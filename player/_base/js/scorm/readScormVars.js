define([], function() {
	var readScormVars = function() {
		Player.Scorm.vars = Player.Scorm.vars ? Player.Scorm.vars : {};
        Player.Scorm.info = Player.Scorm.info ? Player.Scorm.info : {};
        Player.Scorm.info.startTime = new Date().getTime();

        // var scormVars = Player.Config.general.scorm.vars;

        // console.log('scormVars---------', scormVars);
        // for (var i = scormVars.length - 1; i >= 0; i--) {
        // 	if (scormVars[i]) {
        // 		var value = pipwerks.SCORM.get(scormVars[i]);

        // 		if (scormVars[i] === "cmi.suspend_data") {
        // 			if (!Player.Helpers.isJSON(value) && value === "") {
        // 				Player.Scorm.vars[scormVars[i]] = {};
        // 			} else {
        // 				Player.Scorm.vars[scormVars[i]] = jQuery.parseJSON(value);
        // 			}
        // 		} else {
        // 			Player.Scorm.vars[scormVars[i]] = value;
        // 		}
        // 	}
        // };
	}

	return readScormVars;
});
