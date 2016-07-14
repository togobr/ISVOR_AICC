define([], function() {

	var doLMSGetLastError = function() {
		var api = Player.Scorm.Wrapper.getAPIHandle();
		if (api == null) {
			alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
			//since we can't get the error code from the LMS, return a general error
			return _GeneralError;
		}

			return api.GetLastError().toString();

		
	}

	return doLMSGetLastError;
});
