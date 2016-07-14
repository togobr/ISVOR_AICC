define([], function() {

    var saveScormData = function(finaliza) {
        var scormWrapper = Player.Scorm.Wrapper,
            scormVars = Player.Scorm.vars;

        console.log(scormVars);
        for (var key in scormVars) {
            if (scormVars.hasOwnProperty(key)) {
                var valor = key === "cmi.suspend_data" && scormVars[key] !== "" ? JSON.stringify(scormVars[key]) : scormVars[key];
                // var valor = scormVars[key].value;
                if (valor && key !== "cmi.score.scaled") {

                    if (valor == "cmi.location") {
                        var locationString = valor.toString()
                        var foi = pipwerks.SCORM.set(key, locationString);
                    } else {
                        var foi = pipwerks.SCORM.set(key, valor);
                    }

                }
            }
        }

        // scormWrapper.computeTime(Player.Scorm.info.startTime);
        pipwerks.SCORM.save()

        if (finaliza) {
            Player.Scorm.endScorm();
        }
    }

    return saveScormData;
});