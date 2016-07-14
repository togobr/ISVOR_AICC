define([], function() {
    var doLMSFinish = function() {
        var api = Player.scorm.wrapper.getAPIHandle();
        if (api == null) {
            alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
            return "false";
        } else {
            // call the LMSFinish function that should be implemented by the API
            var result = pipwerks.SCORM.quit();
            if (result.toString() != "true") {
                var err = ErrorHandler();
            }
        }
        return result.toString();
    }

    return doLMSFinish;
});