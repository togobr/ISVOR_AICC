define([
	'jquery'
	], function($) {

	var parser = function(string) {
		// var wrapper = document.createElement('div');
		// wrapper.innerHTML = string;
		// return wrapper.firstChild;

		var docfrag = document.createDocumentFragment(),
			wrapper = document.createElement('div');

		docfrag.appendChild(wrapper);
		wrapper.innerHTML = string;

		return docfrag.childNodes[0].firstChild;
	}

	return parser;
});
