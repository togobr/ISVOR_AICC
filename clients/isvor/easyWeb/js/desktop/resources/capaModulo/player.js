define([
    'jquery'
], function($) {

    var capaModulo = function(template, data) {
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
                $top = recurso.$el.find('.top');



            /*
					Si = slides introducao
					m = modulos
		
				*/





            Player.Elements.$content.on({
                contentReady: function(e) {

                	var slideIntro = recurso.$el.parent().parent().data("index");

             
                    if (Player.Scorm.vars["cmi.suspend_data"].sI == undefined) {
                        Player.Scorm.setScormValue('cmi.suspend_data', "sI", {
                            m: [],
                        });

                    }

                    Player.Scorm.vars["cmi.suspend_data"].sI.m.push(slideIntro);


                }
            });



            Player.Elements.$swipe.on({
                slideEnd: function(e, starIndex, endIndex) {
                    var posicaoRecurso = recurso.$el.parent().parent().data("index"),
                        $imgPrincipalModulo = recurso.$el.find(".imgPrincipalModulo "),
                        $numeroModulo = recurso.$el.find(".numeroModulo "),
                        $textosCapaTopico = recurso.$el.find(".textosCapaTopico ");



                    if (endIndex == posicaoRecurso) {
                        $imgPrincipalModulo.addClass("animated").addClass("fadeInUp");
                        $numeroModulo.addClass("animated").addClass("fadeInRight");
                        $textosCapaTopico.addClass("animated").addClass("fadeInRight");
                        recurso.$el.parent().parent().parent().parent().parent().find('.top').css("opacity", "0");

                        Player.Scorm.vars["cmi.suspend_data"].t.tN = false;

                    }

                }
            })


        }

    }

    return capaModulo;
});