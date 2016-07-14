define(['jquery'], function($) {

	var audio = function(template, data) {
		var self = this;

		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			Player.Elements.$content.on({
				contentReady: function() {
					self.bindAudioEvents();
				}
			});

		}

		this['in'] = function() {
			var player = self.player;

			if (!self.data.autoplay || !self.data.src || !self.data.type) return;

			player.play();
			
		},

		this.out = function() {
			var player = self.player;

			if (!player.played) return;

			self.player = self.renderAudiojs();
			self.bindAudioEvents();
		},

		this.bindAudioEvents = function() {
			var audio = self,
				player = audio.player;

			console.log('contentReady rec player: ', player);

			player

			.one('play', function() {
				player.played = true;
			})

			.on("play", function() {
				console.log('audio started to play');
				if (audio.data.lock) {
					audio.lockPlayer(true);
				}
			})

			.on("error", function() {
				console.log('audio error');
				if (audio.data.lock) {
					audio.lockPlayer(false);
				}
			})

			.on("ended", function() {
				console.log('audio ended');
				if (audio.data.lock) {
					audio.lockPlayer(false);
				}
			})

			.on("fullscreenchange", function() {
				console.log('foo full screen change');
				audio.$el.css('-webkit-animation', 'none');
			});

			if (audio.data.lock && !audio.data.src) {
				audio.lockPlayer(false);
			}
		}
	}

	return audio;
});