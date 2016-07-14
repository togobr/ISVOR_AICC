'use strict';
Player.recursos.caixaDestaque = function(obj){
	this.template =

'<div id="{{id}}" class="{{class}}" style="{{style}}">'+
	'<div class="circuloBorda">'+
		'<div class="iconCirculo {{tipo}}"></div>'+
	'</div>'+
	'<div class="textoCaixaDestaque">'+
		'<h2>{{titulo}}</h2>'+
		'<p>{{conteudo}}</p>'+
	'</div>'+
'</div>';


	Player.func.compile(this, obj);

	return this;
};
