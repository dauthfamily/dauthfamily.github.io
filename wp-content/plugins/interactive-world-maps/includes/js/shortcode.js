var iwmMapObj = [];

if (typeof google !== "undefined") {

	google.charts.load('42', {
		packages: ['geochart'],
		mapsApiKey: iwmparam[0].apikey
	});
	google.charts.setOnLoadCallback(iwm_init);

}


function iwm_init() {

	for (var key in iwmparam) {

		var mapcontainer = document.getElementById('unique_iwm_' + iwmparam[key].unique_id);
		if (!mapcontainer) { delete iwmparam[key]; continue; }

		//zoom controls init
		var controls = iwmparam[key]['controls'];
		if (controls) {
			iwm_zoom(iwmparam[key]['unique_id'], iwmparam[key]['id'], iwmparam[key]['controls_position'], iwmparam[key]['overlay']);
		}
	}

	iwmDrawVisualization();
}

iwmObj = {};
iwmObj.iwmoptions = [];
iwmObj.iwmgeocharts = [];
iwmObj.iwmdata = [];

function iwmDrawVisualization(skipNotVisible) {


	//We're loading version 42 of the API, latest version had bugs for text labels

	if (typeof google.visualization !== "undefined") {

		var data = {};
		var values = {};
		var listener_actions = {};
		var listener_custom = {};
		var identifier = {};
		var mapcolours = {};
		var index;

		for (var key in iwmparam) {

			var mapid = iwmparam[key].id;

			if (skipNotVisible && iwmMapObj[mapid] && !iwmMapObj[mapid].div.is(':visible')) {
				continue;
			}

			var keydiv = document.getElementById("map_canvas_" + mapid);
			if (iwmparam[key].region && keydiv) {

				var usehtml = parseInt(iwmparam[key].usehtml, 10);

				/* Disable HTML Tooltips by default on iOS */
				var isMobile = window.matchMedia("only screen and (max-width: 780px)");
				if (isMobile.matches && iwmparam[key].htmlios === '0' && iwmparam[key].tooltip === 'focus') {
					console.log('disabling html tooltips on iOS devices');
					if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
						usehtml = 0;
					}
				}

				var iwmid = parseInt(iwmparam[key].id, 10);
				var uniqueid = parseInt(iwmparam[key].unique_id, 10);
				var bgcolor = iwmparam[key].bgcolor;
				var stroke = parseInt(iwmparam[key].stroke, 10);
				var bordercolor = iwmparam[key].bordercolor;
				var incolor = iwmparam[key].incolor;
				var actcolor = iwmparam[key].actcolor;
				var width = parseInt(iwmparam[key].width, 10);
				var height = parseInt(iwmparam[key].height, 10);
				var ratio = (iwmparam[key].aspratio === '1');
				var interactive = (iwmparam[key].interactive === 'true');
				var toolt = iwmparam[key].tooltip;
				var region = iwmparam[key].region;
				var resolution = iwmparam[key].resolution;
				var markersize = parseInt(iwmparam[key].markersize, 10);
				var displaymode = iwmparam[key].displaymode;
				var placestxt = iwmparam[key].placestxt;
				var projection = iwmparam[key].projection;

				var divid = "map_canvas_" + iwmid;
				var uniquedivid = 'unique_iwm_' + uniqueid;
				var divselector = '#' + uniquedivid + ' #' + divid;

				var magglass = iwmparam[key].magglass;
				var magglasszfactor = parseInt(iwmparam[key].magglasszfactor, 10);

				var widthselector = iwmparam[key].widthselector;

				placestxt = placestxt.replace(/^\s+|\s+$/g, '');

				var action = iwmparam[key].action;
				var customaction = iwmparam[key].custom_action;

				identifier[mapid] = iwmid;
				listener_actions[mapid] = action;
				listener_custom[mapid] = customaction;

				var places = placestxt.split(";");

				data[mapid] = new google.visualization.DataTable();

				if (displaymode === "markers02" || displaymode === "text02" || displaymode === "customicon") {



					data[mapid].addColumn('number', 'Lat');
					data[mapid].addColumn('number', 'Long');
				}


				data[mapid].addColumn('string', 'Country'); // Implicit domain label col.
				data[mapid].addColumn('number', 'Value'); // Implicit series 1 data col.
				data[mapid].addColumn({
					type: 'string',
					role: 'tooltip',
					p: {
						html: true
					}
				}); //

				var colorsmap = [];
				//var colorsindex = [];
				var colorcount = 0;
				var colorsmapecho = "";

				values[mapid] = {};
				dataindex = {};
				mapcolours[mapid] = {};

				//places.length-1 to eliminate empty value at the end
				for (var i = 0; i < places.length - 1; i++) {
					var entry = places[i].split(",");

					var ttitle = entry[1].replace(/&#59/g, ";");
					ttitle = ttitle.replace(/&#44/g, ",");
					var ttooltip = entry[2].replace(/&#59/g, ";");
					ttooltip = ttooltip.replace(/&#44/g, ",");

					if (usehtml === 0) {
						ttitle = jQuery("<div>").html(ttitle).text();
						ttooltip = jQuery("<div>").html(ttooltip).text();
					}

					var iwmcode = entry[0];
					iwmcode = iwmcode.replace(/^\s+|\s+$/g, '');

					//we create an index, to use after with the setSelection functions
					dataindex[iwmcode] = i;


					//If data !== markers02
					if (displaymode !== "markers02" && displaymode !== "text02" && displaymode !== "customicon") {


						data[mapid].addRows([
							[{
								v: iwmcode,
								f: ttitle
							}, i, ttooltip]
						]);
						index = iwmcode;

					} else {

						var trim = entry[0].replace(/^\s+|\s+$/g, "");
						var latlon = trim.split(" ");
						var lat = parseFloat(latlon[0]);
						var lon = parseFloat(latlon[1]);


						//data[mapid].addRows([[lat,lon,ttitle,i,ttooltip]]);
						data[mapid].addRows([
							[lat, lon, ttitle, i, ttooltip]
						]);

						index = lat;


						//finally set dislay mode of markers02 to proper value
						//displaymode = "markers";

					}


					var colori = entry[4];

					values[mapid][index] = entry[3].replace(/&#59/g, ";");
					values[mapid][index] = values[mapid][index].replace(/&#44/g, ",");

					colorsmapecho = colorsmapecho + "'" + colori + "',";

					colorsmap.push(colori);

					//to colour the markers with an index colour and later replace it
					/*
					colorsmap.push(iwmconvert2color(colorcount));
					mapcolours[mapid][colorcount] = colori;

					colorcount++;
					*/

				}

				//add markers color json to map
				//jQuery("#map_canvas_" + iwmid).attr('data-markers-colors',JSON.stringify(mapcolours[mapid]));

				defmaxvalue = 0;
				if ((places.length - 2) > 0) {
					defmaxvalue = places.length - 2;
				}

				if (displaymode === "markers02") {
					displaymode = "markers";
				}
				if (displaymode === "customicon") {
					displaymode = "markers";
				}
				if (displaymode === "text02") {
					displaymode = "text";
				}

				var htmltooltip = false;
				if (usehtml === 1) {
					htmltooltip = true;
				}


				if (widthselector) {

					var wselector = jQuery(widthselector);
					if (wselector) {
						if (wselector.width() > 0) {

							width = wselector.width();
							height = '';

						}

					}

				}

				//in case there was a zoom event, we check the new sizes
				if (jQuery("#map_canvas_" + iwmid).attr('data-iwm-zwidth')) {

					width = jQuery("#map_canvas_" + iwmid).attr('data-iwm-zwidth');
					height = jQuery("#map_canvas_" + iwmid).attr('data-iwm-zheight');

				}

				var domain = '';
				if (region === 'IN' || region === 'world' || region === 'MM') {
					domain = 'IN';
				}


				var options = {
					projection: projection,
					backgroundColor: {
						fill: bgcolor,
						stroke: bordercolor,
						strokeWidth: stroke
					},
					colorAxis: {
						minValue: 0,
						maxValue: defmaxvalue,
						colors: colorsmap
					},
					legend: 'none',
					datalessRegionColor: incolor,
					displayMode: displaymode,
					enableRegionInteractivity: interactive,
					resolution: resolution,
					sizeAxis: {
						minValue: 1,
						maxValue: 1,
						minSize: markersize,
						maxSize: markersize
					},
					region: region,
					keepAspectRatio: ratio,
					width: width,
					height: height,
					magnifyingGlass: {
						enable: magglass,
						zoomFactor: magglasszfactor
					},
					tooltip: {
						trigger: toolt,
						isHtml: htmltooltip
					},
					domain: domain
				};



				var selector = document.querySelector(divselector);

				iwmObj.iwmgeocharts[mapid] = new google.visualization.GeoChart(selector);

				if (action !== "none") {

					google.visualization.events.addListener(iwmObj.iwmgeocharts[mapid], 'select', (function (x) {

						return function () {

                            console.log('map click action');

							var selection = iwmObj.iwmgeocharts[x].getSelection();

							if (selection.length === 1) {
								var selectedRow = selection[0].row;
								var selectedRegion = data[x].getValue(selectedRow, 0);


								if (values[x][selectedRegion] !== "") {
									iwm_run_action(selectedRow, selectedRegion, values[x][selectedRegion], identifier[x], listener_actions[x], listener_custom[x]);
									// iwm_clearSelection(x);
								}
							} else {
                                iwm_clearSelection(x);
                            }
						};
					})(mapid));

				}

				//set global variables
				iwmObj.iwmdata[mapid] = data[mapid];
				iwmObj.iwmoptions[mapid] = options;

				//test to order the entries
				//iwmObj.iwmdata[mapid].sort([{column: 3}]);

				iwmObj.iwmgeocharts[mapid].draw(iwmObj.iwmdata[mapid], options);

				//Create a new object for this map

				if (!iwmMapObj[mapid]) {

					iwmMapObj[mapid] = {
						div: jQuery('#' + divid),
						data: dataindex
					};

				}



				iwmMapObj[mapid].lastWidth = iwmMapObj[mapid].div.parent().width();

				google.visualization.events.addListener(iwmObj.iwmgeocharts[mapid], 'ready', function (mapid) {

					jQuery('.iwm_map_canvas svg').fadeIn(300);

					//to replace markers with custom icon
					jQuery('.iwm_map_canvas.iwm_custom_icon').each(function () {

						var markersize = jQuery(this).find('.i_world_map').attr('data-marker-size');
						var imageurl = jQuery(this).find('.i_world_map').attr('data-icon-url');
						var imageiconposition = jQuery(this).find('.i_world_map').attr('data-icon-position');
						var width = parseInt(markersize);

						//default center position
						var intwidth = -(parseInt(width, 10) / 2);
						var intheight = -(parseInt(width, 10) / 2);
						//top position
						if (imageiconposition === 'top') {
							intheight = -(parseInt(width, 10));
						}

						var transform = 'translate(' + intwidth + ',' + intheight + ')';

						var imageicon = document.createElementNS('http://www.w3.org/2000/svg', 'image');
						imageicon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageurl);
						imageicon.setAttribute('transform', transform);
						imageicon.setAttribute('height', width);
						imageicon.setAttribute('width', width);
						imageicon.setAttribute('preserve', 'xMaxYMax meet');
						imageicon.setAttribute('data-color', '');

						var thismap = jQuery(this).find('svg');
						thismap.find('circle').each(function () {

							var x = jQuery(this).attr('cx');
							var y = jQuery(this).attr('cy');
							var color = jQuery(this).attr('fill');

							jQuery(this).replaceWith(jQuery(imageicon).clone().attr('x', x).attr('y', y).attr('data-color', color));

						});

					});

					if (typeof iwm_callback === 'function') {
						iwm_callback();
					}


				});

			}
		}

	} else {
		console.log('API file not loaded yet');
	}

}


function iwm_run_action(row, selected, value, id, action, customaction) {

	var newid;
	var dropdown;

    console.log('map clicked');

	if (action === 'i_map_action_open_url') {
		document.location = value;
	}

	if (action === 'i_map_action_alert') {

		alert(value);
	}

	if (action === 'i_map_action_open_url_new') {

		window.open(value);
	}

	if (action === 'i_map_action_content_below' || action === 'i_map_action_content_above' || action === 'i_map_action_content_right_1_3' || action === 'i_map_action_content_right_1_4' || action === 'i_map_action_content_right_1_2') {

		newid = selected.toString();


		newid = newid.replace('-', '');
		newid = newid.replace('.', '');
		newid = newid.replace(' ', '');
		jQuery('#imap' + id + 'message > div').fadeOut('fast').promise().done(function () {
			jQuery('#map_' + id + '_message_' + newid).fadeIn('fast');
		});

		console.log(selected);

		//we check if there's a dropdown so we set selection to be the same as region clicked
		dropdown = document.getElementById('imap-dropdown-' + id);
		if (dropdown) {
			document.getElementById('imap' + id + '-' + newid).selected = true;
		}

	}

	if (action === 'i_map_action_content_below_scroll' || action === 'i_map_action_content_above_scroll') {

		newid = selected.toString();
		newid = newid.replace('-', '');
		newid = newid.replace('.', '');
		newid = newid.replace(' ', '');
		jQuery('#imap' + id + 'message > div').fadeOut('fast').promise().done(function () {
			jQuery('#map_' + id + '_message_' + newid).fadeIn('fast');
		});

		jQuery("html, body").animate({
			scrollTop: jQuery("#imap" + id + "message").offset().top - 50
		}, "slow");

		//we check if there's a dropdown so we set selection to be the same as region clicked
		dropdown = document.getElementById('imap-dropdown-' + id);
		if (dropdown) {
			document.getElementById('imap' + id + '-' + newid).selected = true;
		}

	}

	if (action === 'i_map_action_colorbox_content') {

		newid = selected.toString();
		newid = newid.replace('-', '');
		newid = newid.replace('.', '');
		newid = newid.replace(' ', '');

		jQuery.colorbox({
			//html: value,
			inline: true,
			href: '#map_' + id + '_message_' + newid,
			maxWidth: '80%',
			maxHeight: '80%',
			//width:'80%',
			onComplete: function () {
				jQuery.colorbox.resize();
			},
			onClosed: function () {
				iwm_clearSelection(id);
			}
		});

	}


	if (action === 'i_map_action_colorbox_iframe') {

		var winh = parseInt(jQuery(window).height(), 10) - 100;

		jQuery.colorbox({
			open: true,
			href: value,
			iframe: true,
			width: "80%",
			height: "80%",
			maxHeight: winh,
			onClosed: function () {
				iwm_clearSelection(id);
			}
		});

	}

	if (action === 'i_map_action_colorbox_image') {

		jQuery.colorbox({
			open: true,
			href: value,
			photo: true,
			maxWidth: '80%',
			maxHeight: '80%',
			onClosed: function () {
				iwm_clearSelection(id);
			}
		});

	}

	if (action === 'i_map_action_colorbox_inline') {

		var inline = jQuery(value);
		jQuery.colorbox({
			inline: true,
			href: inline,
			//width: '95%',
			//height: '95%',
			maxWidth: '95%',
			maxHeight: '95%',
			onClosed: function () {
				iwm_clearSelection(id);
			}
		});

	}

	if (action === 'i_map_action_custom') {

		var name = "iwm_custom_action_" + id;
		var selectedRegion = selected;
		window[name](value, selected);
	}
}


// Functions to set selection and remove selection.
// Can be used by externel elements to trigger the selection


function iwm_setSelection(code, map) {

	map = map || false;

	if (map) {

		//console.log(iwmMapObj[map]);

		var index = iwmMapObj[map].data[code];
		iwmObj.iwmgeocharts[map].setSelection([{
			row: index,
			column: null
		}]);

	}



}

function iwm_clearSelection(map) {
	map = map || false;
	if (map) {

		iwmObj.iwmgeocharts[map].setSelection(null);

        // if there are messages, reset
        var message = jQuery('#imap' + map + 'message');
        if(message){
            message.find('> div').each(function(){
                jQuery(this).fadeOut('fast');
            });
        }
	}
}

function iwm_select(code, map) {

	map = map || '0';
	var index = iwmMapObj[map].data[code];
	iwmObj.iwmgeocharts[map].setSelection([{
		row: index,
		column: null
	}]);
	google.visualization.events.trigger(iwmObj.iwmgeocharts[map], 'select', {});

}


function iwm_zoom(unique_id, id, position, overlay) {

	overlay = overlay || false;
	var thisMap = jQuery('#unique_iwm_' + unique_id + ' #map_canvas_' + id);
	var container;
	//init panzoom script
	if (overlay && overlay !== id) {

		jQuery('.iwm_map_overlay #unique_iwm_' + unique_id + ', .iwm_map_overlay #unique_iwm_' + unique_id + ' + div').wrapAll('<div style="overflow:hidden;" id="iwm_pan_wrapper_' + id + '" />').wrapAll('<div id="iwm_pan_container_' + id + '" />');
		container = jQuery('#iwm_pan_container_' + id);

		container.wrap('<div id="iwm_control_' + id + '" />');
		jQuery('#iwm_control_' + id).prepend('<div data-step="0" id="iwm-controls-' + id + '" class="iwm-controls iwm-controls-' + position + '"></div>');
		//container.parent().parent().prepend('<div id="iwm-controls-'+id+'" class="iwm-controls iwm-controls-'+position+'"></div>');

		//thisMap = container;

		container.panzoom({
			disableZoom: false,
			contain: 'invert',
			cursor: "default",
		});

		container.mousedown(function () {
			jQuery(this).css('cursor', 'move');
		});
		container.mouseup(function () {
			jQuery(this).css('cursor', 'pointer');
		});



	}

	if (!overlay) {

		thisMap.parent().prepend('<div data-step="0" id="iwm-controls-' + id + '" class="iwm-controls iwm-controls-' + position + '"></div>');

		thisMap.panzoom({
			disableZoom: true,
			contain: 'invert',
			cursor: "default",
		});


		thisMap.mousedown(function () {
			jQuery(this).css('cursor', 'move');
		});
		thisMap.mouseup(function () {
			jQuery(this).css('cursor', 'pointer');
		});

	}

	if (id !== overlay) {

		jQuery('#iwm-controls-' + id).append(function () {

			return jQuery('<div class="iwm-controls-zoom-in">+</div>').click(function () {

				var controlparent = jQuery(this).parent();
				var cur_click = parseInt(controlparent.attr('data-step'), 10);
				var map = thisMap;
				var newleft;
				var newtop;
				var cleft;
				var ctop;
				var matrix;
				var transform;

				if (parseInt(map.width(), 10) <= 6000) {

					controlparent.attr('data-step', cur_click + 1);

					var step = (parseInt(map.width(), 10) * 0.3);

					var newh = (parseInt(map.height()) / parseInt(map.width(), 10)) * (parseInt(map.width(), 10) + step);
					var neww = parseInt(map.width(), 10) + step;

					//console.log(neww);

					//we also calculate margins, so the zoom is central
					var extrah = parseInt(newh, 10) - parseInt(map.height(), 10);
					var extraw = parseInt(neww, 10) - parseInt(map.width(), 10);


					if (!overlay) {

						//we get the transform values and not the margins, so it works with the pan script
						transform = map.css('transform');
						matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');

						if (matrix[5] === null) {
							matrix[5] = 0;
							matrix[4] = 0;
						}

						ctop = parseInt(matrix[5], 10);
						cleft = parseInt(matrix[4], 10);

						newtop = ctop - (extrah / 2);
						newleft = cleft - (extraw / 2);

						//apply data
						map.height(newh).width(neww);
						map.attr('data-iwm-zwidth', neww).attr('data-iwm-zheight', newh);

						map.css('transform', 'matrix(1, 0, 0, 1,' + newleft + ',' + newtop + ')');

						iwmObj.iwmoptions[id].width = neww;
						iwmObj.iwmoptions[id].height = newh;
						iwmObj.iwmgeocharts[id].draw(iwmObj.iwmdata[id], iwmObj.iwmoptions[id]);

						thisMap.panzoom('resetDimensions');

					}


					//to apply zoom to overlay map container instead
					if (overlay) {

						transform = container.css('transform');
						matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');

						if (matrix[5] === null) {
							matrix[5] = 0;
							matrix[4] = 0;
						}

						ctop = parseInt(matrix[5], 10);
						cleft = parseInt(matrix[4], 10);

						newtop = ctop - (extrah / 2);
						newleft = cleft - (extraw / 2);

						container.height(newh).width(neww);
						container.css('transform', 'matrix(1, 0, 0, 1,' + newleft + ',' + newtop + ')');

						iwmObj.iwmoptions[id].width = neww;
						iwmObj.iwmoptions[id].height = newh;
						iwmObj.iwmgeocharts[id].draw(iwmObj.iwmdata[id], iwmObj.iwmoptions[id]);
						iwmObj.iwmoptions[overlay].width = neww;
						iwmObj.iwmoptions[overlay].height = newh;
						iwmObj.iwmgeocharts[overlay].draw(iwmObj.iwmdata[overlay], iwmObj.iwmoptions[overlay]);
						container.panzoom('resetDimensions');
					}

				} else {

					//what to do if zoom limit was reached

				}



			});

		}).append(function () {

			return jQuery('<div class="iwm-controls-zoom-out">-</div>').click(function () {

				controlparent = jQuery(this).parent();
				cur_click = parseInt(controlparent.attr('data-step'), 10);
				var parentw;
				var parenth;
				var transform;

				if (cur_click > 0) {



					map = thisMap;

					var prevw = (10 * parseInt(map.width())) / 13;
					var step = parseInt(map.width(), 10) - prevw;
					var neww = prevw;

					//console.log(neww);

					if (!overlay) {

						parentw = parseInt(map.parent().parent().width(), 10);
						parenth = parseInt(map.parent().parent().height(), 10);

					}

					if (overlay) {

						parentw = parseInt(container.parent().width(), 10);
						parenth = parseInt(container.parent().height(), 10);

					}


					//if (cur_click >0 ) {

					newh = (parseInt(map.height(), 10) / parseInt(map.width(), 10)) * (parseInt(map.width(), 10) - step);

					//we also set the margins, so the zoom is central
					var extrah = parseInt(map.height(), 10) - parseInt(newh, 10);
					var extraw = parseInt(map.width(), 10) - parseInt(neww, 10);

					if (overlay) {

						transform = container.css('transform');

					}

					if (!overlay) {

						transform = map.css('transform');

					}


					var matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');

					var ctop = parseInt(matrix[5], 10);
					var cleft = parseInt(matrix[4], 10);

					var newtop = ctop + (extrah / 2);
					var newleft = cleft + (extraw / 2);

					//not to let map leave parent container
					if (newleft > 0) {
						newleft = 0;
					}
					if (newtop > 0) {
						newtop = 0;
					}

					var maxh = newh - parenth;
					maxh = maxh - (maxh) * 2;
					if (newtop < maxh) {
						newtop = maxh;
					}

					var maxw = neww - parentw;
					maxw = maxw - (maxw) * 2;
					if (newleft < maxw) {
						newleft = maxw;
					}

					if (!overlay) {

						map.height(newh);
						map.width(neww);
						map.attr('data-iwm-zwidth', neww).attr('data-iwm-zheight', newh);
						map.css('transform', 'matrix(1, 0, 0, 1,' + newleft + ',' + newtop + ')');


						iwmObj.iwmoptions[id].width = neww;
						iwmObj.iwmoptions[id].height = newh;
						iwmObj.iwmgeocharts[id].draw(iwmObj.iwmdata[id], iwmObj.iwmoptions[id]);

						thisMap.panzoom('resetDimensions');

						controlparent.attr('data-step', cur_click - 1);


					}


					//to apply zoom to overlay map
					if (overlay) {

						container.height(newh);
						container.width(neww);
						container.attr('data-iwm-zwidth', neww).attr('data-iwm-zheight', newh);
						container.css('transform', 'matrix(1, 0, 0, 1,' + newleft + ',' + newtop + ')');

						iwmObj.iwmoptions[id].width = neww;
						iwmObj.iwmoptions[id].height = newh;
						iwmObj.iwmgeocharts[id].draw(iwmObj.iwmdata[id], iwmObj.iwmoptions[id]);

						iwmObj.iwmoptions[overlay].width = neww;
						iwmObj.iwmoptions[overlay].height = newh;
						iwmObj.iwmgeocharts[overlay].draw(iwmObj.iwmdata[overlay], iwmObj.iwmoptions[overlay]);
						container.panzoom('resetDimensions');

						controlparent.attr('data-step', cur_click - 1);


					}

					//}

				}

			});

		});

	}

}

//simple sort function. We use it in the connect marker function
function iwm_sortNumber(a, b) {
	return a - b;
}

function iwmconvert2color(colorstring) {
	var color = '00000' + colorstring.toString();
	color = color.slice(-6);
	return '#' + color;
}