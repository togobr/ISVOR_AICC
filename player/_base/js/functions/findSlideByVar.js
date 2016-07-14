define([
	'jquery'
	], function($) {

	var findSlideByVar = function(variable, value) {
		var slides = Player.json.slides;
		for (var i = slides.length - 1; i >= 0; i--) {
			var slide = slides[i];
			for (var key in slide) {
				if (slide.hasOwnProperty(key)) {
					if (key === variable && slide[key] === value) {
						return i;
					}
				}
			}
		};
	};

	return findSlideByVar;
});