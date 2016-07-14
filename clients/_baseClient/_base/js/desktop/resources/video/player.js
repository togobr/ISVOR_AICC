/*
	Não importar jquery pois compilação entrega para ele. Explicar melhor na hora de documentar
*/

define([], function() {
	var video = function(template, data) {
		var me = this;

		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/
			console.log('init do recurso: ', this);
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			Player.Elements.$content.on({
				contentReady: function() {
					me.bindVideoEvents();
				}
			});
		},

		this.out = function() {
			var player = me.player || {};

			if (!player.played) return;

			me.player = me.renderVideojs();
			me.bindVideoEvents();
		},

		this.bindVideoEvents = function() {
			var player = me.player;

			console.log('contentReady rec player: ', player);

			player

			.one('play', function() {
				player.played = true;
			})

			.on("play", function() {
				console.log('video started to play');
				if (me.data.lock) {
					//video.lockPlayer(true);
				}
			})

			.on("error", function() {
				console.log('video error');
				if (me.data.lock) {
					me.lockPlayer(false);
				}
			})

			.on("ended", function() {
				console.log('video ended');
				if (me.data.lock) {
					me.lockPlayer(false);
				}
			})

			.on("fullscreenchange", function() {
				console.log('foo full screen change');
				me.$el.css('-webkit-animation', 'none')
				.toggleClass('fullscreen');
			});
			

			if (me.data.lock && !player._src) {
				me.lockPlayer(false);
			}
		}
	}

	return video;
});