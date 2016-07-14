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
			console.log('initialization caixa de destaque: -------', this);
			var me = this;

			this.addElements({
				"btsContainer": ".mbTypeSpotLight"
			});

			console.log(this, this.recView);

			/*
			Processo de renderização irá ocorrer após o encerramento das ações de inicialização
 			*/
		},

		showing: function() {
			console.log('showing');
			var me = this,
				model = me.recView.model;

			/*
			Na exibição de um editor de recursos, são atribuidos os elementos e eventos que serão precisos que a view do recurso tenha
			**** LEMBRAR RETIRAR OS EVENTOS AO ESCONDER O EDITOR '#1' ****
			*/
			this.recView.addElements.call(this.recView, {
				'title': '#cdTitle',
				'content': '#cdContent'
			});

			this.recView.addEvents.call(this.recView, {
				'click _title': me.editTitle,
				'click _content': me.editContent
			});
		},

		hiding: function() {
			console.log('hiding');
			var me = this,
				$title = me.recView.elems.$title,
				$content = me.recView.elems.$content;

			/*
			#1 Retirado eventos inseridos nos elementos do recurso a ser editado
			*/
			this.recView.removeElements.call(this.recView, [
				'title',
				'content'
			]);

			this.recView.removeEvents.call(this.recView, [
				'click _title',
				'click _content'
			]);
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

		editContent: function() {
			console.log('editContent ------- ');

			var me = this.edition, //Eventos atrelados a view do recurso tem que voltar a ter a referencia a view da edição
				//Pametros necessários para que o metodo de textEdition funcione
				params = {
					$el: me.recView.elems.$content,
					attr: 'content',
					textEditor: {
						options: [
							'bold',
							'italic',
							'underline',
							'orderedList',
							'unorderedList',
							'removeFormat',
							'link',
							'highlighter',
							'spellchecker'
						]
					}
				};

			//Metodo que é exposto para edição de textos
			me.textEdition(params);

		}
	};

	return View;
});