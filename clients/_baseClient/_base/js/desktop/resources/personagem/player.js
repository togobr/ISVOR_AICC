define(['jquery'], function($) {

	var texto = function(template, data) {
		this.init = function() {
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));
		}

		this['in'] = function(slide) {
			console.log('caixa de texto slider IN executed on slide #%d', slide);
		}

		this.out = function(slide) {
			console.log('caixa de texto slider OUT executed on slide #%d', slide);
		}

	}

	return texto;
});