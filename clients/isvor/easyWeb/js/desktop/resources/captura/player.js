    define([], function() {
        var captura = function() {
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
                    $captura = recurso.$el.find('.capturaModal'),
                    $bottom = recurso.$el.parent().parent().parent().parent().parent().find('.bottom'),
                    $top = recurso.$el.parent().parent().parent().parent().parent().find('.top'),
                    $btnFecharCaptura = recurso.$el.find('.fecharCaptura'),
                    $btnDesativado = recurso.$el.find('.textoBtnCaptura'),
                    $checkBtn = recurso.$el.find('.checkBtn'),
                    $imagemCapturaBtn = recurso.$el.find('.imagemBtnCaptura'),
                    $btnCaptura = recurso.$el.find('.btnCaptura'),
                    iframe = recurso.$el.find("iframe")[0],
                    iframeWindow = null;
                recursoAtual = this;




                recurso.$el.find("iframe").attr("src", "");

                //recursoAtual.$el.parent().parent().data("index") idSlide


                window.captivateEnded = function() {

                    recursoAtual.lockPlayer(false);
                    recursoAtual.$el.parent().parent().parent().parent().parent().find('.botaoAvancar').addClass("foco").click();

                    if (Player.Scorm.getScormValue('cmi.suspend_data', "SD") == undefined) {


                        Player.Scorm.setScormValue('cmi.suspend_data', "SD", {
                            d: []
                        });

                    }

                   


                        if ($.inArray(recursoAtual.$el.parent().parent().data("index"), Player.Scorm.getScormValue('cmi.suspend_data', "SD").d) == -1) {
                            Player.Scorm.getScormValue('cmi.suspend_data', "SD").d.push(recursoAtual.$el.parent().parent().data("index"));
                        }
                        slideVisitado = true;
                        recursoAtual.$el.find('.imagemBtnCaptura').addClass('desativarBg');
                        recursoAtual.$el.find('.textoBtnCaptura').addClass('capturaDesativado');
                        recursoAtual.$el.find('.checkBtn').show();
                    



                    recursoAtual.$el.find('.imagemBtnCaptura').addClass('desativarBg');
                    recursoAtual.$el.find('.textoBtnCaptura').addClass('capturaDesativado');
                    recursoAtual.$el.find('.checkBtn').show();





                }



                $btnCaptura.on({
                    click: function(e) {

                        //window
                        var iframeWindow = iframe.contentWindow;

                        recursoAtual = recurso;

                        $captura.css({
                            "display": "block",
                            "z-index": "999"
                        });

                        $("body").find(".bottom").css({
                            "top": "46px",
                            "z-index": 9999
                        })

                        // $(iframeWindow.document.body).attr("bgcolor", '#ececec');
                        // $(iframeWindow.document.body).css("overflow", "hidden");
                        // $(iframeWindow.document.body).append("<div style='position:absolute;background-color: #ccc;opacity:0;right: 0;bottom: 3px;width: 870px;height: 22px;'></div>");


                    }
                });

                $(window).resize(function() {

                    resizeCap();

                });

                $btnFecharCaptura.on({
                    click: function(e) {
                        $captura.css({
                            "opacity": "none",
                            "z-index": "-999"
                        });

                        $("body").find(".bottom").css({
                            "top": "46px",
                            "z-index": 0
                        })

                    }
                });

                Player.Elements.$swipe.on({
                    slideInit: function(e, startIndex, endIndex, domInit, domEnd) {

                        if (recurso.getSlideNumber() == endIndex) {

                            $captura.find("iframe").attr("src", recurso.data.captura);

                            $("body").find(".menu").show();




                            if (!Player.json.travaSlides) return;



                            var slideVisitado = false;
                            if (Player.Scorm.getScormValue('cmi.suspend_data', "SD") != undefined) {

                                if ($.inArray(endIndex, Player.Scorm.getScormValue('cmi.suspend_data', "SD").d) != -1) {
                                    slideVisitado = true;
                                    $btnDesativado.addClass('capturaDesativado');
                                $imagemCapturaBtn.addClass('desativarBg');
                                $checkBtn.show();
                                }else{
                                    slideVisitado = false;
                                }


                
                                
                            }

                            if (!slideVisitado) {
                                recurso.lockPlayer(true);
                            }


                        } else {
                            $captura.css({
                                "display": "none",
                                "z-index": "-999"
                            });

                            $("body").find(".bottom").css({
                                "top": "0px",
                                "z-index": 0
                            })
                        }
                    }
                });


                Player.Elements.$content.on({
                    contentReady: function(e) {
                        resizeCap(true);
                    }


                });



                function resizeCap(inicializa) {
                    var topCaptura = ($(window).height() - $captura.height()) / 2,
                        leftCaptura = ($(window).width() - $captura.width()) / 2;


                    if (inicializa) {
                        $captura.appendTo("body").css({
                            "top": topCaptura + "px",
                            "left": leftCaptura + 5 + "px"
                        });

                    } else {
                        $captura.css({
                            "top": topCaptura + "px",
                            "left": leftCaptura + 5 + "px"
                        });
                    }

                }
            },

            this['in'] = function() {




                this.$el.find("iframe").attr("src", this.data.captura);


            }

        }

        return captura;
    });