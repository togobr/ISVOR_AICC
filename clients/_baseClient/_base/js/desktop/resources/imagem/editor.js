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
			- hiding: Ao final das funções de escondimento do painel de edição
			- positioning: Ao final das funções de posicionamento
		*/

		initializating: function(e) {
			console.log('initialization imagem -------', this);
			var me = this;

			this.addElements({
				'imgPicker': '#recImgPicker',
				'imgEdit': '#recImgEditar',
				'imgLegend': '#recImgLegenda'
			});

			this.events = _.extend(this.events, {
				'click _imgPicker': 'pickImage',
				'click _imgEdit': 'editImage',
				'changeSwitch _main': 'changedSwitch'
			});

			this.recView.addElements.call(this.recView, {
				'img': 'img',
				'legenda': '#recImglegendaContent',
				'imageWrapper': '#imageWrapper'
			});

			_.bindAll(this, 'handlerPickedImage', 'handlerEditedImage');

			/*
			Processo de renderização irá ocorrer após o encerramento das ações de inicialização
 			*/
		},

		showing: function() {
			console.log('showing imagem', this);
			var me = this,
				model = me.recView.model;

			model.bind({
				change: function(model) {
					me.checkState();
				}
			});
			me.checkState();

			/*
			Na exibição de um editor de recursos, são atribuidos os elementos e eventos que serão precisos que a view do recurso tenha
			**** LEMBRAR RETIRAR OS EVENTOS AO ESCONDER O EDITOR '#1' ****
			*/

			this.recView.addEvents.call(this.recView, {
				'click _legenda': me.editlegend
			});
		},

		hiding: function() {
			console.log('hiding imagem');
			var me = this,
				$legenda = me.recView.elems.$legenda;

			// #1
			// Retirado eventos inseridos nos elementos do recurso a ser editado	

			this.recView.removeEvents.call(this.recView, [
				'click _legenda'
			]);
		},

		checkState: function() {
			var me = this,
				model = me.recView.model,
				baseImg = model.get('baseImg'),
				$imgEdit = me.elems.$imgEdit;

			if (!baseImg || baseImg === "") {
				$imgEdit.attr("disabled", "disabled");
			} else {
				$imgEdit.removeAttr('disabled');
			}
		},

		changedSwitch: function(data) {
			console.log('[view]edition/imagem [method]changedSwitch [var]data', data);
			this.resizing(null, null);
		},

		warned: false,
		resizing: function(e, ui) {
			console.log('[rec]image [method]resizing: ', e, ui, this);
			var me = this,
				recView = me.recView,
				model = recView.model,
				size = ui && ui.size ? ui.size.height : parseInt(model.get('styleObj.height')),
				$rec = recView.elems.$rec,
				$img = recView.elems.$img,
				$legenda = recView.elems.$legenda,
				recHeight = $rec.outerHeight(),
				legendaHeight = $legenda.outerHeight(),
				height = size - legendaHeight;

			console.log('[rec]image [method]resizing [var]size, recHeight, legendaHeight, height: ', size, recHeight, legendaHeight, height);
			this.recView.model.set('imgHeight', height);

			if (this.recView.model.get("src") !== "" && me.warned === false) {
				me.warned = true;
				Editor.Views.dialogs.insert({
					title: 'Cuidado! ',
					text: 'Você está alterando as dimensões originais desta imagem',
					dismissable: true,
					timer: 4000
				});
			}
			$img.outerHeight(size - $rec);

			// $img.outerHeight(ui.size.height - legendaHeight - (recPadding));
		},

		pickImage: function() {
			console.log('[rec]image [method]pickImage ------- ');

			var fileManager = window.Editor.Views.Modals.fileManager;

			fileManager.show({
				type: 1,
				callback: this.handlerPickedImage
			});
		},

		handlerPickedImage: function(data) {
			console.log('[rec]image [method]handlerPickedImage: ', data);
			var me = this,
				recView = this.recView,
				model = recView.model,
				$imageWrapper = recView.elems.$imageWrapper,
				url = data.path;

			// data.path = "http://images.aviary.com/imagesv5/feather_default.jpg";

			model.set({
				baseImg: url,
				src: ""
			}, {
				silent: true
			});

			console.log('[rec]image [method]handlerPickedImage [var]$imageWrapper, data.path', $imageWrapper, data, typeof data);
			Editor.Views.Modals.aviary.show({
				$el: $imageWrapper,
				src: data.path,
				callback: me.handlerEditedImage
			});
		},

		handlerEditedImage: function(data) {
			console.log('[rec]image [method]handlerEditedImage: ', data, this);
			if (data.status === 'error') {
				return;
			}

			var me = this,
				recView = this.recView,
				model = this.recView.model,
				id = model.get("_id"),
				src = model.get("src");

			model.set({
				src: data.url
			});

			(data.fit) ? me.fitToWidth(data.width): null;

			/* função que copia para s3 os arquivos do curso e percisa do modelo do recurso, 
			path para arquivo a ser copiado e atributo que vai ser alterado na finalização */
			me.copyToS3({
				entity: "resources",
				type: "image",
				model: model,
				src: data.url,
				attr: "src",
				process: false,
				options: data.resize ? data.resize : null
			});
		},

		fitToWidth: function(imgWidth) {
			console.log('[rec]image [method]fitToWidth [var]imgWidth: ', imgWidth);
			var me = this,
				recView = this.recView,
				model = this.recView.model,
				$rec = recView.elems.$rec,
				recPadding = parseInt($rec.css('padding')) || 0,
				width = imgWidth + (2 * recPadding);

			console.log('[rec]image [method]fitToWidth [var]width, recPadding: ', width, recPadding);
			this.recView.model.set({
				"styleObj.width": String(width) + "px"
			});
		},

		editImage: function() {
			console.log('[rec]image [method]editImage: ');
			var me = this,
				model = this.recView.model,
				baseImg = model.get('baseImg'),
				$img = me.recView.elems.$img;

			Editor.Views.Modals.aviary.show({
				$el: $img,
				src: baseImg,
				callback: me.handlerEditedImage
			});
			// Editor.Views.Modals.aviary.show($img, baseImg, me.handlerEditedImage);
		},

		editlegend: function() {
			console.log('editlegend', this);

			var me = this.edition, //Eventos atrelados a view do recurso tem que voltar a ter a referencia a view da edição
				//Pametros necessários para que o metodo de textEdition funcione
				params = {
					$el: me.recView.elems.$legenda, //Elemento wrapped pelo jquery
					attr: 'legend.content', //atributo do modelo
					// resize: false, //função a ser chamada caso haja alteração de altura no recurso de texto
					textEditor: {
						options: [ //opções do editor de texto
							'bold',
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
		}
	};

	return View;
});