define([
    'jquery'
], function($) {

    var mainplayer = function() {
        var self = this,
            right,
            tSliderInd;

        function getElements() {
            var $el = self.$el;



            return {
                $el: $el,
                $btAjuda: $el.find('.botaoAjuda'),
                $telaAjuda: $el.find('.ajuda'),
                $fecharAjuda: $el.find('.closeAjuda'),
                $fecharIndice: $el.find('.closeIndice'),
                $menuBtn: $el.find('.menuBtn'),
                $btApresentacao: $el.find('.apresentacaoBtn'),
                $valorSlideAtual: $el.find('.valorSlideAtual'),
                $topo: $el.find('.top'),
                $bottom: $el.find('.bottom'),
                $btIndice: $el.find('.botaoIndice')
            }
        }



        this.init = function() {


            $.extend(this, new Player.Base.main.player(this));
            self.startIndice();
            $.extend(this.elems, getElements());


            navigator.sayswho = (function() {
                var ua = navigator.userAgent,
                    tem,
                    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                if (M[1] === 'Chrome') {
                    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
                M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
                return M.join(' ');
            })();

            navegador = navigator.sayswho.split(" ")[0].toUpperCase();




            Player.Elements.$swipe.on({
                slideEnd: function(e, startIndex, endIndex, domInit, domEnd) {

                    if (Player.Scorm.vars["cmi.suspend_data"].t != undefined) {

                        $("body").find(".valorSlide").show();

                      
                        if (startIndex < endIndex && endIndex != Player.Scorm.vars["cmi.suspend_data"].sI.m[Player.Scorm.vars["cmi.suspend_data"].t.a-1]) {
                            Player.Scorm.vars["cmi.suspend_data"].t.ctSl++
                        } else if (startIndex > endIndex != Player.Scorm.vars["cmi.suspend_data"].sI.m[Player.Scorm.vars["cmi.suspend_data"].t.a-1] ) {
                            Player.Scorm.vars["cmi.suspend_data"].t.ctSl--;
                        }
                    }else{
                        $("body").find(".valorSlide").hide();
                    }


                    self.updateSlideNumber();
                    var $topoGet = self.elems.$topo;
                    var $bottomGet = self.elems.$bottom;



                    if (endIndex >= 1) {
                        $topoGet.css("opacity", "1");
                        $bottomGet.css("opacity", "1");

                        $bottomGet.show();


                    }

                    if (endIndex == 0 && Player.json.slides[endIndex].resources[0].template == "capa") {
                        self.elems.$btApresentacao.addClass('selected');
                        $topoGet.css("opacity", "0");
                        $bottomGet.css("opacity", "0");
                        $bottomGet.hide();


                    } else {
                        self.elems.$btApresentacao.removeClass('selected');
                    }
                }
            });




            Player.Elements.$content.on({
                contentReady: function(e) {
                    self.updateIndice();


                    $("body").find(".slideIntro").each(function(index) {
                        if (Player.Scorm.vars["cmi.suspend_data"].sI == undefined) {
                            Player.Scorm.setScormValue('cmi.suspend_data', "sI", {

                                m: [],
                            });

                           

                        }

                        if(Player.Scorm.vars["cmi.suspend_data"].sI.m.length <5){
                            Player.Scorm.vars["cmi.suspend_data"].sI.m.push($(this).data("index"));
                        }

                         

                        
                    })





                }
            });


            // ************************* EVENTS *************************


            self.elems.$btAvancar.on({
                click: function(e) {
                    $(this).removeClass('foco');


                    self.updateIndice();

                }
            });

            self.elems.$btVoltar.on({
                click: function(e) {

                    self.updateIndice();
                }
            });

            self.elems.$menuBtn.on('click', function() {
                self.goToSlide($(this).data('slide'));
                self.elems.$menuBtn.removeClass('selected');
                $(this).addClass('selected');
            });

            self.elems.$fecharAjuda.on({
                click: function(e) {
                    self.elems.$telaAjuda.toggle();
                }
            });


            self.elems.$fecharIndice.on({
                click: function(e) {
                    self.elems.$menuIndice.toggle();
                }
            });

            self.elems.$btIndice.on({
                click: function(e) {
                    // if(self.elems.$btIndice.hasClass("desativado")) return;

                    self.elems.$menuIndice.toggle();
                    // $(this).toggleClass('active');
                    // self.elems.$btAjuda.toggleClass('desativado');

                    if (right == tSliderInd) {
                        self.elems.$btAvancarIndice.hide();
                    }
                    if (right == 1) {
                        self.elems.$btVoltarIndice.hide();
                    }
                }
            });

            self.elems.$btAvancarIndice.on({
                click: function(e) {
                    console.log(tSliderInd);
                    $("#indice").animate({
                        right: "+=653px"
                    }, 500);

                    right += 1;
                    if (tSliderInd == right) {
                        self.elems.$btAvancarIndice.hide();
                    } else if (right < (tSliderInd)) {
                        self.elems.$btAvancarIndice.show();

                    }
                    self.elems.$btVoltarIndice.show();
                }
            });

            self.elems.$btVoltarIndice.on({
                click: function(e) {
                    $("#indice").animate({
                        right: "-=653px"
                    }, 500);

                    right -= 1;

                    if (right == 1) {
                        self.elems.$btVoltarIndice.hide();
                    }
                    self.elems.$btAvancarIndice.show();
                }
            });

        }

        // ************************* METHODS ************************* 






        this.goToSlide = function(index) {
            Player.Elements.swipe.slide(index);
        }

        this.updateSlideNumber = function() {
            var player = this,
                slide = self.getCurrentSlide(),
                perc = self.getSlidePercent(),
                total_slides = self.getTotalSlides(),
                slidesModulos = null,
                moduloAtual = null;

            if (Player.Scorm.vars["cmi.suspend_data"].sI != undefined && Player.Scorm.vars["cmi.suspend_data"].t) {
                slidesModulos = Player.Scorm.vars["cmi.suspend_data"].sI.m;
                moduloAtual = Player.Scorm.vars["cmi.suspend_data"].t.a;
                total_slides = (slidesModulos[moduloAtual] - slidesModulos[moduloAtual - 1]) - 1;


                if (moduloAtual == 1) {
                    total_slides = (slidesModulos[moduloAtual] - slidesModulos[moduloAtual - 1]) - 2;
                    
                }
               


                


                if(slidesModulos[moduloAtual] == undefined){
                    total_slides =  (self.getTotalSlides() - slidesModulos[moduloAtual - 1])-1;
                }

                slide = Player.Scorm.vars["cmi.suspend_data"].t.ctSl+1;
            }


            if (slide < 10) {
                slide = "0" + slide;
            }

            if (total_slides < 10) {
                total_slides = "0" + total_slides;
            }

            self.elems.$valorSlideAtual
                .find('#sldAtual').text(slide)
                .end()
                .find('#sldTotal').text(total_slides);
        }

        this.startIndice = function() {
            var player = this,
                slidesArray = player.data.slides,
                slidesTotal = slidesArray.length;

            right = 1;
            tSliderInd = (slidesTotal / 22)

            if (!(tSliderInd % 1 == 0)) {
                tSliderInd = parseInt(tSliderInd);
                tSliderInd += 1;
                if (tSliderInd < 1) {
                    tSliderInd += 1;
                }
            }

            self.elems.$itensLinst.each(function(index, el) {
                var $el = $(el);
                $el.on({
                    click: function(e) {
                        var atual = this;
                        if (!$(atual).hasClass('indiceDesativado')) {
                            if (!$(atual).hasClass('indiceAtual')) {
                                Player.Elements.swipe.slide(index);
                                self.elems.$itensLinst.removeClass('indiceAtual');
                                $(this).addClass('indiceVisitado');
                                $(this).addClass('indiceAtual');
                            }
                            self.elems.$menuIndice.toggle();
                            self.elems.$btIndice.toggleClass('actived').removeClass('active');
                        }

                    }
                });
            });
        }

        this.updateIndice = function() {
            console.log('[main]player [method]updateIndice: ');
            var slide = self.getCurrentSlide();

            self.elems.$itensLinst
                .filter('.indiceAtual')
                .removeClass('indiceAtual indiceDesativado')
                .end()
                .filter(function(i) {
                    return i < slide;
                })
                .addClass('indiceVisitado')
                .removeClass('indiceDesativado')
                .end()
                .eq(slide - 1)
                .addClass('indiceAtual')
        }

    }

    return mainplayer;
});