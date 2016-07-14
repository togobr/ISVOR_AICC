define([
	'backbone'
], function(Backbone) {
	// console.log('BACKBONE BASE ---- $ ', jQuery.waitDependencies);
	var generalChanges = {
		createStateModel: function(options) {
			var me = this,
				State = Backbone.Model.extend(options),
				state = new State();

			me.state = state;

			state.bind({
				change: function(model) {
					// console.log('change geral', model, options,);
					var model = model,
						changed = model.changed;

					for (var key in changed) {
						if (changed.hasOwnProperty(key)) {
							(me.stateHandlers[key]) ? me.stateHandlers[key].call(me, changed[key]) : null;
						}
					}
				}
			});
		},

		waitDependencies: jQuery.waitDependencies
	}

	return generalChanges;
});