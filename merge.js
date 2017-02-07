var fs = require("fs"),
  cheerio = require("cheerio");

var head = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document id="1" xsi:schemaLocation="http://www.opengis.net/kml/2.2 http://schemas.opengis.net/kml/2.2.0/ogckml22.xsd http://www.google.com/kml/ext/2.2 http://code.google.com/apis/kml/schema/kml22gx.xsd">'
var body;

var l = 75; // 80 for parliamentary constituencies, 75 for districts
for (var i = 1; i <= l; i++){
  read(i, l);
}

function read(i, l){

  fs.readFile("kml/" + i + ".kml", "utf8", function(err, data) {
      if (!err) {
        $ = cheerio.load(data);
        var geo = $("coordinates").html().trim();
        var id = $("folder").find("name").html().trim();
        var name = $("folder").find("name").text().replace(/\d+/g, "");

        body = body + "<Placemark><description>" + id + "</description><name>" + name + "</name><Polygon><outerBoundaryIs><LinearRing><coordinates>" + geo + "</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>"
        if (i == l){
          console.log("Completing in 5 seconds...")
          setTimeout(function(){
            var kml = head + body + "</Document></kml>";
            fs.writeFile("kml/uttarpradesh.kml", kml, function(err) {
              if(err) {
                return console.log(err);
              }
              console.log("The file was saved!");
            });
          }, 5000)

        }


      }
  });
}
