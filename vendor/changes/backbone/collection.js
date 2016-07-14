define([
	'backbone',
	'generalChanges'
], function(Backbone, generalChanges) {
	_.extend(Backbone.Collection.prototype, {
		saveChanged: function() {
			var me = this,
				changed = me.getChanged(),
				url = this.url;

			console.log('[backboneChanges]Collection [method]saveChanged [var]changed: ', changed);
			if (changed && changed.models.length !== 0) {
				var data = {
					data: changed.data
				};
				console.log('[backboneChanges]Collection [method]saveChanged [var]data: ', data);

				var def = $.ajax({
					url: url,
					type: "PUT",
					contentType: "application/json; charset=UTF-8",
					data: JSON.stringify(data)
				});

				def.done(function(models, resp, xhr) {
					console.log('[backboneChanges]Collection [method]saveChanged/done [var]model, resp, xhr: ', models, resp, xhr);
					for (var i = models.length - 1; i >= 0; i--) {
						changed.models[i].changed = {}
						changed.models[i].set(models[i], {
							silent: true
						});
					};
				});

				def.fail(function(model, response) {
					console.log('[backboneChanges]Collection [method]saveChanged/done [var]model, resp, xhr: ', model, response);

				});
			} else {
				console.log('Sem novos modelos alterados');
			}

			// dummyModel = Backbone.Model.extend({
			// 	url: this.url,
			// }),
			// dummy = new dummyModel(changed ? changed.models : null),
			// options = {
			// 	success: function(model, resp, xhr) {
			// 		// console.log('saveChanged success', changed, resp);
			// 		for (var i = 0; i < changed.models.length; i++) {
			// 			// console.log(resp[i]);
			// 			changed.models[i].changed = {};
			// 			changed.models[i].set(resp[i], {
			// 				silent: true
			// 			});
			// 		}
			// 	},

			// 	error: function(model, response) {
			// 		// console.log("saveChanged error", model, response);
			// 	}
			// };

			// window.teste = dummy;
			// console.log('saveChanged ', changed, dummy);
			// if (changed) {
			// 	return dummy.save({}, options);
			// } else {
			// 	// return console.log('Sem novos modelos alterados');
			// }
		},

		getChanged: function() {
			var models = [],
				data = [],
				changedAttributes = [];

			for (var i = 0; i < this.models.length; i++) {
				if (this.models[i].hasChanged()) {
					changedAttributes.push(this.models[i].changedAttributes());
					models.push(this.models[i]);
					data.push(_.extend({
						_id: this.models[i].get("_id")
					}, this.models[i].changedAttributes()));
				}
			}
			return models.length ? {
				models: models,
				attributes: changedAttributes,
				data: data
			} : null;
		},

		move: function(oldIndex, newIndex) {
			var me = this,
				models = me.models;

			if (newIndex >= this.length) {
				var k = newIndex - this.length;
				while ((k--) + 1) {
					models.push(undefined);
				}
			}
			models.splice(newIndex, 0, models.splice(oldIndex, 1)[0]);
			me.trigger('move');
			return models;
		}
	}, generalChanges);
});