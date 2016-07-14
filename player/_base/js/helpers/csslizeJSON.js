define([
	'jquery'
	], function($) {

	var csslizeJSON = function(obj) {
		var dados = '';
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				dados += key + ':' + obj[key] + ';';
			}
		}
		return dados;
	}

	return csslizeJSON;
});