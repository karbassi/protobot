var exec = require('child_process').exec;
var unescapeAll = require('../vendor/unescape/unescape');

var UrbanDictionary = function() {
  this.search = function(query, hollaback) {
    exec("curl 'http://www.urbandictionary.com/iphone/search/define?term=" + escape(query) + "'", function(err, stdout, stderr) {
      var results = JSON.parse(stdout)["list"];
      hollaback.call(this, results);
    });
  };
};

function register(j) {
  var ud = new UrbanDictionary();

  j.watch_for(/^(\?)(?:ud) ([^#@]+)(?:\s*#([1-9]))?(?:\s*@\s*([-\[\]|_\w]+))?$/, function(message) {
    var user = message.match_data[4] || message.user;

    ud.search(message.match_data[2], function(results) {
      if (results.length) {
        message.say(user + ': ' + unescapeAll(results[0].word) + ' - ' + results[0].definition.replace(/\r\n/g, ' '));
      } else {
        message.say(user + ": Sorry, no results for '" + message.match_data[2] + "'");
      }
    });
  });
}

// Export
exports.register = register;
