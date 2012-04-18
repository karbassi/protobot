var unescapeAll = require('../../vendor/unescape/unescape');
var Google = require('../google.js');

function register(j) {
  var google = new Google();

  j.watch_for(/^\?(?:css) ([^#@]+)(?:\s*#([1-9]))?(?:\s*@\s*([-\[\]|_\w]+))?$/, function(message) {
    var user = message.match_data[3] || message.user;
    var res = +message.match_data[1] - 1 || 0;

    google.search(message.match_data[1] + ' site:developer.mozilla.org/en/CSS', function(results) {
      if (results.length) {
        message.say(user + ': ' + unescapeAll(results[res].titleNoFormatting) + ' - ' + results[res].unescapedUrl);
      } else {
        message.say(user + ": Sorry, no results for '" + message.match_data[1] + "'");
      }
    });
  });
}

// Export
exports.register = register;
