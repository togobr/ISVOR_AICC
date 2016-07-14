define([
	"jquery"
	], function($) {

	var animateEl = function(infoObject) {
		var me = this,
			animate = Player.Functions.animate,
			array = infoObject.element.toArray ? infoObject.element.toArray() : infoObject.element;

		if (Array.isArray(array)) {
			for (var i = array.length - 1; i >= 0; i--) {
				infoObject.element = array[i];
				animate(infoObject)
			};
		} else {
			animate(infoObject);
		}
	}

	return animateEl;
});
