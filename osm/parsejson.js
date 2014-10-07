var fs = require('fs');
eval(fs.readFileSync('osm.dt').toString('utf8'));

/*
 var nodes = {};
 var k = 100000;
 for (var i = 0; i < osm.osm.node.length; i++) {
 var node = osm.osm.node[i];
 nodes[node["id"]] = [(+node["lon"] - 30.300) * k, (+node["lat"] - 59.986) * k];
 }
 fs.writeFileSync("nodes.dt", "var nodes = " +JSON.stringify(nodes));

 */

console.log(osm.osm.way.length);


eval("var nodes = " + fs.readFileSync('nodes.dt').toString('utf8'));


var buildings = [];
for (var i = 0; i < osm.osm.way.length; i++) {
    var way = osm.osm.way[i];
    var height = -1;
    if (way.tag)
        for (var j = 0; j < way.tag.length; j++) {
            var tag = way.tag[j];
            if (tag["k"] == "building:levels") {
                height = +tag["v"];
                break;
            }
        }
    if (height > -1) {
        var building = {height: height, nodes: []};
        for (var j = 0; j < way.nd.length; j++) {
            var nd = way.nd[j];
            building.nodes.push(nodes[nd["ref"]]);
        }
        buildings.push(building);
    }
}

fs.writeFileSync('buildings.dt', 'var buildings = ' + JSON.stringify(buildings));

console.log(buildings.length);

