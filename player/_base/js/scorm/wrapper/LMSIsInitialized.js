define([], function() {

	var LMSIsInitialized = function() {
		var api = Player.Scorm.Wrapper.getAPIHandle();
		if (api == null) {
			alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
			return false;
		} else {
				var errCode = api.GetLastError().toString();
			
			if (errCode == Player.Scorm.Wrapper.options._NotInitialized) {
				return false;
			} else {
				return true;
			}
		}
	}

	return LMSIsInitialized;
});
