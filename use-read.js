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

// read file with rs.readText(); words and lines are automatically cleaned;
rs.readText('texts/short-test.txt')
.then(function(textWords) {
	// console.log(JSON.stringify(textWords));

	// parse file with rs.parseWords();
	rs.parseWords(textWords)
	.then(function(wordCounts) {
		var results = {
			textName: 'short-test',
			wordsString: JSON.stringify(wordCounts)
		};
		// send with sendResults()
		sendResults(results);

		console.log(wordCounts);
	});

});


})();













