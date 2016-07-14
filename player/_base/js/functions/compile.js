define([
	"jquery"
	], function($) {

	var generalInit = function(obj, data) {
		console.log ('PLAYER-------------------COMPILE', obj, data);
		
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				this[key] = obj[key]
			}
		}

		if(data.player){
			this.template = Player.VisualPattern.Slides[data.player._base].template; 
			data.template = data.player._base;
		}

		this.data = data;
		this.compiled = Player.Functions.compileTemplate(this.template, data);
		this.el = Player.Helpers.parser(this.compiled);
		this.$el = $(this.el);

		return this;
	};

	return generalInit;
});
