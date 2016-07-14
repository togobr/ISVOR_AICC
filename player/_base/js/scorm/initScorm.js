define([], function() {
    'use strict';
    var initScorm = function() {
        var config = Player.Config.general.scorm,
            wrapper = Player.Scorm.Wrapper,
            scorm = Player.Helpers.getQueryVariable('scorm') === 'false' ? false : true,
            suspendedData;




        Player.Scorm.vars = {
            "cmi.location": undefined,
            "cmi.completion_status": undefined,
            "cmi.suspend_data": {}
        };

        if (scorm === false) {

            window.aiccID = null;
            window.aiccUrl = null;
            return;
        }

        window.startTime = new Date().getTime();


        window.aiccID = getParameterByName("aicc_sid"); //colhe dados da URL
        window.aiccUrl = getParameterByName("aicc_url"); //colhe dados da URL
        window.request = makeHttpObject();
        window.dadosLMS = null;
        window.lessonLoc = null;





        if (aiccID.length <= 0 || aiccUrl.length <= 0) {
            aiccID = getParameterByName("AICC_SID");
            aiccUrl = getParameterByName("AICC_URL");
        }

        aiccUrl = aiccUrl.split("?")[0];

        aiccUrl = aiccUrl.split("&")[0];



        if (aiccUrl.length > 0 && aiccUrl.length > 0) {
            aiccUrl = addhttp(aiccUrl);
        }

        // Caso houver informações no Banco, ele envia uma requisição de send, com as informações do request.open.
        request.open("POST", aiccUrl + "?command=getParam&session_id=" + aiccID + "&version=3.0&AICC_data=", true);
        request.send();


        // Ao retornar a resposta do send, é executado esta função.
        // Esta função trata a resposta, para enviar ao curso

        request.onreadystatechange = function() {
            if (request.readyState == 4) {

                dadosLMS = request.responseText;

                var dadosRetorno = escape(dadosLMS).split("%0D%0A");
                for (var i = dadosRetorno.length - 1; i >= 0; i--) {
                    dadosRetorno[i] = unescape(dadosRetorno[i]);
                };

                dadosLMS = separa_dados(dadosRetorno);

                if (dadosLMS.lesson_location != undefined && dadosLMS.lesson_location.length > 5) {

                    var strVars = dadosLMS.lesson_location;

                    strVars = strVars.replace(/-/g, ":");
                    strVars = strVars.replace(/::/g, ":");
                    strVars = strVars.replace(/\//g, "\{");
                    strVars = strVars.replace(/_/g, "\"");
                    strVars = strVars.replace(/d\"d/, "d_d");
                    strVars = strVars.replace(/n\"s/, "n_s")

                    Player.Scorm.vars = JSON.parse(strVars);

                    console.log("Player.Scorm.vars foo", Player.Scorm.vars);
                }


                transfArray();

                Player.Elements.$content.trigger('contentReady');

                Player.Elements.$content.trigger('scormReady');

            }

        };


        // Transforma as informações que veio do banco como string, para array. 
        // Possibilitando sua leitura no player.
        window.transfArray = function() {

            if (Player.Scorm.vars["cmi.suspend_data"].sI == undefined) return;


            Player.Scorm.vars["cmi.suspend_data"].sI.m = Player.Scorm.vars["cmi.suspend_data"].sI.m.split(",");
            for (var i = 0; i < Player.Scorm.vars["cmi.suspend_data"].sI.m.length; i++) {
                Player.Scorm.vars["cmi.suspend_data"].sI.m[i] = Number(Player.Scorm.vars["cmi.suspend_data"].sI.m[i]);



            };




            if (Player.Scorm.vars["cmi.suspend_data"].t == undefined) return;

            if (Player.Scorm.vars["cmi.suspend_data"].t.obC == "") {
                Player.Scorm.vars["cmi.suspend_data"].t.obC = [];
            } else {

                Player.Scorm.vars["cmi.suspend_data"].t.obC = Player.Scorm.vars["cmi.suspend_data"].t.obC.split(",");
            }


            if (Player.Scorm.vars["cmi.suspend_data"].t.opC == "") {
                Player.Scorm.vars["cmi.suspend_data"].t.opC = [];
            } else {
                Player.Scorm.vars["cmi.suspend_data"].t.opC = Player.Scorm.vars["cmi.suspend_data"].t.opC.split(",");
            }


            if (Player.Scorm.getScormValue('cmi.suspend_data', "SD") != undefined) {

                if (Player.Scorm.getScormValue('cmi.suspend_data', "SD").d == "") {
                    Player.Scorm.getScormValue('cmi.suspend_data', "SD").d = [];
                } else {
                    Player.Scorm.getScormValue('cmi.suspend_data', "SD").d = Player.Scorm.getScormValue('cmi.suspend_data', "SD").d.split(",");
                }

                for (var i = 0; i < Player.Scorm.getScormValue('cmi.suspend_data', "SD").d.length; i++) {
                    Player.Scorm.getScormValue('cmi.suspend_data', "SD").d[i] = Number(Player.Scorm.getScormValue('cmi.suspend_data', "SD").d[i]);

                };

            }







            for (var i = 0; i < Player.Scorm.vars["cmi.suspend_data"].t.obC.length; i++) {
                Player.Scorm.vars["cmi.suspend_data"].t.obC[i] = Number(Player.Scorm.vars["cmi.suspend_data"].t.obC[i]);

            };

            for (var i = 0; i < Player.Scorm.vars["cmi.suspend_data"].t.opC.length; i++) {
                Player.Scorm.vars["cmi.suspend_data"].t.opC[i] = Number(Player.Scorm.vars["cmi.suspend_data"].t.opC[i]);

            };






        }

        // Transforma as informações que veio do curso como array, para string. 
        window.transfString = function() {



            if (Player.Scorm.vars["cmi.suspend_data"].sI != undefined) {
                Player.Scorm.vars["cmi.suspend_data"].sI.m = Player.Scorm.vars["cmi.suspend_data"].sI.m.toString();

            }





            if (Player.Scorm.vars["cmi.suspend_data"].t != undefined) {
                Player.Scorm.vars["cmi.suspend_data"].t.obC = Player.Scorm.vars["cmi.suspend_data"].t.obC.toString();

                Player.Scorm.vars["cmi.suspend_data"].t.opC = Player.Scorm.vars["cmi.suspend_data"].t.opC.toString();
            }

            if (Player.Scorm.getScormValue('cmi.suspend_data', "SD") != undefined) {

                Player.Scorm.getScormValue('cmi.suspend_data', "SD").d = Player.Scorm.getScormValue('cmi.suspend_data', "SD").d.toString();

            }

            var strVars = JSON.stringify(Player.Scorm.vars);

            console.log("foo tamanho string nao otimizada", escape(strVars).length);

            strVars = strVars.replace(/true/g, "1");
            strVars = strVars.replace(/false/g, "0");
            strVars = strVars.replace(/:/g, "-");
            strVars = strVars.replace(/\{/g, "/");
            strVars = strVars.replace(/\"/g, "_");

            console.log("foo tamanho string  otimizada", escape(strVars).length);


            if (Player.Scorm.vars["cmi.completion_status"] == "completed") {

                var finaliza = makeHttpObject();


                finaliza.open("POST", aiccUrl + "?command=putParam&session_id=" + aiccID + "&version=3.0&AICC_data=" + escape("[Core]\nlesson_location=" + strVars + "\nlesson_status=C"), true);
                finaliza.send();

            } else {
                var saveScorm = makeHttpObject();


                saveScorm.open("POST", aiccUrl + "?command=putParam&session_id=" + aiccID + "&version=3.0&AICC_data=" + escape("[Core]\nlesson_location=" + strVars + "\nlesson_status=I"), true);
                saveScorm.send();


                console.log(saveScorm, "foo saveScorm.readyState");

            }

            transfArray();

        }

        function addhttp(url) {
            var prefix = 'http://',
                prefix2 = "https://";
            if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix2.length) !== prefix2) {
                url = prefix + url;
            }
            return url;
        }

        function makeHttpObject() {
            try {
                return new XMLHttpRequest();
            } catch (error) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (error) {}
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (error) {}

            throw new Error("Could not create HTTP request object.");
        }


        function separa_dados(retorno) {
            var args = new Object(),
                dados = retorno;

            for (var f = 0; f < dados.length; f++) {
                var campos = dados[f].split('=');
                if (campos[1]) {
                    args[trimSpaces(unescape((campos[0].toLowerCase()).replace(/\+/g, ' ')))] = unescape(campos[1].replace(/\+/g, ' '));
                } else {
                    args[trimSpaces(unescape((campos[0].toLowerCase()).replace(/\+/g, ' ')))] = "";
                }
            }

            return args
        }




        function trimSpaces(str) {
            while (str.charAt(0) == " ") {
                str = str.substr(1);
            }
            while (str.charAt(str.length - 1) == " ") {
                str = str.substr(0, str.length - 1);
            }
            return str;
        }


        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        // wrapper.doLMSInitialize();
        // var inicializou = pipwerks.SCORM.init();

        // if (inicializou) {
        //     var scormVars = Player.Config.general.scorm.vars;

        //     console.log('scormVars---------', scormVars);
        //     for (var i = scormVars.length - 1; i >= 0; i--) {
        //         if (scormVars[i]) {
        //             var value = pipwerks.SCORM.get(scormVars[i]);

        //             if (scormVars[i] === "cmi.suspend_data") {
        //                 if (!Player.Helpers.isJSON(value) && value === "") {
        //                     Player.Scorm.vars[scormVars[i]] = {};
        //                 } else {
        //                     Player.Scorm.vars[scormVars[i]] = jQuery.parseJSON(value);
        //                 }
        //             } else {
        //                 Player.Scorm.vars[scormVars[i]] = value;
        //             }
        //         }
        //     };
        // }
        // suspendedData = Player.Scorm.getScormValue('cmi.suspend_data');

        // $.each(suspendedData.atividades || {}, function(key, item) {
        //     var atividade = Player.Helpers.findRecbyData('_id', key);

        //     if (!atividade) return;

        //     var atv = $('#' + key),
        //         gabarito = suspendedData.atividades[key].gabarito,
        //         resps = suspendedData.atividades[key].respostas,
        //         tentativaPorQuestaoRealizada = suspendedData.atividades[key].tentativaPorQuestaoRealizada,
        //         scoAtividade = suspendedData.atividades[key].scoAtividade,
        //         certa = suspendedData.atividades[key].respostaCerta,
        //         feedBackVisual = atv.find(".chkOrRadio"),
        //         feedBackCircundado = suspendedData.atividades[key].feedBackCircundado,
        //         arrayAlternativas = ["0", "1", "2", "3", "4"];


        //     for (var i = resps.length - 1; i >= 0; i--) {
        //         atv.find('[value="' + resps[i] + '"]').prop("checked", true);
        //     }

        //     for (var i = 0; i < (feedBackVisual.length); i++) {

        //         var found = $.inArray(arrayAlternativas[i], gabarito);

        //         if (found === -1) {
        //             if (feedBackCircundado) {
        //                 feedBackVisual[i].parentNode.parentNode.setAttribute("class", "errado");
        //             }
        //         } else {
        //             if (feedBackCircundado) {
        //                 feedBackVisual[i].parentNode.parentNode.setAttribute("class", "certo");
        //             }
        //         }
        //     }

        //     if (scoAtividade == "comNota") {
        //         atv.find('.chkOrRadio').prop('disabled', true);
        //         atv.find('.enviaResposta').hide();
        //         atividade.tentativaPorQuestaoRealizada = tentativaPorQuestaoRealizada;
        //     }
        // });

        // if (suspendedData['acertos']) {
        //     var totalAcertos = suspendedData['acertos'].questoesCorretas;
        //     // global var
        //     questoesCorretas = totalAcertos;
        // }

        $(window).on({
            beforeunload: function() {
                // window.alert = function() {};
                // Player.Scorm.saveScormData(true);
                // window.alert = function() {};
            }

            // unload: function() {
            //     window.alert = function() {};
            //     Player.Scorm.saveScormData(true);
            //     window.alert = function() {};
            // }
        });

        console.log(Player);
    }

    return initScorm;
});