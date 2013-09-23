(function() {
"use strict";

var fs = require('fs');
var q = require('Q');
var RS = require('read-shakespeare/ReadShakespeare');

var rs = new RS();

// 	results = {
//		text: textName,
//		words: (obj. with word as key and count as value),
//		wordsString: JSON.stringify(words)
//	};
var sendResults = function(results) {
	var HTTP = require("http");
	// http://stackoverflow.com/questions/9768192/sending-data-through-post-request-from-a-node-js-server-to-a-node-js-server
	var data = JSON.stringify(results);

	var options = {
		// host: 'localhost', // sinatra/thin
		// port: 4567,
		// host: '127.0.0.1', // sinatra/shotgun
		// port: 9393,
		host: 'localhost',
		port: 8001,
		path: '/save_results',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length
		}
	};

	var req = HTTP.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log("body: " + chunk);
		});
		res.on('error', function(error) {
			console.log("there was an error: " + error);
		});
	});

	req.write(data);
	req.end();
};

var writeResults = function(results) {
	var resultsFile = fs.openSync('./results/read-results' + new Date().getTime() + '.txt', 'w');
	fs.writeSync(resultsFile, JSON.stringify(results));
};
var start = new Date().getTime();
// read file with rs.readText(); words and lines are automatically cleaned;
rs.readText('texts/ed-poems-complete-gutenberg.txt')
.then(rs.parseWords)
.then(function(wordCounts) {
	var results = {
		textName: 'ED',
		wordsString: JSON.stringify(wordCounts)
	};

	var end = new Date().getTime();

	console.log('Reading and parsing that text took ' + (end - start) + 'ms');

	// write results to file
	// rs.writeResults(wordCounts);

	// send with sendResults()
	// sendResults(results);

	// console.log(wordCounts);

});


})();













