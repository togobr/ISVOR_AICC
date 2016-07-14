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
                paths = [],
                reiterate = function(configObj, propnames) {
                    for (var key in configObj) {
                        if (configObj.hasOwnProperty(key)) {

                            var mods = configObj[key].paths;
                            if (!mods) {
                                if (!propnames) {
                                    propnames = [];
                                }
                                propnames.push(key);
                                reiterate(configObj[key], propnames);
                                propnames = undefined;
                                continue;
                            }

                            for (var i = 0, limit = mods.length; i < limit; i++) {
                                var module_prefix = propnames && propnames.length ? (propnames.join("/") + "/") : '';
                                modules.push(module_prefix + key + "/" + mods[i]);
                            }
                            insertPaths(configObj[key].paths, configObj[key].baseURL);
                        }
                    }
                };

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
                    reiterate(configObj);
                }
            }

            req(paths, function() {
                var namespace = {},
                    args = arguments;

                for (var i = 0; i < modules.length; i++) {

                    var module = modules[i],
                        idx = i,
                        paths = module.split('/'),
                        paths_len = paths.length;

                    if (!paths_len) continue;

                    for (var l = 0, n = namespace; l < paths_len; l++) {
                        var path = paths[l],
                            index_plugin = path.indexOf('!');

                        // remove a marcacao de plugin: `json!`, `text!`, etc...
                        if (index_plugin >= 0) {
                            path = paths[l] = path.substring(index_plugin + 1, path.indexOf('.'));
                        }


                        // cria sub-objetos caso nao existam
                        if (!n[path]) {
                            n[path] = {};
                        }

                        if (l < paths_len - 1) {
                            // não é o ultimo indice do array
                            n = n[path];
                        }
                    }

                    n[paths[paths_len - 1]] = args[idx];

                };
                onload(namespace);
            });
        }
    };
});