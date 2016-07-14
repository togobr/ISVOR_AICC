define([
	"jquery",
	"tipsy"
	], function($, Modal, Tipsy) {

	var tooltip = function(domEle, params) {
		$(domEle).tipsy(params);
	}

	return tooltip;
});