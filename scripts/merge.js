var fs = require("fsz"),
  cheerio = require("cheerio"),
  prompt = require("prompt");

var schema = {
  properties: {
    type: {
      required: true,
      message: "What are we merging? Type 'd' for districts and 'p' for parliamentary constituencies."
    }
  }
}

fs.mkdirIf("merged", "kml");

prompt.start();

prompt.get(schema, (error, response) => {
  if (error) throw error;

  var type = response.type;

  if (type != "p" && type != "d"){
    console.log("Not a valid entry. You have to type 'p' or 'd'. Try again.");
  } else {
    var head = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document id="1" xsi:schemaLocation="http://www.opengis.net/kml/2.2 http://schemas.opengis.net/kml/2.2.0/ogckml22.xsd http://www.google.com/kml/ext/2.2 http://code.google.com/apis/kml/schema/kml22gx.xsd">'
    var body;

    var l = type == "d" ? 75 : 80; // 80 for parliamentary constituencies, 75 for districts
    
    for (var i = 1; i <= l; i++){
      read(i, l);
    }

    function read(i, l){

      fs.readFile("kml/" + (type == "d" ? "district" : "parliament") + "/" + i + ".kml", "utf8", function(err, data) {
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
                fs.writeFile("kml/merged/uttarpradesh_" + (type == "d" ? "district" : "PC") + ".kml", kml, function(err) {
                  
                  if (err) throw err;

                  console.log("The file was saved!");

                });
              }, 5000);

            }
          }
      });
    }
  }
});


