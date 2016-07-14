require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	shim: {
		mustache: {
			exports: 'Mustache'
		},

		jquery: {
			exports: '$'
		},

		modernizr: {
			exports: 'Modernizr'
		},

		swipe: {
			exports: 'Swipe'
		},

		tooltipster: {
			deps: [
				'jquery'
			]
		},

		videojs: {
			exports: 'videojs'
		},

		videojsyoutube: {
			exports: 'videojs.Youtube',
			deps: [
				'videojs'
			]
		},

		videojsvimeo: {
			exports: 'videojs.Vimeo',
			deps: [
				'videojs'
			]
		},

		zoom: {
			deps: [
				'jquery'
			]
		}
	},

	paths: {
		jquery: '../../../../../vendor/components/jquery/dist/jquery.min',
		mustache: '../../../../../vendor/components/mustache/mustache',
		modernizr: '../../../../../vendor/components/modernizr/modernizr',
		json: '../../../../../vendor/components/require-plugins/src/json',
		text: '../../../../../vendor/components/requirejs-text/text',
		namespace: '../../../../../vendor/components/namespace/namespace',
		swipe: '../../../../../vendor/components/swipe/swipe',
		tooltipster: '../../../../../vendor/components/tooltipster/js/jquery.tooltipster.min',
		videojs: '../../../../../vendor/components/video.js/dist/video-js/video',
		videojsyoutube: '../../../../../vendor/components/videojs-youtube/dist/vjs.youtube',
		videojsvimeo: '../../../../../vendor/components/videojs-vimeo/vjs.vimeo',
		zoom: '../../../../../vendor/components/jquery-zoom/jquery.zoom.min'
	},

	config: {
		namespace: {
			"functions": {
				"baseURL": "../../../../../player/_base/js/functions",
				"paths": [
					"ajax",
					"compileTemplate",
					"compile",
					"findSlideByVar",
					"buildContent",
					"animateEl",
					"generalInit",
					"delegateEvents",
					"animate"
				]
			},

			"polyfill": {
				"baseURL": "../../../../../player/_base/js/polyfill",
				"paths": [
					"isArray",
				]
			},

			"helpers": {
				"baseURL": "../../../../../player/_base/js/helpers",
				"paths": [
					"namespace",
					"decode",
					"parser",
					"isJSON",
					"isLocked",
					"resourceExtend",
					"getQueryVariable",
					"base64Decode",
					"serializeJSON",
					"csslizeJSON",
					"removeClass",
					"sortByProperty",
					"rgbaToHex",
					"arrayCompare",
					"findRecbyData"
				]
			},

			"components": {
				"baseURL": "../../../../../player/_base/js/components",
				"paths": [
					"recSequentialEntry",
					"modal",
					"swipe",
					"tooltipster"
				]
			},

			"scorm": {
				"baseURL": "../../../../../player/_base/js/scorm",
				"paths": [
					"initScorm",
					"getScormValue",
					"setScormValue",
					"readScormVars",
					"saveScormData",
					"endScorm"
				]
			},

			"scormWrapper": {
				"baseURL": "../../../../../player/_base/js/scorm/wrapper",
				"paths": [
					"options",
					"doLMSInitialize",
					"doLMSFinish",
					"doLMSGetValue",
					"doLMSSetValue",
					"doLMSCommit",
					"doLMSGetLastError",
					"doLMSGetDiagnostic",
					"LMSIsInitialized",
					"ErrorHandler",
					"getAPIHandle",
					"findAPI",
					"getAPI",
					"computeTime",
					"convertTotalSeconds"
				]
			},

			"config": {
				"baseURL": "config",
				"paths": [
					"json!general.json",
					"json!selectors.json",
				]
			},

			"main": {
				"baseURL": "main",
				"paths": [
					"text!template.html",
					"player"
				]
			},

			"resources": {
				"caixaDestaque": {
					"baseURL": "resources/caixaDestaque",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"imagem": {
					"baseURL": "resources/imagem",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"botaoPP": {
					"baseURL": "resources/botaoPP",
					"paths": [
						"text!template.html",
						"text!modal.html",
						"player"
					]
				},

				"video": {
					"baseURL": "resources/video",
					"paths": [
						"text!template.html",
						"player",
						"generalInit"
					]
				},

				"texto": {
					"baseURL": "resources/texto",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"atividade": {
					"baseURL": "resources/atividade",
					"paths": [
						"text!template.html",
						"text!modal.html",
						"player"
					]
				},

				"audio": {
					"baseURL": "resources/audio",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"multimedia": {
					"baseURL": "resources/multimedia",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"atividadeGaveta": {
					"baseURL": "resources/atividadeGaveta",
					"paths": [
						"text!template.html",
						"player"
					]
				}
			},

			"slides": {
				"default": {
					"baseURL": "slides/default",
					"paths": [
						"text!template.html"
					]
				},

				"slideCapa": {
					"baseURL": "slides/slideCapa",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"slideFinal": {
					"baseURL": "slides/slideFinal",
					"paths": [
						"text!template.html",
						"player"
					]
				},

				"slideSubCapa": {
					"baseURL": "slides/slideSubCapa",
					"paths": [
						"text!template.html",
						"player"
					]
				}
			}
		}
	}
});

require([
	"player"
], function(Player) {
	'use strict';

	/*jQuery(window).load(function() {
		alert("page finished loading now.");
	});*/
});