define([], function() {
	var namespace = function(obj, ns) {

		console.log(ns);
		window[obj] = window[obj] || {};

		var namespaceIt = function(ns_string) {

			var parts = ns_string.split('.'),
				parent = window[obj],
				i;

			if (parts[0] === obj) {
				parts = parts.slice(1);
			}
			for (i = 0; i < parts.length; i += 1) {
				if (typeof parent[parts[i]] === "undefined") {
					parent[parts[i]] = {};
				}
				parent = parent[parts[i]];
			}
			return parent;
		}

		if (typeof ns === 'string') {
			namespaceIt(ns);
		} else if (typeof ns === 'object') {
			for (var i = ns.length - 1; i >= 0; i--) {
				namespaceIt(ns[i]);
			};
		}
	};

	return namespace;
});
