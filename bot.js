/* ------------------------------ Includes && Options ------------------------------ */
require('./vendor/strftime/strftime');

var util = require('util');
var fs = require('fs');
var path = require('path');
var http = require('http');
var URL = require('url');
var groupie = require('groupie');
var jerk = require('jerk');
var settingsFile = path.join(__dirname, "settings.json");

if (process.argv[2]) {
    settingsFile = process.argv[2];
}
if (!path.existsSync(settingsFile)) {
    console.error("Settings file not found '%s'", settingsFile);
    process.exit(1);
}

var options = JSON.parse(fs.readFileSync(process.argv[2] || settingsFile));

/* ------------------------------ Protobot ------------------------------ */
var bot = jerk(function(j) {

  // Join Command
  j.watch_for(/^\?(join|part) (.*)/, function(message) {
    if (options.admin.indexOf(message.user) === -1) {
      return;
    }

    console.log(message);

    var rooms = message.match_data[2];

    // Multiple rooms
    if (rooms.indexOf(',') !== -1) {
      rooms = rooms.split(',');
    } else {
      rooms = [rooms];
    }

    rooms.forEach(function(room, index){
      room = room.trim();

      if (room[0] != '#') {
        room = '#' + room;
      }

      if (message.match_data[1] === 'join') {
        bot.join(room);
        message.say(message.user + ': joining ' + room);
      } else if (message.match_data[1] === 'part') {
        bot.part(room);
        message.say(message.user + ': parting ' + room);
      }
   });

  });

}).connect(options);

// Register plugins
if (options["plugins"]) {
  options["plugins"].forEach(function(plugin) {
    var plugReg = require("./plugins/" + plugin).register;
    try {
      jerk(function(j) {
        // Gross hack until global var is dead
        plugReg(j);
      });
    } catch (e) {
      console.error("Failed to register plugin %s: %s", plugin, e);
    }
  });
}
