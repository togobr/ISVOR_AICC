/**
Classe que contem os metodos de SCORM tanto de leitura quando gravação;
Utiliza a classe APIWrapper.js e SCOFunctions.js *DEPENDENCIA

@class SCORM Classe de comunicação SCORM
**/

/**
Inicializa a comunicação com o SCORM captando os seguintes dados:
	- cmi.suspend_data (Dados suspenços utilizados para gravação de dados customizados pela maquina);
	- cmi.core.score.raw (Nota atribuida ao SCO);
	- cmi.core.lesson_status (Status do SCO);
Aqui os dados suspenços são tuilizados para disparar ações nos recursos que as gravaram atravez da função "set()" dos mesmos;

@method inicializaScorm
*/

'use strict';

Player.scorm.getValueOf = function(scormVar, susDataVar) {
	var scormVars = Player.scorm.vars;

	for (var key in scormVars) {
		if (scormVars.hasOwnProperty(key)) {
			if (key === scormVar) {
				if (scormVar === 'cmi.suspend_data' && susDataVar) {
					return scormVars[key][susDataVar];
				} else {
					return scormVars[key].value;
				}
			}
		}
	}
}

Player.scorm.setValueOf = function(scormVar, susDataVar, value) {
	var scormVars = Player.scorm.vars;
	console.log('setValueOf', scormVar, value);

	for (var key in scormVars) {
		if (scormVars.hasOwnProperty(key)) {
			if (key === scormVar) {
				if (scormVar === 'cmi.suspend_data' && susDataVar) {
					scormVars[key][susDataVar] = value;
					break;
				} else {
					scormVars[key].value = value;
					break;
				}
			}
		}
	}
}

Player.scorm.readVars = function() {
	var scormVars = Player.scorm.vars,
		getValue = Player.scorm.wrapper.doLMSGetValue;

	for (var key in scormVars) {
		if (scormVars.hasOwnProperty(key)) {
			var valor = getValue(key);
			// var valor = key;
			if (valor) {
				scormVars[key].value = key === "cmi.suspend_data" ? jQuery.parseJSON(valor) : valor;
				// scormVars[key].value = key;
			}

		}
	}
}

/**
Finaliza a comunicação SCORM comitando os dados, computando o tempo e fechando o protocolo de comunicação;
Invocado ao descarregar a seção do curso;

@method finalizaScorm
*/
Player.scorm.gravaDados = function(finaliza) {
	var scormVars = Player.scorm.vars,
		scormWrapper = Player.scorm.wrapper,
		setValue = scormWrapper.doLMSSetValue;

	for (var key in scormVars) {
		if (scormVars.hasOwnProperty(key)) {
			var valor = key === "cmi.suspend_data" ? JSON.stringify(scormVars[key].value) : scormVars[key].value;
			// var valor = scormVars[key].value;
			if (valor) {
				setValue(valor);
				// console.log(key, valor);
			}
		}
	}

	scormWrapper.computeTime(Player.scorm.info.startTime);
	scormWrapper.doLMSCommit();

	if (finaliza) {
		Player.scorm.finalizaScorm();
	}
}

Player.scorm.finalizaScorm = function(finaliza) {
	Player.scorm.doLMSFinish();
	Player.scorm.info.finalizado = true;
}
