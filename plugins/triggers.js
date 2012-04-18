var fs = require('fs');
var path = require('path');
var settingsFile = path.join("../settings.json");
var options = JSON.parse(fs.readFileSync(process.argv[2] || settingsFile));
var jerk = require('jerk');
var redis = require('redis');
var rclient;

// Redis
rclient = redis.createClient(options.redis.port, options.redis.server);
rclient.auth(options.redis.auth);
rclient.on('error', function(err) {
  console.log('Redis error: ' + err);
});
rclient.hgetall('triggers', function(err, obj) {

  if (err) {
    console.log(err, obj);
    return;
  }

  console.log(obj);
  for (var i in obj) {
    watchForSingle(i, obj[i]);
    // console.log(obj[i]);
  }

});

// Helper functions


function to(message, def, idx) {
  if (idx === undefined && typeof def === 'number') {
    idx = def;
    def = null;
  } else {
    idx = idx || 1;
  }
  return !!message.match_data[idx] ? message.match_data[idx].trim() : def || message.user;
}

function watchForSingle(trigger, msg) {
  jerk(function(j) {
    j.watch_for(new RegExp("^(\\?)" + trigger + "(?:\\s*@\\s*([-\\[\\]\\{\\}`|_\\w]+))?\\s*$", "i"), function(message) {
      message.say(to(message, 2) + ": " + msg);
    });
  });
}

function register(j) {

  j.watch_for(/^(?:nerdbot)[,:]? ([-_.:|\/\\\w]+) is[,:]? (.+)$/, function(message) {
    rclient.hmset('triggers', message.match_data[1], message.match_data[2], function(err) {
      if (err) {
        message.say(message.user + ': Oops, there was an error: ' + err);
      } else {
        message.say(message.user + ': kk');
        watchForSingle(message.match_data[1], message.match_data[2]);
      }
    });
  });

  j.watch_for(/^(?:nerdbot)[,:]? forget[,:]? (.+)$/, function(message) {
    rclient.hdel('triggers', message.match_data[1], function(err) {
      if (err) {
        message.say(message.user + ': Oops, there was an error: ' + err);
      } else {
        // FIXME: `bot` doesn't exist here
        //bot.forget(new RegExp("^[\\/.`?]?" + message.match_data[1] + "(?:\\s*@\\s*([-\\[\\]\\{\\}`|_\\w]+))?\\s*$", "i"));
        message.say(message.user + ': kk');
      }
    });
  });
}

// Export
exports.register = register;
