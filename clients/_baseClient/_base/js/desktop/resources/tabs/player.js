/*
	Não importar jquery pois compilação entrega para ele. Explicar melhor na hora de documentar
*/

define([], function() {
	var Tabs = function() {
		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/
		
			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			var me = this;

			// renderTabsContent deve ser chamado antes da execução do evento `contentReady`
			me.renderTabsContent();

			/*Player.Elements.$content.on({
				contentReady: function() {
					
				}
			});*/
		};

		this.renderTabsContent = function() {
			var me = this,
				tabs_content = me.$el.find('.tabs-content .tab-content');

			// append tab content
			$.each(me.data.tabs, function(i, tab) {
				if (!tab.dynamicContent.data) return;

				var slide = Player.Functions.buildContent().buildSlide(tab.dynamicContent.data);

				tabs_content.eq(i).prepend(slide.$el);
			});
		}

	}

	return Tabs;
});