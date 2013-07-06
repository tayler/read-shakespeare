# Read Shakespeare

### Usage:
`node read-shakespeare.js lear.txt // replace lear.txt with the name of the file you want to parse (any plain-text file, including code files, will do)` 

### Under the hood:
read-shakespeare uses the [line-by-line package](https://github.com/RustyMarvin/line-by-line) by Markus von der Wehd to make it through a text file.
It splits each line into its words and cleans + parses from there.
Each word is put into the `words` object. The word is the key and the occurrance count is the value.
    word = {
        'lear': 229
        ...
    }
It then sorts the list from fewest entries to most.
### License:
The MIT License (MIT)
Copyright 2013 Tayler Summers