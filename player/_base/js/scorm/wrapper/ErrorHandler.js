define([], function() {

    var ErrorHandler = function() {
        var api = Player.Scorm.Wrapper.getAPIHandle();
        if (api == null) {
            alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
            return;
        }

        // check for errors caused by or from the LMS
        if (Player.Scorm.Wrapper.options.verLms == "2004") {
            var errCode = api.GetLastError().toString();
            if (errCode != Player.Scorm.Wrapper.options._NoError) {
                // an error was encountered so display the error description
                var errDescription = api.GetErrorString(errCode);
                if (Player.Scorm.Wrapper.options._Debug == true) {
                    errDescription += "\n";
                    errDescription += api.LMSGetDiagnostic(null);
                    // by passing null to LMSGetDiagnostic, we get any available diagnostics
                    // on the previous error.
                }
                alert(errDescription);
            }

        } else {
            var errCode = api.LMSGetLastError().toString();
            if (errCode != Player.Scorm.Wrapper.options._NoError) {
                // an error was encountered so display the error description
                var errDescription = api.LMSGetErrorString(errCode);
                if (Player.Scorm.Wrapper.options._Debug == true) {
                    errDescription += "\n";
                    errDescription += api.LMSGetDiagnostic(null);
                    // by passing null to LMSGetDiagnostic, we get any available diagnostics
                    // on the previous error.
                }
                alert(errDescription);
            }

        }

        return errCode;
    }
    return ErrorHandler;
});