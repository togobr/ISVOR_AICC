'use strict';
Player.recursos.atividade = function(obj){
	this.template =

'<div id="{{id}}" class="{{class}}" style="{{style}}">'+
	'<div class="pergunta_atividade">'+
		'<h2>{{&pergunta}}</h2>'+
	'</div>'+
	'<div class="resposta_atividade">'+
		'<table>'+
			'{{#alternativas}}'+
				'<tr>'+
					'<td><input type="{{#multipla}}checkbox{{/multipla}}{{^multipla}}radio{{/multipla}}" name="{{id}}"></td>'+
					'<td>{{&alternativa}}</td>'+
				'</tr>'+
			'{{/alternativas}}'+
		'</table>'+
	'</div>'+
'</div>';


	obj.multipla = obj.params.gabarito.length === 1 ? false : true;
	Player.func.compile(this, obj);

	var recurso = this,
		params = obj.params,
		alternativas = $(this.el).find('input');

	if(obj.multipla){
		this.checaGabarito = function(index, gabarito){
			console.log('multipla', index, gabarito);
			var checa = false;
			for (var i = gabarito.length - 1; i >= 0; i--) {
				if( index === gabarito[i] ){
					checa = true;
				}
			};

			if( checa ){
				$(alternativas[ index-1 ]).addClass( 'certa' );
			}else{
				$(alternativas[ index-1 ]).addClass( 'errada' );
			}
		}
	}else{
		this.checaGabarito = function(index, gabarito){
			var obj = {
				template: "caixaResposta",
				titulo: "Errou!",
				conteudo: "Lorem ipsum Minim reprehenderit ex mollit eu in aliquip in Excepteur minim in dolore.",
				certo: false,
				width: 350
			};
			if( index === gabarito[0] ){
				obj.certo = true;
				obj.titulo = recurso.obj.feedback[0].titulo;
				obj.conteudo = recurso.obj.feedback[0].conteudo;
			}else{
				obj.certo = false;
				obj.titulo = recurso.obj.feedback[1].titulo;
				obj.conteudo = recurso.obj.feedback[1].conteudo;
			}

			$.fn.modal.show(obj)
			console.log('unica', index, gabarito, index === gabarito[0]);
		}
	}

	for (var i = alternativas.length - 1; i >= 0; i--) {
		$(alternativas[i]).on(
			"click", {index: i}, function(e){
				var index = e.data.index;
				recurso.checaGabarito( index+1, params.gabarito );
			}
		);
	};


	return this;
};
