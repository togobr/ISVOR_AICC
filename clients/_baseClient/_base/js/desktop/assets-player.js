require.config({
	config: {
		namespace: {
			"resources": {
				"caixaDestaque": {
					"baseURL": "resources/caixaDestaque",
					"paths": [
						"text!template.html"
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
						"player"
					]
				},

				"texto": {
					"baseURL": "resources/texto",
					"paths": [
						"text!template.html"
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
			}
		}
	}
});

define([
	"namespace!resources",
	], function(Resources) {
	console.log('Resources main module', Resources);

	var resources = Resources;

	return Resources;
});