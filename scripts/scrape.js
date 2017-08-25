var http = require("http"),
  fs = require("fsz"),
  _ = require("underscore"),
  prompt = require("prompt");

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

var schema = {
  properties: {
    type: {
      required: true,
      message: "What are we scraping? Type 'd' for districts and 'p' for parliamentary constituencies."
    }
  }
}

prompt.start();

prompt.get(schema, (err, response) => {
  if (err) throw err;

  if (response.type != "d" && response.type != "p"){
    console.log("Invalid entry. You have to type 'd' or 'p'. Try again.");
  } else {

    var type = response.type,
      outdir = (type == "d" ? "district" : "parliament");

    fs.mkdirIf(outdir, "kml");

    var min = 1, max = type == "d" ? 75 : 80; // start at 1, 5 and go up. max 75 for districts, 80 for parliamentary constituencies

    function makeURL(n){
      return "http://gis.up.nic.in:8080/srishti/kml/" + (type == "d" ? "district" : "pc") + "/" + n + ".kml" // change pc to district or vice versa
    }

    fs.mkdirIf("kml");

    var rl = _.rateLimit(r, 1000);

    for (var i = min; i <= max; i++){
      rl(i);
    }

    function r(d){

      var url = makeURL(d);
      console.log(url);
      var file = fs.createWriteStream("kml/" + outdir + "/" + d + ".kml");
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

  }

});


