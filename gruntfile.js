module.exports = function(grunt) {
	var watchFiles = [
		'Gruntfile.js',
		'*.js',
		'test/*.js'
	];
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: watchFiles,
			options: {
				curly: true,
				eqeqeq: false,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				devel: true,
				smarttabs: true,
				node: true, // allows "use strict"; at top level of files
				loopfunc: true, // allows defining functions in a forEach or for loop
				globals: {
					console: true,
					process: true,
					require: true,
					exports: true,
					module: true
				}
			}
		},

		nodeunit: {
			all: ['test/*.js']
		},
		watch: {
			all: {
				files: watchFiles,
				tasks: ['jshint', 'nodeunit']
			},
			tests: {
				files: watchFiles,
				tasks: ['nodeunit']
			}
		}

	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Default task(s).
	grunt.registerTask('default', ['watch:all']);
};