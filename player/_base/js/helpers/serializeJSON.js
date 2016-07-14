define([
	'jquery'
	], function($) {

	var serializeJSON = function(obj) {
		var dados = '';
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				dados += key + '=' + obj[key] + '&';
			}
		}
		return dados;
	}

	return serializeJSON;
});