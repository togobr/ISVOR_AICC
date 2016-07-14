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
			var me = this;

			this.addElements({
				'audioPicker': '#editionChangeAudio',
				'lockPlayerBtn': '#editionLockPlayer',
				'autoPlayBtn': '#editionAutoPlay'
			});

			this.events = _.extend(this.events, {
				'click _audioPicker': 'fileManeger',
				'click _lockPlayerBtn': 'toggleLockPlayer',
				'click _autoPlayBtn': 'toggleAutoPlay'
			});

			_.bindAll(this, 'handlerPickedAudio');

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

		toggleAutoPlay: function() {
			var me = this,
				model = me.recView.model,
				autoplay = model.get('autoplay');

			me.autoPlay(!autoplay);
		},

		autoPlay: function(autoplay) {
			var me = this,
				model = me.recView.model,
				$autoPlayBtn = me.elems.$autoPlayBtn;

			if (autoplay !== true && autoplay !== false) {
				autoplay = !model.get('autoplay');
			}

			model.set({
				autoplay: autoplay
			});

			$autoPlayBtn.toggleClass('selected', autoplay);

			return autoplay;
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

		fileManeger: function() {
			var fileManager = window.Editor.Views.Modals.fileManager;

			fileManager.show({
				type: 2,
				callback: this.handlerPickedAudio
			});
		},

		handlerPickedAudio: function(data) {
			console.log('[rec]audio [method]handlerPickedAudio: ', data);
			var me = this,
				recView = this.recView,
				url = data.path,
				model = this.recView.model;

			/* função que copia para s3 os arquivos do curso e percisa do modelo do recurso, 
			path para arquivo a ser copiado e atributo que vai ser alterado na finalização */
			me.copyToS3({
				entity: "resources",
				type: "audio",
				model: model,
				src: url,
				attr: "src",
				callback: function(data) {
					var audio_type = me.detectAudioType(data.src);

					if (!audio_type) return;

					model.set({
						src: data.dest,
						type: audio_type
					});
					
					recView.renderAudiojs();
				}
			});
		},

		showing: function() {
			console.log('showing texto', this);
			var me = this,
				model = me.recView.model;

			this.recView.delegateEvents();
			this.lockPlayer(!!model.get('lock'));
			this.autoPlay(!!model.get('autoplay'));
		},

		detectAudioType: function(url) {
			var me = this,
				extension = url.toLowerCase().split('.').pop(),
				format = null,
				formats = {
					'aac': "audio/aac",
					'mp3': "audio/mp3",
					'mp4': "audio/mp4",
					'm4a': "audio/mp4",
					'ogg': "audio/ogg",
					'oga': "audio/ogg",
					'wav': "audio/wav",
					'mid': "audio/midi",
					'midi': "audio/midi",
					'webm': "audio/webm"
				};

			$.each(formats, function(k, _format) {
				if (k !== extension) return;
				format = _format;
				return false;
			});

			return format;
		},

	};

	return View;
});