define([
	'backbone',
	'generalChanges'
], function(Backbone, generalChanges) {
	_.extend(Backbone.Model.prototype, {
		unset: function(attr, options) {
			if (typeof attr === "string") {
				return this.set(attr, void 0, _.extend({}, options, {
					unset: true
				}));
			} else if (Array.isArray(attr)) {
				// console.log('ARRAY ----- ');
				for (var i = attr.length - 1; i >= 0; i--) {
					this.set(attr[i], void 0, _.extend({}, options, {
						unset: true
					}));
				};

				return this;
			}
		},

		changeSilently: function() {
			var options = {},
				changing = this._changing;
			this._changing = true;

			// console.log(this._silent);
			for (var attr in this._silent) {
				this._pending[attr] = true;
			}
			this._silent = {};
			if (changing) {
				return this;
			}

			while (!_.isEmpty(this._pending)) {
				this._pending = {};
				for (var attr in this.changed) {
					if (this._pending[attr] || this._silent[attr]) continue;
					delete this.changed[attr];
				}
				this._previousAttributes = _.clone(this.attributes);
			}
			this._changing = false;
			return this;
		},

		arrayAttrRemove: function(attribute, value, options) {
			var me = this,
				array = _.clone(me.get(attribute)),
				index = array.indexOf(value),
				toSet = {};

			if (index !== -1) {
				array.splice(index, 1);
				toSet[attribute] = array;
				me.set(toSet, options);
			}
		},

		arrayAttrAdd: function(attribute, value, uniq, options) {
			var me = this,
				array = _.clone(me.get(attribute)),
				uniq = uniq ? uniq : true,
				toSet = {};

			if (Array.isArray(value)) {
				array = array.concat(value);
			} else {
				array.push(value);
			}

			(uniq) ? _.uniq(array): null;
			toSet[attribute] = array;
			me.set(toSet, options);
		},

		arrayAttrAddOrRemove: function(attribute, value) {
			var me = this,
				array = me.get(attribute),
				index = array.indexOf(value);

			if (index === -1) {
				me.arrayAttrAdd(attribute, value);
			} else {
				me.arrayAttrRemove(attribute, value);
			}
		},

		arrayAttrBackToIndex: function(attribute, index, options) {
			var me = this,
				array = _.clone(me.get(attribute)),
				toSet = {};

			array = array.slice(0, index);
			toSet[attribute] = array;
			me.set(toSet, options);
		}
	}, generalChanges);
});