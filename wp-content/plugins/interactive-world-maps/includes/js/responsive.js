/*jshint esversion: 6 */
/*jshint browser: true */
"use strict";

var iwmdelay = (function () {
	var timer = 0;
	return function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();


function iwm_resize(map_divs, skipcheck) {

	jQuery.each(map_divs, function (index, element) {

		if (typeof element !== 'undefined') {

			//we access the .iwm_map_canvas
			var map_div = element.div.parent();

			if (!map_div.is(':visible')) {

				if (!skipcheck) {
					setTimeout(function () { iwm_resize(map_divs, true); }, 1);
				}
			}

			else {

				//we check the parent width - site layout - for changes
				var width = map_div.parent().width();
				//if it's the same we terminate function
				if (width === element.lastWidth) {

					return;

				}


				//else we redraw the map
				iwmdelay(function () {

					if (typeof iwmDrawVisualization === 'function') {

						map_div.animate({
							opacity: 0,
						}, 100, function () {
							iwmDrawVisualization(true);

						});

						map_div.animate({
							opacity: 1,
						}, 50, function () {
							// Animation complete.
						});


					}

				}, 200);

				//end else
			}

		}

		//end each
	});

}


jQuery(window).on('resize orientationchange', function () {
	iwm_resize(iwmMapObj);
});
