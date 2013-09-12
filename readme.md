# Read Shakespeare

Reads plain-text files (even .js, etc.). Kindly informs you which words the file contains and how many instances of each word there are. It's called read-shakespeare because that's what I created it to do. But don't worry, it's not so snooty that it won't read OSC or Beowulf.

Does not run on node 0.10.13 and possibly others. Tested on 0.11.3 and 0.8.7.

### Install:
For now, [download](https://github.com/tayler/read-shakespeare/archive/master.zip) and unzip. `npm install` in project root directory.

### Usage:
`node read-shakespeare.js lear.txt` 
Replace `lear.txt` with the name of the file you want to parse (any plain-text file, including code files, will do). This parses *Lear* (29,163 words) in about 60ms on my machine.

### Under the hood:
Read Shakespeare uses the [line-by-line package](https://github.com/RustyMarvin/line-by-line) by Markus von der Wehd to make it through a text file.
Read Shakespeare then splits each line it gets from line-by-line into its words and runs `.replace(/[\.,-\/\!#$%\^&\*;:{}\[\]\(\)=\-_~()\?]/g,"")` on the word + parses from there.

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

It then sorts the list from fewest entries to most.

### Etc.
By the way, [MIT](http://shakespeare.mit.edu/) has public domain copies of all of Shakespeare's texts.

### License:
The MIT License (MIT)
Copyright 2013 Tayler Summers
