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
		console.log('[rec]slider [method]init [var]this, source', this, source);

		var me = this,
			data = me.model ? me.model.toJSON() : me.data,
			total_tabs = data.tabs.length,
			$el = $(null);

		function sliderClasses() {
			var active = $el.tabs('option', 'active');
				
				$el
				.toggleClass('firstSlide', total_tabs > 0 && active <= 0)
				.toggleClass('lastSlide', total_tabs > 0 && active >= total_tabs - 1)
				.toggleClass('noContent', total_tabs <= 0);
		}

		function updateSummary() {
			var active_tab = $el.tabs('option', 'active');
			me.elems.$summary.html('<span class="current-slide">' + (active_tab + 1) + '</span> / <span class="total-slides">' + total_tabs + '</span>');
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


			$el.tabs({
				active: Math.min(data.active, total_tabs - 1),
				activate: function() {
					sliderClasses();
					updateSummary();
				}
			});

			// abaixo tem que funcionar tanto no editor quanto no player
			$.extend(true, me, {
				elems: {
					'$tabsContainer': $el.find('.tabs-nav'),
					'$tabPrev': $el.find('.tab-prev'),
					'$tabNext': $el.find('.tab-next'),
					'$prevSlide': $el.find('.prev-slide'),
					'$nextSlide': $el.find('.next-slide'),
					'$summary': $el.find('.summary')
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

			me.elems.$prevSlide
				.on('click', function() {
					var active = $el.tabs('option', 'active');
					$el.tabs('option', 'active', Math.max(active - 1, 0));
				});

			me.elems.$nextSlide
				.on('click', function() {
					var active = $el.tabs('option', 'active');
					$el.tabs('option', 'active', active + 1);
				});

			sliderClasses();
			updateSummary();
			me.scrollTabs(0);

		}

		this.scrollTabs = function(pixels) {
			var $tabsContainer = me.elems.$tabsContainer,
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
			.toggleClass('tabs-nav-left-exausted', curr_scroll <= 0)
			.toggleClass('tabs-nav-right-exausted', final_scroll >= max_scroll)
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
			me.$el.on('reposition', function() {
				me.scrollTabs(me.scrollPosition);
			});
			
			me.renderTabs();
		}
	}

	return init;
});