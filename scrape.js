var min = 71, max = 75; // start at 1, 5 and go up. max 75 for districts, 80 for parliamentary constituencies

function makeURL(n){
  return "http://gis.up.nic.in:8080/srishti/kml/district/" + n + ".kml" // change pc to district or vice versa
}

var http = require("http"),
  fs = require("fs"),
  _ = require("underscore");

_.rateLimit = function(func, rate, async) {
  var queue = [];
  var timeOutRef = false;
  var currentlyEmptyingQueue = false;

  var emptyQueue = function() {
    if (queue.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue.shift().call(); });
        } else {
          queue.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };

  return function() {
    var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
    queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

var rl = _.rateLimit(r, 200)

for (var i = min; i <= max; i++){
  rl(i);
}

function r(d){

  var url = makeURL(d);
  console.log(url);
  var file = fs.createWriteStream("kml/" + d + ".kml");
  http.get(url, function(response, err) {

    if (!err && response.statusCode == "200"){

      console.log("Scraping " + d);

      response.pipe(file);
    } else {
      console.log("Error");
      console.log(err);
    }

  });
}
