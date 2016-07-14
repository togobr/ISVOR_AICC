define([
	"jquery",
	"swipe"
], function($, Swipe) {

	var swipe = function($domEle, params) {
		var startSlide = Number(Player.Scorm.getScormValue('cmi.location'));

		Player.Helpers.namespace('Player', [
			'Elements'
		]);

		params.startSlide = startSlide ? startSlide : 0;

		params.callbackEnd = function(stratIndex, endIndex, domInit, domEnd) {
			$domEle.trigger('slideEnd', [stratIndex, endIndex, domInit, domEnd]);
		}

		params.callbackInit = function(stratIndex, endIndex, domInit, domEnd) {
			$domEle.trigger('slideInit', [stratIndex, endIndex, domInit, domEnd]);
		}

		params.transitionEnd = function(slide) {
			$domEle.trigger('transitionEnd', [slide]);
		};

		Player.Elements.swipe = new Swipe($domEle[0], params);

		$domEle.trigger('slideEnd', [0, params.startSlide, null, null]);
	}

	return swipe;
});