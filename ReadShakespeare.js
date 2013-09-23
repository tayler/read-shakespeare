//  usage: node ./read-shakespeare.js example.txt [nameoftextfordb]

"use strict";

var ReadShakespeare = function() {

	var q = require('Q');
	var rs = this;
	var words;

	/**
	 * removes white space from beginning of line
	 * @param  {string} line  The line to be stripped of spaces
	 * @return {string}       The line, free from spaces at the beginning
	 */
	this.cleanLine = function(line) {
		return line.replace(/^\s+|\s+$/g, '');
	};

	/**
	 * Trims words and removes punctuation and other symbols
	 * @param  {Array} words  an array of words to be cleaned up (the words usually make up a line in the text being parsed; sent from this.readText()'s lr.on('line'))
	 * @return {Array}        an array of words that has passed through the cleaning functions
	 */
	this.prepWords = function(words) {
		var lineWordsLength = words.length,
		i, trimmedWord, preparedWord, allTextWords = [];

		for (i = 0; i < lineWordsLength; i++) {
			// clean up the word
			trimmedWord = words[i].trim();
			// need to think whether I want .toLowerCase() b/c case is useful for part-of-speech tagging
			preparedWord = trimmedWord.replace(/[\.,-\/\!#$%\^&\*;:{}\[\]\(\)=\-_`~()\?|]/g,"").toLowerCase();

			allTextWords.push(preparedWord);

			// wordCount++;
		}

		return allTextWords;
	};

	/**
	 * Turns a plain-text file into an array of words, one array member for each word in the text
	 * @param  {String} willRead  the location of the text to be read, relative to this file
	 * @return {Promise (Array)}           an array of the words that make up the text at `willRead`
	 */
	this.readText = function(willRead) {
		var fs = require('fs'),
			deferred = q.defer(),
			linesCount = 0,
			wordCount = 0,
			allTextWords = [],
			LineByLineReader = require('line-by-line');

		if (!willRead) {
			console.log('Looks like you forgot to tell node what to read; try this: `node read-shakespeare.js example.txt nameoftext`');
			deferred.reject('Looks like you forgot to tell node what to read; try this: `node read-shakespeare.js example.txt nameoftext`');
		}

		var lr = new LineByLineReader(willRead);


		lr.on('error', function (err) {
			deferred.reject('There was an error reading the lines of the text: ' + err + 'Does the file exist? Do you have permission to read it?');
		});
		lr.on('line', function (line) {
			// 'line' contains the current line without the trailing newline character.
			// clean up the line
			var noIndent = rs.cleanLine(line),
				// split it up by word
				lineWords = noIndent.split(' '),
				cleanedLineWords = rs.prepWords(lineWords);
			cleanedLineWords.forEach(function(cleanedWord) {
				allTextWords.push(cleanedWord);
			});
			linesCount++;
		});
		lr.on('end', function () {
			// All lines are read, file is closed now. Get ready to send.
			// var end = +new Date;
			// var duration = end - start;
			var readResults = {
				// text: textName,
				// duration: duration,
				linesCount: linesCount,
				wordCount: wordCount
			};
			// console.log(readResults);
			// console.log('number of lines parsed: ' + linesCount);
			// console.log('number of unique words used: ' + allTextWords.length);
			// console.log('total word count: ' + wordCount);
			// console.log('parsing this took: ' + duration + 'ms');
			// return allTextWords;
			deferred.resolve(allTextWords);
		});
		return deferred.promise;
	};

	/**
	 * Creates an object that has one member for each unique word in `allTextWords`; the key of that member is the word and the value is the word's occurrence count
	 * @param  {Array} allTextWords  words whose occurrences will be counted
	 * @return {Promise (Object)}              holds words from `allTextWords` and their occurrence count
	 */
	this.parseWords = function(allTextWords) {
		var deferred = q.defer();
		var words = {}, i, allWordsLen = allTextWords.length, wordKeys = [];

		for (i = 0; i < allWordsLen; i++) {
			if (wordKeys.indexOf(allTextWords[i]) >= 0) {
				// the word has already been seen
				// increment the value at words.preparedWord
				words[allTextWords[i]]++;
			} else {
				// it hasn't been seen yet
				// add `preparedWord` to `words` and give it an initial value/count of 1
				wordKeys.push(allTextWords[i]);
				words[allTextWords[i]] = 1;
			}
		}

		deferred.resolve(words);

		return deferred.promise;
	};

	/**
	 * sorts object and returns it from least entries to most (http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value)
	 * @param  {Object} obj  a list of things whose values are numeric
	 * @return {Array}      a list of things sorted from hightest to lowest values
	 */
	this.sortOccurrences = function(obj) {
		var arr = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				arr.push({
					'word': prop,
					'word_count': obj[prop]
				});
			}
		}
		arr.sort(function(a, b) { return a.value - b.value; });
		return arr;
	};
};

module.exports = ReadShakespeare;




