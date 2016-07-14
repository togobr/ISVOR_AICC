define([
	'jquery',
	'modernizr'
	], function($, Modernizr) {

	if (Modernizr.csstransitions && Modernizr.csstransitions && Modernizr.csstransforms3d) {
		var animate = function(infoObject) {
			var prefix = "trans",
				element = $(infoObject.element),
				style = element[0].style;

			style.webkitAnimationDuration =
				style.MozAnimationDuration =
				style.msAnimationDuration =
				style.OAnimationDuration =
				style.AnimationDuration = infoObject.time + 'ms';

			Player.Helpers.removeClass(element, prefix); //Limpa o elemento de todas as classes com o prefixo trans

			if (infoObject.action == 'hide') {
				element.addClass('visuallyhidden');
			} else if (infoObject.action == 'show') {
				element.removeClass('visuallyhidden');
			} else {
				infoObject.action = infoObject.action.charAt(0).toUpperCase() + infoObject.action.slice(1); //Assegura primeira letra maiuscula
				infoObject.transition = infoObject.transition.charAt(0).toUpperCase() + infoObject.transition.slice(1); //Assegura primeira letra maiuscula
				element.addClass('animate');
				element.removeClass('visuallyhidden');
				// element.addClass(prefix + infoObject.transition + infoObject.action);
				element.addClass("fadeIn");

				if (infoObject.callback) {
					var callbackTimeout = window.setTimeout(function() {
						element.addClass('visuallyhidden');
						infoObject.callback();
						window.clearTimeout(callbackTimeout);
					}, infoObject.time);
				}
			}

		}
	} else {
		var animate = function(infoObject) {
			var sulfix,
				element = $(infoObject.element);

			infoObject.transition = 'fade'; //Força a transição para fade quando o navegador não tem suporte CSS3

			if (infoObject.action == 'hide') {
				element.hide();
			} else if (infoObject.action == 'show') {
				element.show();
			} else {
				infoObject.action = infoObject.action.charAt(0).toUpperCase() + infoObject.action.slice(1); //Assegura primeira letra maiuscula
				element[infoObject.transition + infoObject.action](Number(infoObject.time), function() {
					(infoObject.callback) ? infoObject.callback() : null;
				});
			}
		}
	}

	return animate;
});
