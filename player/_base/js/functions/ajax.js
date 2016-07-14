define([
	'jquery'
	], function($) {
	var ajax = function(options) {
		var defaults = {
			type: "GET",
			dataType: 'text'
		},
			options = $.extend({}, defaults, options);

		return $.ajax(options);
	}

	return ajax;
});
