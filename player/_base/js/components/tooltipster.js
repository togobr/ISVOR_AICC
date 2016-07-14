define([
	"jquery",
	"tooltipster"
	], function($) {

	var tooltipster = function() {
		$('.mbTooltip').each(function(i, item) {
			var item = $(item),
				config = item.data(),
				content_el = null;

			if (config.content) {
				content_el = $(config.content);
				if (content_el.length) {
					config.content = content_el;
				}
			}

			if (!item.attr('title')) return;

			item.tooltipster(config);
		});
	}

	return tooltipster;
});