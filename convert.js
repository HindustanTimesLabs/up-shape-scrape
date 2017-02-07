var fs = require("fs"),
  tj = require("togeojson"),
  DOMParser = require("xmldom").DOMParser;

var kml = new DOMParser().parseFromString(fs.readFileSync("kml/uttarpradesh.kml", "utf8"));
var converted = tj.kml(kml);
var convertedWithStyles = tj.kml(kml, { styles: true });
var json = JSON.stringify(convertedWithStyles);
fs.writeFile("json/uttarpradesh.json", json, "utf8", function(err){
  if (err){
    console.log(err);
  }
  console.log("Coverted to JSON!");
});
