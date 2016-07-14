define([], function() {

	var doLMSSetValue = function(name, value) {
		var api = Player.Scorm.Wrapper.getAPIHandle();
		if (api == null) {
			alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
			return;
		} else {


                var result = pipwerks.SCORM.set(name, value);
           
			
			if (result.toString() != "true") {
				var err = Player.Scorm.Wrapper.ErrorHandler();
			}
		}
		return result.toString();
	}

	return doLMSSetValue;
});
