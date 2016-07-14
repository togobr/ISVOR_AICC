'use strict';
Player.recursos.imagem = function(obj){
	this.template =

'<div id={{id}} class="{{class}}" style="{{style}}">'+
	'<img src="{{src}}"/>'+
	'{{#legenda}}'+
  		'<p>{{legenda}}</p>'+
	'{{/legenda}}'+
'</div>';

	Player.func.compile(this, obj);

	return this;
};
