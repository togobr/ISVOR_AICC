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
			console.log('initialization personagem -------', this);
			var me = this,
				$el = me.recView.$el,
				model = me.recView.model,
				current_src = model.get('src');

			// APENAS ADICIONANDO O INDICE DO OBJETO PARA SER USADO NA VIEW
			// JA QUE O MUSTACHE NAO RETORNA ALGO COMO @INDEX OU @KEY
			$.each(me.recView.config.character, function(i, character) {
				character.index = i;
				character.selected = $.grep(character.position, function(pos) {
					return pos === current_src;
				}).length > 0;
			});

			this.addElements({
				'charPicker': '#recCharPicker',
				'charPosition': '.thumbs-character .btn',
				'scrollPrev': '.scrollPrev',
				'scrollNext': '.scrollNext',
				'thumbsContainer': '#recCharPicker .mbBalloonOptions'
			});

			this.events = _.extend(this.events, {
				'change _charPicker': 'pickChar',
				'click _charPosition': 'selectPosition'
			});

			$el.on('rendered', function() {
				me.elems.$scrollPrev
					.on('mouseenter', function() {
						me.autoScrollTabs(-5);
					})
					.on('mouseleave', function() {
						me.stopAutoScrollTabs();
					})
					.on('click', function() {
						me.scrollTabs(-40);
					});

				me.elems.$scrollNext
					.on('click', function() {
						me.scrollTabs(40);
					})
					.on('mouseenter', function() {
						me.autoScrollTabs(5);
					})
					.on('mouseleave', function() {
						me.stopAutoScrollTabs();
					});

				me.pickChar();
			});

			me.scrollTabs(me.scrollPosition || 0);
		},

		showing: function() {
			var me = this;

			me.scrollTabs(0);
		},

		pickChar: function() {
			var me = this,
				$main = me.elems.$main,
				config = me.recView.config,
				selected = $main.find('.selectChar').val();

			$main
				.find('.thumbs-character')
				.hide()
				.filter('#character-' + selected)
				.show();

			me.scrollTabs(0);
		},

		selectPosition: function(e) {
			var me = this,
				position = e.currentTarget,
				model = me.recView.model,
				srcImage = $(position).children().attr('src');

			model.set('src', srcImage);
		},

		scrollTabs: function(pixels) {
			var me = this,
				$el = me.elems.$charPicker,
				$thumbsContainer = me.elems.$thumbsContainer,
				$scrollPrev = me.elems.$scrollPrev,
				$scrollNext = me.elems.$scrollNext,
				scroll = 'scrollTop',
				curr_scroll,
				final_scroll,
				max_scroll = $thumbsContainer[scroll](99999999)[scroll](),
				scroll_position;

			$thumbsContainer[scroll](me.scrollPosition || 0);
			curr_scroll = $thumbsContainer[scroll]();
			scroll_position = curr_scroll + pixels

			$thumbsContainer[scroll](scroll_position);

			final_scroll = $thumbsContainer[scroll]();
			me.scrollPosition = final_scroll;
			$el
				.toggleClass('scrollPrev-exausted', curr_scroll <= 0)
				.toggleClass('scrollNext-exausted', final_scroll >= max_scroll)
				.toggleClass('scrollable', max_scroll > 0);
		},

		autoScrollTabs: function(pixels) {
			var me = this,
				update = 15,
				$thumbsContainer = me.elems.$thumbsContainer,
				timeout = function() {
					setTimeout(function() {
						if (!me.scrollingTab) return;

						me.scrollTabs(pixels);
						timeout();

					}, update);
				};

			me.scrollingTab = true;
			timeout();

		},

		stopAutoScrollTabs: function() {
			var me = this;
			me.scrollingTab = false;
		}
	};

	return View;
});