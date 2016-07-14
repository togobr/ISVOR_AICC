define([], function() {
	var setScormValue = function(scormVar, value, susDataVar) {
		var scormVars = Player.Scorm.vars;

		for (var key in scormVars) {
			if (scormVars.hasOwnProperty(key)) {
				if (key === scormVar) {
					if (scormVar === 'cmi.suspend_data' && susDataVar) {
						scormVars[key][value] = susDataVar;
					} else if (scormVar === "cmi.location" && value > (Player.Tree.slides.length - 1)) {
						scormVars[key] = Player.Tree.slides.length - 1;
					} else {
						scormVars[key] = value;
					}
					break;
				}
			}
		}
	}

	return setScormValue;
});
