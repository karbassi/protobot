var unescapeAll = require('../../vendor/unescape/unescape');
var Google = require('../google.js');

function register(j) {
  var google = new Google();

  j.watch_for(/^\?(?:drupal|drupal(\d)) ([^#@]+)(?:\s*#([1-9]))?(?:\s*@\s*([-\[\]|_\w]+))?$/, function(message) {
    var user = message.match_data[4] || message.user;
    var res = +message.match_data[2] - 1 || 0;
    var drupal_version = message.match_data[1] || 7;

    google.search(message.match_data[2] + ' site:api.drupal.org/ drupal ' + drupal_version, function(results) {
      if (results.length) {
        message.say(user + ': ' + unescapeAll(results[res].titleNoFormatting) + ' - ' + results[res].unescapedUrl);
      } else {
        message.say(user + ": Sorry, no results for '" + message.match_data[2] + "'");
      }
    });
  });
}

// Export
exports.register = register;
