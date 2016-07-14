define([], function() {
	var View = {
		/*
		O objecto 'elemens' foi criado para separa em um objeto chamado elems atrelado a view
		todos os elementos que precisaram tratamento funcional.
		Os elementos são criados em pares com e sem o wrapper do jquery e nomeados com e som '$'.

		No objecto temos '<nome do objecto no elems>': '<seletor de busca atravez do $.find()>'
		ex: 'teste': '.verde' criará 'verde' e '$verde' no elems procurando por $.find('verde')

		Obs: todos tem main/$main no elems que representa o elemento geral		

		
		Aqui foi criada uma interface para criação de novas edições de recursos.
		Os verdadeiros metodos da view(render, initialize) foram abstraidos em um recurso genérico
		que serve de base para a criaão de todos os recursos e aqui fica as partes espicifas a edição
		deste recurso expecifico.

		Metodos disparados:
			- initializating: Ao final do initialiaze da view
			- showing: Ao final das funções de exibição do painel de edição
			- hiding: Ao final das funções de escondeimento do painel de edição
			- positioning: Ao final das funções de posicionamento
		*/

		initializating: function(e) {
			console.log('initialization Slider -------', this);
			var me = this,
				recView = me.recView,
				model = recView.model,
				$rec = $(recView.elems.main);

			me.tabStage = new Editor.Views.SliderStage({
				dependencies: {
					playerData: playerData,
					slidesData: Editor.Collections.slides
				},
				insertToDom: {
					method: 'append',
					selector: '.mbViewport'
				}
			});

			// insere os thumbs no rodape do recurso
			me.thumbs = [];
			recView.$el.on('rendered', function() {
				var tabs = model.get('tabs'),
					resource_slider = Editor.Player.Resources['slider'],
					$anchors = $rec.find('.anchor');

				me.thumbs = [];

				$.each(tabs, function(i, tab) {
					var resource_name = resource_slider.config.thumbnails.template,
						stage = me.tabStage.stageInstance,
						resource_model = $.extend(true, {}, resource_slider.config.thumbnails, {
							src: tab.thumbnail.src,
							baseImg: tab.thumbnail.baseImg
						}),
						thumb = Editor.Functions.resourceFactory.new(resource_name, stage, resource_slider.config.thumbnails, resource_model),
						cover = $('<div class="tab-thumb-cover"></div>').on('dblclick', function() {
							thumb.resource.$el.trigger('dblclick');
						});

					// caso usuario selecione uma imagem diferente para o thumb
					thumb.resource.model.on('change:src', function(thumb_model) {
						var thumb_json = thumb_model.toJSON();

						// altera o src do tab
						model.set('tabs[' + i + '].thumbnail.src', thumb_json.src, {
							silent: true
						});

						// altera a origem do thumb
						model.set('tabs[' + i + '].thumbnail.baseImg', thumb_json.baseImg, {
							silent: true
						});

						// altera a flag que diz que o usuario alterou o thumb
						model.set('tabs[' + i + '].thumbnail.changed', true, {
							silent: true
						});

						model.save();
					});

					$anchors.eq(i)
						.prepend(thumb.edition.el)
						.prepend(thumb.resource.$el)
						// cria um cover pois o elemento `.resource` está parando propagacao do evento mousedown
						.prepend(cover);
				});
			});

			// insere conteudo default quando nao tiver recursos
			me.tabStage.stageInstance.Collections.resources.on({
				loadedResourcesSuccess: function(resources) {
					if (resources.length) return;

					console.log('slider loadedResourcesSuccess but no resources. Loading default content...');
					me.insertDefaultContent();
					//me.tabStage.stageInstance.open('tituloTextoImagemDir');
				}
			});

			model.on('remove', function() {
				Editor.Views.Stage.destroy(me.tabStage.stageInstance);
			});

			this.addElements({
				'addRemoveTabs': '.addRemoveTabs',
				'subTypesBlocks': '.recTabsSubType'
			});

			this.events = _.extend(this.events, {
				'changeGroupSwitch': 'showSubType'
			});

			recView.$el
				.on('beforeRender', function() {
					me.tabStage.$el.detach();
				})
				.on('rendered', function() {
					var $rec = $(recView.elems.rec),
						active_tab = $rec.tabs('option', 'active');

					recView.addElements.call(recView, {
						'tabs': '.tabs-nav li',
						'tabsText': '.tabs-nav .tagP',
						'contents': '.tabs-content > .tab-content'
					});

					recView.addEvents.call(recView, {
						'dblclick _tabsText': me.editContent
					});

					me.openTab(active_tab);

					$rec
						.off('tabsactivate')
						.on('tabsactivate', function() {
							var $rec = $(recView.elems.rec),
								active_tab = $rec.tabs('option', 'active');

							model.set({
								active: active_tab
							});
						});

					me.showBtns();
				});
		},

		insertDefaultContent: function() {
			// do something
			// or override this method
		},

		showing: function() {
			var me = this,
				$main = me.recView.elems.$main,
				$rec = me.recView.$el,
				$recTabs = $rec.find('.ui-tabs-nav'),
				tabs_stage = me.tabStage;

			tabs_stage.stageInstance.enable();

			Editor.Views.Stage.setActive(tabs_stage.stageInstance);
			me.checkDisableStage();

			$main.addClass('onEdition2');
			$recTabs.sortable('option', 'disabled', false);
		},

		hiding: function() {
			var me = this,
				$main = me.recView.elems.$main,
				$rec = me.recView.$el,
				$recTabs = $rec.find('.ui-tabs-nav');

			// #1
			// Retirado eventos inseridos nos elementos do recurso a ser editado

			this.recView.removeElements.call(this.recView, [
				'tabs'
			]);
			this.recView.removeEvents.call(this.recView, [
				'dblclick _tabs'
			]);

			$main.removeClass('onEdition2');
			me.tabStage.stageInstance.disable().hideBoundingBoxes();
			Editor.Views.Stage.setActive('main');
			$recTabs.sortable('option', 'disabled', true);
		},

		showSubType: function(e, attr, value) {
			// console.log('showSubType: --- ', e, attr, value);
			var me = this,
				$main = me.elems.$main,
				type = attr.substr(0, attr.indexOf('.')),
				$subTypesBlocks = me.elems.$subTypesBlocks,
				$subTypesBlock = $main.find('[data-type="' + type + '"]');

			// console.log('showSubType', type, $subTypesBlock);
			$subTypesBlocks.hide();
			$subTypesBlock.show();
		},

		checkDisableStage: function() {
			var me = this,
				tabs_stage = me.tabStage.stageInstance,
				model = me.recView.model,
				$main = me.recView.elems.$main,
				data = model.toJSON();

			if (data.tabs.length <= 0) {
				tabs_stage.disable();
			} else if ($main.hasClass('onEdition2')) {
				tabs_stage.enable();
			}

		},

		editContent: function(e) {
			var me = this.edition,
				$rec = me.recView.$el,
				tabs = me.recView.elems.$tabsText,
				tab = $(e.currentTarget),
				tab_index = tabs.index(tab),

				params = {
					$el: tab, //Elemento wrapped pelo jquery
					attr: 'tabs[' + tab_index + '].tab', //atributo do modelo
					textEditor: {
						options: [ //opções do editor de texto
							'bold',
							'italic',
							'underline',
							'removeFormat',
							'align-left',
							'align-center',
							'align-right',
							'justify',
							'spellchecker'
						]
					}
				};

			// jQuery UI tem uma funcionalidade para acessibilidade
			// que é a navegação pelos tabs usando as setas do teclado
			// a rotina abaixo é para impedir essa funcionalidade quando editando texto
			/*tab
				.off('keydown.preventJqueryUIBehaviour')
				.on('keydown.preventJqueryUIBehaviour', function(e) {
					e.stopPropagation();
					e.stopImmediatePropagation();
				});*/

			// desabilita sortable enquanto estiver editando texto
			/*$rec
				.find('.ui-tabs-nav')
				.sortable('disable');*/

			// quando editar texto, substituir a tag `a.anchor`
			// por `div.anchor`
			// isso previne bugs ao selecionar o texto com o mouse
			/*var atag = $('<a class="anchor"></a>'),
				div = $('<div class="anchor"></div>'),
				anchor = tab.parent('.anchor');

			anchor.replaceWith(div.append(tab));

			// quando sair da edição de texto:
			tab
				.off('editableOff.tabWorkaround')
				.on('editableOff.tabWorkaround', function() {
					// habilita sortable
					$rec
						.find('.ui-tabs-nav')
						.sortable('enable');

					// substitui o elemento `div.anchor` por `a.anchor`
					// (inverso da operação acima)
					var anchor = tab.parent('.anchor');
					anchor.replaceWith(atag.append(tab));
				});*/

			//Metodo que é exposto para edição de textos
			me.textEdition(params);
		},

		showBtns: function() {
			var me = this,
				recView = me.recView,
				$addRemoveTabs = me.elems.$addRemoveTabs,
				model = recView.model,
				data = model.toJSON(),
				$rec = recView.$el,
				tabs = $rec.find('li'),
				ul = $rec.find('ul'),
				$addRmv = cloneAddRemoveTabs();

			function cloneAddRemoveTabs(i) {
				var $addRmv = $addRemoveTabs.clone(),
					i = (i === undefined ? $rec.find('li').length : i);

				return $addRmv
					.find('button#mbAddTab')
					.show()
					.on('click', function() {
						me.addTab(i + 1);
					})
					.end()
					.find('button#mbRemoveTab')
					.show()
					.on('click', function() {
						me.removeTab(i);
					})
					.end();
			}

			function moveTab(from, to) {
				var data = model.toJSON(),
					tabs = data.tabs;

				tabs.splice(to, 0, tabs.splice(from, 1)[0]);

				model.set('tabs', data.tabs);

				return data;
			}

			// make tabs sortable
			var old_index = null,
				new_index = null;

			$rec
				.find('.ui-tabs-nav')
				.sortable({
					delay: 200,
					disabled: !me.recView.elems.$main.hasClass('onEdition2'),
					distance: 25,
					axis: (data.vertical.active ? 'y' : 'x'),
					start: function(e, ui) {
						old_index = $rec.find('li').index(ui.item);
					},
					update: function(e, ui) {
						new_index = $rec.find('li').index(ui.item);

						moveTab(old_index, new_index);
					}
				});

			// cria botoes de exclusao para todas as tabs
			$.each(tabs, function(i) {
				var $addRmv = cloneAddRemoveTabs(i),
					tab = tabs.eq(i);

				$addRmv.prependTo(tab);
			});

			// cria inserção de tabs
			$addRmv.appendTo(ul);
		},

		addTab: function(index) {
			var me = this,
				model = me.recView.model,
				data = model.toJSON();

			data.tabs.splice(index, 0, {
				tab: '',
				thumbnail: {
					baseImg: '',
					src: '',
					changed: false
				},
				dynamicContent: {
					entity: "slide",
					_id: null
				}
			});
			data.active = Math.min(index, data.tabs.length - 1); // set created tab as active
			model.set(data);

			me.checkDisableStage();
		},

		removeTab: function(index) {
			var me = this,
				model = me.recView.model,
				data = model.toJSON();

			data.tabs.splice(index, 1);
			model.set('tabs', data.tabs);

			me.checkDisableStage();
		},

		openTab: function(tab_index) {
			var me = this,
				recView = me.recView,
				model = recView.model,
				$rec = $(recView.elems.main),
				tabs = model.get('tabs'),
				tab = tabs[tab_index],
				slide_id;

			if (!tab || !tab.dynamicContent) return; // tab doesn't exist
			slide_id = tab.dynamicContent._id;

			if (!slide_id) { // slide was not created yet
				me.createSlide(model.get('_id'), function(new_slide) {
					model.set('tabs[' + tab_index + '].dynamicContent._id', new_slide.get('_id'));
					// com o set do model, o recurso é renderizado novamente, fazendo com que openTab seja executado novamente
					// nao precisa fazer mais nada
				});

				return;
			}

			// cria o slide local que representa o conteudo do tab clicado
			var slide_model = new Editor.Models.Slide({
				_id: slide_id
			});

			slide_model.fetch().done(function() {
				me.appendStage(slide_model, tab_index);
			});
		},

		createSlide: function(resource_id, callback) {
			var new_slide_model = new Editor.Models.Slide({
				_resource_id: resource_id
			});

			new_slide_model.save().done(function() {
				callback(new_slide_model);
			});

		},

		// append stage to the opened content tab
		appendStage: function(slide_model, tab_index) {
			var me = this,
				recView = me.recView,
				$el = $(recView.elems.rec),
				tabs_stage = me.tabStage,
				tabs_content = recView.elems.$contents,
				content_tab = tabs_content.eq(tab_index);

			// insert stage at the tab's content
			tabs_stage
				.render(slide_model)
				.$el.prependTo(content_tab);

			me.checkDisableStage();
		}

	};

	return View;
});