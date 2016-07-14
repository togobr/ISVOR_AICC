module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		date: Date.now(),

		// CONFIG ===================================/

		requirejsEditor: {},

		requirejs: {
			backbone: {
				// compile: {
				options: {
					preserveLicenseComments: true,
					wrap: true,
					optimize: "none",
					wrap: true,
					baseUrl: "./",
					mainConfigFile: "./mbBackbone.js",
					include: ['mbBackbone'],
					out: "./mbBackbone.min.js"
				}
				// }
			},

			jquery: {
				// compile: {
				options: {
					preserveLicenseComments: true,
					wrap: true,
					optimize: "none",
					baseUrl: "./",
					mainConfigFile: "./mbJquery.js",
					include: ['mbJquery'],
					out: "./mbJquery.min.js"
				}
				// }
			}
		},

		watch: {
			backbone: {
				files: [
					'./changes/backbone/*.js',
					'./components/backbone/*.js'
				],
				tasks: ['requirejs:backbone'],
				options: {
					spawn: false,
				}
			},

			jquery: {
				files: [
					'./changes/jquery/*.js',
					'./components/jquery/*.js'
				],
				tasks: ['requirejs:jquery'],
				options: {
					spawn: false,
				}
			}
		}
	});

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// TASKS =====================================/

	grunt.registerTask('build', ['requirejs']);
};