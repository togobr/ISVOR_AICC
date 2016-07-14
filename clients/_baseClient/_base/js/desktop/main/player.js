define([
    'jquery'
], function($) {

    var baseplayer = function(player) {

        var self = this,
            current_slide_index = 0;

        function getElements() {
            var $el = player.$el;

            return {
                $el: $el,
                $btAvancar: $el.find('.botaoAvancar'),
                $btVoltar: $el.find('.botaoVoltar'),
                $btAjuda: $el.find('.botaoAjuda'),
                $telaAjuda: $el.find('.ajuda'),
                $btAvancarIndice: $el.find('.avancarIndice'),
                $btVoltarIndice: $el.find('.voltarIndice'),
                $barraProgresso: $el.find('.barraProgresso'),
                $bottom: $el.find('.bottom'),
                $btIndice: $el.find('.botaoIndice'),
                $menuIndice: $el.find('.menuIndice'),
                $itensLinst: $el.find('#indice li')
            };
        }

        this.init = function() {

            self.elems = getElements();

            Player.Elements.$content = self.elems.$el.find(Player.Config.selectors.content);
            Player.Elements.$swipe = self.elems.$el.find(Player.Config.selectors.swipe);
            Player.Elements.generalModal = new Player.Components.modal(Player.Config.general.modal, $('body'));

            (Player.Components.recSequentialEntry) ? Player.Components.recSequentialEntry.init() : null;

            Player.Elements.$swipe.on({
                slideInit: function(e, startIndex, endIndex, domInit, domEnd) {

                    // check for 'out' events on every resource within the last slide
                    console.log('slide #%d was changed. Triggering resource\'s "out" events for that slider...', startIndex);
                    $.each($.makeArray(Player.Tree.resources[startIndex]), function(i, resource) {
                        if (!$.isFunction(resource.out)) return;
                        resource.out(startIndex);
                    });

                    // check for 'in' events on every resource within the actual slide
                    console.log('slide #%d started. Triggering resource\'s "in" events for this slider...', endIndex);
                    $.each($.makeArray(Player.Tree.resources[endIndex]), function(i, resource) {
                        if (!$.isFunction(resource['in'])) return;
                        resource['in'](endIndex);
                    });

                    // slides 'in' and 'out'
                    // check for 'out' events of the last slide
                    if ($.isFunction(Player.Tree.slides[startIndex].out)) {
                        Player.Tree.slides[startIndex].out();
                    }

                    // check for 'in' event of the current slide
                    if ($.isFunction(Player.Tree.slides[endIndex]['in'])) {
                        Player.Tree.slides[endIndex]['in']();
                    }

                },

                slideEnd: function(e, startIndex, endIndex, domInit, domEnd) {
                    self.updateScorm(endIndex);
                    current_slide_index = parseInt(endIndex);
                    self.updateSlideButtons();

                    // var salvaPos = makeHttpObject();

                    // salvaPos.open("POST", aiccUrl + "?command=putParam&session_id=" + aiccID + "&version=3.0&AICC_data=" + escape("[Core]\nlesson_location=" + JSON.stringify(Player.Scorm.vars)), true);
                    // salvaPos.send();

                    
                },

                transitionEnd: function() {
                    self.updateSlideButtons();
                }
            });

            Player.Elements.$content.on({
                contentReady: function(e) {
                    Player.Components.swipe(Player.Elements.$swipe, Player.Config.general.swipe);
                    Player.Components.tooltipster();

                    current_slide_index = parseInt(Player.Scorm.getScormValue('cmi.location')) || 0;

                    self.updateScorm(current_slide_index);
                    self.updateSlideButtons();

                    // usar timeout porque há recursos que executam metodos de inicialização no evento `contentReady`
                    // e os métodos `in` devem ser executados somente após o recurso ter sido completamente inicializado
                    setTimeout(function() {
                        // check for 'in' event of the current slide
                        if ($.isFunction(Player.Tree.slides[current_slide_index]['in'])) {
                            Player.Tree.slides[current_slide_index]['in']();
                        }

                        $.each($.makeArray(Player.Tree.resources[current_slide_index]), function(i, resource) {
                            if (!$.isFunction(resource['in'])) return;
                            resource['in'](current_slide_index);
                        });
                    });
                }
            });


            // ************************* EVENTOS *************************

            self.elems.$btAvancar.on({
                click: function(e) {
                    if (Player.Helpers.isLocked()) {
                        self.playerLocked();
                        return;
                    }

                    Player.Elements.swipe.next();
                }
            });

            self.elems.$btVoltar.on({
                click: function(e) {

                    var retornaTela = true;

                    $("body").find(".capturaModal").each(function(){

                        if($(this).css("display") == "block"){
                            $(this).css("display","none"); 
                            retornaTela = false;

                            $("body").find(".bottom").css("top","0");
                        }
            
                    });

                    if(!retornaTela)return;
                    
                    if($(this).hasClass("voltarInicio")){
                        Player.Elements.swipe.slide(1);
                    }else{
                        Player.Elements.swipe.prev();    
                    }
                    
                }
            });

            self.elems.$btAjuda.on({
                click: function(e) {
                    if (self.elems.$btAjuda.hasClass("desativado")) return;

                    self.elems.$telaAjuda.toggle();
                    $(this).toggleClass('active');
                    self.elems.$btIndice.toggleClass('desativado');
                }
            });

            self.elems.$btIndice.on({
                click: function(e) {
                    if (self.elems.$btIndice.hasClass("desativado")) return;

                    self.elems.$menuIndice.toggle();
                    $(this).toggleClass('active');
                    self.elems.$btAjuda.toggleClass('desativado');

                    if (right == tSliderInd) {
                        self.elems.$btAvancarIndice.hide();
                    }
                    if (right == 1) {
                        self.elems.$btVoltarIndice.hide();
                    }
                }
            });
        }

        // ************************* METHODS ************************* 

        window.computeTime = function(startDate) {
            if (startDate != 0) {
                var currentDate = new Date().getTime(),
                    elapsedSeconds = ((currentDate - startDate) / 1000),
                    formattedTime = Player.Scorm.Wrapper.convertTotalSeconds(elapsedSeconds);
            } else {
                formattedTime = "00:00:00.0";
            }

            return formattedTime;

        }

        window.makeHttpObject = function() {
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

        this.updateSlideButtons = function() {
            var current_slide = this.getCurrentSlide(),
                total_slides = this.getTotalSlides(),
                player_locked = Player.Helpers.isLocked();

            self.elems.$btVoltar.toggleClass('hidden', current_slide <= 1);

            if (player_locked || current_slide >= total_slides) {
                this.disableBtAvancar();
            } else {
                this.enableBtAvancar();
            }
        }

        this.disableBtAvancar = function() {
            self.elems.$btAvancar
                .addClass('desativado');
        }

        this.enableBtAvancar = function() {
            if (this.getCurrentSlide() >= this.getTotalSlides()) return; // end of slide

            self.elems.$btAvancar
                .removeClass('desativado');
        }

        this.getTotalSlides = function() {
            return Player.json.slides.length;
        }

        this.getCurrentSlide = function() {
            return current_slide_index + 1;
        }

        this.getSlidePercent = function() {
            var slide = this.getCurrentSlide(),
                total_slides = this.getTotalSlides();

            return (slide * 100) / total_slides;
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

                        if (!$(atual).hasClass('indiceAtual')) {
                            Player.Elements.swipe.slide(index);
                            self.elems.$itensLinst.removeClass('indiceAtual');
                            $(this).addClass('indiceVisitado');
                            $(this).addClass('indiceAtual');
                        }
                        self.elems.$menuIndice.toggle();
                        self.elems.$btIndice.toggleClass('active');
                        self.elems.$btAjuda.toggleClass('desativado');
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

        this.updateScorm = function(slide) {
            console.log('updateScorm', slide);

            var scoAtividade = player.data.atividade,
                scormLocation = Player.Scorm.getScormValue('cmi.location'),
                scormStatus = Player.Scorm.getScormValue('cmi.completion_status'),
                totalSlides = Player.json.slides.length,
                setValue = Player.Scorm.setScormValue,
                last_slide = Player.Tree.slides[totalSlides - 1];


            setValue('cmi.location', slide);


            if ($.isEmptyObject(Player.Scorm.vars["cmi.suspend_data"])) return;


            if(Player.Scorm.vars["cmi.suspend_data"].t == undefined)return;


            if(Player.Scorm.vars["cmi.suspend_data"].t.obC.length == 3){
                Player.Scorm.vars["cmi.completion_status"] = "completed";
            }


        




            if ((Player.Scorm.vars["cmi.suspend_data"].t.obC.length == 3 && scormStatus != 'completed') || Player.Scorm.vars["cmi.suspend_data"].t.obC.length == 5) {
              


                

                

                setValue('cmi.completion_status', 'completed');
                if (last_slide.el && last_slide.el.className == "slideFinal") {
                    last_slide.feedBackFinal();
                }
            } else {


                


                // setValue('cmi.completion_status', 'incomplete');
                if (last_slide.el && last_slide.el.className == "slideFinal") {
                    last_slide.feedBackFinal();
                }

            }

            transfString();




        }

        this.playerLocked = function() {
            console.log('a resource disabled the "next" button');
            // do something
        }

        this.init();
    }

    return baseplayer;
});