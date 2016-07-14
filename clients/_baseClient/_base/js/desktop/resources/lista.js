'use strict';
Player.recursos.lista = function(obj){
	this.template = 

'<div class="{{class}}" id="{{id}}" style="{{style}}">'+
	'{{#ordenada}}<ol>{{/ordenada}}{{^ordenada}}<ul>{{/ordenada}}'+
	'{{#itens}}'+
		'<li>'+'{{.}}'+'</li>'+
	'{{/itens}}'+
	'{{#ordenada}}</ol>{{/ordenada}}{{^ordenada}}</ul>{{/ordenada}}'+
'</div>'

	Player.func.compile(this, obj);

	return this;
};