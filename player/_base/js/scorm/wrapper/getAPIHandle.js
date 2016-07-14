define([], function() {
	var getAPIHandle = function() {
		if (Player.Scorm.Wrapper.options.apiHandle == null) {
			Player.Scorm.Wrapper.options.apiHandle = Player.Scorm.Wrapper.getAPI();
		}
		return Player.Scorm.Wrapper.options.apiHandle;
	}

	return getAPIHandle;
});
