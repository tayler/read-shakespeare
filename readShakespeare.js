//  usage: node ./readShakespeare.js example.txt
(function() {
"use strict";
var LineByLineReader = require('line-by-line');
var fs = require('fs');
var args = process.argv;
var willRead = args[2];
if (!willRead) {
	console.log('Looks like you forgot to tell node what to read: node readShakespeare.js example.txt');
	process.exit();
}
var lr = new LineByLineReader(willRead);
// var lr = new LineByLineReader('kjv.txt');
var linesCount = 0;
var wordCount = 0;
var words = {};
var start = +new Date;

lr.on('error', function (err) {
	// 'err' contains error object
});

lr.on('line', function (line) {
	// 'line' contains the current line without the trailing newline character.
	// clean up the line
	var noIndent = line.replace(/^ +/, '');
	// split it up by word
	var lineWords = noIndent.split(' ');
	var lineWordsLength = lineWords.length;

	for (var i = 0; i < lineWordsLength; i++) {
		// clean up the word
		var trimmedWord = lineWords[i].trim();
		var preparedWord = trimmedWord.replace(/[\.,-\/\!#$%\^&\*;:{}\[\]\(\)=\-_`~()\?]/g,"").toLowerCase();
		// get all the words already in the `words` object
		var wordKeys = Object.keys(words);
		// check to see if word is already in `words`
		if (wordKeys.indexOf(preparedWord) >= 0) {
			// increment the value at words.preparedWord
			words[preparedWord]++;
		} else {
			// add `preparedWord` to `words` and give it a value of 1
			words[preparedWord] = 1;
		}
		wordCount++;
	}

	linesCount++;
});

lr.on('end', function () {
	// All lines are read, file is closed now.
	var end = +new Date;
	var duration = end - start;
	var response = {
		words: words,
		duration: duration,
		linesCount: linesCount,
		wordCount: wordCount
	};
	console.log(response);
	var parsedWordsArray = sortObject(words);
	console.log(parsedWordsArray);
	console.log('number of lines parsed: ' + linesCount);
	console.log('number of words used: ' + parsedWordsArray.length);
	console.log('total word count: ' + wordCount);
	console.log('parsing this took: ' + duration + 'ms');
	var resultsFile = fs.openSync('./lear-results.txt', 'w');
	fs.writeSync(resultsFile, parsedWordsArray);
});
// http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value
// sorts object and returns it from least entries to most
function sortObject(obj) {
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
}

})();
