var bee = require("beeline");
var HTTP = require("http");

// some couchDb options
var couchDb = {
	hostname: '127.0.0.1',
	port: '5984'
};

var router = bee.route({
	"/": function(req, res) {
		console.log('they came and they went');
	},
	"/read-shakespeare":
		bee.staticFile("./ui.html", "text/html"),
	"/js/`path...`":
		bee.staticDir("./js/", {".js": "application/x-javascript"}),
	"/texts/`text`": function(req, res, tokens, values) {
		var text = "";
		couchDb.path = '/texts/' + tokens.text;
		couchDb.method = 'GET';
		// default method is 'GET', so I'm not bothering to specify
		var couchRequest = HTTP.get(couchDb, function(couchResponse) {
			// console.log('STATUS: ' + res.statusCode);
			// console.log('HEADERS: ' + JSON.stringify(couchResponse.headers));
			couchResponse.on('data', function (chunk) {
				text += chunk;
				// console.log('BODY: ' + chunk); // {"_id":"my","_rev":"1-394f584eabb3e5973abecf76a39e0b47","count":7}
				// I might just want to send chunk without parsing it first. then parse in client?

				// var text = JSON.parse(chunk);
				// console.log('Word: ' + text._id); // my
				// console.log('Count: ' + text.count); // 7
			});
			couchResponse.on('end', function() {
				res.setHeader("Content-Type", "application/json");
					res.write(text);
					res.end();
				});

		});
		couchRequest.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		couchRequest.end();
	},
	"/new_text/`text`": function(req, res, tokens, values) {
		couchDb.path = '/texts/' + tokens.text;
		couchDb.method = 'PUT';
		var couchRequest = HTTP.request(couchDb, function(response) {
			response.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
				var chunky = JSON.parse(chunk);
				console.log(chunky);
			});
		});
		couchRequest.write(JSON.stringify({
			"count":"1"
		}));
		couchRequest.end();
	},
	"/save_results": function(req, res) {
		var data = "";
		req.on("data", function(chunk) {
			data += chunk;
		});
		req.on("end", function() {
//			console.log("raw: " + data);

			var json = JSON.parse(data);

            couchDb.path = '/texts/' + json.text;
			couchDb.method = 'PUT';
			// send to couch
			var couchRequest = HTTP.request(couchDb, function(response) {
				response.on('data', function (chunk) {
					console.log('BODY: ' + chunk);
					var chunky = JSON.parse(chunk);
					// console.log(chunky);
				});
			});
			couchRequest.write(json.wordsString);
			couchRequest.end();
			// console.log('count of enter: ' + json.words.enter);
			// console.log("json: " + json.wordCount); // 336
			// for (var property in json) {
			// 	console.log('property: ' + property);
			// }
		});
// traverse object
// function process(key,value) {
//     console.log(key + " : "+value);
// }

// function traverse(o,func) {
//     for (var i in o) {
//         func.apply(this,[i,o[i]]);
//         if (typeof(o[i])=="object") {
//             //going on step down in the object tree!!
//             traverse(o[i],func);
//         }
//     }
// }
	}
});

HTTP.createServer(router).listen(8001);

// Getting Started with CouchDB
// creating a db named recipes:
	// curl -X PUT http://192.168.0.57:5984/recipes
	// response:
		// {"ok":true} OR {"error":"file_exists","reason":"The database could not be created, the file already exists."}
// getting db info. (and checking if it exists):
	// curl -X GET http://192.168.0.57:5984/recipes
// creating document with a random id
	// the argument after the -d option is the JSON of the document
	// we want to submit, in this case a placeholder for a recipe
	// curl -H 'Content-type: application/json' \
	// -X POST http://192.168.0.57:5984/recipes \
	// -d '{"title": "Lasagne"}'
	// response:
		// {"ok":true,
		// "id":"8843faaf0b831d364278331bc3001bd8", // id generated automatically
		// "rev":"1-33b9fbce46930280dab37d672bbc8bb9"} // revision id needed (with id) to update doc
// creating a document with a specific id
	// curl -H 'Content-type: application/json' \
	// -X PUT \
	// http://127.0.0.1:5984/recipes/lasagne \ <- recipes is db/lasagne is name of doc
	// -d '{"title": "Lasagne"}'
	// response:
		// {"ok":true,"id":"lasagne","rev":"1-f07d272c69ca1ba91b94544ec8eda1b6"}

// getting a document
	//curl -X GET http://192.168.0.57:5984/recipes/8843faaf0b831d364278331bc3001bd8
	// response:
		// {"_id":"8843faaf0b831d364278331bc3001bd8",
		// "_rev":"1-33b9fbce46930280dab37d672bbc8bb9",
		// "title":"Lasagne"}







