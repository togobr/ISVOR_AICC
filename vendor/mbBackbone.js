require.config({
	shim: {
		backbone: {
			exports: 'Backbone'
		}
	},

	paths: {
		collection: './changes/backbone/collection',
		view: './changes/backbone/view',
		model: './changes/backbone/model',
		backbone: './components/backbone/backbone',
		generalChanges: './changes/backbone/generalChanges'
	}
});

require([
	'backbone',
	'collection',
	'view',
	'model'
], function(Backbone) {
	console.log('Modulo geral', Backbone);
	return Backbone
});