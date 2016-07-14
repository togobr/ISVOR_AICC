/*!
 * @license RequireJS Namespace Plugin, Copyright (c) 2013 Ates Goral
 * @version 0.0.1
 * Loads modules into a namespace
 */
define(["module"], function(module) {
	return {
		load: function(name, req, onload, config) {
			var localConfig = module.config(),
				configObj = localConfig[name],
				modules = [],
				path = [name],
				type = Object.prototype.toString.call(configObj),
				// baseURL = type === '[object Object]' ? configObj.baseURL : name,
				paths = [];

			if (!configObj) {
				var err = new Error("Module configuration is missing");
				err.namespaceModule = name;
				onload.error(err);
				return;
			}

			var insertPaths = function(modules, baseURL) {
				for (var i = 0, limit = modules.length; i < limit; i++) {
					var index = modules[i].indexOf('!')

					if (modules[i] != undefined) {
						if (index !== -1) {
							var plugin = modules[i].substr(0, index + 1),
								moduleString = modules[i].substr(index + 1);

							paths.push(plugin + baseURL + '/' + moduleString);

						} else {
							paths.push(baseURL + '/' + modules[i]);
						}
					}
				};
			}

			if (configObj.baseURL) {
				modules = configObj.paths;
				insertPaths(modules, configObj.baseURL);
			} else {
				if (type === '[object String]') {
					modules = configObj.split(",");
					insertPaths(modules, name);
				} else if (type === '[object Object]') {
					for (var key in configObj) {
						if (configObj.hasOwnProperty(key)) {
							var mods = configObj[key].paths;
							for (var i = 0, limit = mods.length; i < limit; i++) {
								modules.push(key + "/" + mods[i]);
							}
							insertPaths(configObj[key].paths, configObj[key].baseURL);
						}
					}
				}
			}

			// console.log(paths, modules);

			req(paths, function() {
				var namespace = {},
					args = arguments;

				for (var i = 0; i < modules.length; i++) {
					var module = modules[i],
						idx = i,
						subModule,
						indexSubMod = module.indexOf('/');

					if (indexSubMod !== -1) {
						var subModules = module.split('/');
						subModule = subModules[0];
						module = subModules[1];
					}

					var indexPlugin = module.indexOf('!');

					if (indexPlugin !== -1) {
						var moduleString = module.substring(indexPlugin + 1, module.indexOf('.'));
						module = moduleString;
					}

					if (indexSubMod !== -1) {
						namespace[subModule] = namespace[subModule] ? namespace[subModule] : {};
						namespace[subModule][module] = args[idx];
					} else {
						namespace[module] = args[idx];
					}
				};

				onload(namespace);
			});
		}
	};
});
