/*
	Não importar jquery pois compilação entrega para ele. Explicar melhor na hora de documentar
*/

define([], function() {
	var Slider = function() {
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

			Player.Elements.$content.on({
				contentReady: function() {
					// a tab ativa deve ser a ultima salva no SCORM
					var resource_id = me.data._id,
						scorm = Player.Scorm.getScormValue('cmi.suspend_data').slider || {},
						resource_scorm = scorm[resource_id] || {};

					if (resource_scorm.active === undefined) return;
					
					me.$el.tabs('option', 'active', resource_scorm.active);
				}
				
			});
		};

		this.renderTabsContent = function() {
			var me = this,
				tabs_content = me.$el.find('.tabs-content .tab-content'),
				tabs_thumbs = me.$el.find('.tabs-nav .anchor'),
				tabs_lis = me.$el.find('.tabs-nav li'),
				resource_slider = Player.VisualPattern.Resources.slider,

				resource_id = me.data._id,
				scorm = Player.Scorm.getScormValue('cmi.suspend_data').slider || {},
				resource_scorm = scorm[resource_id] || {};

			// append tab content
			$.each(me.data.tabs, function(i, tab) {
				if (!tab.dynamicContent.data) return;

				var slide = Player.Functions.buildContent().buildSlide(tab.dynamicContent.data),
					visited = (resource_scorm.tabs && resource_scorm.tabs[i] && resource_scorm.tabs[i].visited) || false,
					image_model = $.extend(true, {}, resource_slider.config.thumbnails, {
						src: tab.thumbnail.src,
						baseImg: tab.thumbnail.baseImg
					}),
					thumb = Player.Functions.buildContent().buildResourceView(image_model['imagem'], image_model);

				tabs_content.eq(i).prepend(slide.$el);
				tabs_thumbs.eq(i)
					.prepend(thumb.container)

				// ao clicar no tab, deve gravar no SCORM que o usuario o visitou
				.on({
					click: function(e) {
						var i = e.data,
							resource_id = me.data._id,
							suspend_data = Player.Scorm.getScormValue('cmi.suspend_data').slider,
							resource_scorm = {},
							new_suspend_data,
							tab = {};

						tab[i] = {
							visited: true
						};

						resource_scorm[resource_id] = {
							active: i,
							tabs: tab
						};

						new_suspend_data = $.extend(true, {}, suspend_data, resource_scorm);

						Player.Scorm.setScormValue('cmi.suspend_data', 'slider', new_suspend_data);
						tabs_lis.eq(i).addClass('visited');
					}
				}, i);  // passando `i` como parametro - acessa-se no callback por `event.data`

				// marca como visitado o tab atual (caso tenha sido gravado no SCORM)
				tabs_lis.eq(i).toggleClass('visited', visited);
			});
		}

	}

	return Slider;
});