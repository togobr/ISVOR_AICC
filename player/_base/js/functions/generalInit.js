define([], function() {
	var generalInit = function(obj, data, index) {
		console.log('generalInit: ', obj, data, index);
		data.index = index + 1;
		var element = obj && obj.player ? new obj.player() : {};
		Player.Functions.compile.call(element, obj, data);
		(obj.generalInit) ? obj.generalInit.call(element, "player") : null;
		(element.init) ? element.init() : null;

		return element;
	}

	return generalInit;
});
