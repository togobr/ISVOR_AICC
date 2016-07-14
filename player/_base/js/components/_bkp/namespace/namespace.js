/*!
 * @license RequireJS Namespace Plugin, Copyright (c) 2013 Ates Goral
 * @version 0.0.1
 * Loads modules into a namespace
 */
define(["module"], function(module) {
    return {
        load: function(name, req, onload, config) {
            var localConfig = module.config();
            var modules = localConfig[name],
                path = [name],
                type = Object.prototype.toString.call(modules),
                baseURL = type === '[object Object]' ? modules.baseURL : name,
                paths = [];

            if (!modules) {
                var err = new Error("Module configuration is missing");
                err.namespaceModule = name;
                onload.error(err);
                return;
            }

            if (type === '[object Object]') {
                modules = modules.paths;
            } else if (type === '[object String]') {
                modules = modules.split(",");
            }

            for (var i = 0, limit = modules.length; i < limit; i++) {
                var index = modules[i].indexOf('!')

                if (index !== -1) {
                    var plugin = modules[i].substr(0, index + 1),
                        moduleString = modules[i].substr(index + 1);

                    paths.push(plugin + baseURL + '/' + moduleString);

                } else {
                    paths.push(baseURL + '/' + modules[i]);
                }

            };

            req(paths, function() {
                var namespace = {},
                    args = arguments;

                modules.forEach(function(module, idx) {
                    var index = module.indexOf('!');

                    if (index !== -1) {
                        var moduleString = module.substring(index + 1, module.indexOf('.'));
                        namespace[moduleString] = args[idx];
                    } else {
                        namespace[module] = args[idx];
                    }
                });

                onload(namespace);
            });
        }
    };
});