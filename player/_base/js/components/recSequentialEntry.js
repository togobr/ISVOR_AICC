define([
	"jquery"
	], function($) {

	var recSequentialEntry = {
		init: function() {
			var me = this;
			Player.Elements.$swipe.on({
				slideEnd: function(e, stratIndex, endIndex, domInit, domEnd) {
					me.slideEnter(endIndex, Player.Config.general.reourcesInAnimation);
				},

				slideInit: function(e, stratIndex, endIndex, domInit, domEnd) {
					me.slideExit(stratIndex, Player.Config.general.reourcesInAnimation);
				}
			});

			Player.Elements.$content.on({
				contentReady: function(e) {
					var startSlide = Player.Scorm.getScormValue('cmi.location'),
						slides = Player.Tree.slides;

					startSlide = startSlide ? startSlide : 0;
					for (var i = slides.length - 1; i >= 0; i--) {
						// if (i !== startSlide) {
							me.slideExit(i, Player.Config.general.reourcesInAnimation, false);
						// }
					};
				}
			});
		},

		slideEnter: function(slideIndex, params, animated) {
			var resources = Player.Helpers.sortByProperty("data.order", Player.Tree.resources[slideIndex]),
				i = 0,
				interval;



			params.action = animated === false ? "show" : "in";
			clearInterval(interval);
			interval = setInterval(function() {
				if (resources[i] && resources[i].order !== false) {

			
					resources[i].$el.css('z-index', resources[i].data.order);
					Player.Functions.animateEl({
						"action": params.action,
						"element": resources[i].$el,
						"transition": params.transition,
						"time": params.time
					});
				}

				if ((i + 1) === resources.length) {
					clearInterval(interval);
				} else {
					i++;
				}
			}, params.interval);
		},

		slideExit: function(slideIndex, params, animated) {
			var resources = Player.Tree.resources[slideIndex],
				i = 0;

			params.action = animated === false ? "hide" : "out";
			for (var i = resources.length - 1; i >= 0; i--) {
				Player.Functions.animateEl({
					"action": params.action,
					"element": resources[i].$el,
					"transition": params.transition,
					"time": params.time
				});
			};
		}
	}

	return recSequentialEntry;
});