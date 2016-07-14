define([
	'jquery'
	], function($) {

	Array.prototype.compare = function (array) {
		// if the other array is a falsy value, return

		if (!array)
			return false;

		 var thisSorted = this.sort(),
			arraySorted = array.sort();

		// compare lengths - can save a lot of time
		if (thisSorted.length != arraySorted.length)
			return false;

		for (var i = 0, l=thisSorted.length; i < l; i++) {
			// Check if we have nested arrays
			if (thisSorted[i] instanceof Array && arraySorted[i] instanceof Array) {
				// recurse into the nested arrays
				if (!thisSorted[i].compare(arraySorted[i]))
					return false;
			}
			else if (thisSorted[i] != arraySorted[i]) {
				// Warning - two different object instances will never be equal: {thisSorted:20} != {thisSorted:20}
				return false;
			}
		}
		return true;
	}
});
