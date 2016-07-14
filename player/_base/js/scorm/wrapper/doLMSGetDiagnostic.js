define([], function() {
	var doLMSGetDiagnostic = function(errorCode) {
		var api = Player.Scorm.Wrapper.getAPIHandle();
		if (api == null) {
			alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
		}
		
			return api.LMSGetDiagnostic(errorCode).toString();
		
	}
	return doLMSGetDiagnostic;
});
