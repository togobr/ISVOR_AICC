define([], function() {
	var findAPI = function(win) {
		while ((win.API == null) && (win.parent != null) && (win.parent != win) && (win.API_1484_11) == null) {
			Player.Scorm.Wrapper.options.findAPITries++;
			// Note: 7 is an arbitrary number, but should be more than sufficient
			if (Player.Scorm.Wrapper.options.findAPITries > 7) {
				alert("Error finding API -- too deeply nested.");
				return null;
			}
			win = win.parent;
		}

		if(win.API_1484_11 != null){
			Player.Scorm.Wrapper.options.verLms = "2004";
			return win.API_1484_11;
		}
		
	}

	return findAPI;
});
