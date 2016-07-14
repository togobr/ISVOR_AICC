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
			console.log('initialization imagem -------', this);
			var me = this,
				model = me.recView.model,
				recView = me.recView,
				$gabarito = model.attributes.parametros.gabarito;

			//Uma maneira de deixar setado as alternativas que estão no gabarito de cada questão, 
			//não afetando o modelo que irá pro player.
			for (var i = $gabarito.length - 1; i >= 0; i--) {
				recView.elems.$rec.find('[value="' + $gabarito[i] + '"]').prop("checked", true);
			}

			this.addElements({
				'subTypesBlocks': '.recAtividadeSubType',
				'mbTrueFalseButton': '.mbTrueFalseButton',

				'mbAddAlternative': '#mbAddAlternative',
				'mbRemoveAlternative': '#mbRemoveAlternative',

				// 
				'addRemoveBlock': '#addRemoveBlock',
				'addRemoveTemplate': '#addRemoveTemplate',

				'lockPlayerBtn': '#editionLockPlayer'
			});

			this.events = _.extend(this.events, {
				'changeGroupSwitch': 'showSubType',
				'click _mbAddAlternative': 'addAlt',
				'click _mbRemoveAlternative': 'removeAlt',
				'click _mbTrueFalseButton': 'trueOrFalse',
				'click _lockPlayerBtn': 'toggleLockPlayer'
			});

			// reseleciona as opções apos renderizar
			me.recView.$el.on('rendered', function() {
				var model = me.recView.model,
					gabarito = model.attributes.parametros.gabarito,
					$rec = me.recView.elems.$rec;

				for (var i = gabarito.length - 1; i >= 0; i--) {
					$rec.find('[value="' + gabarito[i] + '"]').prop("checked", true);
				}

				me.showBtns();
			});

			/*
			Processo de renderização irá ocorrer após o encerramento das ações de inicialização
 			*/
		},

		toggleLockPlayer: function() {
			var me = this,
				model = me.recView.model,
				locked = model.get('lock');

			me.lockPlayer(!locked);
		},

		lockPlayer: function(lock) {
			var me = this,
				model = me.recView.model,
				$btnlockPlayer = me.elems.$lockPlayerBtn;

			if (lock !== true && lock !== false) {
				lock = !model.get('lock');
			}

			model.set({
				lock: lock
			});

			$btnlockPlayer.toggleClass('selected', lock);

			return lock;
		},

		showing: function() {
			console.log('showing texto', this);
			var me = this,
				model = me.recView.model,
				$addClassEdition = me.recView.elems.$main;

			this.recView.addElements.call(this.recView, {
				'title': '.recTitleAtividade',
				'content': '.recContentAtividade',
				'chkOrRadio': '.chkOrRadio'
			});

			this.recView.addEvents.call(this.recView, {
				'click _title': me.editTitle,
				'click _content': me.editContent,
				'change _chkOrRadio': function() {
					me.trueOrFalse();
				}
			});

			me.lockPlayer(!!model.get('lock'));

			// me.insertBtns(); //Respectivo aos botões de adicionar/remover questões e verdadeiro/falso
			me.showBtns();

			//Adiciona a classe onEdition2, ao entrar na area de edição da atividade.
			//Criado para adicionar o border-bottom nas alternativas
			$addClassEdition.addClass('onEdition2');
		},

		hiding: function() {
			var me = this,
				recView = me.recView,
				model = recView.model,
				$title = me.recView.elems.$title,
				$content = me.recView.elems.$content,
				$chkOrRadio = me.recView.elems.$chkOrRadio,
				$addClassEdition = me.recView.elems.$main;

			this.recView.removeElements.call(this.recView, [
				'title',
				'content',
				'chkOrRadio'
			]);

			this.recView.removeEvents.call(this.recView, [
				'click _title',
				'click _content',
				'change _chkOrRadio'
			]);
			
			$addClassEdition.removeClass('onEdition2');

			if (model.get("parametros.gabarito").length <= 0) {
				Editor.Views.dialogs.insert({
					icon: '4',
					title: 'Aviso! ',
					text: 'Você deve selecionar uma alternativa correta.',
					dismissable: true,
					timer: 3000,
					type: 'warning'
				});
			}
		},

		showSubType: function(e, attr, value) {
			// console.log('showSubType: --- ', e, attr, value);
			var me = this,
				$main = me.elems.$main,
				textEditor = Editor.Views.textEditor,
				type = attr.substr(0, attr.indexOf('.')),
				$subTypesBlocks = me.elems.$subTypesBlocks,
				$subTypesBlock = $main.find('[data-type="' + type + '"]');

			// console.log('showSubType', type, $subTypesBlock);
			$subTypesBlocks.hide();
			$subTypesBlock.show();

			/*
				Debugar um dia, não faço a menor ideia com dois funciona e com um não.
			*/

			textEditor.$el.hide();

			me.ensurePosition();
			me.ensurePosition();

		},

		showBtns: function() {

			var me = this,
				recView = me.recView,
				$addRemoveBlock = me.elems.$addRemoveBlock,
				$addRemoveTemplate = me.elems.$addRemoveTemplate,
				model = recView.model,
				viewAlts = recView.$el.find('li'),
				altClass = "mbAddRemoveAlternative",
				altsArray = model.get('alternativas');

			recView.$el.find('.addRemoveTemplate').remove();

			$.each(altsArray, function(i, alt) {
				var $addRmv = $addRemoveTemplate.clone(),
					viewAlt = viewAlts.eq(i);

				$addRmv
				.find('button#mbAddAlternative')
					.on('click', function() {
						me.addAlt();
					})
					.end()
				.find('button#mbRemoveAlternative')
					.on('click', function() {
						me.removeAlt();
					})
					.end()
					.prependTo(viewAlt);
			});
		},

		addAlt: function() {
			var me = this,
				$addRemoveBlock = me.elems.$addRemoveBlock,

				model = me.recView.model,
				alts = model.get('alternativas'),
				length = alts.length,
				item = {
					"numberAlt": alts.length,
					"alt": "Edite as alternativas dando dois cliques.",
					"checked": false
				};

			model.set('alternativas[' + length + ']', item);
			me.showBtns();

		},

		removeAlt: function(e) {
			var me = this,
				$addRemoveBlock = me.elems.$addRemoveBlock,
				model = me.recView.model,
				alts = model.get('alternativas'),
				length = alts.length;

			// array.splice(index, 1);

			model.set('alternativas[' + (length - 1) + ']');
			me.showBtns();
		},

		trueOrFalse: function(e) {
			var me = this,
				recView = me.recView,
				model = recView.model,
				gabaritoModel = model.get('parametros.gabarito'),
				atividade = recView.elems.$rec,
				altAssinaladas = atividade.find(".chkOrRadio:checked"),
				gabarito = [];

			altAssinaladas.each(function() {
				gabarito.push($(this).val());
			});

			model.set({
				"parametros.gabarito": gabarito,
			});

			for (var i = gabarito.length - 1; i >= 0; i--) {
				recView.elems.$rec.find('[value="' + gabarito[i] + '"]').prop("checked", true);
			}
		},

		editTitle: function() {
			// console.log('editTitle', this);

			var me = this.edition, //Eventos atrelados a view do recurso tem que voltar a ter a referencia a view da edição
				//Pametros necessários para que o metodo de textEdition funcione
				params = {
					$el: me.recView.elems.$title, //Elemento wrapped pelo jquery
					attr: 'title', //atributo do modelo
					textEditor: {
						options: [ //opções do editor de texto
							'italic',
							'underline',
							'removeFormat',
							'link',
							'spellchecker'
						]
					}
				};

			//Metodo que é exposto para edição de textos
			me.textEdition(params);
		},

		editContent: function(e) {
			var $el = $(e.currentTarget),
				index = $el[0].className.substr(28, 3),
				$el = this.elems.$content.eq(index),
				me = this.edition, //Eventos atrelados a view do recurso tem que voltar a ter a referencia a view da edição
				//Pametros necessários para que o metodo de textEdition funcione
				$hideBtn = this.elems.$rec.find('.addRemoveTemplate'),

				params = {
					$el: $el, //Elemento onde as ções vão ser realizadas (wrapped pelo jquery)
					attr: 'alternativas[' + index + '].alt', // atributo do modelo que vai ser alterado pela ação 
					textEditor: {
						options: [
							'bold',
							'italic',
							'underline',
							'orderedList',
							'unorderedList',
							'removeFormat',
							'link',
							'spellchecker'
						]
					}
				};

			//Metodo que é exposto para edição de textos
			me.textEdition(params);

			$hideBtn.hide();
		}
	};

	return View;
});