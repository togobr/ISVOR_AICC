define([], function() {
    var doLMSCommit = function() {
        var api = Player.scorm.wrapper.options.getAPIHandle();
        if (api == null) {
            alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
            return "false";
        } else {
            var result = pipwerks.SCORM.save();
            if (result != "true") {
                var err = ErrorHandler();
            }
        }
        return result.toString();
    }

    return doLMSCommit;
});