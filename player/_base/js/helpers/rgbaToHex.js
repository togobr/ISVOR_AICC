define([], function() {
	var rgbaToHex = function(color, opacity) {
		var opa = Math.floor(opacity * 255).toString(16);

		return "#" + opa + $.map(color.match(/\b(\d+)\b/g), function(digit) {
			return ('0' + parseInt(digit).toString(16)).slice(-2)
		}).join('');
	}

	return rgbaToHex;
});
