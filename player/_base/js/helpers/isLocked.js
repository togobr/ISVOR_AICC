define([
	'jquery'
], function($) {

	/**
	 * check for all resources within the actual slide to see if any has the property "locked"
	 * @return {Boolean} returns true only when has at least 1 resource with locked attribute === true
	 */
	var isLocked = function(slide_number) {

		var slide = $.isNumeric(slide_number) ? slide_number : (Player.Tree.main.getCurrentSlide() - 1),
			resources_locked = $.grep($.makeArray(Player.Tree.resources[slide]), function(resource) {
				if (!$.isFunction(resource.lockPlayer)) return;

				return resource.lockPlayer() === true;
			});

		return (resources_locked.length != 0);

	};

	return isLocked;
});