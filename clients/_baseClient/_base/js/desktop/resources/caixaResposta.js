'use strict';
Player.recursos.caixaResposta = function(obj){
	this.template =

'{{#certo}}'+
	'<div id="{{id}}" class="{{class}} respostaCerta" style="{{style}}">'+
		'<div class="caixaRespostaTexto"> '+		
			'<div class="iconResposta iconCerto"></div>'+
			'<h2 class="h2_cor h2_verde">{{titulo}}</h2>'+
			'<p>{{conteudo}}</p>'+
		'</div>'+
	'</div>'+	
'{{/certo}}'+
	
'{{^certo}}'+
	'<div id="{{id}}" class="{{class}} respostaErrada" style="{{style}}">'+
		'<div class="caixaRespostaTexto"> '+		
			'<div class="iconResposta iconErrado"></div>'+
			'<h2 class="h2_cor h2_vermelho">{{titulo}}</h2>'+
			'<p>{{conteudo}}</p>'+
		'</div>'+
	'</div>'+
'{{/certo}}';

	Player.func.compile(this, obj);	

	return this;
};