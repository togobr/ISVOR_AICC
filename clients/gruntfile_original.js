module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		date: Date.now(),

		// CONFIG ===================================/

		requirejs: {
			editor: {
				// compile: {
				options: {
					wrap: true,
					namespace: 'player',
					optimize: 'none',
					preserveLicenseComments: false,
					baseUrl: "./js/desktop",
					mainConfigFile: "./js/desktop/assets-editor.js",
					name: "../../../../../player/_base/js/vendor/almond/almond",
					include: ['assets-editor'],
					out: "./_dist/js/assets.editor.min.js"
				}
				// }
			},

			desktop: {
				// compile: {
				options: {
					optimize: 'none',
					preserveLicenseComments: false,
					baseUrl: "./js/desktop",
					mainConfigFile: "./js/desktop/main.js",
					name: "../../../../../player/_base/js/vendor/almond/almond",
					include: ['main'],
					out: "_dist/js/main.desktop.min.js"
				}
				// }
			}
		},

		watch: {
			scripts: {
				files: [
					'./js/**/*.js',
					'./js/**/*.html',
					'./js/**/*.json'
				],
				tasks: ['requirejs'],
				options: {
					spawn: false,
				},
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: 'css/assets/images',
					src: ['*.{png,jpg,gif}'],
					dest: '_dist/css/assets/images'
				}]
			}
		},

		copy: {
			main: {
				files: [{
						expand: true,
						cwd: 'css',
						src: '*.css',
						dest: '_dist/css'
					},

					{
						expand: true,
						cwd: 'css/assets/fonts',
						src: '**/*',
						dest: '_dist/css/assets/fonts'
					},

					{
						expand: true,
						cwd: './themes',
						src: '*.css',
						dest: '_dist/'
					}
				]
			}
		},

		preprocess: {
			options: {
				context: {
					PROD: true
				}
			},

			multifile: {
				files: {
					'_dist/index.html': 'index.html'
				}
			}
		}

	});

	// DEPENDENT PLUGINS =========================/

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-preprocess');

	// TASKS =====================================/

	grunt.registerTask('build', ['requirejs', 'imagemin', 'copy', 'preprocess']);

};