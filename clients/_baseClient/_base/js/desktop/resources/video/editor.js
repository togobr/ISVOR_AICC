define([
	"videojs",
	'videojsyoutube',
	'videojsvimeo'
], function(videojs, videojsyoutube, videojsvimeo) {

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
			console.log('initialization video -------', this);
			var me = this;

			this.addElements({
				// 'bts': '#editionVideoSource .btn',
				'URL': '#editionVideoURL',
				'ok': '#editionVideoOk',
				'videoPicker': '#editionVideoLocal',
				'addLinkVideoBtn': '#editionExternalLink',
				'inputVideoBox': '.mbInputVideoBox',
				'lockPlayerBtn': '#editionLockPlayer'
			});

			this.events = _.extend(this.events, {
				// 'click _bts': 'setTypeByClick',
				'click _ok': 'setSource',
				'click _videoPicker': 'fileManeger',
				'click _addLinkVideoBtn': 'addExternalLinkVideo',
				'click _lockPlayerBtn': 'toggleLockPlayer'
			});

			_.bindAll(this, 'handlerPickedVideo');

			me.recView.addElements.call(me.recView, {
				'player': 'video'
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

		addExternalLinkVideo: function() {
			var me = this,
				btnInsertLink = $('#editionExternalLink'),
				$inputVideoBox = this.elems.$inputVideoBox;

			if (btnInsertLink.hasClass('actived')) {
				btnInsertLink.removeClass('actived');
			} else {
				btnInsertLink.addClass('actived');
			}

			$inputVideoBox
				.toggle();
		},

		showing: function() {
			console.log('showing video', this);
			var me = this,
				model = me.recView.model,
				$main = me.recView.elems.$main;

			me.lockPlayer(!!model.get('lock'));
		},

		hiding: function() {

		},

		fileManeger: function() {
			var fileManager = window.Editor.Views.Modals.fileManager;

			fileManager.show({
				type: 3,
				callback: this.handlerPickedVideo
			});
		},

		handlerPickedVideo: function(data) {
			console.log('[rec]audio [method]handlerPickedVideo: ', data);
			var me = this,
				recView = this.recView,
				url = data.path,
				model = this.recView.model;

			/* função que copia para s3 os arquivos do curso e percisa do modelo do recurso, 
			path para arquivo a ser copiado e atributo que vai ser alterado na finalização */
			me.copyToS3({
				entity: "resources",
				type: "video",
				model: model,
				src: url,
				attr: "src",
				callback: function(data) {
					var toChange = me.setType('local', {});
					toChange['local.src'] = data.dest;
					model.set(toChange);
				}
			});
		},

		setSource: function() {
			console.log('setSource: ', this);
			var me = this,
				model = me.recView.model,
				$URL = me.elems.$URL,
				URL = $URL.val(),
				toChange,
				type,
				videoType,
				id;

			console.log('setSource: ', $URL, URL);

			if (URL !== "") {
				type = me.detectType(URL);
				toChange = me.setType(type, toChange);
				// console.log('toChange', toChange);

				if (type === "youtube") {
					id = me.getYoutubeIdByUrl(URL);
					toChange["youtube.id"] = id;
					console.log('youtube', id);
				} else if (type === "vimeo") {
					id = me.getVimeoIdByUrl(URL);
					toChange["vimeo.id"] = id;
					console.log('vimeo', id);
				} else if (type === "web") {
					toChange["web.src"] = URL;
					console.log('web');
				}
			}

			console.log('toChange', toChange);
			model.set(toChange);
		},

		detectType: function(URL) {
			console.log('detectType: ', URL);

			var me = this,
				types = [
					{
						type: 'youtube',
						identifiers: [
							'youtube.com',
							'youtu.be'
						]
					},

					{
						type: 'vimeo',
						identifiers: [
							'vimeo.com'
						]
					}
				]

			for (var i = types.length - 1; i >= 0; i--) {
				for (var j = types[i].identifiers.length - 1; j >= 0; j--) {
					if (URL.indexOf(types[i].identifiers[j]) !== -1) {
						me.setType(types[i].type);
						return types[i].type;
					};
				};
			};

			me.setType('web');
			return 'web';
		},

		types: ['youtube', 'vimeo', 'web', 'local'],
		setType: function(type, toChange) {
			console.log('setType: ', type);
			var me = this,
				types = me.types,
				model = me.recView.model,
				modelData = model.toJSON(),
				toChange = toChange ? toChange : {};

			for (var i = types.length - 1; i >= 0; i--) {
				console.log(modelData[types[i]], types[i], types[i] === type);
				if (types[i] === type) {
					toChange[types[i] + '.active'] = true;
				} else {
					toChange[types[i] + '.active'] = false;
				};
			};
			console.log(toChange);
			return toChange;
			// model.set(toChange);
		},

		getType: function(data) {
			var me = this,
				types = me.types,
				model = me.recView.model,
				modelData = model.toJSON();

			for (var i = types.length - 1; i >= 0; i--) {
				console.log(modelData[types[i]], types[i]);
				if (modelData[types[i]].active && modelData[types[i]].active === true) {
					return types[i];
				}
			};
		},

		getSource: function() {
			console.log('getSource', this);
			var me = this,
				model = me.recView.model,
				$URL = me.elems.$URL,
				value = model.get(me.type + '.src');

			console.log('getSource', value, $URL);
			$URL.val(value);
		},

		detectVideoType: function(URL) {
			var me = this,
				model = me.recView.model,
				formats = [
					'mp4',
					'ogv',
					'webm'
				],
				types = [
					"video/mp4; codecs='avc1.42E01E, mp4a.40.2'",
					"video/ogg; codecs='theora, vorbis'",
					"video/webm; codecs='vp8, vorbis'"
				];

			for (var i = formats.length - 1; i >= 0; i--) {
				if (URL.indexOf(formats[i]) !== -1) {
					console.log('detectType as ', formats[i]);
					return types[i];
					// model.set(me.type + '.type', types[i]);
				};
			};
		},

		/*==========  Exatratores de id dos urls para vimeo e youtube  ==========*/
		/*
			Formatos suportados:
				- http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
				- http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
				- http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
				- http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
				- http://www.youtube.com/embed/0zM3nApSvMg?rel=0
				- http://www.youtube.com/watch?v=0zM3nApSvMg
				- http://youtu.be/0zM3nApSvMg
		*/
		getYoutubeIdByUrl: function(url) {
			var me = this,
				regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
				match = url.match(regExp);

			if (match && match[1].length == 11) {
				return match[1];
			} else {
				me.urlNotFound();
			}
		},

		/*
			Formatos suportados:
				- https://vimeo.com/11111111
				- http://vimeo.com/11111111
				- https://www.vimeo.com/11111111
				- http://www.vimeo.com/11111111
				- https://vimeo.com/channels/11111111
				- http://vimeo.com/channels/11111111
				- https://vimeo.com/groups/name/videos/11111111
				- http://vimeo.com/groups/name/videos/11111111
				- https://vimeo.com/album/2222222/video/11111111
				- http://vimeo.com/album/2222222/video/11111111
				- https://vimeo.com/11111111?param=test
				- http://vimeo.com/11111111?param=tes
		*/
		getVimeoIdByUrl: function(url) {
			var me = this,
				regExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/,
				match = url.match(regExp);

			if (match) {
				return match[3];
			} else {
				me.urlNotFound();
			}
		},

		urlNotFound: function() {
			Editor.Views.dialogs.insert({
				title: 'Erro! ',
				text: 'Não foi possível acessar o video atravéz deste URL',
				dismissable: true,
				timer: 3000
			});
		}
	};

	return View;
});