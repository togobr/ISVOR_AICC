define([
	"zoom"
], function() {

	var imagem = function(template, data) {
		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/
		
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			var resource = this,
				zoomImg = this.$el.hasClass('zoomImg'), 
				hideElems = this.$el.find('#imageWrapper, #recImglegendaContent'),
				imageWrapper = this.$el.find('#imageWrapper');

			Player.Elements.$swipe.on({
				slideEnd: function(e, startIndex, endIndex, domInit, domEnd) {				
								
					if((resource.data.slide === endIndex)){						
						console.log('HA UMA IMAGEM:', resource.data.slide, startIndex, endIndex);
					}

				}
			});

			if(zoomImg){
				this.$el
				.zoom({
					on:'click', 
					magnify: 1.5
				})
				.on({
					click: function(e){
						if(!imageWrapper.hasClass('noContent')){
							hideElems.toggle();
						}
					}
				});
			}


		}

	}

	return imagem;
});