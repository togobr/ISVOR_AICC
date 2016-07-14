define([
	'jquery'
	], function($) {

	var getQueryVariable = function(variable) {
		var query = window.location.search.substring(1),
			vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		return false;
	}

	return getQueryVariable;
});