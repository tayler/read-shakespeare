"use strict";

var RS = require('read-shakespeare/ReadShakespeare');
var fs = require('fs');
var q = require('Q');

exports["initial test"] = function(test) {
	test.strictEqual(typeof RS, 'function', 'sanity check');

	test.done();
};

// exports["reading files with fs"] = function(test) {
// 	fs.readFile('test/texts/short-test.txt', 'utf8', function (err, data) {
// 		if (err) {
// 			return console.log(err);
// 		}
// 		// console.log(data);
// 	});

// 	test.done();
// };

exports["text cleaning"] = function(test) {
	var rs = new RS();
	test.strictEqual(typeof rs.cleanLine, 'function', 'rs.readText is a function');

	var lineWithSpace = '   this line starts and ends with spaces. I hope it\'s gone later.    ';
	var lineWithSpaceCleaned = rs.cleanLine(lineWithSpace);
console.log(lineWithSpaceCleaned);
	test.strictEqual(lineWithSpaceCleaned, 'this line starts with a space. I hope it\'s gone later.', 'the line was cleaned properly');

	var wordsToClean = [
		' space',
		'.period',
		',comma',
		'-hyphens-',
		'!!exclamat!ion',
		'/forwardslash',
		'hash#',
		'$dollars$',
		'fifty%percent',
		'carrot^',
		'amp&',
		'stars**',
		'semi;',
		'colon:',
		'{curlies}',
		'[sqBracket]',
		'paren()',
		'youhaveaquestion?',
		'pip|e'
	];
	var punctuationAndSymbolFree = rs.prepWords(wordsToClean);
	test.deepEqual(punctuationAndSymbolFree, ['space','period','comma','hyphens','exclamation','forwardslash','hash','dollars','fiftypercent','carrot','amp','stars','semi','colon','curlies','sqbracket','paren','youhaveaquestion','pipe'], 'this is cleaning the words correctly');

	test.done();
};

exports["reading files"] = function(test) {
	var rs = new RS();

	test.strictEqual(typeof rs.readText, 'function', 'rs.readText is a function');

	q.all([
		// need a test for if readText() argument not included; make sure user is informed.
		rs.readText('test/texts/one-line.txt'),
		rs.readText('test/texts/multi-line-simple.txt'),
		rs.readText('test/texts/multi-line-with-symbols.txt')
	]).spread(function(oneLine, multiLineSimple, multiLineAndSymbols) {
		test.deepEqual(oneLine, ['the','the','his','his','his','hers','hers','hers','multiplatitudinous','the','his'], 'rs.readText can return a one-line text');

		test.deepEqual(multiLineSimple, ['the','the','his','his','his','hers','hers','hers','multiplatitudinous','the','his'], 'rs.readText can return a multi-line text');

		test.deepEqual(multiLineAndSymbols, ['the','the','his','his','his','hers','hers','hers','multiplatitudinous','the','his'], 'rs.readText can return a multi-line text');

		test.done();
	});

};

exports["parse files"] = function(test) {
	var rs = new RS();

	test.strictEqual(typeof rs.parseWords, 'function', 'rs.parseWords is a function');

	q.all([
		rs.readText('test/texts/one-line.txt'),
		rs.readText('test/texts/multi-line-simple.txt'),
		rs.readText('test/texts/multi-line-with-symbols.txt')
	]).spread(function(oneLine, multiLineSimple, multiLineAndSymbols) {
		rs.parseWords(oneLine)
		.then(function(oneLineParsed) {
			test.deepEqual(oneLineParsed, {the: 3, his: 4, hers: 3, multiplatitudinous: 1}, 'rs.parseWords can parse and count word occurrences in a one-line text');
		});

		rs.parseWords(multiLineSimple)
		.then(function(multiLineParsed) {
			test.deepEqual(multiLineParsed, {the: 3, his: 4, hers: 3, multiplatitudinous: 1}, 'rs.parseWords can parse and count word occurrences in a multi-line text');
		});

		rs.parseWords(multiLineAndSymbols)
		.then(function(multiLineAndSymbolsParsed) {
			test.deepEqual(multiLineAndSymbolsParsed, {the: 3, his: 4, hers: 3, multiplatitudinous: 1}, 'rs.readText can return a multi-line text');
		});

		test.done();
	});
};