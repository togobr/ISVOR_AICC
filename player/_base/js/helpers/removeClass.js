define([
	'jquery'
	], function($) {

	var removeClass = function(quem, pref) {
		if (quem.attr('class') != undefined) {
			var classArray = quem.attr('class').split(" ");
			for (var i = 0, lim = classArray.length; i < lim; i += 1) {
				if (classArray[i] && classArray[i].indexOf(pref) !== -1) {
					classArray.splice(i, 1);
					i--;
				}
			}
			classArray = classArray.toString().replace(/,/g, " ");
			quem.attr('class', classArray);
		}
	}

	return removeClass;
});
