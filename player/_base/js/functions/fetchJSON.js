define([
	'jquery'
	], function($) {
	var ajax = function(options) {
		this.options = $.extend({}, this.defaults, options);
		return $.ajax({
			type: "GET",
			url: url,
			dataType: 'text'
		});
	}

	return fetchJSON;
});
