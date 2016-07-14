/* 
Para recursos de inicialização dinâmica onde precisamos inicializar um plugin para obter a visualização
final de um recursos criamos um modulo de inicialização geral que deve ser usado tando para player quando 
para o editor.

Cuidados devem ser tomados pois o escopo das duas chamadas é diferente
*/
define([
	"videojs",
	'videojsyoutube',
	'videojsvimeo'
], function(videojs, videojsyoutube, videojsvimeo) {
	var init = function(source) { //source é a flag que indica a origem da chamada: "player" || "editor"
		console.log('[rec]audio [method]init [var]this, source', this, source);
		
		var me = this,
			data = me.model ? me.model.toJSON() : me.data,
			$el = me.$el,
			el_html = $el.html();

		this.renderAudiojs = function() {

			if (source === "player") {
				// reset content
				$el.html(el_html);
			}

			var el = $el.find('audio')[0],
				player;

			if (!data.src) {
				player = videojs(el);

			} else {
				player = videojs(el, {
					src: data.src,
					techOrder: ['html5', 'flash'],
					controls: true
				});

				player.src({
					type: data.type,
					src: data.src
				});
			}

			me.$el.toggleClass('noContent', !data.src);
			return player;
		}

		if (source === "player") {
			Player.Elements.$content.on({
				contentReady: function() {
					me.player = me.renderAudiojs();
				}
			});
		} else {
			me.renderAudiojs();
		}
	}

	return init;
});