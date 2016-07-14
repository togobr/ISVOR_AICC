define([], function() {
	var getAPI = function() {
		var theAPI = Player.Scorm.Wrapper.findAPI(window);
		if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
			theAPI = Player.Scorm.Wrapper.findAPI(window.opener);
		}

		if (theAPI == null) {
			alert("Unable to find an API adapter");
		}
		return theAPI;
	}

	return getAPI;
});
