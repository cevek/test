var fs = require('fs');
var parser = require('xml2json');
var xmlData = fs.readFileSync('/Users/cody/Downloads/map (1)').toString('utf8');
var json = parser.toJson(xmlData); //returns a string containing the JSON structure by default

fs.writeFileSync("osm.dt", "var osm = " +json);
console.log("done");

/*
 parseString(xml, function (err, result) {
 //console.dir(result);
 console.log(readed);
 console.error(err);

 });*/


