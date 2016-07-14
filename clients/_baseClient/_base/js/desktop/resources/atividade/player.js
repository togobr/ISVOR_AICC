/*
	Não importar jquery pois compilação entrega para ele. Explicar melhor na hora de documentar
*/

define([], function() {
	var base_atividade = function() {
		this.init = function() {
			/*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/

			$.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

			var recurso = this,

				$btnEnviaResposta = this.$el.find('.enviaResposta'),
				$chkOrRadio = this.$el.find('.chkOrRadio'),
				$serverMsg = this.$el.find('.serverMsg'),
				$checkOnDiv = this.$el.find('.checkOnDiv'),
				$inputCheck = this.$el.find('input[type=checkbox]'), //corrigir bug do checkOnDiv
				$inputRadio = this.$el.find('input[type=radio]'), //corrigir bug do checkOnDiv
				atvType = recurso.data.multipla,
				qtdSlide = Player.Tree.slides,
				scoAtividade = recurso.data.nota.subType,
				feedBackModal = recurso.data.feedback.modal,
				feedBackCircundado = recurso.data.feedback.circundado,
				respostaUsuario = new Array(),
				altAssinaladas = this.$el.find(".chkOrRadio:checked"),
				tentativaGeral = recurso.data.tentativas,
				tentativaGeralRealizadas = 0, //verificar se esta variável deve ficar no recurso atividade
				tentativaPorQuestao = recurso.data.parametros.tentativas,
				tentativaPorQuestaoRealizada = 0,
				gabarito = recurso.data.parametros.gabarito;

			function highlightRows() {
				$.each($checkOnDiv.parent(), function(i, div) {
					$(div).toggleClass('selected', $chkOrRadio.eq(i).is(':checked'));
				});
			}

			//Global
			recurso.tentativaPorQuestaoRealizada = 0;
			questoesCorretas = 0; //verificar se é necessário desta variável global.
			notaFinal = 0;

			Player.Elements.$content.on({
				contentReady: function(e) {
					var slidesLength = Player.Tree.slides.length,
						slideAtual = Player.Elements.swipe.getPos(),
						lastSlide = Player.Tree.slides[slidesLength - 1],
						scorm = Player.Scorm.getScormValue('cmi.suspend_data').atividades || {}, 
						comNota = recurso.data.nota.subType == 'comNota';

					if (lastSlide.hasAtividade) {
						lastSlide.hasAtividade(slideAtual);
					}

					if (comNota && recurso.getSlideNumber() == Player.Elements.swipe.getPos() && !recurso.isAnswered()) {
						recurso.lockPlayer(true);
					}
					
					if(comNota && recurso.isAnswered()){
						recurso.$el.addClass('disabled');
						$chkOrRadio.prop('disabled', true);
						$btnEnviaResposta.hide();
					}
				}
			});

			Player.Elements.$swipe.on({
				slideInit: function(e, startIndex, endIndex, domInit, domEnd) {
					if (recurso.data.nota.subType == 'comNota' && recurso.getSlideNumber() == endIndex && !recurso.isAnswered()) {
						recurso.lockPlayer(true);
					}
				},
				slideEnd: function(e, startIndex, endIndex, domInit, domEnd) {

					var slidesLength = Player.Tree.slides.length,
						lastSlide = Player.Tree.slides[slidesLength - 1];

					// if (lastSlide.hasAtividade) {
					// 	lastSlide.hasAtividade(endIndex);
					// }
					if (recurso.data.nota.subType == 'comNota' && recurso.getSlideNumber() == endIndex && !recurso.isAnswered()) {
						recurso.lockPlayer(true);
					}
				}
			});

			// ************************* MODAIS FEEDBACK ************************* 

			var feedback_certo = Player.Elements.generalModal.add(recurso, Player.Config.general.modal, {
				id: recurso.data.id + 'feedbackCerto',
				dataId: 'feedbackCerto',
				actions: {
					"click .btnFechar": function() {
						Player.Elements.generalModal.hide();
					}
				},
				content: "#modalContent"
			});

			var feedback_errado = Player.Elements.generalModal.add(recurso, Player.Config.general.modal, {
				id: recurso.data.id + 'feedbackErrado',
				dataId: 'feedbackErrado',
				actions: {
					"click .btnFechar": function() {
						Player.Elements.generalModal.hide();
						// Player.Elements.generalModal.hide(feedback_errado); //retirado, pois ie não fechava modal
					}
				},
				content: "#modalContent"
			});

			// ************************* EVENTOS ************************* 

			$chkOrRadio.on({
				click: function() {
					if ($('.chkOrRadio').is(':checked')) {
						$btnEnviaResposta.off('click'); //utilizado para não chamar a função "ativaBtnResposta()", pela quantidade de alternativas assinaladas, mas apenas uma vez.
						recurso.ativaBtnResposta();
					} else {
						recurso.desativaBtnResposta();
						$btnEnviaResposta.off('click');
					}
				},

				change: function() {
					highlightRows();
				}
			});

			$checkOnDiv.on({
				click: function() {

					if(recurso.$el.hasClass('disabled')) return;

					var checkbox = $(this).find('input[type=checkbox]'),
						radiobox = $(this).find('input[type=radio]');

					checkbox.prop("checked", !checkbox.prop("checked"));
					radiobox.prop("checked", !radiobox.prop("checked"));

					if ($checkOnDiv.find('.chkOrRadio').is(':checked')) {
						$btnEnviaResposta.off('click');
						recurso.ativaBtnResposta();
					} else {
						$btnEnviaResposta.off('click');
						recurso.desativaBtnResposta();
					}

					highlightRows();
				}
			});

			//corrigir bug do checkOnDiv
			$inputCheck.on({
				click: function(e) {
					e.stopPropagation();
					return true;
				}
			});
			//corrigir bug do checkOnDiv
			$inputRadio.on({
				click: function(e) {
					e.stopPropagation();
					return true;
				}
			});

			// ************************* FUNÇÕES ************************* 

			this.isAnswered = function() {
				return (recurso.tentativaPorQuestaoRealizada > 0);
			}

			this.ativaBtnResposta = function() {
				$btnEnviaResposta.removeClass('desativado');
				$btnEnviaResposta.on('click', this.enviaResposta);
			}

			this.desativaBtnResposta = function() {
				$btnEnviaResposta.addClass('desativado');
			}

			this.enviaResposta = function() {
				var altAssinaladas = recurso.$el.find(".chkOrRadio:checked"),
					feedBackVisual = recurso.$el.find(".chkOrRadio"),
					respostaCerta = false,
					idAtividade = $(this).parent().attr('id');

				respostaUsuario = []; //A cada vez que o usuário clicar para enviar a resposta, ele zera o array antes.

				altAssinaladas.each(function() {
					respostaUsuario.push($(this).val());
				});

				respostaCerta = recurso.checaResposta(respostaUsuario, altAssinaladas, respostaCerta, feedBackVisual);

				if (scoAtividade == "comNota") {
					$chkOrRadio.prop('disabled', true);
					$btnEnviaResposta.hide();
					$serverMsg.css('display', 'block');

					recurso.$el.addClass('disabled');
				}

				var x = recurso.calculaMedia(questoesCorretas),
					atividade_info = {};

				recurso.tentativaPorQuestaoRealizada += 1;

				// unlock player next button
				recurso.lockPlayer(false);

				atividade_info[idAtividade] = {
					tentativaPorQuestaoRealizada: recurso.tentativaPorQuestaoRealizada,
					respostaCerta: respostaCerta,
					feedBackCircundado: feedBackCircundado,
					scoAtividade: scoAtividade,
					gabarito: gabarito,
					respostas: respostaUsuario
				};

				// Player.Scorm.setScormValue('cmi.suspend_data', 'atividades', $.extend(true, atividade_info, Player.Scorm.getScormValue('cmi.suspend_data').atividades));

				// Player.Scorm.setScormValue('cmi.suspend_data', 'acertos', {
				// 	questoesCorretas: questoesCorretas
				// });

				// Player.Scorm.setScormValue('cmi.core.score.raw', x); //talvez inserir no player.js geral
			}

			this.checaResposta = function(respostaUsuario, altAssinaladas, respostaCerta, feedBackVisual) {
				var arrayTeste = ["0", "1", "2", "3", "4"];


				

				if (respostaUsuario.compare(gabarito)) { // realiza a comparação com o que o usuário assinalou, com o gabarito do Json.
					if (scoAtividade == "comNota") {
						questoesCorretas += 1;
					} else {
						questoesCorretas + 0;
					}


					$(altAssinaladas[0]).parent().parent().css("color","green")

					respostaCerta = true;

					

					if (feedBackModal) {
						Player.Elements.generalModal.show(recurso.data.id + 'feedbackCerto');
					}

				} else {
					// for (var i = 0; i < (feedBackVisual.length); i++) {

					// 	var found = $.inArray(respostaUsuario, gabarito);

					// 	if (found === -1) {
					// 		if (feedBackCircundado) {
					// 			feedBackVisual[i].parentNode.parentNode.setAttribute("class", "errado");
					// 		}
					// 	} else {
					// 		if (feedBackCircundado) {
					// 			feedBackVisual[i].parentNode.parentNode.setAttribute("class", "certo");
					// 		}
					// 	}

					// };

					$checkOnDiv.parent().each(function(index){

						if(index == $(altAssinaladas[0]).attr("value") ){
							$(this).css("color","red");
						}

						if(index == gabarito[0]){
							$(this).css("color","green");
						}
						
					})

					if (feedBackModal) {
						Player.Elements.generalModal.show(recurso.data.id + 'feedbackErrado');
					}

				}

				console.log('RespostaUsuario: ', respostaUsuario, gabarito);
				return respostaCerta;
			}

			this.calculaMedia = function(questoesCorretas) {
				var nota = 0,
					totalDeQuestoes = 0,
					getQuestoes = function(slide) {
						var questoes = 0;

						if (!slide) return 0;

						$.each(slide.resources, function(i, resource) {
							if (resource.template == "atividade" && resource.nota.subType == "comNota") {
								questoes += 1;
							} else if (resource.template == "botaoPP" && resource.modal && resource.modal.dynamicContent) {
								questoes += getQuestoes(resource.modal.dynamicContent.data);
							}
						});

						return questoes;
					};

				//Faz uma varredura em todos os slides. Verifica quais slides possuem um recurso chamado atividade. Calcula o total de atividades.
				// funcao recursiva quando o resource for do tipo que envolve um 'fake canvas', ex: botaoPP
				for (var i = 0; i < qtdSlide.length; i++) {
					totalDeQuestoes += getQuestoes(qtdSlide[i].data);
				}

				nota = (questoesCorretas / totalDeQuestoes) * 100;
				notaFinal = Number(nota.toFixed(0));

				console.log('questoesCorretas: ', questoesCorretas);
				console.log('totalDeQuestoes: ', totalDeQuestoes);
				console.log('notaFinal: ', notaFinal);


				return notaFinal;
			}

		}

	}

	return base_atividade;
});