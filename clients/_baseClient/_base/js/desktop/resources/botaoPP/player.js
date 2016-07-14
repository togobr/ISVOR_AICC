/*
	Não importar jquery pois compilação entrega para ele. Explicar melhor na hora de documentar
*/

define([], function() {
	var botaoPP = function() {
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
				resource_id = recurso.data._id,
				scorm = Player.Scorm.getScormValue('cmi.suspend_data').botaoPP || {},
				resource_scorm = scorm[resource_id] || {};

			Player.Elements.generalModal.add(recurso, Player.Config.general.modal, {
				actions: [
					"click .btnFechar hide"
				],
				content: "#modalContent"
			});

			recurso.$el
				.toggleClass('visited', resource_scorm.visited || false)
				.on({
					click: function(e) {
						var resource_id = recurso.data._id,
							suspend_data = Player.Scorm.getScormValue('cmi.suspend_data').botaoPP,
							resource_scorm = {},
							new_suspend_data;

						resource_scorm[resource_id] = {
							visited: true
						};

						new_suspend_data = $.extend(true, {}, suspend_data, resource_scorm);

						Player.Elements.generalModal.show(recurso.data.id);
						Player.Scorm.setScormValue('cmi.suspend_data', 'botaoPP', new_suspend_data);
						recurso.$el.addClass('visited');
					}
				});
		}

	}

	return botaoPP;
});