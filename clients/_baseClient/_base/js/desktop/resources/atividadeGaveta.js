'use strict';
Player.recursos.atividadeGaveta = function(obj){
	this.template =

'<div id="{{id}}" class="{{class}}" style="{{style}}">'+
	'<div class="gavetas">'+
		'<ul>'+
			'{{#gavetas}}'+
				'<li><p>'+'{{.}}'+'</p></li>'+
			'{{/gavetas}}'+
		'</ul>'+
	'</div>'+

	'<div class="caixaTextoGaveta textoSelected">'+
		'{{#capa}}'+
			'<div class="capa">'+
				'<div class="tituloGaveta">'+
					'<h2>{{capa.titulo}}</h2>'+
				'</div>'+
				'<div class="textoGaveta">'+
					'<p>{{capa.conteudo}}</p>'+
				'</div>'+
			'</div>'+
		'{{/capa}}'+

		'{{#conteudos}}'+
			'<div class="gaveta">'+
				'<div class="tituloGaveta">'+
					'<h2>{{titulo}}</h2>'+
				'</div>'+
				'<div class="textoGaveta">'+
					'<p>{{conteudo}}</p>'+
				'</div>'+
			'</div>'+
		'{{/conteudos}}'+
	'</div>'+
'</div>';

	Player.func.compile(this, obj);
	var recurso = this,
		gavetas = $(this.el).find('.gavetas').find('li'),
		conteudos = $(this.el).find('.caixaTextoGaveta').find('.gaveta'),
		capa = $(this.el).find('.caixaTextoGaveta').find('.capa'),
		params = obj.params,
		classes = {
			selected: "gavetaSelected",
			checked: "gavetaChecked"
		},
		ativa;

	this.mostraCont = function(dom, index){
		if( ativa || ativa != undefined || ativa != null ){
			var info = {
				acao: "hide",
				quem: ativa.dom
			};
			$(gavetas[ativa.index]).removeClass( classes.selected );
			Player.func.animaElemento( info );
		}

		ativa = {
			dom: dom,
			index: index
		};

		var info = {
			"acao": "mostra",
			"quem": ativa.dom,
			"trans": params.trans,
			"tempo": params.tempo
		}
		$(gavetas[ativa.index]).addClass( classes.selected );
		$(gavetas[ativa.index]).addClass( classes.checked );
		Player.func.animaElemento(info);
	}

	for ( var i = gavetas.length-1; i >= 0; i-- ) {
		var info = {
			acao: "hide",
			quem: conteudos[i]
		};
		Player.func.animaElemento(info);
		$(gavetas[i]).on(
			"click", {index: i}, function(e){
				var index = e.data.index;

				if( ativa && ativa.index === index && recurso.obj.capa){
					recurso.mostraCont( capa );
				}else{
					recurso.mostraCont( conteudos[index], index );
				}
			}
		);
	};

	if( !recurso.obj.capa ){
		$( gavetas[0] ).trigger('click');
	}else{
		capa.dom = capa;
	}

	return this;
};
