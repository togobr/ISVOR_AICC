define([
	'backbone',
	'generalChanges'
], function(Backbone, generalChanges) {
	_.extend(Backbone.View.prototype, {
		setElements: function() {
			var me = this;
			me.elems = me.elems ? me.elems : {};

			me.elems.$main = me.$el;
			me.elems.main = me.el;

			for (var key in me.elements) {
				if (me.elements.hasOwnProperty(key)) {
					var $element = me.$el.find(me.elements[key]);

					me.elems['$' + key] = $element;
					me.elems[key] = $element[0];
				}
			}

			return me;
		},

		addElements: function(obj) {
			var me = this;
			me.elements = me.elements ? me.elements : {};

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					me.elements[key] = obj[key]
				}
			}

			me.setElements();

			return me;
		},

		addEvents: function(obj) {
			var me = this;
			me.events = me.events ? me.events : {};

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					me.events[key] = obj[key]
				}
			}

			me.delegateEvents();

			return me;
		},

		removeElements: function(arr) {
			var me = this;
			me.elements = me.elements ? me.elements : {};

			for (var i = arr.length - 1; i >= 0; i--) {
				delete me.elements[arr[i]];
			};

			me.setElements();

			return me;
		},

		removeEvents: function(arr) {
			var me = this;
			me.events = me.events ? me.events : {};

			for (var i = arr.length - 1; i >= 0; i--) {
				delete me.events[arr[i]];
			};

			me.delegateEvents();

			return me;
		},

		updateElements: function(obj) {
			var me = this;
			me.elems = me.elems ? me.elems : {};

			for (var i = obj.length - 1; i >= 0; i--) {
				var selector = me.elements[obj[i]],
					$element = me.$el.find(selector);

				me.elems['$' + obj[i]] = $element;
				me.elems[obj[i]] = $element[0];
			};

			me.setElements();

			return me;
		},

		delegateEvents: function(events) {
			// console.log('delegateEvents init: ', this)
			// console.trace('delegateEvents init');
			
			var me = this,
				delegateEventSplitter = /^(\S+)\s*(.*)$/;

			if (!(events || (events = _.result(this, 'events')))) return this;
			me.undelegateEvents();
			for (var key in events) {
				var method = events[key];
				if (!_.isFunction(method)) {
					method = this[events[key]];
				}
				if (!method) {
					continue;
				}

				var match = key.match(delegateEventSplitter),
					eventName = match[1],
					selector = match[2] && match[2].substr(0, 1) === '_' && me.elements && me.elements[match[2].substring(1)] ? me.elements[match[2].substring(1)] : match[2];

				method = _.bind(method, this);
				eventName += '.delegateEvents' + this.cid;
				
				if (selector === '') {
					this.$el.on(eventName, method);
				} else {
					this.$el.on(eventName, selector, method);
				}
			}
			return this;
		},

		filter: function(elements) {
			var me = this,
				elems = me.elems;

			if (elements) {
				for (var key in elems) {
					if (elems.hasOwnProperty(key)) {
						if (key.indexOf('$') !== -1) {
							var elString = key.substr(1),
								index = $.inArray(elString, elements);

							if (elems[key]) {
								if (index !== -1) {
									elems[key].hide();
								} else {
									elems[key].show();
								};
							};
						};
					};
				};

				// for (var i = me.options.length - 1; i >= 0; i--) {
				// 	if (me.elems[me.options[i]]) {
				// 		me.elems['$' + me.options[i]].show();
				// 	}
				// };

				// for (var i = dif.length - 1; i >= 0; i--) {
				// 	if (me.elems[dif[i]]) {
				// 		me.elems['$' + dif[i]].hide();
				// 	}
				// };
			}
		}
	}, generalChanges);
});