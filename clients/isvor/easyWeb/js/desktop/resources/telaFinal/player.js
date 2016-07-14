define([
	'jquery'
	], function($) {

	var telaFinal = function(template, data) {
		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/
		
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			var recurso = this,
				$btnFim = recurso.$el.find('.btnCapaFim');
				$top = recurso.$el.find('.top'),
				$fimBackImage = recurso.$el.find(".fimBackImage"),
				$rightSideFim = recurso.$el.find(".rightSideFim"),
				$iframe = recurso.$el.find("iframe");

				$iframe.attr("src","");


				$btnFim.on({
					click:function(e){
						pipwerks.SCORM.set("adl.nav.request","continue");
						Player.Scorm.saveScormData(true);
					}
				});



				if(recurso.data.animado){
					$fimBackImage.hide();
					$rightSideFim.hide();
					
				}

			Player.Elements.$swipe.on({
				slideEnd: function(e, starIndex, endIndex){
					var posicaoRecurso = recurso.$el.parent().parent().data("index"),
						$imgPrincipalModulo = recurso.$el.find(".imgPrincipalModulo "),
						$numeroModulo = recurso.$el.find(".numeroModulo "),
						$textosCapaTopico = recurso.$el.find(".textosCapaTopico ");
		
					if(endIndex == recurso.getSlideNumber() ){

						$("body").find(".top").css("opacity", "0");

						$iframe.attr("src",recurso.data.srcAnima);

						if(Player.Scorm.vars["cmi.suspend_data"].t.a == 1 || Player.Scorm.vars["cmi.suspend_data"].t.a == 2){

							if($.inArray(Player.Scorm.vars["cmi.suspend_data"].t.a,Player.Scorm.vars["cmi.suspend_data"].t.opC) == -1){
								Player.Scorm.vars["cmi.suspend_data"].t.opC.push(Player.Scorm.vars["cmi.suspend_data"].t.a)
							}

						}else{

							if($.inArray(Player.Scorm.vars["cmi.suspend_data"].t.a,Player.Scorm.vars["cmi.suspend_data"].t.obC) == -1){
								Player.Scorm.vars["cmi.suspend_data"].t.obC.push(Player.Scorm.vars["cmi.suspend_data"].t.a)
							}

						}
						
						 

					} 
					
				}
			})

			
		},

		this["in"] = function(){
			this.$el.find("iframe").attr("src", this.data.srcAnima);



			var $slider = $("body").find("#slider");

			 if (navegador == "FIREFOX") {

			 	if(Player.Scorm.vars["cmi.suspend_data"].t.a == 1 || Player.Scorm.vars["cmi.suspend_data"].t.a == 2){

							if($.inArray(Player.Scorm.vars["cmi.suspend_data"].t.a,Player.Scorm.vars["cmi.suspend_data"].t.opC) == -1){
								Player.Scorm.vars["cmi.suspend_data"].t.opC.push(Player.Scorm.vars["cmi.suspend_data"].t.a)
							}

						}else{

							if($.inArray(Player.Scorm.vars["cmi.suspend_data"].t.a,Player.Scorm.vars["cmi.suspend_data"].t.obC) == -1){
								Player.Scorm.vars["cmi.suspend_data"].t.obC.push(Player.Scorm.vars["cmi.suspend_data"].t.a)
							}

						}
						
						
                this.$el.appendTo($slider);

                this.$el.css({
                    "position": "absolute",
                    "top": 0
                })
            }
		},
		this.out = function(){
			if (navegador == "FIREFOX") {
        		this.$el.appendTo($parentElement);
        	}

		}

	}

	return telaFinal;
});