define([
	'jquery'
], function($) {
	jQuery.fn.getDimensions = function(method) {
		var offset = method ? this[method]() : this.position(),
			width = this.width(),
			height = this.height();

		this.dimensions = {
			top: offset.top,
			left: offset.left,
			width: this.outerWidth(),
			height: this.outerHeight()
		};

		return this;
	};

	jQuery.isKeyPressed = (function() {
		var pressed_keys = {};

		$(function() {
			$('body')
				.on('keydown', function(e) {
					pressed_keys[e.which] = true;
				})
				.on('keyup', function(e) {
					delete pressed_keys[e.which];
				});
		});

		return function(keycode) {
			return pressed_keys[keycode];
		};
	})();

	// jQuery.fn.clearPaste = function() {
	// 	var $el = this,
	// 		diffMethod = Editor.Helpers.stringDiff,
	// 		diffSelector = "#diff";

	//     $el.on({
	//     	keydown: function(e){
	//     		console.log('keydown clearpaste', e.keyCode);
	//     		if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)) {

	//     			var oldHTMLContent = $el.html(),
	//     				oldTextContent = $el[0].textContent || $el[0].innerHTMLext,
	//     				carot = Editor.Helpers.getCarotPosition($el[0]),
	//     				prePaste = oldContent.substr(0, carot.start),
	//     				posPaste = oldContent.substr(carot.end);

	//     			console.log('oldContent', oldContent);
	//     			console.log('carot', carot);
	//     			console.log('prePaste', prePaste);
	//     			console.log('posPaste', posPaste);
	//     			window.to = window.setTimeout(function(){
	// 					var newContent = $el.html(),
	// 						pastedStrat = newContent.indexOf(prePaste) + prePaste.length,
	// 						pastedEnd = newContent.lastIndexOf(posPaste),
	// 						pasted = newContent.substring(pastedStrat, pastedEnd);

	// 					console.log('new content', newContent);
	// 					console.log('pasted', pastedStrat, pastedEnd, pasted);

	// 					pasted = pasted.replace(/<[^>]+>/g, '');

	// 					console.log('final', prePaste + pasted + posPaste);
	// 					$el.html(prePaste + pasted + posPaste)

	// 					window.clearTimeout(window.to);
	// 		 		}, 10);
	//         	}
	//     	}
	//     });
	// }

	jQuery.fn.getTextSelectionRange = function() {
		var t = '',
			r;
		if (window.getSelection) {
			t = window.getSelection();
		} else if (document.getSelection) {
			t = document.getSelection();
		} else if (document.selection) {
			t = document.selection.createRange().text;
		}

		if (t.rangeCount <= 0) return;

		r = t.getRangeAt(0).cloneRange();

		return r;
	}

	jQuery.waitDependencies = function(dependencies, callback) {
		var me = this,
			deps = [];
		
		for (var key in dependencies) {
			if (dependencies.hasOwnProperty(key)) {
				var state = (dependencies[key].deferred ? dependencies[key].deferred.state() : null);

				if (state && state !== "resolved") {
					deps.push(dependencies[key].deferred);
				}
			}
		}

		// console.log('[backboneChanges]waitDependencies', this, dependencies, deps);
		if (deps.length === 0) {
			callback();
		} else {
			$.when.apply($, deps).done(callback);
		}
	}

	jQuery.fn.contentEditabel = function(options) {
		var $el = this,
			el = $el[0],
			defaults = {
				maxChars: 20,
				charsNotAllowed: [],
				charsAlwaysAllowed: [39, 37, 9, 8, 46],
				enterLeave: true,
				clickoutside: true,
				clearPaste: true
			},
			options = $.extend({}, defaults, options),
			mouseDownIn = false,
			clearPaste = Editor.Helpers.clearPaste,
			mousedown = function(e) {
				// console.log('mousedown');
				mouseDownIn = true;
			},
			mousedownoutside = function(e) {
				// console.log('mousedownoutside');
				if (e.isPropagationStopped()) return;

				mouseDownIn = false;
				editableOff(e);
			};

		console.log('[jqueryChanges]contentEditabel [var]options, $el: ', options, $el);
		if (!$el.attr('contenteditable') || $el.attr('contenteditable') === "false" || $el.attr('contenteditable') === false) {
			events("off");
			events("on");

			$el.attr('contenteditable', 'true');
			options.showTextEditor();

			$el.focus();
		}

		function events(method) {
			$el[method]({
				clickoutside: options.clickoutside ? editableOff : null,
				resize: options.resize ? options.resize : null,
				paste: options.clearPaste ? clearPaste : null,
				mousedown: mousedown,
				mousedownoutside: mousedownoutside,
				keydown: checkChars,
				forceOff: editableOff,
				mouseup: getTextProps,
				mouseupoutside: getTextProps
			});
		}

		function checkChars(e) {
			console.log(e.keyCode, options);
			console.log($el.text().trim().length + " / " + options.maxChars + " / " + $.inArray(e.keyCode, options.charsNotAllowed));
			console.log((options.maxChars && $el.text().length > options.maxChars) + " / " + $.inArray(e.keyCode, options.charsNotAllowed) !== -1);
			console.log($.inArray(e.keyCode, options.charsAlwaysAllowed) === -1);

			if (options.enterLeave && e.keyCode === 13) {
				editableOff(e, true);
			} else if ((options.maxChars && $el.text().trim().length > options.maxChars) || $.inArray(e.keyCode, options.charsNotAllowed) !== -1) {
				if ($.inArray(e.keyCode, options.charsAlwaysAllowed) === -1) {
					e.preventDefault();
				}
			}

			/*if (e.keyCode === 13) {
				// prevent adding <div> element on enter press
				var docFragment = document.createDocumentFragment();

				//add a new line
				var newEle = document.createTextNode('\n');
				docFragment.appendChild(newEle);

				//add the br, or p, or something else
				newEle = document.createElement('br');
				docFragment.appendChild(newEle);

				//make the br replace selection
				var range = window.getSelection().getRangeAt(0);
				range.deleteContents();
				range.insertNode(docFragment);

				//create a new range
				range = document.createRange();
				range.setStartAfter(newEle);
				range.collapse(true);

				//make the cursor there
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);

				e.preventDefault();
				return false;
			}*/
		}

		function getTextProps(e) {
			if (mouseDownIn) {
				// console.log('[helpers]jqueryChanges [method]contentEditabel/getTextProps');
				var selection = jQuery.fn.getTextSelectionRange();

				// console.log('[helpers]jqueryChanges [method]contentEditabel/getTextProps [var]selection/range', selection, range);
				$el.selection = selection;
			}
		}

		function editableOff(e, force) {
			console.log('editableOff', e, force);
			if (!mouseDownIn || force === true) {
				$el.trigger('editableOff', {
					content: $el.html()
				});
				$el.attr('contenteditable', 'false');
				events("off");

				(e && options.callback) ? options.callback(e) : null;
			}
		}
	};

	jQuery.fn.swap = function(elem) {
		var elm1 = $(this),
			elm2 = $(elem),
			parent1, next1,
			parent2, next2;

		parent1 = elm1.parent();
		next1 = elm1.next();
		parent2 = elm2.parent();
		next2 = elm2.next();

		parent1[0].insertBefore(elm2[0], next1[0]);
		parent2[0].insertBefore(elm1[0], next2[0]);

		return this;
	};

	/*
	Não ficou muito bom, mas tem um fix que recebe a view para não perder o referencial.
	Este fiz provavelmente deiveria estar com um metodo das views e não no jquery
	*/
	jQuery.fn.dbClickFix = function(view, singleClick, doubleClick) {
		this.click(function(e) {
			var that = this;
			setTimeout(function() {
				var dblclick = parseInt($(that).data('double'), 10);
				if (dblclick > 0) {
					$(that).data('double', dblclick - 1);
				} else {
					view[singleClick](e);
				}
			}, 100);
		}).dblclick(function(e) {
			$(this).data('double', 2);
			view[doubleClick](e);
		});
	};

	// jQuery.fn.positioner = function(options) {
	// 	/*{
	// 		position: "right" || "left" || "top" ||"bottom"
	// 		align:  "normal" || "center"
	// 		el: $(element)
	// 		spacing:
	// 	}
	// 	*/
	// 	var $el = this,
	// 		$elRef = options.el,
	// 		defaults = {
	// 			position: "right",
	// 			align: "normal",
	// 			spacing: 0
	// 		},
	// 		options = $.extend({}, defaults, options);

	// 	if (!$elRef) {
	// 		return null;
	// 	}

	// 	$el.removeClass('top bottom right left')
	// 	$el.addClass(options.position);

	// 	$el.getDimensions('offset');
	// 	$elRef.getDimensions('offset');

	// 	if (options.position === "top" || options.position === "bottom") {
	// 		if (options.position === "top") {
	// 			$el.css({
	// 				top: $rec.dimensions.top - ($el.dimensions.height + options.spacing) + 'px',
	// 				// left: $rec.dimensions.left + (($rec.dimensions.width - $main.dimensions.width) / 2) + 'px'
	// 			});
	// 		} else {
	// 			$main.css({
	// 				top: $rec.dimensions.top + $rec.dimensions.height + me.spacing + 'px',
	// 				// left: $rec.dimensions.left + (($rec.dimensions.width - $main.dimensions.width) / 2) + 'px'
	// 			});
	// 		}
	// 	} else if (options.position === "right" || options.position === "left") {

	// 	} else {
	// 		return null;
	// 	}
	// };

	/*
	 * jQuery outside events - v1.1 - 3/16/2010
	 * http://benalman.com/projects/jquery-outside-events-plugin/
	 *
	 * Copyright (c) 2010 "Cowboy" Ben Alman
	 * Dual licensed under the MIT and GPL licenses.
	 * http://benalman.com/about/license/
	 */
	(function($, c, b) {
		$.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "), function(d) {
			a(d)
		});
		a("focusin", "focus" + b);
		a("focusout", "blur" + b);
		$.addOutsideEvent = a;

		function a(g, e) {
			e = e || g + b;
			var d = $(),
				h = g + "." + e + "-special-event";
			$.event.special[e] = {
				setup: function() {
					d = d.add(this);
					if (d.length === 1) {
						$(c).bind(h, f)
					}
				},
				teardown: function() {
					d = d.not(this);
					if (d.length === 0) {
						$(c).unbind(h)
					}
				},
				add: function(i) {
					var j = i.handler;
					i.handler = function(l, k) {
						l.target = k;
						j.apply(this, arguments)
					}
				}
			};

			function f(i) {
				$(d).each(function() {
					var j = $(this);
					if (this !== i.target && !j.has(i.target).length) {
						j.triggerHandler(e, [i.target])
					}
				})
			}
		}
	})(jQuery, document, "outside");

});