define(['jquery'], function($) {

	var resourceExtend = function(resource) {

		var self = this;

		this.init = function() {

			var data = resource && resource.data || {};
			
			// check for initial 'lock' for resource data
			if (data.lock === true) {
				Player.Elements.$content.on({
					contentReady: function() {
						self.lockPlayer(true);
					}
				});
			}
		};

		this.lockPlayer = (function() {

			var locked = false;

			return function(lock) {

				if (lock === true) {
					locked = true;
					if (Player.Helpers.isLocked()) { // check if current slide is locked
						console.log('resource LOCKED the player\'s buttons');
						Player.Tree.main.disableBtAvancar();
					}
				} else if (lock === false) {
					locked = false;

					if (!Player.Helpers.isLocked()) { // check if current slide is locked
						console.log('resource UNLOCKED the player\'s buttons');
						Player.Tree.main.enableBtAvancar();
					}
				}

				return locked;
			}
		})();

		/**
		 * return the slide number this resources is
		 * @return {INTEGER|NULL} slide number or null if not found
		 */
		this.getSlideNumber = function() {
			var slide_number = null;

			$.each(Player.Tree.resources, function(i, resources) {
				$.each(resources, function(l, slide_resource) {
					if (resource.data.id == slide_resource.data.id) {
						slide_number = i;
						return false;
					}
				})
				if (!(slide_number === null)) return false;
			});

			return slide_number;
		};

		this.init();

		return this;

	};

	return resourceExtend;

});