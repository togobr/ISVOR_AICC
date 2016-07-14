require.config({
	paths: {
		jquery: '../../../../../vendor/components/jquery/dist/jquery.min',
		image: '../../../../../vendor/components/require-plugins/src/image',
		json: '../../../../../vendor/components/require-plugins/src/json',
		text: '../../../../../vendor/components/requirejs-text/text',
		namespace: '../../../../../vendor/components/namespace/namespace',
		videojs: '../../../../../vendor/components/video.js/dist/video-js/video',
		videojsyoutube: '../../../../../vendor/components/videojs-youtube/dist/vjs.youtube',
		videojsvimeo: '../../../../../vendor/components/videojs-vimeo/vjs.vimeo'
	},

	config: {
		namespace: {
			"_base": {
				"slides": {
					"baseURL": "../../../_base/js/slides",
					"paths": [
						"json!config.json"
					]
				},

				"resources": {
					"baseURL": "../../../_base/js/resources",
					"paths": [
						"json!config.json"
					]
				}
			},

			"slides": {
				"slideCapa": {
					"baseURL": "slides/slideCapa",
					"paths": [
						"text!template.html",
						"json!config.json",
						"editor"
					]
				},

				"slideFinal": {
					"baseURL": "slides/slideFinal",
					"paths": [
						"text!template.html",
						"json!config.json",
						"editor"
					]
				},

				"slideSubCapa": {
					"baseURL": "slides/slideSubCapa",
					"paths": [
						"text!template.html",
						"json!config.json",
						"editor"
					]
				},

				"slideAnimacao": {
					"baseURL": "slides/slideAnimacao",
					"paths": [
						"text!template.html",
						"json!config.json",
						"editor",
						"text!edition.html"
					]
				},

				"slideVideo": {
					"baseURL": "slides/slideVideo",
					"paths": [
						"text!template.html",
						"json!config.json"
					]
				},

				"slideAudio": {
					"baseURL": "slides/slideAudio",
					"paths": [
						"text!template.html",
						"json!config.json"
					]
				},

				"slideAtividade": {
					"baseURL": "slides/slideAtividade",
					"paths": [
						"text!template.html",
						"json!config.json"
					]
				}
			},

			"resources": {
				"audio": {
					"baseURL": "resources/audio",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"multimedia": {
					"baseURL": "resources/multimedia",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"caixaDestaque": {
					"baseURL": "resources/caixaDestaque",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"imagem": {
					"baseURL": "resources/imagem",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"video": {
					"baseURL": "resources/video",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor",
						"generalInit"
					]
				},

				"texto": {
					"baseURL": "resources/texto",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"botaoPP": {
					"baseURL": "resources/botaoPP",
					"paths": [
						"text!template.html",
						"text!modal.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"atividade": {
					"baseURL": "resources/atividade",
					"paths": [
						"text!template.html",
						"text!modal.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				},

				"atividadeGaveta": {
					"baseURL": "resources/atividadeGaveta",
					"paths": [
						"text!template.html",
						"text!edition.html",
						"json!config.json",
						"editor"
					]
				}

			}
		}
	}
});

require([
	"namespace!_base",
	"namespace!slides",
	"namespace!resources"
	], function(Base, Slides, Resources) {

	var Player = {
		"_base": Base,
		"Slides": Slides,
		"Resources": Resources
	}

	window.Player = Player;
});