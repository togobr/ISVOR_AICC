require.config({
	shim: {
		jquery: {
			exports: '$'
		}
	},

	paths: {
		jquery: './components/jquery/dist/jquery',
		jqueryChanges: './changes/jquery/jqueryChanges'
	}
});

require([
	'jqueryChanges'
], function($) {
	console.log('Modulo geral', $);

	return $
});