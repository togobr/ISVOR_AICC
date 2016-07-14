'use strict';

/**
Metodo de decodificação nas parametros definidos na codificação;

@method decodifica
@param {String} data String a ser decodificada
@return {String} String decodificada
*/
Player.helpers.decodifica = function (data){
	var senha = 'mobPass',
		decoded ='',
		decode = Player.helpers.base64_decode(data);
	for(var i=0; i<decode.length; i++){
		var chr = decode.substr(i,1),
			mod = i%senha.length,
			passChr = senha.substr(mod,1);
		decoded += String.fromCharCode(chr.charCodeAt(0)-passChr.charCodeAt(0));
	}
	return unescape(decoded);
}

Player.helpers.parser = function (string){
	var wrapper = document.createElement('div');
	wrapper.innerHTML = string;
	return wrapper.firstChild;
}

/**
Metodo para validação de uma String como Object valido ou não

@method IsJsonString
@param {String} str String a ser interpretada como Object ou não
@return {Boolean} true para Strings validadas como Object e false para não validas
*/

Player.helpers.IsJsonString = function (str) {
    try {
       JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
Metodo que faz varedura na URL procurando por variaveis de querie;

@method getQueryVariable
@param {String} variable String da variavel a ser procurada
@return {String} Retorna o valor da variavel ou false em caso de variavel não encontrada
*/
Player.helpers.getQueryVariable = function (variable) {
	var query = window.location.search.substring(1),
		vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return false;
}

/**
Metodo que decodificada em base64;

@method base64_decode
@param {String} data String a ser decodificada em base64
@return {String} Retorna uma String decodificada na base 64
*/
Player.helpers.base64_decode = function (data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = "",
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do { // unpack four hexets into three octets using index points in b64
	h1 = b64.indexOf(data.charAt(i++));
	h2 = b64.indexOf(data.charAt(i++));
	h3 = b64.indexOf(data.charAt(i++));
	h4 = b64.indexOf(data.charAt(i++));

	bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

	o1 = bits >> 16 & 0xff;
	o2 = bits >> 8 & 0xff;
	o3 = bits & 0xff;

	if (h3 == 64) {
		tmp_arr[ac++] = String.fromCharCode(o1);
	} else if (h4 == 64) {
		tmp_arr[ac++] = String.fromCharCode(o1, o2);
	} else {
		tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	}

	} while (i < data.length);
		dec = tmp_arr.join('');
	return dec;
}

/**
Recebe um objeto e transforma em uma string no formato querie ex:"posicao=2&video1=5.5&atividade1=3";

@method serializeJSON
@param {Object} obj Object que será tranformado em uma string;
@return {String} String serializada
*/
Player.helpers.serializeJSON = function (obj) {
	var dados = '';
	for (var key in obj) {
		if (obj.hasOwnProperty(key)){
			dados += key+'='+obj[key]+'&';
		}
	}
	return dados;
}

/**
Recebe um objeto e transforma em uma string no formato querie ex:"posicao=2&video1=5.5&atividade1=3";

@method serializeJSON
@param {Object} obj Object que será tranformado em uma string;
@return {String} String serializada
*/
Player.helpers.csslizeJSON = function (obj) {
	var dados = '';
	for (var key in obj) {
		if (obj.hasOwnProperty(key)){
			dados += key+':'+obj[key]+';';
		}
	}
	return dados;
}

/**
Remove classes que tenham um prefixo especifico
Utiliza a classe jquery.mim.js; *DEPENDENCIA jquery.mim.js

@method removeClasse
@param {JqueyObject} quem Obecjt de Jquery que se refere a um bloco da marcaçãod a qual será retirado uma classe especifica
@param {String} pref Prefixo, String que está contida na classe a ser retirada
*/
Player.helpers.removeClasse = function (quem, pref){
	if(quem.attr('class')!=undefined){
		var classes = quem.attr('class').split(" "),
			novaClasse='';

		for (var i = 0, lim = classes.length; i < lim; i += 1) {
			if( classes[i].indexOf(pref)==-1 && classes[i]!="" ){
				novaClasse += classes[i];
				if( i!=classes.length-1 ){
					novaClasse +=' ';
				}
			}
		}
		quem.attr('class', novaClasse);
	}
}
