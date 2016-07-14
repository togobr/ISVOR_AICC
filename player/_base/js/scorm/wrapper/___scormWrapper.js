'use strict';

/**
Classe que contem os metodos de SCORM basicos utilizados na leitura e escrita no SCORM;

@class APIWrapper Classe de comunicação SCORM

@param {Boolean} _Debug Setar false para acabar com alertas de debbug;
@param {Number} _NoError Definições de erros, defaul = 0;
@param {Number} _GeneralException Definições de erros, defaul = 101;
@param {Number} _ServerBusy Definições de erros, defaul = 102;
@param {Number} _InvalidArgumentError Definições de erros, defaul = 201;
@param {Number} _ElementCannotHaveChildren Definições de erros, defaul = 202;
@param {Number} _ElementIsNotAnArray Definições de erros, defaul = 203;
@param {Number} _NotInitialized Definições de erros, defaul = 301;
@param {Number} _NotImplementedError Definições de erros, defaul = 401;
@param {Number} _InvalidSetValue Definições de erros, defaul = 402;
@param {Number} _ElementIsReadOnly Definições de erros, defaul = 403;
@param {Number} _ElementIsWriteOnly Definições de erros, defaul = 404;
@param {Number} _IncorrectDataTypeDefinições de erros, defaul = 405;

@param apiHandle Definição de variaveis locais, default = null;
@param var API Definição de variaveis locais, default = null;
@param {Number} findAPITries Definição de variaveis locais, default = 0;
**/

Player.namespace('Player.scorm.wrapper');

/**
Inicializa a comunicação com o LMS chamando LMSInitialize() função que será implementada pelo LMS;

@method doLMSInitialize
@return {Boolean} CMIBoolean true se a inicialização foi feita com sucesso, ou CMIBoolean false se não.
*/
Player.scorm.wrapper.doLMSInitialize = function() {
	var api = Player.scorm.wrapper.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
		return "false";
	}
	var result = api.LMSInitialize("");

	if (result.toString() != "true") {
		var err = Player.scorm.wrapper.options.ErrorHandler();
	}
	return result.toString();
}

/**
Finaliza a comunicação com o LMS chamando LMSFinish() função que será implementada pelo LMS;

@method doLMSFinish
@return {Boolean} CMIBoolean true se a finalização foi feita com sucesso, ou CMIBoolean false se não.
*/
Player.scorm.wrapper.doLMSFinish = function() {
	var api = Player.scorm.wrapper.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
		return "false";
	} else {
		// call the LMSFinish function that should be implemented by the API
		var result = api.LMSFinish("");
		if (result.toString() != "true") {
			var err = ErrorHandler();
		}
	}
	return result.toString();
}

/**
Busca a valor de uma variavel SCORM;

@method doLMSFinish
@param {String} name String que representa o "cmi data model" definido na sua categoria ou elemento (ex cmi.core.student_id);
@return {String} Retorno o valor da variavel ou "" em caso de algum problema;
*/
Player.scorm.wrapper.doLMSGetValue = function(name) {
	var api = Player.scorm.wrapper.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
		return "";
	} else {
		var value = api.LMSGetValue(name);
		var errCode = api.LMSGetLastError().toString();
		if (errCode != Player.scorm.wrapper.options._NoError) {
			// an error was encountered so display the error description
			var errDescription = api.LMSGetErrorString(errCode);
			alert("LMSGetValue(" + name + ") failed. \n" + errDescription);
			return "";
		} else {
			return value.toString();
		}
	}
}

/**
Seta o valor de uma variavel SCORM;

@method doLMSSetValue
@param {String} name String que representa o "cmi data model" definido na sua categoria ou elemento (ex cmi.core.student_id);
@param {String} value Valor a ser atribuido ao elemento;

@return {Boolean} CMIBoolean true se a ação foi feita com sucesso, ou CMIBoolean false se não.
*/
Player.scorm.wrapper.doLMSSetValue = function(name, value) {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
		return;
	} else {
		var result = api.LMSSetValue(name, value);
		if (result.toString() != "true") {
			var err = Player.scorm.wrapper.options.ErrorHandler();
		}
	}
	return;
}

/**
Comita os dados setados ao longo da seção;

@method doLMSCommit
*/
Player.scorm.wrapper.doLMSCommit = function() {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
		return "false";
	} else {
		var result = api.LMSCommit("");
		if (result != "true") {
			var err = ErrorHandler();
		}
	}
	return result.toString();
}

/**
Retorna o ultimo erro ocorrido;

@method doLMSGetLastError
@return {String} Codigo e descrição do ultimo erro ocorrido;
*/
Player.scorm.wrapper.doLMSGetLastError = function() {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
		//since we can't get the error code from the LMS, return a general error
		return _GeneralError;
	}
	return api.LMSGetLastError().toString();
}

/**
Retorna a descrição dado um código de um erro;

@method doLMSGetErrorString
@param {String} errorCode Codigo do erro;

@return {String} Descrição do erro fornecido;
*/
Player.scorm.wrapper.doLMSGetErrorString = function(errorCode) {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
	}
	return api.LMSGetErrorString(errorCode).toString();
}

/**
Retorna o diagnostico dado um código de um erro;

@method doLMSGetDiagnostic
@param {String} errorCode Codigo do erro;

@return {String} Descrição do erro fornecido e do diagnostico analisado pelo LMS;
*/
Player.scorm.wrapper.doLMSGetDiagnostic = function(errorCode) {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
	}
	return api.LMSGetDiagnostic(errorCode).toString();
}

/**
Determina se a API do LMS foi inicializada;

@method LMSIsInitialized

@return {Boolean} true se o LMS foi inicializado com sucesso e false se
*/
Player.scorm.wrapper.LMSIsInitialized = function() {
	// there is no direct method for determining if the LMS API is initialized
	// for example an LMSIsInitialized function defined on the API so we'll try
	// a simple LMSGetValue and trap for the LMS Not Initialized Error

	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nLMSIsInitialized() failed.");
		return false;
	} else {
		var value = api.LMSGetValue("cmi.core.student_name");
		var errCode = api.LMSGetLastError().toString();
		if (errCode == Player.scorm.wrapper.options._NotInitialized) {
			return false;
		} else {
			return true;
		}
	}
}

/**
Determina se um erro foi encontrado na chamada enterior da API e em caso positivo mostra uma mensagem para o usuário.
Se o erro tiver uma descrição associada tambem será exibida;

@method ErrorHandler

@return {String} Retorna o atual valor do LMS Error Code;
*/
Player.scorm.wrapper.ErrorHandler = function() {
	var api = Player.scorm.wrapper.options.getAPIHandle();
	if (api == null) {
		alert("Unable to locate the LMS's API Implementation.\nCannot determine LMS error code.");
		return;
	}

	// check for errors caused by or from the LMS
	var errCode = api.LMSGetLastError().toString();
	if (errCode != Player.scorm.wrapper.options._NoError) {
		// an error was encountered so display the error description
		var errDescription = api.LMSGetErrorString(errCode);
		if (Player.scorm.wrapper.options._Debug == true) {
			errDescription += "\n";
			errDescription += api.LMSGetDiagnostic(null);
			// by passing null to LMSGetDiagnostic, we get any available diagnostics
			// on the previous error.
		}
		alert(errDescription);
	}
	return errCode;
}

/**
Retorna o "handle" para o objeto da API se ele foi previamente setado se não volta null;

@method getAPIHandle

@return {String} Valor contido na APIHandle;
*/
Player.scorm.wrapper.getAPIHandle = function() {
	if (Player.scorm.wrapper.options.apiHandle == null) {
		Player.scorm.wrapper.options.apiHandle = Player.scorm.wrapper.getAPI();
	}
	return Player.scorm.wrapper.options.apiHandle;
}

/**
Retorna a API dado um Window Object;

@method findAPI
@param {String} win a Window Object;

@return {String} Retorno a API encontrada ou null em caso de não encontrar a API;
*/
Player.scorm.wrapper.findAPI = function(win) {
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
		Player.scorm.wrapper.options.findAPITries++;
		// Note: 7 is an arbitrary number, but should be more than sufficient
		if (Player.scorm.wrapper.options.findAPITries > 7) {
			alert("Error finding API -- too deeply nested.");
			return null;
		}
		win = win.parent;
	}
	return win.API;
}

/**
Retorna a API da atual Window Object;

@method findAPI

@return {String} Retorno a API encontrada ou null em caso de não encontrar a API;
*/
Player.scorm.wrapper.getAPI = function() {
	var theAPI = Player.scorm.wrapper.findAPI(window);
	if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
		theAPI = findAPI(window.opener);
	}

	if (theAPI == null) {
		alert("Unable to find an API adapter");
	}
	return theAPI
}

/**
Classe que contem os metodos de SCORM basicos utilizados na leitura e escrita no SCORM!

@class SCOFunctions Classe de comunicação SCORM
**/

/**
Calcula a diferença entre a data e hora de inicio e a data atual e grava o tempo total dentro do SCO na variavel cmi.core.session_time;

@method computeTime
@param {Number} startDate Data e hora do inicio do SCO;
*/
Player.scorm.wrapper.computeTime = function(startDate) {
	if (startDate != 0) {
		var currentDate = new Date().getTime(),
			elapsedSeconds = ((currentDate - startDate) / 1000),
			formattedTime = Player.scorm.wrapper.convertTotalSeconds(elapsedSeconds);
	} else {
		formattedTime = "00:00:00.0";
	}
	Player.scorm.wrapper.doLMSSetValue("cmi.core.session_time", formattedTime);
}

/**
Converte um numero total de segundos no formato hh:mm:ss

@method convertTotalSeconds
@param {Number} ts Numero total de segundos

@return {Number} Retorno de segundos no formato hh:mm:ss
*/
Player.scorm.wrapper.convertTotalSeconds = function(ts) {
	var sec,
		tmp,
		strSec,
		strWholeSec,
		strFractionSec,
		rtnVal,
		hour,
		min;

	sec = (ts % 60);
	ts -= sec;
	tmp = (ts % 3600); //# of seconds in the total # of minutes
	ts -= tmp; //# of seconds in the total # of hours

	// convert seconds to conform to CMITimespan type (e.g. SS.00)
	sec = Math.round(sec * 100) / 100;

	strSec = new String(sec);
	strWholeSec = strSec;
	strFractionSec = "";

	if (strSec.indexOf(".") != -1) {
		strWholeSec = strSec.substring(0, strSec.indexOf("."));
		strFractionSec = strSec.substring(strSec.indexOf(".") + 1, strSec.length);
	}

	if (strWholeSec.length < 2) {
		strWholeSec = "0" + strWholeSec;
	}
	strSec = strWholeSec;

	if (strFractionSec.length) {
		strSec = strSec + "." + strFractionSec;
	}

	if ((ts % 3600) != 0)
		hour = 0;
	else hour = (ts / 3600);
	if ((tmp % 60) != 0)
		min = 0;
	else min = (tmp / 60);

	if ((new String(hour)).length < 2)
		hour = "0" + hour;
	if ((new String(min)).length < 2)
		min = "0" + min;

	rtnVal = hour + ":" + min + ":" + strSec;

	return rtnVal;
}