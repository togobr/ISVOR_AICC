define([], function() {

    var multimedia = function(template, data) {
        this.init = function() {
            /*Checar Função compile para observar que objetos são atrelados ao objeto principal
            - this.template
            - this.data
            - this.compiled
            - this.el
            - this.$el
            */

            $.extend(true, this, new Player.Helpers.resourceExtend(this, arguments));

            var multimedia = this,
                $multimedia = multimedia.$el.find('iframe'),
                src = $multimedia.attr('src');

            this.iframe = $multimedia;
            this.src = src;


            Player.Elements.$swipe.on({
                slideEnd: function(e, startIndex, endIndex, domInit, domEnd) {



                }
            });

        }

        this['in'] = function() {
            this.iframe.attr('src', this.src);




            var resource = this,
                slideVisitado = false,
                iframe = this.iframe,
                valorSlide = $(this.$el).parent().parent().data("index");



            if(resource.data.travado != false){
                if (Player.Scorm.getScormValue('cmi.suspend_data', "slideDestravado" + valorSlide) == undefined) {
                Player.Scorm.setScormValue('cmi.suspend_data', "slideDestravado" + valorSlide, {
                    destravado: false,
                    bts: []
                });
            }

            slideVisitado = Player.Scorm.getScormValue('cmi.suspend_data', "slideDestravado" + valorSlide).destravado




            if (!slideVisitado) {
                if(!Player.json.travaSlides)return;
                resource.lockPlayer(true);
            }

            }    

            $(window).off("bodyFoi");
            $(window).on({
                bodyFoi: function(e) {

                    if ($(iframe).attr("src") != "about:blank") {

                        var botoes = Player.Scorm.getScormValue('cmi.suspend_data', "slideDestravado" + valorSlide).bts,
                            iframeAtual = iframe[0];

                        botoes = botoes.toString();

                        botoes = botoes.replace(/,/g, '');


                        console.log(botoes,"bts");



                        iframeAtual.contentWindow.vistos_array = botoes;



                        $(window).off("getBts");
                        $(window).on({
                            getBts: function(e, vistos_array) {

                                Player.Scorm.getScormValue('cmi.suspend_data', "slideDestravado" + valorSlide).bts = vistos_array;

                                



                            }
                        })
                        $(window).off("destravaSlide");
                        $(window).on({
                            destravaSlide: function(e) {

                                Player.Scorm.getScormValue('cmi.suspend_data', "slideDestravado" + valorSlide).destravado = true;
                                resource.lockPlayer(false);
                                resource.$el.parent().parent().parent().parent().parent().find('.botaoAvancar').addClass("foco");
                                


                            }
                        })
                    }
                }


            })



        }

        this.out = function() {
            this.iframe.attr('src', 'about:blank');
        }


    }

    return multimedia;
});