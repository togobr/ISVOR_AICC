define([], function() {
	var computeTime = function(startDate) {
		if (startDate != 0) {
			var currentDate = new Date().getTime(),
				elapsedSeconds = ((currentDate - startDate) / 1000),
				formattedTime = Player.Scorm.Wrapper.convertTotalSeconds(elapsedSeconds);
		} else {
			formattedTime = "00:00:00.0";
		}

		
			Player.Scorm.Wrapper.doLMSSetValue("cmi.session_time", formattedTime);
		
	}

	return computeTime;
});
