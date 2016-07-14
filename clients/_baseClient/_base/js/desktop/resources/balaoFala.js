'use strict';
Player.recursos.balaoFala = function(obj){
	this.template = 

'<div class="{{class}}" id="{{id}}" style="{{style}}">'+
	'<p>{{&conteudo}}</p>'+
'</div>'

	Player.func.compile(this, obj);	

	return this;
};