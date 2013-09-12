//  usage: node ./read-shakespeare.js example.txt nameoftextfordb

(function() {

"use strict";

var LineByLineReader = require('line-by-line');
var fs = require('fs');
var HTTP = require("http");
var querystring = require('querystring');

function ReadShakespeare() {
	var args = process.argv;

	var willRead = args[2];
	var textName = args[3];

	var lr = new LineByLineReader(willRead);

	var linesCount = 0;
	var wordCount = 0;
	var words = {};
	var start = +new Date;

	if (!willRead) {
		console.log('Looks like you forgot to tell node what to read; try this: node read-shakespeare.js example.txt nameoftext');
		process.exit();
	}

	lr.on('error', function (err) {
		console.log('there was an error: ' + err);
	});
	lr.on('line', function (line) {
		// 'line' contains the current line without the trailing newline character.
		// clean up the line
		var noIndent = line.replace(/^ +/, '');
		// split it up by word
		var lineWords = noIndent.split(' ');
		var lineWordsLength = lineWords.length;
		var i, trimmedWord, preparedWord, wordKeys = [];

		for (i = 0; i < lineWordsLength; i++) {
			// clean up the word
			trimmedWord = lineWords[i].trim();
			preparedWord = trimmedWord.replace(/[\.,-\/\!#$%\^&\*;:{}\[\]\(\)=\-_`~()\?]/g,"").toLowerCase();
			// I was looking up keys in each word. For a text of 34028 total words (ED complete), that was taking about 12 seconds.
			// when I changed to just keeping track of words in a separate array and checking that on every word (`wordKeys.indexOf(preparedWord) >= 0`)
			// the total parsing time dropped to about 90 MS!
			// Basically, I commented out `wordKeys = Object.keys(words)` on ~ ln. 55 and added `wordKeys.push(preparedWord)` on ~ ln. 63.
			// get all the words already in `words`
			// wordKeys = Object.keys(words);

			// check to see if word is already in `words`
			if (wordKeys.indexOf(preparedWord) >= 0) {
				// increment the value at words.preparedWord
				words[preparedWord]++;
			} else {
				// add `preparedWord` to `words` and give it a value/count of 1
				wordKeys.push(preparedWord);
				words[preparedWord] = 1;
			}
			wordCount++;
		}

		linesCount++;
	});
	lr.on('end', function () {
		// All lines are read, file is closed now. Get ready to send.
		var end = +new Date;
		var duration = end - start;
		var results = {
			text: textName,
			words: words,
			wordsString: JSON.stringify(words),
			duration: duration,
			linesCount: linesCount,
			wordCount: wordCount
		};
		console.log(results);
		var parsedWordsArray = sortObject(words);

		console.log('number of lines parsed: ' + linesCount);
		console.log('number of unique words used: ' + parsedWordsArray.length);
		console.log('total word count: ' + wordCount);
		console.log('parsing this took: ' + duration + 'ms');

		sendPost(results);

	});
	// http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
	// sorts object and returns it from least entries to most
	var sortObject = function(obj) {
		var arr = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// use this to make it write to file correctly as a string instead of an array of objects (doesn't sort correctly--least entries to most--when stringified)
				// forFile.push(JSON.stringify({
				// 	'word': prop,
				// 	'count': obj[prop]
				// }));
				// this mimics pretty print (haven't tried it)
				// forFile.push(JSON.stringify({
				// 	'word': prop,
				// 	'count': obj[prop]
				// }, "false", '\t'));
				// to make it sort correctly (show smallest to biggest count) in console.log
				arr.push({
					'key': prop,
					'value': obj[prop]
				});
			}
		}
		arr.sort(function(a, b) { return a.value - b.value; });
		//arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
		return arr;
	};
	var sendPost = function(results) {
		// http://stackoverflow.com/questions/9768192/sending-data-through-post-request-from-a-node-js-server-to-a-node-js-server
		// var data = querystring.stringify(results);
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
}

ReadShakespeare();
module.exports = ReadShakespeare;
})();