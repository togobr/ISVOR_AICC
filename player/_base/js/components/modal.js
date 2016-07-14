define([
], function() {
	var modal = function(params, $el) {
		var me = this,
			$modal,
			$overlay,
			defaults = {
				color: "0, 0, 0",
				opacity: "0.6",
				transition: "fade",
				time: 0
			};

		me.params = $.extend({}, me.defaults, params);

		var modal = document.createElement('div'),
			$modal = $(modal);

		modal.id = "modal";
		me.$modal = $modal;
		me.active = "init";

		var overlay = document.createElement('div');
		overlay.id = "modalOverlay";
		if (!Modernizr.rgba) {
			var corHex = Player.Helpers.rgbaToHex(me.params.color, me.params.opacity);
			overlay.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=" + corHex + ",endColorstr=" + corHex + ");";
		} else {
			overlay.style.background = 'rgba(' + me.params.color + ', ' + me.params.opacity + ')';
		}
		me.$overlay = $(overlay);

		me.$overlay.on({
			click: function(e) {
				me.hide();
			}
		});

		Player.Functions.animateEl({
			"action": "hide",
			"element": me.$overlay
		});

		me.$modal.append(me.$overlay);
		$el.append(me.$modal);

		Player.Elements.$swipe.on({
			slideInit: function(e, stratIndex, endIndex, domInit, domEnd) {
				me.hide();
			}
		});

		Player.Elements.$content.on({
			contentReady: function(e) {
				me.hide();
			}
		});

		this.add = function(obj, params, config) {

				var me = this,
					data = obj.data,
					id = config.id ? config.id : obj.data.id,
					dataId = config.dataId,
					modalData;

				if (config.id && !dataId) {
					modalData = data[id];
				} else if (dataId) {
					modalData = data[dataId];
				} else if (data.modal) {
					modalData = data.modal;
					if (modalData.dynamicContent.data) {
						$.extend(true, modalData, modalData.dynamicContent.data);
					}
				}

				modalData = modalData || {};

				var contentString = Player.Functions.compileTemplate(obj.modal, modalData),
					$content = $(Player.Helpers.parser(contentString)),
					slide = Player.Functions.buildContent().buildSlide(modalData);

				$content
					.attr('id', (config.id || id) + 'Content')
					.off('modal-show')
					// atribui evento de open/show ao modal
					.on('modal-show', function() {
						// executa o metodo .out de cada recurso
						// seria o mesmo que estivesse entrando no slide atual
						$.each(slide.resources, function(i, resource) {
							var in_callback = resource.instance['in'];

							if (!$.isFunction(in_callback)) return;
							in_callback();
						});
					})
					.off('modal-hide')
					// atribui o evento de close/hide ao modal
					// que executara alguns metodos de cada recurso
					.on('modal-hide', function() {
						// executa o metodo .out de cada recurso
						// seria o mesmo que estivesse saindo do slide atual
						$.each(slide.resources, function(i, resource) {
							var out = resource.instance.out;

							if (!$.isFunction(out)) return;
							out();
						});
					})
					.find(config.content).prepend(slide.$el);

				Player.Functions.delegateEvents(me, $content, config.actions);

				me.$modal.prepend($content);
				$content.css({
					top: (me.$overlay.height() - $content.height()) / 2,
					left: (me.$overlay.width() - $content.width()) / 2,
				});

				Player.Functions.animateEl({
					"action": "hide",
					"element": $content
				});

				return $content;
			},

			this.show = function(id, scope) {
				var me = this,
					active = "#" + id + "Content",
					$element = me.$modal.find(active),
					doc = document.documentElement,
					//left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
					//top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0),
					w = $(document).width(),
					//h = $(document).height(),
					//wvp = Math.max(doc.clientWidth, window.innerWidth || 0),
					hvp = Math.max(doc.clientHeight, window.innerHeight || 0),
					ew = $element.width(),
					eh = $element.height();

				//console.log('foo', left, top, w, h, hvp, wvp, eh, ew);
				Player.Functions.animateEl({
					"action": "in",
					"element": [
						$element,
						me.$modal,
						me.$overlay
					],
					"transition": me.params.transition,
					"time": me.params.time,
					callback: function() {
						// ao mostrar, deve-se remover principalmente o class transFadeIn
						// pois, quando roda-se o video em fullscreen dá problema por causa desta classname
						// ja o visuallyhidden está sendo adicionado por algum motivo quando o objeto tiver callback (tf??)
						$element.removeClass('visuallyhidden transFadeIn');
						me.$modal.removeClass('visuallyhidden transFadeIn');
						me.$overlay.removeClass('visuallyhidden');
					}
				});

				$element.trigger('modal-show');

				if ($element.hasClass('responsive')) {
					$element.removeAttr('style');
					return;
				}

				$element.css({
					top: Math.max(0, (hvp - eh) / 2) + 'px',
					left: ((w - ew) / 2) + 'px'
				});
			},

			this.hide = function(element) {
				var me = this,
					visible = me.$modal.find('> :not(.visuallyhidden):not(#modalOverlay)'),
					element = element || visible,
					yet_visible = visible.not(element);

				Player.Functions.animateEl({
					"action": "hide",
					"element": element
				});

				element.trigger('modal-hide');

				if (yet_visible.length) return;

				// hide modal's parent
				Player.Functions.animateEl({
					"action": "out",
					"element": me.$modal,
					"transition": me.params.transition,
					"time": me.params.time
				});

			}
	}

	return modal;
});