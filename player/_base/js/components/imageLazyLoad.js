define([
	'jquery'
	], function($) {

	var imageLazyLoad = function(params, nSlides) {
		var me = this,
			defaults = {
				placeholderURL: "./css/assets/images/placeholder.png"
			};

		me.params = $.extend({}, me.defaults, params);
		me.arraySlides = new Array(nSlides);
		console.log('imageLazyLoad ------- ', me.arraySlides.length);

		Player.Elements.$swipe.on({
			slideEnd: function(e, stratIndex, endIndex, domInit, domEnd) {
				var imgs = me.arraySlides[endIndex];
				if (imgs.length !== 0) {
					for (var i = imgs.length - 1; i >= 0; i--) {
						loadImage(imgs[i]);
					};
				}
			}
		});

		this.add = function($img, slide) {
			console.log('IMAGE LAZY LOAD ADD', $img, slide);
			me.arraySlides[slide] = me.arraySlides[slide] ? me.arraySlides[slide] : [];
			formatPlaceholder($img);
			me.arraySlides[slide].push($img);

			console.log(me.arraySlides);
		}

		formatPlaceholder = function($img) {
			var src = $img.attr('src');

			$img.data('src', src);
			$img.attr('src', me.params.placeholderURL);
		}

		loadImage = function($img) {
			var daraSrc = $img.data('src');

			$img.attr('src', daraSrc);
		}

	}

	return imageLazyLoad;
});
