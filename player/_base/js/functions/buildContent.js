define([
	'jquery'
], function($) {

	var buildContent = function() {
		var me = this,
			order_resources = function(resources) {
				// corrige a propriedade "order" que deveria vir do backend como integer
				// caso contrario a ordenação dos recursos ficaria algo como:
				// ["0", "1", "11", "12", "2", ...]
				$.each(resources, function(i, rec) {
					rec.order = parseInt(rec.order, 10);
				});

				resources = Player.Helpers.sortByProperty("order", resources);

				return resources;
			},

			prepare_resources = function(resources) {
				var recArray = [],
					resources = order_resources(resources);

				for (var j = resources.length - 1; j >= 0; j--) {
					var res = resources[j],
						recPattern = Player.VisualPattern.Resources[res.template],
						resourceClass = res['class'] || '',
						resource = Player.Functions.generalInit(recPattern, res, j),
						// cria um container para o recurso para deixar pareado com o editor (que possui um container para o mesmo)
						container = $('<div class="resource"></div>').addClass(resourceClass).prepend(resource.$el.css({
							'z-index': res.order
						}));

					recArray.push({
						container: container,
						instance: resource
					});
				}

				return recArray;
			};

		return {
			buildMain: function(json) {
				console.log('buildContent for main------', json);
				var main = Player.Functions.generalInit(Player.VisualPattern.Main, json),
					contentSelector = Player.Config.selectors.content,
					visualPatterns = Player.VisualPattern.Slides;
					slides = json.slides;
				/*
					Documentar a criação de uma arvore de acesso aos elementos ops sua renderização e inicialização
				*/
				Player.Tree.main = main;
				Player.Tree.slides = [];
				Player.Tree.resources = [];

				$.each(slides, function(slide_number, _slide) {
					var slidePattern = visualPatterns[_slide.template] || visualPatterns['default'],
						slide = Player.Functions.generalInit(slidePattern, _slide, slide_number),
						resources = prepare_resources(_slide.resources || []),
						recArr = [];

					// adiciona os recursos ao slide
					$.each(resources, function(j, resource) {
						recArr.push(resource.instance);
						(slide.addResource) ? slide.addResource(resource.container): slide.$el.append(resource.container); //**Documentar, metodos de inclusão customizada de recursos
					});

					Player.Tree.slides.push(slide);
					Player.Tree.resources.push(recArr);
					(main.addSlide) ? main.addSlide(slide.$el): main.$el.find(contentSelector).append(slide.$el); //**Documentar, metodos de inclusão customizada de slides
				});

				$('body').append(main.$el);
			},

			buildSlide: function(json_slide, slide_number) {
				var slidePattern = Player.VisualPattern.Slides['default'],
					slide = Player.Functions.generalInit(slidePattern, json_slide, slide_number),
					resources = prepare_resources(json_slide.resources || []);
				
				// adiciona os recursos ao slide
				$.each(resources, function(j, resource) {
					(slide.addResource) ? slide.addResource(resource.container): slide.$el.append(resource.container);
				});

				slide.resources = resources;

				return slide;
			},

			buildResourceView: function(resourcename, params) {
				var resource = prepare_resources([params])[0];

				return resource;
			}
		}

	};

	return buildContent;
});