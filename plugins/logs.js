var fs = require('fs');
var path = require( 'path' );
var settingsFile = path.join( "../settings.json" );
var options = JSON.parse( fs.readFileSync( process.argv[2] || settingsFile ) );

function register(j) {
  j.watch_for(/.*/, function(message) {
    var now = new Date();
    var location = path.join(options.logdir, message.source.toString());
    var file = path.join(location, now.strftime('%Y-%m-%d.log'));

    // Make the directory
    path.exists(location, function(exists) {
      var log;
      if (!exists) {
        fs.mkdirSync(location, 0755);
      }

      log = fs.createWriteStream(file, {
        flags: 'a'
      });
      log.write(message + '\n');
      log.end();
    });
  });
}

// Export
exports.register = register;
