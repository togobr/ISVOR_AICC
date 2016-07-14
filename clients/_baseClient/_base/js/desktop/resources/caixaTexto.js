'use strict';
Player.recursos.caixaTexto = function(obj){
	this.template =

'<div id="{{id}}" class="{{class}}" style="{{style}}">'+
	'<p>{{&conteudo}}</p>'+
'</div>';

	Player.func.compile(this, obj);

	return this;
};
