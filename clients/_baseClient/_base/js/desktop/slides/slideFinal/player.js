define([
	'jquery'
], function($) {

	var slideFinal = function() {
		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
				- this.template
				- this.data
				- this.compiled
				- this.el
				- this.$el
			*/
			var slide = this;
		}

		this.feedBackFinal = function() {
			var notaMedia = Player.Tree.main.data.notaMedia,
				$textoSucesso = this.$el.find('.textoFinalSucesso'),
				$textoFracasso = this.$el.find('.textoFinalFracasso'),
				$notaFinalUsuario = this.$el.find('.notaFinalUsuario'),
				$notaMedia = this.$el.find('.notaMedia'),
				scormRaw = Player.Scorm.getScormValue('cmi.core.score.raw'),
				$tituloFinalAtividade = this.$el.find('.tituloFinalAtividade'),
				$caixaFinalAtividade = this.$el.find('.caixaFinalAtividade');

			$notaFinalUsuario.html(scormRaw || 0);

			$notaMedia.html(notaMedia);

			console.log('scormRaw/notaMedia', scormRaw, notaMedia);

			return;
		}

		this.hasAtividade = function(slide) {
			var $msgNota = this.$el.find('.msgNota'),
				qtdSlide = Player.Tree.slides,
				slideAtual = slide;

			// for (var x = qtdSlide[slideAtual].data.resources.length - 1; x >= 0; x--) {
			// 	if(qtdSlide[slideAtual].data.resources[x]['class'] == "atividade" || qtdSlide[slideAtual].data.resources[x]['class'] == "atividade atividade" && qtdSlide[slideAtual].data.resources[x].nota.subType == "comNota"){
			// 		$msgNota.show();
			// 	}
			// };

			for (var i = 0; i < qtdSlide.length; i++) {
				for (var x = qtdSlide[i].data.resources.length - 1; x >= 0; x--) {
					if (qtdSlide[i].data.resources[x]['class'] == "atividade" && qtdSlide[i].data.resources[x].nota.subType == "comNota") {
						$msgNota.show();
					}
				};
			}

		}

	}

	return slideFinal;
});