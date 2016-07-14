define([
	'jquery'
	], function($) {

	var isJSON = function(str) {
		if (typeof str === "number") {
			return false;
		} else {

			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}
	}

	return isJSON;
});
