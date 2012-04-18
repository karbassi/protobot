var fs = require('fs');
var path = require('path');
var settingsFile = path.join( "../settings.json");
var options = JSON.parse(fs.readFileSync(process.argv[2] || settingsFile));

function register(j) {
  j.watch_for(RegExp("^(?:" + options.nick + "\\W+)?(?:hi|hello|hey)(?:\\W+" + options.nick + ".*)?$", "i"), function(message) {
    var r = ['oh hai!', 'why hello there', 'hey', 'hi', 'sup?', 'hola', 'yo!'];
    setTimeout(function() {
      message.say(message.user + ': ' + r[Math.floor(Math.random() * r.length)]);
    }, Math.round(Math.random() * 10000));
  });
}

// Export
exports.register = register;
