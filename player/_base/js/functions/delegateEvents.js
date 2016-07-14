define([
	"jquery"
	], function($) {

	var delegateEvents = function(baseObj, $baseEl, actionsArray) {
		if ($.isArray(actionsArray)) {
			for (var i = actionsArray.length - 1; i >= 0; i--) {
				var actionArray = actionsArray[i].split(' '),
					event = actionArray[0],
					selector = actionArray[1],
					action = actionArray[2];

				$baseEl.find(selector).on(event, function(e) {
					(baseObj[action]) ? baseObj[action]() : null;
				});
			};
		} else if($.isPlainObject(actionsArray)) {
			$.each(actionsArray, function(k, callback) {
				var actionArray = k.split(' '),
					event = actionArray[0],
					selector = actionArray[1];

				$baseEl.find(selector).on(event, function(e) {
					callback();
				});
			});
		}
	};

	return delegateEvents;
});
