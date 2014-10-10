var fibers = require('fibers');
var fs = require('fs');
var lastFileChanged = '';

var filename = process.argv.pop();
console.error("Arguments", filename);


var b = filename.split(".");
var ext = b.pop();
var basename = b.join(".");
if (basename == 'bench') {
	return;
}

var file = fs.readFileSync(filename).toString('utf8');

if (ext == "js") {
	lastFileChanged = basename + ".html";
	fs.writeFileSync(lastFileChanged, file + "\n1");
}


if (ext == "html") {
	lastFileChanged = basename + ".js";
	fs.writeFileSync(lastFileChanged, file + "\n1");
}
//fs.writeFileSync(filename, file + '\nvar a = ' + Math.random());


console.log(filename, lastFileChanged);


/*
 function wait(i, callback) {
 process.nextTick(function() {
 callback(null, i);
 });
 }


 function* bbbb(resume) {
 yield wait(1, resume);
 throw "23e2";
 return 56;
 }

 function* abc(resume) {
 try {
 yield bbbb.run();
 }
 catch (e) {
 console.trace()
 throw e;

 }
 return 2134;
 }

 !function*(resume) {
 console.time("perf");
 var val = 0;
 for (var i = 0; i < 999; i++) {
 try {
 //val = yield wait(i, resume);
 val = yield abc.run();
 //		val = yield bca(resume);
 }
 catch (e) {
 //console.error(e.stack);
 }
 }
 console.log(val);
 console.timeEnd("perf");

 }.run();

 function bca(callback) {
 wait(1, callback);
 }


 */

