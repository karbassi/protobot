/* ------------------------------ Includes && Options ----------------- */
var exec = require('child_process').exec;
var unescapeAll = require('../vendor/unescape/unescape');

/* ------------------------------ WolframAlpha ------------------------ */

function WolframAlpha() {
  this.search = function(query, hollaback) {
    var result = {
      url: 'http://www.wolframalpha.com/input/?i=' + encodeURIComponent(query)
    };

    exec("curl -e 'http://www.wolframalpha.com' '" + result.url + "'", function(err, stdout, stderr) {
      var solution = />Solution:<[\s\S]*?alt\s*=\s*\"([^\""]*)\"/;
      var other = /stringified"\s*:\s*"([^"\r\n]*)/g;

      if (solution.test(stdout)) {
        result.data = stdout.match(solution)[1].replace(/\\\//, '/');
      } else {
        match = stdout.match(other);
        if (!(match && match[1])) {
          result.data = null;
        } else {
          result.data = match[1].replace(/stringified"\s*:\s*"/g, '').replace(/\\n/g, ' ').replace(/\\\//, '/');
        }
      }

      hollaback.call(this, result);
    });
  };
}

function register(j) {
  var wa = new WolframAlpha();

  j.watch_for(/^([\/.,`?]?)wa ([^@]+)(?:\s*@\s*([-\[\]\{\}`|_\w]+))?/, function(message) {
    var user = message.match_data[3] || message.user;

    wa.search(message.match_data[2], function(result) {
      message.say(user + ": " + (result && result.data ? unescapeAll(result.data) : "Sorry, no results for '" + message.match_data[2] + "'"));
    });
  });
}

/* ------------------------------ Export ------------------------------ */
exports.register = register;
