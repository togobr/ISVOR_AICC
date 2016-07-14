define([
    'jquery'
    ], function($) {

    var findRecbyData = function (attr, value) {
        var slides = Player.Tree.resources;
		for (var i = slides.length - 1; i >= 0; i--) {
			var recs = slides[i];
			for (var j = recs.length - 1; j >= 0; j--) {
				if(recs[j].data[attr] === value){
					return recs[j];
				}
			};
		};
    }

    return findRecbyData;
});




