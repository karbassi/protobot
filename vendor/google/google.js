/* ------------------------------ Includes && Options ------------------------------ */
var sys = require("sys");

/* ------------------------------ Google ------------------------------ */
function Google() {
  this.search = function(query, hollaback) {
    sys.exec("curl -e 'http://gf3.ca' 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + escape(query) + "'", function (err, stdout, stderr) {
      hollaback.call(this, JSON.parse(stdout)["responseData"]["results"]);
    });
  };
}

/* ------------------------------ Export ------------------------------ */
exports.Google = Google;
