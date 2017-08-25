var fs = require("fsz"),
  tj = require("togeojson"),
  DOMParser = require("xmldom").DOMParser,
  prompt = require("prompt");

fs.mkdirIf("json");

var schema = {
	properties: {
		type: {
			required: true,
			message: "What are we converting? Type 'd' for districts and 'p' for parliamentary constituencies."
		}
	}
}

prompt.start();

prompt.get(schema, (error, response) => {

	if (error) throw error;

	var type = response.type;

	if (type != "d" && type != "p"){
		console.log("Enter 'd' or 'p'. Try again.");
	} else {

		var suffix = type == "d" ? "district" : "PC";

		var kml = new DOMParser().parseFromString(fs.readFileSync("kml/merged/uttarpradesh_" + suffix + ".kml", "utf8"));
		var converted = tj.kml(kml);
		var convertedWithStyles = tj.kml(kml, { styles: true });
		var json = JSON.stringify(convertedWithStyles);
		fs.writeFile("json/uttarpradesh_" + suffix + ".json", json, "utf8", function(err){
		  if (err){
		    console.log(err);
		  }
		  console.log("Coverted to JSON!");
		});
	}

});


