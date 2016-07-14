define([
    'jquery'
], function($) {

    var telaNavegacao = function(template, data) {
        this.init = function() {
            /*Checar Função compile para observar que objetos são atrelados ao objeto principal
			- this.template
			- this.data
			- this.compiled
			- this.el
			- this.$el
			*/

            $.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

            var recurso = this,
                $abaModulo = recurso.$el.find(".abaModulo"),
                $bottomTelaNav = recurso.$el.find(".bottomTelaNav"),
                $modulo = recurso.$el.find(".modulo"),
                $maskTut = recurso.$el.find(".maskTut"),
                $midTelaNav = recurso.$el.find(".midTelaNav"),
                $btAcessoMod = recurso.$el.find(".btAcessoMod"),
                $midNavtutorial = recurso.$el.find(".midNavtutorial"),
                $textoDinamico = recurso.$el.find(".textoDinamico");

            $abaModulo.on({
                click: function(e) {
                    $abaModulo.removeClass("modAtual");
                    $(this).addClass("modAtual");
                    $modulo.hide();
                    $bottomTelaNav.find("[data-modulo='" + $(this).data("aba") + "']").show();

                    Player.Scorm.vars["cmi.suspend_data"].t.a = $(this).data("aba");



                    if (Player.Scorm.vars["cmi.suspend_data"].t.ct == 4) {
                        // $maskTut.fadeIn("fast");
                        // mostraTuto(Player.Scorm.vars["cmi.suspend_data"].t.ct);
                    }

                }
            });

            $btAcessoMod.off("click");
            $btAcessoMod.on({
                click: function(e) {

                    var redireciona = Player.Scorm.vars["cmi.suspend_data"].sI.m[$(this).parent().data("modulo") - 1],
                        slidesModulos = Player.Scorm.vars["cmi.suspend_data"].sI.m,
                        moduloAtual = Player.Scorm.vars["cmi.suspend_data"].t.a;


    

                    Player.Elements.swipe.slide(redireciona);





                }
            });

            $midNavtutorial.off("click");
            $midNavtutorial.on({
                click: function(e) {
                    e.stopPropagation();
                }
            })

            // $maskTut.off("click");
            // $maskTut.on({
            //     click: function(e) {
            //         var $this = $(this);
            //         if ($this.hasClass('noClick')) return;

            //         $this.addClass('noClick');
            //         $maskTut.fadeOut("fast", function() {
            //             $this.removeClass('noClick');
            //             atTuto();
            //         });
            //     }
            // });



            $maskTut.find(".telaTuto").off("click");
            $maskTut.find(".telaTuto").on({
                click: function(e) {
                    e.stopPropagation();
                }
            });
            $maskTut.find(".btFechar").off("click");
            $maskTut.find(".btFechar").on({
                click: function(e) {
                    var $this = $(this);
                    if ($this.hasClass('noClick')) return;

                    $this.addClass('noClick');
                    $maskTut.fadeOut("fast", function() {
                        $this.removeClass('noClick');
                        atTuto();
                    });





                }
            });

            $maskTut.find(".btVoltarTutorial").on({
                click: function(e) {


                    Player.Scorm.vars["cmi.suspend_data"].t.ct--;
                    // mostraTuto(Player.Scorm.vars["cmi.suspend_data"].t.ct);

                }
            });

            $maskTut.find(".btAvTutorial").on({
                click: function(e) {


                    Player.Scorm.vars["cmi.suspend_data"].t.ct++;
                    // mostraTuto(Player.Scorm.vars["cmi.suspend_data"].t.ct);



                }
            });


            Player.Elements.$swipe.on({
                slideEnd: function(e, starIndex, endIndex) {



                    if(Player.Scorm.vars["cmi.suspend_data"].sI != undefined){
                        if($.inArray(endIndex, Player.Scorm.vars["cmi.suspend_data"].sI.m) != -1){
                            $("body").find(".valorSlideAtual").show();

                        }
                    }

                   

                    if (endIndex == recurso.getSlideNumber()) {

                        $("body").find(".top").css("opacity", "0");
                        // $("body").find(".menu").hide();
                        $("body").find(".botaoAvancar").hide();
                        $("body").find(".botaoVoltar").addClass("voltarInicio");
                        $("body").find(".valorSlide").hide();

                        $("body").find(".botaoVoltar").text("VOLTAR AO INÍCIO");



                        //operacoes tutorial adicionar condicionais

                        /* 
                            t = tutorial;
                            ct = contador tutorial;
                            obC = obrigatórios completos;
                            opC = opcionais completos; 
                            tN tela navegação;
                            a:atual;
                        */


                        if (Player.Scorm.vars["cmi.suspend_data"].t == undefined) {

                            Player.Scorm.setScormValue('cmi.suspend_data', "t", {
                                ct: 1,
                                obC: [],
                                opC: [],
                                tN: true,
                                a: null,
              
                            });
                            // $maskTut.appendTo("body").fadeIn("fast");
                            // mostraTuto(Player.Scorm.vars["cmi.suspend_data"].t.ct);

                        } else if ((Player.Scorm.vars["cmi.suspend_data"].t.obC.length >= 1 && Player.Scorm.vars["cmi.suspend_data"].t.obC.length < 3 )||(Player.Scorm.vars["cmi.suspend_data"].t.opC.length >= 1 && Player.Scorm.vars["cmi.suspend_data"].t.obC.length < 3)) {

                            $textoDinamico.html("Escolha o próximo módulo que deseja estudar. Lembre-se de realizar todos os <b>módulos obrigatórios</b> para aprimorar os seus conhecimentos e poder realizar a atividade avaliativa do curso.");
            

                        }else if(Player.Scorm.vars["cmi.suspend_data"].t.obC.length == 3 && Player.Scorm.vars["cmi.suspend_data"].t.opC.length < 2){
                            $textoDinamico.text("Muito bem! Você já realizou todos os módulos obrigatórios deste curso. Agora você já pode realizar a sua atividade avaliativa. Mas lembre-se: esta avaliação abordará todos os tópicos deste curso, por isso não deixe de estudar os módulos opcionais caso não esteja seguro em todos os seus assuntos.");
                        }else if(Player.Scorm.vars["cmi.suspend_data"].t.obC.length == 3 && Player.Scorm.vars["cmi.suspend_data"].t.opC.length == 2){
                            $textoDinamico.text("Parabéns! Você já realizou todos os módulos deste curso. Reveja-os sempre que necessário e faça a atividade avaliativa no momento em que desejar!");
                        }


                        Player.Scorm.vars["cmi.suspend_data"].t.ctSl = 1;

                        ajustatuto();

                        Player.Scorm.vars["cmi.suspend_data"].t.tN = true;

                        $abaModulo.removeClass("modAtual");

                        $abaModulo.each(function(index) {
                            if ($(this).data("aba") == Player.Scorm.vars["cmi.suspend_data"].t.a) {
                                $(this).addClass("modAtual");
                                $(this).click();
                            }

                            if ($(this).data("aba") == 1 || $(this).data("aba") == 2) {

                                if ($.inArray($(this).data("aba"), Player.Scorm.vars["cmi.suspend_data"].t.opC) != -1) {
                                    $(this).addClass("modFinalizado");
                                }

                            } else {

                                if ($.inArray($(this).data("aba"), Player.Scorm.vars["cmi.suspend_data"].t.obC) != -1) {
                                    $(this).addClass("modFinalizado");
                                }

                            }
                        });

                        // $maskTut.appendTo("body");



                    } else {




                        if (Player.Scorm.vars["cmi.suspend_data"].t == undefined) return;



                        if (!Player.Scorm.vars["cmi.suspend_data"].t.tN) {
                            $("body").find(".botaoAvancar").show();
                            $("body").find(".valorSlide").show();

                             $("body").find(".botaoVoltar").removeClass("voltarInicio");
            

                        $("body").find(".botaoVoltar").text("");
                        }


                        $("body").find(".numeroModuloTop").text(Player.Scorm.vars["cmi.suspend_data"].t.a + ". ");
                        $("body").find(".courseMod").text(Player.json["mod" + Player.Scorm.vars["cmi.suspend_data"].t.a]);


                    }


                }

            });


            $(window).resize(function() {
                ajustatuto();
            });


            function ajustatuto() {

                var $passoUm = $maskTut.find(".passo1"),
                    sliderPosTop = $("body").find("#slider").offset().top,
                    sliderPosLeft = $("body").find("#slider").offset().left,
                    $passoDois = $maskTut.find(".passo2"),
                    $passoTres = $maskTut.find(".passo3"),
                    $passoQuatro = $maskTut.find(".passo4"),
                    $passoCinco = $maskTut.find(".passo5"),
                    $passoSeis = $maskTut.find(".passo6"),
                    $passoSete = $maskTut.find(".passo7"),
                    $passoOito = $maskTut.find(".passo8"),
                    $btModTut = $maskTut.find(".btModTut"),
                    $midNavtutorial = $maskTut.find(".midNavtutorial");



                $passoUm.css({
                    "left": (sliderPosLeft + ($passoUm.width() / 2)) + "px",
                    "top": (sliderPosTop + ($passoUm.height() / 2)) - 50 + "px"

                });

                $passoDois.css({
                    "left": (sliderPosLeft + 57) + "px",
                    "top": ($midTelaNav.offset().top - 200) + "px"

                });

                $passoTres.css({
                    "left": (sliderPosLeft + ($passoTres.width()) - 80) + "px",
                    "top": (sliderPosTop + ($passoTres.height() / 2) + 50) + "px"

                });

                $passoQuatro.each(function() {
                    if ($(this).hasClass("btModTut")) {

                        $(this).css({
                            "left": sliderPosLeft + 648 + "px",
                            "top": sliderPosTop + 394 + "px",
                            "position": "relative"
                        })

                    } else {

                        $(this).appendTo($btModTut).css({
                            "top": "-150px",
                            "left": "-185px"

                        });

                    }
                })


                $midNavtutorial.css({
                    "left": (sliderPosLeft) + "px",
                    "top": $midTelaNav.offset().top + "px"

                });


                $passoCinco.css({
                    "left": (sliderPosLeft + ($passoCinco.width() / 2)) + 83 + "px",
                    "top": (sliderPosTop + ($passoCinco.height() / 2)) + "px"

                });

                $passoSeis.css({
                    "left": (sliderPosLeft + ($passoCinco.width() / 2)) + 83 + "px",
                    "top": (sliderPosTop + ($passoCinco.height() / 2)) + "px"

                });

                $passoSete.css({
                    "left": (sliderPosLeft + ($passoSete.width() / 2)) - 25 + "px",
                    "top": (sliderPosTop + ($passoSete.height() / 4)) - 50 + "px"

                });

                $passoOito.css({
                    "left": (sliderPosLeft + ($passoOito.width() / 2)) - 40 + "px",
                    "top": (sliderPosTop + ($passoOito.height() / 4)) - 50 + "px"

                });


            }

            function mostraTuto(passo) {
                ajustatuto();
                $maskTut.find(".telaTuto").hide();
                $maskTut.find(".elTuto").hide();
                $maskTut.find(".passo" + passo).fadeIn("fast");

            }


            function atTuto() {
                var contTuto = Player.Scorm.vars["cmi.suspend_data"].t.ct;


                if (contTuto == 1 || contTuto == 2 || contTuto == 3) {
                    Player.Scorm.vars["cmi.suspend_data"].t.ct = 4;
                } else if (contTuto == 4) {
                    Player.Scorm.vars["cmi.suspend_data"].t.ct = 5;
                } else if (contTuto == 5 || contTuto == 6) {
                    Player.Scorm.vars["cmi.suspend_data"].t.ct = 7;
                } else if (contTuto == 7) {
                    Player.Scorm.vars["cmi.suspend_data"].t.ct = 8;
                } else if (contTuto == 8) {
                    Player.Scorm.vars["cmi.suspend_data"].t.ct = 0;
                }

            }


        },
        this.out = function(){
            Player.Scorm.vars["cmi.suspend_data"].t.tN = false;
        }
    }

    return telaNavegacao;
});