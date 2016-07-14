/* 
Para recursos de inicialização dinâmica onde precisamos inicializar um plugin para obter a visualização
final de um recursos criamos um modulo de inicialização geral que deve ser usado tando para player quando 
para o editor.

Cuidados devem ser tomados pois o escopo das duas chamadas é diferente
*/

define([
	"jquery",
	"jqueryUITabs"
], function($, jqueryUITabs) {

	var init = function(source) { //source é a flag que indica a origem da chamada: "player" || "editor"
		console.log('[rec]tabs [method]init [var]this, source', this, source);

		var me = this,
			data = me.model ? me.model.toJSON() : me.data,
			total_tabs = data.tabs.length,
			$el = $(null);

		function sliderClasses() {
			var $theTab = me.elems.$theTab,
				active = $theTab.tabs('option', 'active');

			$theTab
				.toggleClass('firstSlide', total_tabs > 0 && active <= 0)
				.toggleClass('lastSlide', total_tabs > 0 && active >= total_tabs - 1)
				.toggleClass('noContent', total_tabs <= 0);
		}

		this.renderTabs = function() {
			/**
			 * implementacao horrivel para que o template renderize o indice do tab
			 * ja que o mustache nao entrega algo como {{index}} para o template
			 */
			var tabs = $('.tabs-nav > li > .anchor', $el),
				contents = $('.tabs-content > div', $el);

			$.each(data.tabs, function(i) {
				var id = 'tab-' + i;

				tabs.eq(i).attr('href', '#' + id);
				contents.eq(i).attr('id', id);
			});

			// abaixo tem que funcionar tanto no editor quanto no player
			$.extend(true, me, {
				elems: {
					'$tabsContainer': $el.find('.tabs-nav'),
					'$tabPrev': $el.find('.tab-prev'),
					'$tabNext': $el.find('.tab-next'),
					'$theTab': $el.find('.theTab')
				}
			});

			me.elems.$theTab.tabs({
				active: Math.min(data.active, data.tabs.length - 1),
				activate: function() {
					sliderClasses();
				}
			});

			me.elems.$tabPrev
				.on('mouseenter', function() {
					me.autoScrollTabs(-5);
				})
				.on('mouseleave', function() {
					me.stopAutoScrollTabs();
				})
				.on('click', function() {
					me.scrollTabs(-40);
				});

			me.elems.$tabNext
				.on('click', function() {
					me.scrollTabs(40);
				})
				.on('mouseenter', function() {
					me.autoScrollTabs(5);
				})
				.on('mouseleave', function() {
					me.stopAutoScrollTabs();
				});

			sliderClasses();
			me.scrollTabs(me.scrollPosition || 0);

		}

		this.scrollTabs = function(pixels) {
			var $el = me.elems.$theTab,
				$tabsContainer = me.elems.$tabsContainer,
				$tabPrev = me.elems.$tabPrev,
				$tabNext = me.elems.$tabNext,
				data = me.model ? me.model.toJSON() : me.data,
				scroll = data.horizontal.active ? 'scrollLeft' : 'scrollTop',
				dimension = data.horizontal.active ? 'innerWidth' : 'innerHeight',
				curr_scroll,
				final_scroll,
				max_scroll = $tabsContainer[scroll](99999999)[scroll](),
				max_size = $tabsContainer[dimension](),
				scroll_position;

			$tabsContainer[scroll](me.scrollPosition || 0);
			curr_scroll = $tabsContainer[scroll]();
			scroll_position = curr_scroll + pixels

			$tabsContainer[scroll](scroll_position);

			final_scroll = $tabsContainer[scroll]();
			me.scrollPosition = final_scroll;

			$el
			.toggleClass('tabs-nav-prev-exausted', curr_scroll <= 0)
			.toggleClass('tabs-nav-next-exausted', final_scroll >= max_scroll)
			.toggleClass('tabs-nav-can-scroll', max_scroll > 0);
		}

		this.autoScrollTabs = function(pixels) {
			var me = this,
				update = 15,
				$tabsContainer = me.elems.$tabsContainer,
				timeout = function() {
					setTimeout(function() {
						if (!me.scrollingTab) return;

						me.scrollTabs(pixels);
						timeout();

					}, update);
				};

			me.scrollingTab = true;
			timeout();

		}

		this.stopAutoScrollTabs = function() {
			me.scrollingTab = false;
		}

		if (source === "player") {
			$el = $(me.el);
			Player.Elements.$content.on({
				contentReady: function() {
					me.renderTabs();
				}
			});
		} else {
			$el = $(me.elems.rec);
			me.renderTabs();
		}
	}

	return init;
});