define([], function() {
    var capa = function() {
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
                $btnCapa = recurso.$el.find('.btnCapaInicio'),
                $capaBack = recurso.$el.find(".capaBack"),
                iframe = recurso.$el.find("embed");
            if (recurso.data.animado) {
                $capaBack.hide();

            }



            Player.Elements.$swipe.on({
                slideEnd: function(e, starIndex, endIndex) {

                    if (endIndex == recurso.getSlideNumber()) {

                        $("body").find(".top").css("opacity", "0");

                       
                            $("body").find(".valorSlideAtual").hide();
                            
                        
                        

                    }

                }
            });


            Player.Elements.$content.on({
                contentReady: function(e) {


                    if(recurso.getSlideNumber() !=0){

                         $(iframe).attr("src","");

                    }


                }
            });





            $btnCapa.on({
                click: function(e) {
                    Player.Elements.swipe.next();
                }
            });
        },

        this['in'] = function() {

            var tempoAnimacao = this.data.tempoAnima * 1000,
                $btnCapa = this.$el.find('.btnCapaInicio'),
                $slider = $("body").find("#slider"),
                iframe = this.$el.find("iframe");

            $parentElement = this.$el.parent().parent();

            if (navegador == "FIREFOX") {
                this.$el.appendTo($slider);

                this.$el.css({
                    "position": "absolute",
                    "top": 0
                })
            }

            if (this.getSlideNumber() != 0) {
                //this.$el.find(".btnCapaInicio").remove();

                $(iframe).attr("src",this.data.srcAnima);
            }

            var slide = this.getSlideNumber();

            setTimeout(function() {




                if( slide== 0){
                    $btnCapa.fadeIn("fast");
                }

                

            }, tempoAnimacao);

            if (this.$el.find('.btnCapaInicio').css("display") == "block") return;

            




        },

        this.out = function() {
            if (navegador == "FIREFOX") {
                this.$el.appendTo($parentElement);
            }

        }

    }

    return capa;
});