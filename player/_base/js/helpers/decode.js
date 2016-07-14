define([
	'jquery'
	], function($) {

	var decode = function(data) {
		var senha = 'mobPass',
			decoded = '',
			decode = Player.helpers.base64_decode(data);
		for (var i = 0; i < decode.length; i++) {
			var chr = decode.substr(i, 1),
				mod = i % senha.length,
				passChr = senha.substr(mod, 1);
			decoded += String.fromCharCode(chr.charCodeAt(0) - passChr.charCodeAt(0));
		}
		return unescape(decoded);
	}

	return decode;
});