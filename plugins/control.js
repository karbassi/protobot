var fs = require('fs');
var path = require( 'path' );
var settingsFile = path.join( "../settings.json" );
var options = JSON.parse( fs.readFileSync( process.argv[2] || settingsFile ) );

function register(j) {

  // TODO: Doesn't work because we don't have `bot`.
  /*
  // Join Command
  j.watch_for(/^\?join (.*)/, function(message) {
    if (options.admin.indexOf(message.user) === -1) {
      return;
    }

    var room = message.match_data[1];

    if (room[0] != '#') {
      room = '#' + room;
    }

    bot.join(room);
    message.say(message.user + ': joining ' + room);

  });

  // Part Command
  j.watch_for(/^\?(?:part|leave) (.*)/, function(message) {
    if (options.admin.indexOf(message.user) === -1) {
      return;
    }

    var room = message.match_data[1];

    if (room[0] != '#') {
      room = '#' + room;
    }

    bot.part(room);
    message.say(message.user + ': parting ' + room);
  });
  */
}

// Export
exports.register = register;
