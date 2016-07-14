define([], function() {
	var doLMSInitialize = function() {
		var api = Player.Scorm.Wrapper.getAPIHandle();
		if (api == null) {
			alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
			return "false";
		}

		var result = pipwerks.SCORM.init() 
		

		if (result.toString() != "true") {
			var err = Player.Scorm.Wrapper.ErrorHandler();
		}

		return result.toString();
	}

	return doLMSInitialize;
});
