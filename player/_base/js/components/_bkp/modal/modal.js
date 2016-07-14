(function($) {
	$.fn.modal = function(params) {
		var modal = this.modal;

		modal.params = params,
		modal.overlay = document.createElement('div');
		modal.overlay.id = 'overlayModal';

		modal.overlay.style.background = 'rgba(' + params.cor + ',' + params.opacidade + ')';
		$('#middle').append(this.overlay);

		var info = {
			"acao": "hide",
			"quem": this.modal.overlay,
		}
		Player.func.animaElemento(info);

		$(this.modal.overlay).on({
			click: function(e) {
				modal.hide();
			}
		})

		Player.events.domReady.appendModal = function(overlay) {
			$(Player.info.flags.slider).append(overlay);
		}
		Player.events.domReady.appendModal.params = this.modal.overlay;
	}

	$.fn.modal.show = function(obj) {
		var recurso = new Player.recursos[obj.template](obj),
			dom = recurso.el

		var content = document.createElement('div');
		content.id = 'wrapperModalCont';
		content.style.width = obj.width + 'px';
		$(content).append(dom);
		$('#overlayModal').append(content);

		var info = {
			"acao": "mostra",
			"quem": this.overlay,
			"trans": this.params.trans,
			"tempo": this.params.tempo
		}
		Player.func.animaElemento(info);
		$(dom).on({
			resize: function(e) {
				console.log('resize', content, dom);
				content.style.height = $(dom).height() + 'px';
			}
		});
		$(dom).trigger('resize');
	}

	$.fn.modal.hide = function() {
		var info = {
			"acao": "hide",
			"quem": this.overlay
		}
		Player.func.animaElemento(info);
		$(this.overlay).empty();
	}
})(jQuery);