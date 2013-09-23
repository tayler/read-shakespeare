# Read Shakespeare

Reads plain-text files (even .js, etc.). Kindly informs you which words the file contains and how many instances of each word there are. It's called read-shakespeare because that's what I created it to do. But don't worry, it's not so snooty that it won't read OSC or Beowulf.

Does not run on node 0.10.13 and possibly others. Tested on 0.11.3 and 0.8.7.

### Install:
For now, [download](https://github.com/tayler/read-shakespeare/archive/master.zip) and unzip. `npm install` in project root directory.

### Usage:
Try something like this (see `use-read.js` for a full implementation):

    var start = new Date().getTime();
    // read file with rs.readText(); words and lines are automatically cleaned;
    rs.readText('texts/ed-poems-complete-gutenberg.txt')
    // results of rs.readText are passed into `rs.parseWords` by q
    .then(rs.parseWords)
    // `wordCounts` is the return value from rs.parseWords
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


### Under the hood:
ReadShakespeare has two key methods: `readText()` and `parseWords()`. 

`readText()` uses the [line-by-line package](https://github.com/RustyMarvin/line-by-line) by Markus von der Wehd to make it through a text file.
It then splits each line it gets from line-by-line into its words and runs `.replace(/[\.,-\/\!#$%\^&\*;:{}\[\]\(\)=\-_~()\?|]/g,"")` on each word through the `prepWords()` method. Each word in the text
is pushed to an array. That array is returned in a promise.

`parseWords()` takes an array of words (like the one created in `readText()`) as its argument. It checks each word in the array
and counts each occurrence.

Each unique word is made a property of the `words` object. The word is the key and the occurrance count is the value.

    words = {
        'word': # of occurrences,
        'ahanging': 1,
        'fordone': 1,
        'bootless': 1,
        ...
        'lear': 229
        ...
    }

### Etc.
By the way, [MIT](http://shakespeare.mit.edu/) has public domain copies of all of Shakespeare's texts.

### License:
The MIT License (MIT)
Copyright 2013 Tayler Summers
