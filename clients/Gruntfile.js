/*
	grunt build - builda todos os clientes

	grunt build:CLIENTE - Builda cliente especifico
	grunt builddev:CLIENTE - Builda para dev cliente especifico

	grunt build:CLIENTE_PADRAO - Builda padrão especifico de cliente
	grunt builddev:CLIENTE_PADRAO - Builda para dev padrão especifico de cliente


*/

var path = require('path');
var _ = require('underscore');

module.exports = function(grunt) {

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-env');

	var myConfig = {

		dest: '_dist/',

		baseDir: __dirname + '/',

		gitCommit: ''

	};

	var excludeClients = ['Xbaseclient'];

	function gitLog(err, stdout, stderr, cb) {
		console.log(stdout);
		myConfig.gitCommit = stdout;
		cb();
	}

	var deleteForDev = ['imagemin', 'uglify', 'removelogging'];

	var removeElemFormArray = function(array, toDelete) {
		var arrayCopy = new Array(array.length);
		var arrayCopyRef = new Array(array.length);
		for (var g = 0; g < array.length; g++) {
			arrayCopy[g] = array[g];
			arrayCopyRef[g] = array[g];
		}

		for (var l = arrayCopy.length - 1; l >= 0; l--) {
			for (var m = toDelete.length - 1; m >= 0; m--) {
				if (arrayCopyRef[l].indexOf(toDelete[m]) !== -1) {
					arrayCopy.splice(l, 1);
				}
			};
		};

		return arrayCopy;
	}

	console.log("Init Config - Sub-tasks Empty");

	var gruntConfig = {

		myConfig: myConfig,

		pkg: grunt.file.readJSON('package.json'),

		today: grunt.template.today("yyyymmddhhmmss"),

		date: Date.now(),

		env: {

			options: {},

			dev: {
				NODE_ENV: 'development',
				DEST: 'temp'
			},

			prod: {

				NODE_ENV: 'production',
				DEST: 'dist'

			}
		},

		clean: {

		},

		requirejs: {

		},

		imagemin: {

		},

		copy: {

		}

	};

	/* ---- Creating the PackageDist Dinamically ---- */

	/* 
        - Iterate over all folders inside directory clients
        - For each folder, we will define a set of tasks generating the dist/clientIterator

     */

	console.log("Package Config.push(clean)");

	// first thing to do is clean
	var PackageDist = [];

	//Digoo, o que acha de colocar clients/*
	var src = [
		'*',
		'!node_modules'
	];

	var clients = grunt.file.expand({
		filter: 'isDirectory',
	}, src);

	console.log("Iterating over all clients folders");
	console.log("clients.length:" + clients.length);

	for (var i = 0; i < clients.length; i++) {

		var currentClient = clients[i],
			clientTask = [];

		currentClient = currentClient.split('/');
		currentClient = currentClient.pop();

		console.log('clients[' + i + ']: ', currentClient);

		if (_.indexOf(excludeClients, currentClient) !== -1)
			continue;

		var patterns = grunt.file.expand({
			filter: 'isDirectory',
		}, [currentClient + '/*', '!' + currentClient + '/_base']);

		for (var j = 0; j < patterns.length; j++) {

			var currentPattern = patterns[j];
			currentPattern = currentPattern.split('/');
			currentPattern = currentPattern.pop();

			// console.log('currentPattern[' + j + ']: ', currentPattern);

			var key = currentClient + '_' + currentPattern,
				path = currentClient + '/' + currentPattern + '/',
				patternTask = [];

			/*======================*/
			/*        COPY          */
			/*======================*/

			//expand means that grunt will create the sub-directory missing
			//http://stackoverflow.com/questions/16977884/what-does-the-expand-option-do-in-grunt-contrib-copy-the-examples-all-use-it

			/*src: Pattern(s) to match, relative to the cwd.*/

			// gruntConfig.copy[key] = {
			// 	files: [{
			// 		expand: true,
			// 		cwd: currentClient + '/' + currentPattern + '/css',
			// 		src: '*.css',
			// 		dest: '_dist/' + currentClient + '/' + currentPattern + '/css'
			// 	}]
			// };
			// PackageDist.push('copy:' + key);

			//clean
			gruntConfig.clean[currentClient] = gruntConfig.clean[currentClient] ? gruntConfig.clean[currentClient] : [];
			gruntConfig.clean[currentClient].push([path + '_dist']);

			(clientTask.indexOf('clean:' + currentClient) === -1) ? clientTask.push('clean:' + currentClient): null;
			(patternTask.indexOf('clean:' + currentClient) === -1) ? patternTask.push('clean:' + currentClient): null;

			//compass
			gruntConfig.compass = gruntConfig.compass ? gruntConfig.compass : {};
			gruntConfig.compass[currentClient + '_' + currentPattern] = {
				options: {
					sassDir: path + 'css/sass',
					cssDir: path + 'css'
				}
			};
			clientTask.push('compass:' + currentClient + '_' + currentPattern);
			patternTask.push('compass:' + currentClient + '_' + currentPattern);

			//reqJS			
			gruntConfig.requirejs = gruntConfig.requirejs ? gruntConfig.requirejs : {};

			gruntConfig.requirejs[currentClient + '_' + currentPattern + '_editor'] = {
				options: {
					wrap: true,
					namespace: 'player',
					optimize: 'none',
					preserveLicenseComments: false,
					baseUrl: path + "/js/desktop/",
					mainConfigFile: path + "/js/desktop/assets-editor.js",
					name: "../../../../../vendor/components/almond/almond",
					include: ['assets-editor'],
					out: path + "_dist/js/assets.editor.min.js"
				}
			};
			clientTask.push('requirejs:' + currentClient + '_' + currentPattern + '_editor');
			patternTask.push('requirejs:' + currentClient + '_' + currentPattern + '_editor');

			gruntConfig.requirejs[currentClient + '_' + currentPattern + '_desktop'] = {
				options: {
					optimize: 'none',
					preserveLicenseComments: false,
					baseUrl: path + "/js/desktop/",
					mainConfigFile: path + "/js/desktop/main.js",
					name: "../../../../../vendor/components/almond/almond",
					include: ['main'],
					out: path + "_dist/js/main.desktop.min.js"
				}
			};
			clientTask.push('requirejs:' + currentClient + '_' + currentPattern + '_desktop');
			patternTask.push('requirejs:' + currentClient + '_' + currentPattern + '_desktop');

			//removelogging
			gruntConfig.removelogging = gruntConfig.removelogging ? gruntConfig.removelogging : {};

			gruntConfig.removelogging[currentClient + '_' + currentPattern + '_editor'] = {
				src: path + "/_dist/js/assets.editor.min.js",
				dest: path + "/_dist/js/assets.editor.min.js",
				options: {}
			};
			clientTask.push('removelogging:' + currentClient + '_' + currentPattern + '_editor');
			patternTask.push('removelogging:' + currentClient + '_' + currentPattern + '_editor');

			gruntConfig.removelogging[currentClient + '_' + currentPattern + '_desktop'] = {
				src: path + "_dist/js/main.desktop.min.js",
				dest: path + "_dist/js/main.desktop.min.js",
				options: {}
			};
			clientTask.push('removelogging:' + currentClient + '_' + currentPattern + '_desktop');
			patternTask.push('removelogging:' + currentClient + '_' + currentPattern + '_desktop');

			//uglify
			gruntConfig.uglify = gruntConfig.uglify ? gruntConfig.uglify : {};

			files = {};
			files[path + './_dist/js/assets.editor.min.js'] = path + '_dist/js/assets.editor.min.js';
			gruntConfig.uglify[currentClient + '_' + currentPattern + '_editor'] = {
				files: files
			};
			clientTask.push('uglify:' + currentClient + '_' + currentPattern + '_editor');
			patternTask.push('uglify:' + currentClient + '_' + currentPattern + '_editor');

			files = {};
			files[path + '_dist/js/main.desktop.min.js'] = path + '_dist/js/main.desktop.min.js';
			gruntConfig.uglify[currentClient + '_' + currentPattern + '_desktop'] = {
				files: files
			};
			clientTask.push('uglify:' + currentClient + '_' + currentPattern + '_desktop');
			patternTask.push('uglify:' + currentClient + '_' + currentPattern + '_desktop');

			//imagemin			
			gruntConfig.imagemin = gruntConfig.imagemin ? gruntConfig.imagemin : {};

			gruntConfig.imagemin[currentClient + '_' + currentPattern] = {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: path + 'css/assets/images',
					src: ['**/*.{png,jpg,gif}'],
					dest: path + '_dist/css/assets/images'
				}]
			};
			clientTask.push('imagemin:' + currentClient + '_' + currentPattern);
			patternTask.push('imagemin:' + currentClient + '_' + currentPattern);

			//copy
			gruntConfig.copy = gruntConfig.copy ? gruntConfig.copy : {};

			gruntConfig.copy[currentClient + '_' + currentPattern] = {
				files: [
					{
						expand: true,
						cwd: path + '../_base/css/assets',
						src: '**/*.*',
						dest: path + '_dist/css/assets'
					},

					{
						expand: true,
						cwd: path + 'css',
						src: '*.css',
						dest: path + '_dist/css'
					},

					{
						expand: true,
						cwd: path + 'css',
						src: 'PIE.htc',
						dest: path + '_dist/css'
					},

					{
						expand: true,
						cwd: path + 'css/assets/fonts',
						src: '**/*',
						dest: path + '_dist/css/assets/fonts'
					},

					{
						expand: true,
						cwd: path + './themes',
						src: '*.css',
						dest: path + '_dist/'
					}
				]
			}
			clientTask.push('copy:' + currentClient + '_' + currentPattern);
			patternTask.push('copy:' + currentClient + '_' + currentPattern);

			//preprocess				
			gruntConfig.preprocess = gruntConfig.preprocess ? gruntConfig.preprocess : {
				options: {
					context: {
						PROD: true
					}
				}
			};

			files = {};
			files[path + '_dist/index.html'] = path + 'index.html';

			gruntConfig.preprocess[currentClient + '_' + currentPattern] = {
				files: files
			};
			clientTask.push('preprocess:' + currentClient + '_' + currentPattern);
			patternTask.push('preprocess:' + currentClient + '_' + currentPattern);

			//watch
			gruntConfig.watch = gruntConfig.watch ? gruntConfig.watch : {};

			gruntConfig.watch[currentClient + '_' + currentPattern] = {
				files: [
					path + './js/**/*.js',
					path + './js/**/*.html',
					path + './js/**/*.json',

					path + '../_base/js/**/*.js',
					path + '../_base/js/**/*.html',
					path + '../_base/js/**/*.json',

					path + './css/**/*.scss',
				],
				tasks: [
					'requirejs:' + currentClient + '_' + currentPattern + '_desktop',
					'requirejs:' + currentClient + '_' + currentPattern + '_editor',

					'compass:' + currentClient + '_' + currentPattern,
					'copy:' + currentClient + '_' + currentPattern
				],
				options: {
					spawn: false,
				}
			};

			console.log('patternTask builddev:' + currentClient + '_' + currentPattern, patternTask);
			grunt.registerTask('build:' + currentClient + '_' + currentPattern, patternTask);

			var patternTaskDev = removeElemFormArray(patternTask, deleteForDev);

			console.log('patternTaskDev builddev:' + currentClient + '_' + currentPattern, patternTaskDev);
			grunt.registerTask('builddev:' + currentClient + '_' + currentPattern, patternTaskDev);
		}

		// PackageDist.push('clean:' + currentClient);
		// PackageDist.push('compass:' + currentClient);

		// console.log('clientTask build:' + currentClient, clientTask);
		grunt.registerTask('build:' + currentClient, clientTask);

		var clientTaskDev = removeElemFormArray(clientTask, deleteForDev);
		// console.log('clientTaskDev builddev:' + currentClient, clientTaskDev);
		grunt.registerTask('builddev:' + currentClient, clientTaskDev);
	}

	/* ---- End Creating the PackageDist Dinamically ---- */

	//This method is an alias for the grunt.config.init method
	grunt.initConfig(gruntConfig);

	grunt.registerTask('package', function() {

		grunt.verbose.write("Initing Custom Task Package", PackageDist);

		// var context = process.env || {};
		// context.NODE_ENV = context.NODE_ENV || 'development';

		// if (context.NODE_ENV === 'development') {

		// 	grunt.log.writeln("Env Development");

		// 	var clientArg = grunt.option("client");
		// 	var src = clientArg;

		// 	grunt.log.writeln("Checking:" + src);

		// 	if (!grunt.file.isDir(src)) {

		// 		grunt.log.error('You must specify a client to generate the temp folder');
		// 		grunt.log.errorlns(
		// 			'grunt devel --client=client_id'
		// 		);

		// 		return;
		// 	}

		// 	//@TODO remove all items on PackageDIST
		// 	//withou the sub-string client_id

		// 	grunt.task.run(PackageDist);

		// } else {

		// 	grunt.log.writeln("Env Production");
		// 	//@TODO remove the tasks somethin:devel_something
		// 	//without the sub-string client_id
		// 	grunt.task.run(PackageDist);

		// }

	});

	// Build task.
	// grunt.registerTask('build', 'Automatically builds the final version of clients patterns.', [
	// 	'clean',
	// 	'compass',
	// 	'requirejs',
	// 	'removelogging',
	// 	'uglify',
	// 	'imagemin',
	// 	'copy',
	// 	'preprocess'
	// ]);
	// Default task.
	grunt.registerTask('devel', 'Automatically builds the temp version of specific client/pattern.', ['env:dev', 'package']);

	// grunt.registerTask('reqjs', ['requirejs']);
	// grunt.registerTask('imgmin', ['imagemin']);
	// grunt.registerTask('cp', ['copy']);
	// grunt.registerTask('process', ['preprocess']);
	// grunt.registerTask('build', ['reqjs', 'imgmin', 'cp', 'process']);

};