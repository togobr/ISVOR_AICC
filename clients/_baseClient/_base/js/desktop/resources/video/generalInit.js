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
		console.log('[rec]video [method]init [var]this, source', this, source);

		var me = this,
			data = me.model ? me.model.toJSON() : me.data,
			$el = me.$el,
			el_html = $el.html();

		this.renderVideojs = function() {
			console.log("initVideojs", data);

			if (source === "player") {
				// reset video content
				$el.html(el_html);
			}
			
			var videoData = {},
				el = $el.find('video')[0],
				player;

			if (data.youtube.active) {
				videoData = data.youtube;
				videoData.src = '//www.youtube.com/embed/' + videoData.id;
				videoData.techOrder = ['youtube', 'html5', 'flash'];
			} else if (data.vimeo.active) {
				videoData = data.vimeo;
				videoData.src = '//vimeo.com/' + videoData.id;
				videoData.techOrder = ['vimeo', 'html5', 'flash'];
			} else if (data.local.active) {
				videoData = data.local;
				videoData.techOrder = ['html5', 'flash'];
			} else if (data.web.active) {
				videoData = data.web;
				videoData.techOrder = ['html5', 'flash'];
			}

			if (!videoData.src) {
				player = videojs(el);

			} else {
				player = videojs(el, {
					techOrder: videoData.techOrder,
					src: videoData.src,
					controls: true
				});

				player.src({
					type: videoData.type,
					src: videoData.src
				});
			}

			player._src = videoData.src;

			me.$el.toggleClass('noContent', !videoData.src);

			return player;
		}

		if (source === "player") {
			Player.Elements.$content.on({
				contentReady: function() {
					me.player = me.renderVideojs();
				}
			});
		} else {
			me.renderVideojs();
		}
	}

	return init;
});