define([], function() {

	var getScormValue = function(scormVar, susDataVar) {
		var scormVars = Player.Scorm.vars;

		for (var key in scormVars) {
			if (scormVars.hasOwnProperty(key)) {
				console.log(key, scormVar);
				if (key === scormVar) {
					if (scormVar === 'cmi.suspend_data' && susDataVar) {
						return scormVars[key][susDataVar];
					} else {
						return scormVars[key];
					}
					break;
				}
			}
		}
	}

	return getScormValue;
});
