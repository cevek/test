var fs = require('fs');
var http = require('http');


function get(url, callback) {
	http.get(url, function(req) {
		var json = '';
		req.on("data", function(data) {
			json += data.toString('utf8');
		})
		req.on("end", function() {
			try {
				json = JSON.parse(json);
			}
			catch (e) {
			}
			callback(json);
		})
	});
}


var pl = '[playlist]\nNumberOfEntries=100\n';

var file = fs.openSync('sky.pls', 'a+');
fs.writeSync(file, pl);

get('http://listen.radiotunes.com/public3/', function(json) {
	json.map(function(item) {
		console.log(item);
		get(item.playlist, function(playlist) {
			console.log(playlist);
			var m = playlist.match(/File1=(.*?)$/m) || ['', ''];
			pl = 'File1=' + m[1] + '\n' +
			'Title1=' + item.name + '\n' +
			'Length1=-1\n'
			fs.writeSync(file, pl);
		});
	});
});
