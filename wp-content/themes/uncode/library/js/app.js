/* ----------------------------------------------------------
 * Uncode App
 * ---------------------------------------------------------- */

(function($) {
	"use strict";
	var UNCODE = window.UNCODE || {};
	window.UNCODE = UNCODE;

	window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame	   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame	||
			window.oRequestAnimationFrame	  ||
			window.msRequestAnimationFrame	 ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

window.requestTimeout = function(fn, delay) {
	if( !window.requestAnimationFrame	  	&&
		!window.webkitRequestAnimationFrame &&
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame	  &&
		!window.msRequestAnimationFrame)
			return window.setTimeout(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop(){
		var current = new Date().getTime(),
			delta = current - start;

		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
};

window.clearRequestTimeout = function(handle) {
	if ( typeof handle !== 'undefined' ) {
		window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
		window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
		window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
		window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
		window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
		window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
		clearTimeout(handle);
	}
};

UNCODE.betterResize = function() {
	var setResize,
		doubleResize = true,
		oldW = UNCODE.wwidth;
	$(window).on( 'resize orientationchange', function(){
		if ( oldW === UNCODE.wwidth ) {
			return;
		} else {
			oldW = UNCODE.wwidth;
			$(window).trigger('wwResize');
		}
	});
};

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

UNCODE.utils = function() {
	$(document).on('mouseover', 'a', function() {
		$(this).attr('data-title', $(this).attr('title'));
		$(this).removeAttr('title');
	});
	$(document).on('mouseout', 'a', function() {
		$(this).attr('title', $(this).attr('data-title'));
		$(this).removeAttr('data-title');
	});

	this.get_scroll_offset = function(e) {

		var scroll_offset = 0,
			target,
			trigger;

		if ( Number.isInteger(e) !== true && typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.currentTarget !== 'undefined' ) {
			target = e.target;
			trigger = e.currentTarget;
		}

		if ($('.menu-hide').length || $('.menu-hide-vertical').length) {
			if (UNCODE.bodyTop > UNCODE.wheight / 2) {
				UNCODE.hideMenu(100);
			}
		}

		if ( ! $('body').hasClass('vmenu') || UNCODE.wwidth < UNCODE.mediaQuery  ) {
			// if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) ) {
			if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) ) {
				if ( ( $('.menu-sticky').length && !$('.menu-hide').length && !UNCODE.isMobile ) || ( $('.menu-sticky-mobile').length && UNCODE.isMobile ) ) {
					if ( !$('.menu-hided').length ) {
						scroll_offset += $('.logo-container:visible').outerHeight();
					}
				} else if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length ) {
					var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;
					scroll_offset += $('.menu-sticky .menu-container').outerHeight() - ( $('.navbar-brand').data('minheight') + shrink );
				} else {
					if ( ($('.menu-sticky').length && !$('.menu-hide').length) || ($('.menu-sticky-vertical').length && !$('.menu-hide-vertical').length) ) {
						scroll_offset += UNCODE.menuMobileHeight;
					} else {
						if ( typeof target !== 'undefined' && target.closest('.main-menu-container') != null && UNCODE.wwidth < UNCODE.mediaQuery && ! $('body').hasClass('vmenu') && ! $('body').hasClass('menu-mobile-transparent') && ! $('.menu-sticky').length ) {
							scroll_offset += $('.main-menu-container > div:first-child()').height() - 2;
						} else {
							if ( $(trigger)[0] !== $(document)[0] && $(trigger).length && typeof $(trigger).offset() !== 'undefined' && window.scrollY > ($(trigger).offset().top + UNCODE.menuMobileHeight) ) {
								scroll_offset += UNCODE.menuMobileHeight;
							}
						}
					}
				}
			}
	
		}

		scroll_offset += UNCODE.bodyBorder;

		return scroll_offset;
	}

	if ( !UNCODE.isFullPage ) {
		$(document).on('click', 'a[href*="#"]:not(.woocommerce-review-link):not(.one-dot-link)', function(e) {

			var hash = (e.currentTarget).hash,
			is_scrolltop = $(e.currentTarget).hasClass('scroll-top') ? true : false,
			anchor = '';
			if ($(e.currentTarget).data('toggle') == 'tab' || $(e.currentTarget).data('toggle') == 'collapse') return;
			if ($(e.currentTarget).hasClass('woocommerce-review-link') && $('.wootabs .tab-content').length) {
				e.preventDefault();
				if (!$('#tab-reviews').is(':visible')) {
					$('a[href="#tab-reviews"]').trigger('click');
				}
				var calc_scroll = $('.wootabs .tab-content').offset().top;
				calc_scroll -= UNCODE.get_scroll_offset(e);

				if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) ) {
					var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;

					if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
						scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
					}
				}

				var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
					delta = bodyTop - calc_scroll,
					scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
				if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

				requestTimeout(function(){
					if (scrollSpeed == 0) {
						$('html, body').scrollTop(calc_scroll);
						UNCODE.scrolling = false;
					} else {
   						$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
							$(this).stop();
						}).animate({
								scrollTop: calc_scroll
							}, scrollSpeed, 'easeInOutCubic', function() {
								$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
								UNCODE.scrolling = false;
							}
						);
					}
				}, 200);
				return;
			}
			if (hash != undefined) {
				var specialFormat = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
				var anchor = this.hash.slice(1);
				if ( !specialFormat.test(hash) && location.pathname.replace(/^\//g,'') == this.pathname.replace(/^\//g,'') && location.hostname == this.hostname) {
			  		if ( !specialFormat.test(hash) ) {
			  			if ( $(hash).length )
			  				anchor = $(hash);
			  		}
				}
			}

			if (is_scrolltop || anchor != '') {
				if (is_scrolltop) {
					e.preventDefault();
					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
					scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(bodyTop) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if (scrollSpeed == 0) {
						$('html, body').scrollTop(0);
						UNCODE.scrolling = false;
					} else {
   						$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
							$(this).stop();
						}).animate({
							scrollTop: 0
						}, scrollSpeed, 'easeInOutCubic', function() {
							$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
							UNCODE.scrolling = false;
						});
					}
				} else {
					var scrollSection = (typeof anchor === 'string') ? $('[data-name="' + anchor + '"]') : anchor;
					$.each($('.menu-container .menu-item > a, .widget_nav_menu .menu-smart .menu-item > a'), function(index, val) {
						var get_href = $(val).attr('href');
						if (get_href != undefined) {
							if (get_href.substring(get_href.indexOf('#')+1) == anchor) $(val).parent().addClass('active');
							else $(val).parent().removeClass('active');
						}
					});
					if (scrollSection.length) {
						if ( $('body').hasClass('uncode-scroll-no-history') ) {
							e.preventDefault();
						}

						if (UNCODE.menuOpened) {
							if (UNCODE.wwidth < UNCODE.mediaQuery) {
								window.dispatchEvent(UNCODE.menuMobileTriggerEvent);
							} else {
								$('.mmb-container-overlay .overlay-close').trigger('click');
								$('.mmb-container .trigger-overlay.close')[0].dispatchEvent(new Event("click"));;
							}
						}

						var calc_scroll = scrollSection.offset().top,
							getOffset = UNCODE.get_scroll_offset(e),
							$logo = $('.logo-container:visible'),
							logoH,
							$menu = $('#masthead .menu-container'),
							menuH;

						calc_scroll -= isNaN(getOffset) ? 0 : getOffset;

						var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
							delta = bodyTop - calc_scroll,
							scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
						if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

						if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) ) {
							if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length && ! $('body').hasClass('vmenu') && UNCODE.wwidth > UNCODE.mediaQuery ) {
								logoH = $logo.outerHeight(),
								menuH = $menu.outerHeight();
								if ( calc_scroll < ( logoH + menuH ) ) {
									calc_scroll = 0;
								}
							}
						}


						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
						} else {
	   						$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
								$(this).stop();
							}).animate({
								scrollTop: (delta > 0) ? calc_scroll - 0.1 : calc_scroll
							}, scrollSpeed, 'easeInOutCubic', function() {
								$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
								UNCODE.scrolling = false;
								if  ( ( getOffset != UNCODE.get_scroll_offset(e) && !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) )
								||
								$('.menu-hided').length ) {
									calc_scroll = scrollSection.offset().top;
									getOffset = UNCODE.get_scroll_offset(e);
									calc_scroll -= getOffset;
									$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
										$(this).stop();
									}).animate({
										scrollTop: (delta > 0) ? calc_scroll - 0.1 : calc_scroll
										}, scrollSpeed, 'easeInOutCubic', function() {
											$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
											UNCODE.scrolling = false;
										}
									);
								}
							});
						}
					}
				}
			}
		});
		$('.header-scrolldown').on('click', function(event) {

			event.preventDefault();

			var pageHeader = $(event.target).closest('#page-header'),
				pageHeaderTop = pageHeader.offset().top,
				pageHeaderHeight = pageHeader.outerHeight(),
				scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(pageHeaderTop + pageHeaderHeight) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
			if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

			var calc_scroll = pageHeaderTop + pageHeaderHeight,
			getOffset = UNCODE.get_scroll_offset(event);
			calc_scroll -= getOffset;

			if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) ) {
				var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;

				if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
					scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
				}
			}

			if (scrollSpeed == 0) {
				$('html, body').scrollTop(calc_scroll);
				UNCODE.scrolling = false;
			} else {
					$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
						$(this).stop();
					}).animate({
						scrollTop: calc_scroll
					}, scrollSpeed, 'easeInOutCubic', function() {
						$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
						UNCODE.scrolling = false;
						if (getOffset != UNCODE.get_scroll_offset(event) || $('.menu-hided').length) {
							calc_scroll = pageHeaderTop + pageHeaderHeight;
							getOffset = UNCODE.get_scroll_offset(event);
							calc_scroll -= getOffset;
								$('html, body').on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
									$(this).stop();
								}).animate({
									scrollTop: calc_scroll
								}, scrollSpeed, 'easeInOutCubic', function() {
									$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
									UNCODE.scrolling = false;
								}
							);
						}
					}
				);
			}
		});
	}

	// Colomun hover effect
	// =================
	$(document).on('mouseenter', '.col-link', function(e) {
		var uncol = $(e.target).prev('.uncol'),
		el = uncol.find('.column-background');
		if (el) {
			$('.btn-container .btn', uncol).toggleClass('active');
			var elOverlay = $(el[0]).find('.block-bg-overlay');
			if (elOverlay.length) {
				var getOpacity = $(elOverlay).css('opacity');
				if (getOpacity != 1) {
					getOpacity = Math.round(getOpacity * 100) / 100;
					var newOpacity = getOpacity + .1;
					$(elOverlay).data('data-opacity', getOpacity);
					$(elOverlay).css('opacity', newOpacity);
				}
			}
		}
	}).on('mouseleave', '.col-link', function(e) {
		var uncol = $(e.target).prev('.uncol'),
		el = uncol.find('.column-background');
		$('.btn-container .btn', uncol).toggleClass('active');
		if (el) {
			var elOverlay = $(el[0]).find('.block-bg-overlay');
			if (elOverlay.length) {
				var getOpacity = $(elOverlay).data('data-opacity');
				$(elOverlay).css('opacity', getOpacity);
			}
		}
	});

	// Admin bar
	// ============
	var fixAdminBar = function() {
		if ($('html').hasClass('admin-mode') && !SiteParameters.is_frontend_editor ) {
			var getAdminBar = $('#wpadminbar');
			if (getAdminBar.length) {
				if (getAdminBar.css('position') !== 'hidden') {
					var getAdminBarHeight = getAdminBar.height();
					if (getAdminBar.css('position') === 'fixed') {
						$('html').css({'margin-top':getAdminBarHeight + 'px','padding-top': UNCODE.bodyBorder+'px'});
						$('.body-borders .top-border').css({'margin-top':getAdminBarHeight+'px'});
					} else {
						$('html').css({'padding-top':UNCODE.bodyBorder + 'px','margin-top':'0px'});
						$('.body-borders .top-border').css({'margin-top':'0px'});
					}
				}
			}
		}
	};
	window.addEventListener('load', fixAdminBar);
	window.addEventListener('resize', fixAdminBar);
	// Print
	// ===========
	var beforePrint = function() {
		window.dispatchEvent(new CustomEvent('resize'));
		window.dispatchEvent(UNCODE.boxEvent);
	};

	if (window.matchMedia) {
		var mediaQueryList = window.matchMedia('print');
		mediaQueryList.addListener(function(mql) {
			if (mql.matches) {
				beforePrint();
			}
		});
	}

	window.onbeforeprint = beforePrint;

	// Safari srcset
	var safariSrcSet = function(){
		if ( !SiteParameters.is_frontend_editor ) {
			$('html.safari img[sizes]').each(function(){
				var $img = $(this),
					sizeImg = parseInt($img.attr('sizes'));
				if ( typeof(sizeImg) === 'number' ) {
					$img.attr('sizes', (sizeImg) + 'px');
				}
			});
		}
	};
	window.addEventListener('load', safariSrcSet);
}

UNCODE.lettering = function() {

	var setCTA;
	var highlightStill = function(){

		var $heading_texts = $('.heading-text:not(.animate_inner_when_almost_visible)');

		$.each($heading_texts, function(key, el) {
			var $heading = $(el);

			if ( ! $('.heading-text-highlight-inner[data-animated="yes"]', $heading).length ) {
				return;
			}

			if (UNCODE.isUnmodalOpen && !el.closest('#unmodal-content')) {
				return;
			}

			var waypoint = new Waypoint({
				context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
				element: el,
				handler: function() {
					var $anims = $('.heading-text-highlight-inner[data-animated="yes"]', this.element),
						anims_l = $anims.length;
					$anims.each(function(_key_, _el_){
						var $anim = $(_el_);

						if ( ! $anim.hasClass('heading-text-highlight-animated') ) {
							$anim.addClass('heading-text-highlight-animated');

							if ( $heading.data('animate') === true ) {
								$anim.css({
									'-webkit-transition-duration': '0ms',
									'-moz-transition-duration': '0ms',
									'-o-transition-duration': '0ms',
									'transition-duration': '0ms',
								});
							} else {
								$anim.css({
									'-webkit-transition-delay': ((_key_ + 2) * 200) + 'ms',
									'-moz-transition-delay': ((_key_ + 2) * 200) + 'ms',
									'-o-transition-delay': ((_key_ + 2) * 200) + 'ms',
									'transition-delay': ((_key_ + 2) * 200) + 'ms',
								});
							}
						}

					});
					$anims.last().one('webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd transitionEnd', function(e) {
						$heading.data('animate', true);
					});
					$anims.removeAttr('data-animated');
				},
				offset: '100%'
			});

		});

		Waypoint.refreshAll();
		$( document.body ).trigger('uncode_waypoints');

	}

	requestTimeout(function(){
		highlightStill();
		$(window).on( 'resize', function(){
			clearRequestTimeout(setCTA);
			setCTA = requestTimeout( highlightStill, 100 );
		});
	}, 400);

};

UNCODE.isUnmodalOpen = false;

var manageVideoSize = function(){

	var setVideoFit;
	$('.wp-block-embed').each(function(){

		var $this = $(this);

		if ( $('iframe', $this).length ) {

			var $iframe = $('> iframe, > a > iframe', $this),
				w = parseFloat($iframe.attr('width')),
				h = parseFloat($iframe.attr('height')),
				url = $iframe.attr('src'),
				ratio, frW;

			if ( typeof url != 'undefined' && url.indexOf('soundcloud') == -1 && h !== 0  ) {

				ratio = h / w;
				var setResizeiFto,
					resizeiFrame = function(){
					frW = $iframe.width();
					$iframe.css({
						height: frW * ratio
					});
				};
				resizeiFrame();
				$(window).on( 'resize load', function(){
					clearRequestTimeout(setResizeiFto);
					setResizeiFto = requestTimeout( function() {
						resizeiFrame();
					}, 10 );
				});

			}

		}

	});

};

manageVideoSize();

UNCODE.vivus = function(icon, time, delay, file) {
	if (typeof Vivus !== 'undefined') {
		var icon_options = {
			type: 'delayed',
			pathTimingFunction: Vivus.EASE_OUT,
			animTimingFunction: Vivus.LINEAR,
			duration: time,
		}

		if (delay) {
			icon_options.delayStart = delay;
		}

		if (file) {
			icon_options.file = file;
		}

		new Vivus(icon, icon_options);
	}
};

UNCODE.lastURL = '';

UNCODE.getURLParams = function(current_location, is_string) {
	var params = {};
	if (is_string) {
		var url = current_location.split('?')[1];
	} else {
		var url = current_location.search;
		url = url.substring(1);
	}
	if (url) {
		var parts = url.split('&');
		for (var i = 0; i < parts.length; i++) {
			var nv = parts[i].split('=');
			if (!nv[0]) {
				continue;
			}
			params[nv[0]] = nv[1] || true;
		}
	}
	return params;
}

UNCODE.hasEqualURLParams = function(obj1, obj2) {
	for (var i in obj1) {
		if (obj1.hasOwnProperty(i)) {
			if (!obj2.hasOwnProperty(i)) {
				return false;
			}
			if (obj1[i] != obj2[i]) {
				return false;
			}
		}
	}
	for (var i in obj2) {
		if (obj2.hasOwnProperty(i)) {
			if (!obj1.hasOwnProperty(i)) {
				return false;
			}
			if (obj1[i] != obj2[i]) {
				return false;
			}
		}
	}
    return true;
}

UNCODE.changeSkinOnScroll = function(){
	if ( UNCODE.isFullPage && ! UNCODE.isFullPageSnap ) {
		return;
	}
	var $masthead = $('#masthead'),
		transDesktop,
		transMobile,
		changeSkin,

	checkTransparencyAndChange = function( $col ){
		transDesktop = $masthead.hasClass('menu-desktop-transparent') && UNCODE.wwidth >= UNCODE.mediaQuery;
		transMobile = $masthead.hasClass('menu-mobile-transparent') && UNCODE.wwidth < UNCODE.mediaQuery;
		changeSkin = $masthead.hasClass('menu-change-skin');

		if ( ! transDesktop && ! transMobile ) {
			return false;
		}

		if ( ! changeSkin ) {
			return false;
		}

		if ( $col.hasClass('style-light') ){
			$masthead.removeClass('style-dark-override').addClass('style-light-override');
			return false;
		} else if ( $col.hasClass('style-dark') ) {
			$masthead.removeClass('style-light-override').addClass('style-dark-override');
			return false;
		}
	};

	var prev_row = 'normal',
		odd = true,
		$rows = $('.vc_row[data-parent]:visible');
	$.each($rows, function(index, row){
		var $row = $(row),
			$col = $('.uncol', $row).first(),
			$slider = $('.uncode-slider', $row);

		var wayDown = new Waypoint({
			context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
			element: row,
			handler: function(direction) {
				if ( direction == 'down' && ( prev_row !== 'normal' || !row.hasAttribute('data-bg-changer') ) ) {
					if ( $slider.length ) {
						$col = $('.owl-item.index-active .uncol', $slider).first();
					}
					checkTransparencyAndChange($col);
				}
				if ( odd === false ) {
					if ( row.hasAttribute('data-bg-changer') ) {
						prev_row = 'bg-changer';
					} else {
						prev_row = 'normal';
					}
					odd = true;
				} else {
					odd = false;
				}
			},
			offset: function() {
				return UNCODE.menuHeight / 2
			}
		});
		var wayUp = new Waypoint({
			context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
			element: row,
			handler: function(direction) {
				if ( direction == 'up' && ( prev_row !== 'normal' || !row.hasAttribute('data-bg-changer') ) ) {
					if ( $slider.length ) {
						$col = $('.owl-item.index-active .uncol', $slider).first();
					}
					checkTransparencyAndChange($col);
				}
				if ( odd === false ) {
					if ( row.hasAttribute('data-bg-changer') ) {
						prev_row = 'bg-changer';
					} else {
						prev_row = 'normal';
					}
					odd = true;
				} else {
					odd = false;
				}
			},
			offset: function() {
				return -row.clientHeight + ( UNCODE.menuHeight / 2 )
			}
		});
	});

};

UNCODE.share = function() {
	if (typeof Share !== 'undefined') {
		var share_button_element = $('.share-button');
		var share_button_url = share_button_element.data('url');

		var share_button_config = {
			ui: {
				flyout: "top center",
				button_font: false,
				button_text: '',
				icon_font: false
			}
		};

		if (share_button_url) {
			share_button_config.url = share_button_url.replace("&", "%26");
		}

		var share_button_top = new Share('.share-button', share_button_config);
	}
};

UNCODE.tooltip = function() {
	if (typeof jQuery.fn.tooltip !== 'undefined') {
		$('.btn-tooltip').tooltip();
	}
};

UNCODE.counters = function() {
	var $counters = $('.uncode-counter:not(.counter-init)');
	$counters.each(function(){
		var $counter = $(this).addClass('counter-init');
		if ( $counter.closest( '.owl-carousel' ).length ) {
			return;
		}
		$counter.addClass('started').counterUp({
			delay: 10,
			time: 1500
		});
	});
};

UNCODE.countdowns = function() {
	var $countdowns = $('[data-uncode-countdown]:not(.counter-init)');
	$countdowns.each(function() {
		var $this = $(this).addClass('counter-init'),
			finalDate = $(this).data('uncode-countdown');
		$this.countdown(finalDate, function(event) {
			$this.html(event.strftime('%D <small>' + SiteParameters.days + '</small> %H <small>' + SiteParameters.hours + '</small> %M <small>' + SiteParameters.minutes + '</small> %S <small>' + SiteParameters.seconds + '</small>'));
		});
	});
};

UNCODE.tabs = function() {
	$(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
		e.preventDefault()
		$(this).tab('show');
		requestTimeout(function() {
			window.dispatchEvent(UNCODE.boxEvent);
			$(window).trigger('uncode.re-layout');
		}, 300);
	});
};

UNCODE.collapse = function() {
	$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
		var $this = $(this),
			href
		var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
		var $target = $(target)
		var data = $target.data('bs.collapse')
		var option = data ? 'toggle' : $this.data()
		var parent = $this.attr('data-parent')
		var $parent = parent && $(parent)
		var $title = $(this).parent()
		if ($parent) {
			$parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
			if ($title.hasClass('active')) {
				$title.removeClass('active');
			} else {
				$parent.find('.panel-title').removeClass('active')
				$title[!$target.hasClass('in') ? 'addClass' : 'removeClass']('active')
			}
		}
		$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
		requestTimeout(function() {
			$(window).trigger('uncode.re-layout');
		}, 500);
	});
};

UNCODE.bigText = function(el) {
	if (el == undefined) {
		el = $('body');
	}
	$.each($('.bigtext', el), function(index, val) {
		$(val).bigtext({
			minfontsize: 24
		});
		if (!$(val).parent().hasClass('blocks-animation') && !$(val).hasClass('animate_when_almost_visible')) $(val).css({
			opacity: 1
		});
		requestTimeout(function() {
			if ($(val).find('.animate_when_almost_visible').length != 0) {
				$(val).css({opacity: 1});
			}
		}, 400);
	});
};

UNCODE.process_shortpixel_image = function(image) {
	var data = {
		action: 'shortpixel_manual_optimization',
		image_id: image,
		cleanup: true
	};

	$.get(SiteParameters.ajax_url, data);
};

UNCODE.menuSystem = function() {

	function menuMobile() {
		var $body = $('body'),
			$mobileToggleButton = $('.mobile-menu-button'),
			$masthead = $('#masthead'),
			$box,
			$el,
			$el_transp,
			elHeight,
			check,
			animating = false,
			stickyMobile = false,
			menuClose = new CustomEvent('menuMobileClose'),
			menuOpen = new CustomEvent('menuMobileOpen');
		UNCODE.menuOpened = false;
		$mobileToggleButton.on('click', function(event) {
			var btn = this;
			if ($(btn).hasClass('overlay-close')) return;
			event.preventDefault();
			$('.overlay-search.open .menu-close-dd', $masthead).trigger('click');
			if (UNCODE.wwidth <= UNCODE.mediaQuery) {
				$box = $(this).closest('.box-container').find('.main-menu-container');
				$el = $(this).closest('.box-container').find('.menu-horizontal-inner:not(.row-brand), .menu-sidebar-inner');
				$el_transp = $('.menu-absolute.menu-transparent');
				if (UNCODE.isMobile) {
					if ( $('.menu-wrapper.menu-sticky, .menu-wrapper.menu-hide-only, .main-header .menu-sticky-vertical, .main-header .menu-hide-only-vertical, .menu-mobile-centered, .menu-sticky-mobile').length ) {
						stickyMobile = true;
						elHeight = window.innerHeight - UNCODE.menuMobileHeight - (UNCODE.bodyBorder * 2) - UNCODE.adminBarHeight + 1;
					} else {
						elHeight = 0;
						$.each($box.find('> div'), function(index, val) {
							elHeight += $(val).outerHeight();
						});
					}
				} else {
					elHeight = 0;
					$.each($el, function(index, val) {
						elHeight += $(val).outerHeight();
					});
				}
				var open = function() {
					if (!animating) {
						$body.addClass('open-overlay-menu').addClass('opening-overlay-menu');
						window.dispatchEvent(menuOpen);
						animating = true;
						UNCODE.menuOpened = true;
						if ($('body[class*="vmenu-"], body.hmenu-center').length && ($('.menu-hide, .menu-sticky, .menu-transparent').length)) {			
							if ( $body.hasClass('menu-sticky-mobile') || $('#masthead.menu-transparent').length ) {
								$('.main-header > .vmenu-container').css({position:'fixed', top: ($('.menu-container').outerHeight() + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
							}
							if ($('body.menu-offcanvas').length) {
								$('.menu-container:not(.sticky-element):not(.grid-filters)').css({position:'fixed'});
								$('.vmenu-container.menu-container:not(.sticky-element):not(.grid-filters)').css({position:'fixed', top: (UNCODE.menuMobileHeight + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
							} else {
								if ( $('.menu-hide, .menu-sticky').length ) {
									if ( UNCODE.wwidth >= 960 && $('.menu-sticky').length  ) {
										$('.menu-container:not(.sticky-element):not(.grid-filters)').css({position:'fixed'});
									}
								}
							}
						}
						if ($('body.hmenu-center').length && ( (!UNCODE.isMobile && $('.menu-hide, .menu-sticky').length) || (UNCODE.isMobile && $('.menu-hide, .menu-sticky-mobile').length) )) {
							$("#masthead")[0].scrollIntoView();
							$('.menu-container:not(.sticky-element):not(.grid-filters)').css({position:'fixed', top: (UNCODE.menuMobileHeight + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
						}
						btn.classList.add('close');
						$box.addClass('open-items');
						if ($el_transp.length && $('body.menu-mobile-transparent').length) {
							$el_transp.addClass('is_mobile_open');
						}
						$box.animate({
							height: elHeight
						}, 600, "easeInOutCirc", function() {
							animating = false;
							if (!stickyMobile) $box.css('height', 'auto');
						});
					}
				};

				var close = function() {
					if (!animating) {
						window.dispatchEvent(menuClose);
						animating = true;
						UNCODE.menuOpened = false;
						btn.classList.remove('close');
						btn.classList.add('closing');
						$box.addClass('close');
						requestTimeout(function() {
							$box.removeClass('close');
							$box.removeClass('open-items');
							btn.classList.remove('closing');
							if ($el_transp.length) {
								$el_transp.removeClass('is_mobile_open');
							}
						}, 500);
						$body.removeClass('opening-overlay-menu');
						$box.animate({
							height: 0
						}, {
							duration: 600,
							easing: "easeInOutCirc",
							complete: function(elements) {
								$(elements).css('height', '');
								animating = false;
								if ($('body[class*="vmenu-"]').length && UNCODE.wwidth >= 960) {
									$('.main-header > .vmenu-container').add('.menu-container:not(.sticky-element):not(.grid-filters)').css('position','relative');
								}
								$body.removeClass('open-overlay-menu');
							}
						});
					}
				};
				check = (!UNCODE.menuOpened) ? open() : close();
			}
		});
		window.addEventListener('menuMobileTrigged', function(e) {
			$('.mobile-menu-button.close').trigger('click');
		});
		window.addEventListener('orientationchange', function(e) {
			$('#logo-container-mobile .mobile-menu-button.close').trigger('click');
		});
		window.addEventListener("resize", function() {
			if ($(window).width() < UNCODE.mediaQuery) {
				if (UNCODE.isMobile) {
					var $box = $('.box-container .main-menu-container'),
						$el = $('.box-container .menu-horizontal-inner, .box-container .menu-sidebar-inner');
					if ($($box).length && $($box).hasClass('open-items') && $($box).css('height') != 'auto') {
						if ($('.menu-wrapper.menu-sticky, .menu-wrapper.menu-hide-only').length) {
							elHeight = 0;
							$.each($el, function(index, val) {
								elHeight += $(val).outerHeight();
							});
							elHeight = window.innerHeight - $('.menu-wrapper.menu-sticky .menu-container .row-menu-inner, .menu-wrapper.menu-hide-only .menu-container .row-menu-inner').height() - (UNCODE.bodyBorder * 2) + 1;
							$($box).css('height', elHeight + 'px');
						}
					}
				}
			} else {
				$('.menu-hide-vertical').removeAttr('style');
				$('.menu-container-mobile').removeAttr('style');
				$('.vmenu-container.menu-container').removeAttr('style');
			}
		});
	};

	function menuOffCanvas() {
		var menuClose = new CustomEvent('menuCanvasClose'),
			menuOpen = new CustomEvent('menuCanvasOpen');
		$('.menu-primary .menu-button-offcanvas:not(.menu-close-search)').click(function(event) {
			if ($(window).width() > UNCODE.mediaQuery) {
				if ($(event.currentTarget).hasClass('close')) {
					$(event.currentTarget).removeClass('close');
					$(event.currentTarget).addClass('closing');
					requestTimeout(function() {
						$(event.currentTarget).removeClass('closing');
						window.dispatchEvent(menuClose);
					}, 500);

				} else {
					$(event.currentTarget).addClass('close');
					window.dispatchEvent(menuOpen);
				}
			}

			$('body').toggleClass('off-opened');
		});
	};

	function menuOverlay() {
		if ( $('.overlay').length ) {
			$('.overlay').removeClass('hidden');
		}
		if ($('.overlay-sequential, .menu-mobile-animated').length > 0) {
			$('.overlay-sequential .menu-smart > li, .menu-sticky .menu-container .menu-smart > li, .menu-hide.menu-container .menu-smart > li, .vmenu-container .menu-smart > li').each(function(index, el) {
				var transDelay = (index / 20) + 0.1;
				if ( $('body').hasClass('menu-mobile-centered') && $(window).width() < UNCODE.mediaQuery )
					transDelay = transDelay + 0.3;
				$(this)[0].setAttribute('style', '-webkit-transition-delay:' + transDelay + 's; -moz-transition-delay:' + transDelay + 's; -ms-transition-delay:' + transDelay + 's; -o-transition-delay:' + transDelay + 's; transition-delay:' + transDelay + 's');
			});
		}
	};
	function menuAppend() {
		var $body = $('body'),
			$menuCont = $('.menu-container'),
			$cta = $('.navbar-cta'),
			$socials = $('.navbar-social'),
			$ul = $('.navbar-main ul.menu-primary-inner'),
			$ulCta,
			$ulSocials,
			$firstMenu = $('.main-menu-container:first-child', $menuCont),
			$secondMenu = $('.main-menu-container:last-child', $menuCont),
			$firstNav = $('.navbar-nav:first-child', $firstMenu),
			$secondNav = $('.navbar-nav:first-child', $secondMenu),
			$ulFirst = $('> ul', $firstNav),
			$ulSecond = $('> ul', $secondNav),
			setCTA,
			appendCTA = function(){
				return true;
			},
			appendSocials = function(){
				return true;
			},
			appendSplit = function(){
				return true;
			};

		if ( $body.hasClass('cta-not-appended') )
			return false;

		if ( ( $body.hasClass('menu-offcanvas') || $body.hasClass('menu-overlay') || $body.hasClass('hmenu-center-split') ) && $cta.length ) {
			$ulCta = $('> ul', $cta);

			appendCTA = function(){
				if (UNCODE.wwidth < UNCODE.mediaQuery) {
					$ul.after($ulCta);
				} else {
					$cta.append($ulCta);
				}
			}
		}
		appendCTA();

		if ( ( $body.hasClass('hmenu-center-split') || $body.hasClass('menu-overlay-center') ) && $socials.length ) {
			$ulSocials = $('> ul', $socials);

			appendSocials = function(){
				if (UNCODE.wwidth < UNCODE.mediaQuery) {
					$ul.after($ulSocials);
				} else {
					$socials.append($ulSocials);
				}
			}
		}
		appendSocials();

		if ( ( $body.hasClass('hmenu-center-double') ) ) {
			appendSplit = function(){
				if (UNCODE.wwidth < UNCODE.mediaQuery) {
					if ( $secondNav.length ) {
						$secondNav.prepend($ulFirst);
					}
					$firstMenu.hide();
				} else {
					$firstNav.append($ulFirst);
					$firstMenu.css({
						'display': 'table-cell'
					});
				}
			}
		}
		appendSplit();

		$(window).on( 'resize', function(){
			clearRequestTimeout(setCTA);
			setCTA = requestTimeout( function() {
				appendCTA();
				appendSocials();
				appendSplit();
			}, 10 );
		});
	}
	//menuMobileButton();
	menuMobile();
	menuOffCanvas();
	UNCODE.menuSmartInit();
	menuAppend();
	menuOverlay();
	var setMenuOverlay;
	$(window).on( 'resize', function(){
		if ( $('.overlay').length && $(window).width() > 1024 ) {
			$('.overlay').addClass('hidden');
		}
		clearRequestTimeout(setMenuOverlay);
		setMenuOverlay = requestTimeout( menuOverlay, 150 );
	});
};

UNCODE.menuSmartInit = function() {
	var $menusmart = $('[class*="menu-smart"]'),
		$masthead = $('#masthead'),
		$hMenu = $('.menu-horizontal-inner', $masthead),
		$focus = $('.overlay-menu-focus'),
		showTimeout = 50,
		hideTimeout = 50,
		showTimeoutFunc, hideTimeoutFunc;

	$('> li.menu-item-has-children', $menusmart).hover(function(){
		$(this).data('hover', true);
	}, function(){
		$(this).data('hover', false);
	});

	if ( $(window).width() >= UNCODE.mediaQuery && $('.overlay-menu-focus').length ) {
		var $notLis = $('> .nav > ul > li a', $hMenu),
			$menuA = $('a', $masthead).not($notLis),
			$hoverSelector = $('> .nav > ul > li', $hMenu).has('> ul'),
			showFuncCond = function() { return true };

		if ( $('body').hasClass('focus-megamenu') ) {
			$hoverSelector = $('> .nav > ul > li', $hMenu).has('.mega-menu-inner');
			showFuncCond = function($ul) { return $ul.hasClass('mega-menu-inner') };
		} else if ( $('body').hasClass('focus-links') ) {
			$hoverSelector = $('> .nav > ul > li', $hMenu).add($menuA);
		}

		$hoverSelector.hover(function(){
			clearRequestTimeout(hideTimeoutFunc);
			showTimeoutFunc = requestTimeout(function(){
				$('body').addClass('navbar-hover');
			}, showTimeout*2);
		}, function(){
			hideTimeoutFunc = requestTimeout(function(){
				if ( ! $('.overlay-search.open', $masthead).length ) {
					$('body').removeClass('navbar-hover');
				}
			}, hideTimeout*2);
		});
	} else {
		showFuncCond = function() { return false };
	}

	if ($menusmart.length > 0) {
		$menusmart.smartmenus({
			subIndicators: false,
			subIndicatorsPos: 'append',
			//subMenusMinWidth: '13em',
			subIndicatorsText: '',
			showTimeout: showTimeout,
			hideTimeout: hideTimeout,
			showFunction: function($ul, complete) {
				clearRequestTimeout(showTimeoutFunc);
				$ul.fadeIn(0, 'linear', function(){
					complete();
					if ( $ul.hasClass('vc_row') ) {
						$ul.css({
							'display': 'table'
						});
					}
					if ( $('.overlay-menu-focus').length && $ul.hasClass('mega-menu-inner') ) {
						$('body').addClass('open-megamenu');
					}
					if ( $('.overlay-menu-focus').length && showFuncCond($ul) && $(window).width() >= UNCODE.mediaQuery && $ul.closest('.main-menu-container').length ) {
						$('body').addClass('navbar-hover');
					}
				}).addClass('open-animated');
			},
			hideFunction: function($ul, complete) {
				if ( $('.overlay-menu-focus').length && $ul.hasClass('mega-menu-inner') && ! $('.overlay-search.open', $masthead).length ) {
					$('body').removeClass('open-megamenu');
				}
				var fixIE = $('html.ie').length;
				if (fixIE) {
					var $rowParent = $($ul).closest('.main-menu-container');
					$rowParent.height('auto');
				}
				$ul.fadeOut(0, 'linear', function(){
					complete();
					$ul.removeClass('open-animated');
					if ( $ul.closest('li.menu-item-has-children').data('hover') === false ) {
						$('body').removeClass('open-submenu');
					}
				});
			},
			collapsibleShowFunction: function($ul, complete) {
				$ul.slideDown(400, 'easeInOutCirc', complete);
			},
			collapsibleHideFunction: function($ul, complete) {
				$ul.slideUp(200, 'easeInOutCirc', complete);
			},
			hideOnClick: true
		});

		if ( $('body').hasClass('menu-accordion-active') ) {
			requestTimeout(function(){
				$menusmart.addClass('menu-smart-init');
				$menusmart.smartmenus( 'itemActivate', $menusmart.find( '.current-menu-item > a' ).eq( -1 ) );
			}, 1000);
		}
	}
}

UNCODE.okvideo = function() {
	var BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D";
	$.okvideo = function(options) {
		// if the option var was just a string, turn it into an object
		if (typeof options !== 'object') options = {
			'video': options
		};
		var base = this;
		// kick things off
		base.init = function() {
			base.options = $.extend({}, $.okvideo.options, options);
			// support older versions of okvideo
			if (base.options.video === null) base.options.video = base.options.source;
			base.setOptions();
			var target = base.options.target || $('body');
			var position = target[0] == $('body')[0] ? 'fixed' : 'absolute';
			var zIndex = base.options.controls === 3 ? -999 : "auto";
			if ($('#okplayer-' + base.options.id).length == 0) { //base.options.id = String(Math.round(Math.random() * 100000));
				var mask = '<div id="okplayer-mask-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;"></div>';
				if (OKEvents.utils.isMobile()) {
					target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:' + zIndex + ';height:100%;width:100%;"></div>');
				} else {
					if (base.options.controls === 3) {
						target.append(mask)
					}
					if (base.options.adproof === 1) {
						target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:-10%;top:-10%;overflow:hidden;z-index:' + zIndex + ';height:120%;width:120%;"></div>');
					} else {
						target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:' + zIndex + ';height:100%;width:100%;"></div>');
					}
				}
				$("#okplayer-mask-" + base.options.id).css("background-image", "url(" + BLANK_GIF + ")");
				if (base.options.playlist.list === null) {
					if (base.options.video.provider === 'youtube') {
						base.loadYouTubeAPI();
					} else if (base.options.video.provider === 'vimeo') {
						base.options.volume /= 100;
						base.loadVimeoAPI();
					}
				} else {
					base.loadYouTubeAPI();
				}
			}
		};
		// clean the options
		base.setOptions = function() {
			// exchange 'true' for '1' and 'false' for 3
			for (var key in this.options) {
				if (this.options[key] === true) this.options[key] = 1;
				if (this.options[key] === false) this.options[key] = 3;
			}
			if (base.options.playlist.list === null) {
				base.options.video = base.determineProvider();
			}
			// pass options to the window
			$(window).data('okoptions-' + base.options.id, base.options);
		};
		// insert js into the head and exectue a callback function
		base.insertJS = function(src, callback){
			var tag;
			if (UNCODE.insertedSripts && UNCODE.insertedSripts[src]) {
				tag = UNCODE.insertedSripts[src];
				if (callback){
					if (tag.readyState){  //IE
						tag.onreadystatechange = function(){
							if (tag.readyState === "loaded" ||
								tag.readyState === "complete"){
								tag.onreadystatechange = null;
								callback();
							}
						};
					} else {
						$(tag).on('load', callback);
					}
				}
				return;
			}
			tag = document.createElement('script');
			if (callback){
				if (tag.readyState){  //IE
					tag.onreadystatechange = function(){
						if (tag.readyState === "loaded" || tag.readyState === "complete"){
							tag.onreadystatechange = null;
							callback();
						}
					};
				} else {
					tag.onload = function() {
						callback();
					};
				}
			}
			tag.src = src;
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			if ( ! UNCODE.insertedSripts ) {
				UNCODE.insertedSripts = [];
			}
			UNCODE.insertedSripts[src] = tag;
		};
		// load the youtube api
		base.loadYouTubeAPI = function(callback) {
			base.insertJS('https://www.youtube.com/player_api');
		};
		base.loadYouTubePlaylist = function() {
			player.loadPlaylist(base.options.playlist.list, base.options.playlist.index, base.options.playlist.startSeconds, base.options.playlist.suggestedQuality);
		};
		// load the vimeo api by replacing the div with an iframe and loading js
		base.loadVimeoAPI = function() {
			var source = '//player.vimeo.com/video/' + base.options.video.id + '?background=1&api=1&title=0&byline=0&portrait=0&playbar=0&loop=' + base.options.loop + '&autoplay=' + (base.options.autoplay === 1 ? 1 : 0) + '&player_id=okplayer-' + base.options.id,
			jIframe = $('<iframe data-src="'+source+'" frameborder="0" id="okplayer-' + base.options.id +'" style="visibility: hidden;" class="vimeo-background" webkitallowfullscreen mozallowfullscreen allowfullscreen>');
			$(window).data('okoptions-' + base.options.id).jobject = jIframe;
			$('#okplayer-' + base.options.id).replaceWith(jIframe[0]);
			base.insertJS('//player.vimeo.com/api/player.js', function() {
				vimeoPlayerReady(base.options.id);
			});
		};
		// is it from youtube or vimeo?
		base.determineProvider = function() {
			var a = document.createElement('a');
			a.href = base.options.video;
			if (/youtube.com/.test(base.options.video) || /youtu.be/.test(base.options.video)) {
				var videoid = a.href.split('/')[3].toString();
				var query = videoid.substring(videoid.indexOf('?') + 1);
				if (query != '') {
					var vars = query.split('&');
					for (var i = 0; i < vars.length; i++) {
						var pair = vars[i].split('=');
						if (pair[0] == 'v') {
							videoid = pair[1];
						}
					}
				}
				return {
					"provider": "youtube",
					"id": videoid
				};
			} else if (/vimeo.com/.test(base.options.video)) {
				return {
					"provider": "vimeo",
					"id": (a.href.split('/')[3].toString()).split('#')[0],
				};
			} else if (/[-A-Za-z0-9_]+/.test(base.options.video)) {
				var id = new String(base.options.video.match(/[-A-Za-z0-9_]+/));
				if (id.length == 11) {
					return {
						"provider": "youtube",
						"id": id.toString()
					};
				} else {
					for (var i = 0; i < base.options.video.length; i++) {
						if (typeof parseInt(base.options.video[i]) !== "number") {
							throw 'not vimeo but thought it was for a sec';
						}
					}
					return {
						"provider": "vimeo",
						"id": base.options.video
					};
				}
			} else {
				throw "OKVideo: Invalid video source";
			}
		};
		base.init();
	};
	$.okvideo.options = {
		id: null,
		source: null, // Deprecate dis l8r
		video: null,
		playlist: { // eat ur heart out @brokyo
			list: null,
			index: 0,
			startSeconds: 0,
			suggestedQuality: "default" // options: small, medium, large, hd720, hd1080, highres, default
		},
		disableKeyControl: 1,
		captions: 0,
		loop: 1,
		hd: 1,
		volume: 0,
		adproof: false,
		unstarted: null,
		onFinished: null,
		onReady: null,
		onPlay: null,
		onPause: null,
		buffering: null,
		controls: false,
		autoplay: true,
		annotations: true,
		cued: null
	};
	$.fn.okvideo = function(options) {
		options.target = this;
		return this.each(function() {
			(new $.okvideo(options));
		});
	};

	$(".no-touch .uncode-video-container.video").each(function(index, el) {
		var $this = $(this),
			url = $this.attr('data-video'),
			id = $this.attr('data-id'),
			cloned = $this.closest('.owl-item');
		if (!cloned.hasClass('cloned') || cloned.length == 0) {
			$this.okvideo({
				id: id,
				source: url.split('#')[0],
				time: ((url).indexOf("#") > -1) ? (url).substring((url).indexOf('#') + 1) : null,
				autoplay: 1,
				controls: 0,
				volume: 0,
				adproof: 0,
				caller: $this,
				hd: 1,
				onReady: function(player) {
					var getPlayer = player.c || player.h || player,
					$iframe,
					getContainer = $(getPlayer).closest('.background-element');
					if (getContainer.length) {
						UNCODE.initVideoComponent(getContainer[0], '.uncode-video-container.video:not(.drop-move)');
					}

					if ( $this.hasClass('drop-move') ) {

						var $iframe = $(getPlayer),
							w = parseFloat($iframe.attr('width')),
							h = parseFloat($iframe.attr('height')),
							ratio = h / w,
							setResizeiFto,
						resizeiFrame = function(){
							var dataW = $this.attr('data-w'),
								newW = UNCODE.wwidth / 12 * parseFloat( dataW ),
								newH = newW * ratio;
							$iframe.css({
								width: newW,
								height: newH
							});
						};
						resizeiFrame();
						$(window).on( 'load', resizeiFrame );
						$(window).on( 'resize', function(){
							clearRequestTimeout(setResizeiFto);
							setResizeiFto = requestTimeout( function() {
								resizeiFrame();
							}, 10 );
						});

					}

				}
			});
		}
	});

	$(window).on('load', function(){
		$('.mejs-fullscreen-button button').on('click', function(){
			var $button = $(this),
				$stuck = $button.closest('.is_stucked');

			if ( $stuck.length ) {
				$stuck = $(this).trigger("sticky_kit:detach");
				window.scrollTo(0, 0);
			}
		});
	});
};

UNCODE.backgroundSelfVideos = function( $ctx ) {

	if ( typeof $ctx === 'undefined' ) {
		$ctx = $('body');
	}

	var backgroundSelfVideosInit = function( $ctx ) {
		$(".background-video-shortcode", $ctx).each(function(index, el) {
			if ( SiteParameters.block_mobile_videos === true ) {
				return false;
			}
			if ( $(this).closest('mediaelementwrapper').length ) {
				return true;
			}
			var $video_el = $(this),
				$parent_carousel = $video_el.parents('.uncode-slider').eq(0),
				$parent_drop_move = $video_el.closest('.t-entry-drop.drop-move'),
				video_id = $video_el.attr('id');

			if ( SiteParameters.is_frontend_editor ) {
				video_id = video_id + '_' + index;
				$video_el.attr('id', video_id);
			}

			if (typeof MediaElement === "function") {
				var media = new MediaElement(video_id, {
					startVolume: 0,
					loop: true,
					success: function(mediaElement, domObject) {
						domObject.volume = 0;
						$(mediaElement).data('started', false);
						mediaElement.addEventListener('timeupdate', function(e) {
							if (!$(e.target).data('started')) {
								$(mediaElement).data('started', true);
							}
						});
						mediaElement.addEventListener('loadedmetadata', function(e) {
							mediaElement.play();
						});
						if (!UNCODE.isMobile) {
							requestTimeout(function() {
								UNCODE.initVideoComponent(document.body, '.uncode-video-container.video:not(.drop-move), .uncode-video-container.self-video:not(.drop-move)');
							}, 100);
						}
						if ( ($('html.firefox').length) && !$parent_carousel.length  ) {
							mediaElement.play();
						}

						if ( $parent_drop_move.length ) {
							var setResizeMEto,
								resizeMediaElement = function(){
								var dataW = $parent_drop_move.attr('data-w'),
									videoW = domObject.width,
									videoH = domObject.height,
									newW = UNCODE.wwidth / 12 * parseFloat( dataW ),
									newH = newW / ( videoW / videoH );

								$(domObject).css({
									'height': newH,
									'width': newW
								});
							};
							$(window).on( 'resize load', function(){
								clearRequestTimeout(setResizeMEto);
								setResizeMEto = requestTimeout( function() {
									resizeMediaElement();
								}, 10 );
							});
						}

						mediaElement.addEventListener('play', function() {
							$(mediaElement).closest('.uncode-video-container:not(.t-entry-drop)').css('opacity', '1');
							$(mediaElement).closest('#page-header').addClass('video-started');
							$(mediaElement).closest('.background-wrapper').find('.block-bg-blend-mode.not-ie').css('opacity', '1');
						}, true);

					},
					// fires when a problem is detected
					error: function() {}
				});

			} else {
				$video_el[0].play();
				$video_el[0].addEventListener('play', function() {
					$video_el[0].muted = true;
					$video_el[0].loop = true;
					$video_el.closest('.uncode-video-container:not(.t-entry-drop)').css('opacity', '1');
					$video_el.closest('#page-header').addClass('video-started');
					$video_el.closest('.background-wrapper').find('.block-bg-blend-mode.not-ie').css('opacity', '1');
				}, false);
			}
		});
	};

	backgroundSelfVideosInit( $ctx );

	if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
		window.parent.vc.events.on( 'shortcodeView:updated shortcodeView:ready', function(model){
			var $el = model.view.$el,
				shortcode = model.attributes.shortcode;

			backgroundSelfVideosInit( $el );
		});
	}
};

UNCODE.is_scrolling = false;

UNCODE.disableHoverScroll = function() {

	if (!UNCODE.isMobile && !UNCODE.isFullPage) {
		var body = document.body,
		timer;

		window.addEventListener('scroll', function() {
			var delay = ( body.classList.contains('bg-changer-init') ) ? SiteParameters.bg_changer_time : 300;
			clearRequestTimeout(timer);
			if ( body.classList && !body.classList.contains('disable-hover') ) {
				body.classList.add('disable-hover');
				window.dispatchEvent(new CustomEvent('disable-hover'));
			}
			UNCODE.is_scrolling = true;

			timer = requestTimeout(function() {
				if ( body.classList ) {
					body.classList.remove('disable-hover');
					window.dispatchEvent(new CustomEvent('enable-hover'));
				}
				UNCODE.is_scrolling = false;
			}, delay);
		}, false);
	}
};

UNCODE.isotopeLayout = function() {
	if ($('.isotope-layout').length > 0) {
		var isotopeContainersArray = [],
			typeGridArray = [],
			layoutGridArray = [],
			screenLgArray = [],
			screenMdArray = [],
			screenSmArray = [],
			transitionDuration = [],
			$filterItems = [],
			$filters = $('.isotope-system .isotope-filters'),
			$itemSelector = '.tmb-iso',
			$items,
			itemMargin,
			correctionFactor = 0,
			firstLoad = true,
			isOriginLeft = $('body').hasClass('rtl') ? false : true;
		$('[class*="isotope-container"]').each(function(index) {
			var _this = $(this);
			var isoData = _this.data(),
			$data_lg,
			$data_md,
			$data_sm;
			_this.children('.tmb').addClass('tmb-iso');
			if (isoData.lg !== undefined) $data_lg = _this.attr('data-lg');
			else $data_lg = '1000';
			if (isoData.md !== undefined) $data_md = _this.attr('data-md');
			else $data_md = '600';
			if (isoData.sm !== undefined) $data_sm = _this.attr('data-sm');
			else $data_sm = '480';
			screenLgArray.push($data_lg);
			screenMdArray.push($data_md);
			screenSmArray.push($data_sm);
			transitionDuration.push($('.t-inside.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
			if (isoData.type == 'metro') typeGridArray.push(true);
			else typeGridArray.push(false);
			if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
			else layoutGridArray.push('masonry');
			isotopeContainersArray.push(_this);
			_this.attr('data-iso-index', index);
		});
		var colWidth = function(index) {
				$(isotopeContainersArray[index]).width('');
				var isPx = $(isotopeContainersArray[index]).parent().hasClass('px-gutter'),
					widthAvailable = $(isotopeContainersArray[index]).width(),
					columnNum = 12,
					columnWidth = 0,
					data_vp_height = $(isotopeContainersArray[index]).attr('data-vp-height'),
					consider_menu = $(isotopeContainersArray[index]).attr('data-vp-menu'),
					winHeight = UNCODE.wheight - UNCODE.adminBarHeight,
					$rowContainer,
					paddingRow,
					$colContainer,
					paddingCol;

				if ( consider_menu )
					winHeight = winHeight - UNCODE.menuHeight;

				if ( data_vp_height === '1' ) {
					$rowContainer = $(isotopeContainersArray[index]).parents('.row-parent').eq(0),
					paddingRow = parseInt($rowContainer.css('padding-top')) + parseInt($rowContainer.css('padding-bottom')),
					$colContainer = $(isotopeContainersArray[index]).parents('.uncell').eq(0),
					paddingCol = parseInt($colContainer.css('padding-top')) + parseInt($colContainer.css('padding-bottom'));
					winHeight = winHeight - ( paddingRow + paddingCol );
				}

				if (isPx) {
					columnWidth = Math.ceil(widthAvailable / columnNum);
					$(isotopeContainersArray[index]).width(columnNum * Math.ceil(columnWidth));
				} else {
					columnWidth = ($('html.firefox').length) ? Math.floor(widthAvailable / columnNum) : widthAvailable / columnNum;
				}
				$items = $(isotopeContainersArray[index]).find('.tmb-iso:not(.tmb-carousel)');
				itemMargin = parseInt($(isotopeContainersArray[index]).find('.t-inside').css("margin-top"));
				for (var i = 0, len = $items.length; i < len; i++) {
					var $item = $($items[i]),
						multiplier_w = $item.attr('class').match(/tmb-iso-w(\d{0,2})/),
						multiplier_h = $item.attr('class').match(/tmb-iso-h(\d{0,3})/),
						multiplier_fixed = multiplier_h !== null ? multiplier_h[1] : 1;


					if (multiplier_w != null && multiplier_w[1] !== undefined && multiplier_w[1] == 15) {
						multiplier_w[1] = 2.4; // 20/(100/12) - 5 columns
					}

					if (multiplier_h != null && multiplier_h[1] !== undefined && multiplier_h[1] == 15) {
						multiplier_h[1] = 2.4; // 20/(100/12) - 5 columns
					}

					if (widthAvailable >= screenMdArray[index] && widthAvailable < screenLgArray[index]) {
						if (multiplier_w != null && multiplier_w[1] !== undefined) {
							switch (parseInt(multiplier_w[1])) {
								case (5):
								case (4):
								case (3):
									if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 6;
									break;
								case (2):
								case (1):
									if (typeGridArray[index]) multiplier_h[1] = (3 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 3;
									break;
								default:
									if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 12;
									break;
							}

							if (multiplier_w[1] == 2.4) { // 5 columns
								if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
								multiplier_w[1] = 6;
							}
						}
					} else if (widthAvailable >= screenSmArray[index] && widthAvailable < screenMdArray[index]) {
						if (multiplier_w != null && multiplier_w[1] !== undefined) {
							switch (parseInt(multiplier_w[1])) {
								case (5):
								case (4):
								case (3):
								case (2):
								case (1):
									if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 6;
									break;
								default:
									if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 12;
									break;
							}

							if (multiplier_w[1] == 2.4) { // 5 columns
								if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
								multiplier_w[1] = 6;
							}
						}
					} else if (widthAvailable < screenSmArray[index]) {
						if (multiplier_w != null && multiplier_w[1] !== undefined) {
							//if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
							multiplier_w[1] = 12;
							if (typeGridArray[index]) multiplier_h[1] = 12;
						}
					}
					var width = multiplier_w ? Math.floor(columnWidth * multiplier_w[1]) : columnWidth,
						height;

					if ( data_vp_height === '1' && typeof multiplier_h[1] !== 'undefined' ) {
						height = multiplier_h ? Math['ceil'](winHeight / (100 / multiplier_fixed) ) - itemMargin : columnWidth;
						if ( widthAvailable < screenSmArray[index] ) {
							height = Math['ceil']((2 * Math.ceil(columnWidth / 2)) * 12) - itemMargin;
						}
					} else {
						height = multiplier_h ? Math['ceil']((2 * Math.ceil(columnWidth / 2)) * multiplier_h[1]) - itemMargin : columnWidth;
					}

					if (width >= widthAvailable) {
						$item.css({
							width: widthAvailable
						});
						if (typeGridArray[index]) {
							$item.children().add($item.find('.backimg')).css({
								height: height
							});
						}
					} else {
						$item.css({
							width: width
						});
						if (typeGridArray[index]) {
							$item.children().add($item.find('.backimg')).css({
								height: height
							});
						}
					}
				}
				if (multiplier_w != null && multiplier_w[1] !== undefined && multiplier_w[1] == 2.4) { // 5 columns
					return columnWidth / 60; // least common multiple for 12 (regular columns) and 10 (5 columns)
				} else {
					return columnWidth;
				}
			},
			init_isotope = function() {
				for (var i = 0, len = isotopeContainersArray.length; i < len; i++) {
					var isotopeSystem = $(isotopeContainersArray[i]).closest($('.isotope-system')),
						isotopeId = isotopeSystem.attr('id'),
						$layoutMode = layoutGridArray[i],
						setIsotopeFirstRowTimeOut,
					setIsotopeFirstRow = function(items){
						var firstRow = true;
						$(items).each(function(index, val){
							var el = items[index].element,
								el_top = items[index].position.y,
								$el = $(el);
							if ( index > 0 && el_top > 0 && firstRow ) {
								firstRow = false;
							} else if ( index == 0 && el_top == 0 ) {
								firstRow = true;
							}
							if ( firstRow ) {
								$el.removeClass('tmb-isotope-further-row');
							} else {
								$el.addClass('tmb-isotope-further-row');
							}
						});
					};
					$(isotopeContainersArray[i]).not('.un-isotope-init').addClass('un-isotope-init').isotope({
						//resizable: true,
						itemSelector: $itemSelector,
						layoutMode: $layoutMode,
						transitionDuration: transitionDuration[i],
						masonry: {
							columnWidth: colWidth(i)
						},
						vertical: {
							horizontalAlignment: 0.5,
						},
						sortBy: 'original-order',
						isOriginLeft: isOriginLeft
					})
					.on('layoutComplete', onLayout($(isotopeContainersArray[i]), 0))
					.on('layoutComplete', function( event, items ){
						if ( typeof items[0] !== 'undefined' ) {
							if ( $(items[0].element).closest('.off-grid-layout:not(.off-grid-forced)').length ) {
								setIsotopeFirstRow(items);
							}
						}
					})
					.on('arrangeComplete', function( event, items ){
						if ( typeof items[0] !== 'undefined' ) {
							if ( $(items[0].element).closest('.off-grid-layout:not(.off-grid-forced)').length ) {
								clearRequestTimeout(setIsotopeFirstRowTimeOut);
								setIsotopeFirstRowTimeOut = requestTimeout(function(){
									setIsotopeFirstRow(items);
								}, 100);
							}
						}
					});
					if ($(isotopeContainersArray[i]).hasClass('isotope-infinite') && $.fn.infinitescroll) {
						$(isotopeContainersArray[i]).infinitescroll({
								navSelector: '#' + isotopeId + ' .loadmore-button', // selector for the pagination container
								nextSelector: '#' + isotopeId + ' .loadmore-button a', // selector for the NEXT link (to page 2)
								itemSelector: '#' + isotopeId + ' .isotope-layout .tmb, #' + isotopeId + ' .isotope-filters li.filter-cat', // selector for all items you'll retrieve
								animate: false,
								behavior: 'local',
								debug: false,
								loading: {
									selector: '#' + isotopeId + '.isotope-system .isotope-footer-inner',
									speed: 0,
									finished: undefined,
									msg: $('#' + isotopeId + ' .loadmore-button'),
								},
								errorCallback: function() {
									var isotope_system = $(this).closest('.isotope-system');
									$('.loading-button', isotope_system).hide();
									$('.loadmore-button', isotope_system).attr('style', 'display:none !important');
								}
							},
							// append the new items to isotope on the infinitescroll callback function.
							function(newElements, opts) {
								var $isotope = $(this),
									isotopeId = $isotope.closest('.isotope-system').attr('id'),
									filters = new Array(),
									$loading_button = $isotope.closest('.isotope-system').find('.loading-button'),
									$infinite_button = $isotope.closest('.isotope-system').find('.loadmore-button'),
									$numPages = $('a', $infinite_button).data('pages'),
									delay = 300;
								$('a', $infinite_button).html($('a', $infinite_button).data('label'));
								$infinite_button.show();
								$loading_button.hide();
								if ( $numPages != undefined && opts.state.currPage == $numPages) $infinite_button.hide();
								$('> li', $isotope).remove();
								$.each($(newElements), function(index, val) {
									$(val).addClass('tmb-iso');
									if ($(val).is("li")) {
										filters.push($(val)[0]);
									}
								});
								newElements = newElements.filter(function(x) {
									return filters.indexOf(x) < 0
								});
								$.each($(filters), function(index, val) {
									if ($('#' + isotopeId + ' a[data-filter="' + $('a', val).attr('data-filter') + '"]').length == 0) $('#' + isotopeId + ' .isotope-filters ul').append($(val));
								});
								$isotope.isotope('reloadItems', onLayout($isotope, newElements.length));
								if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
									var getLightbox = UNCODE.lightboxArray['ilightbox_' + isotopeId];
									if (typeof getLightbox === 'object') {
										getLightbox.refresh();
									} else {
										UNCODE.lightbox();
									}
								}
								if ( typeof twttr !== 'undefined' )
									twttr.widgets.load(isotopeContainersArray[i]);

								requestTimeout(function() {
									Waypoint.refreshAll();
									$isotope.trigger('more-items-loaded');
								}, 1000);

							});
						if ($(isotopeContainersArray[i]).hasClass('isotope-infinite-button')) {
							var $infinite_isotope = $(isotopeContainersArray[i]),
								$infinite_button = $infinite_isotope.closest('.isotope-system').find('.loadmore-button a');
							$infinite_isotope.infinitescroll('pause');
							$infinite_button.on('click', function(event) {
								event.preventDefault();
								var $infinite_system = $(event.target).closest('.isotope-system'),
								$infinite_isotope = $infinite_system.find('.isotope-container'),
								isotopeId = $infinite_system.attr('id');
								$(event.currentTarget).html(SiteParameters.loading);
								$infinite_isotope.infinitescroll('resume');
								$infinite_isotope.infinitescroll('retrieve');
								$infinite_isotope.infinitescroll('pause');
							});
						}
					}
				}
			},
			onLayout = function(isotopeObj, startIndex, needsReload) {
				var needsReload = needsReload ? true : false;

				if (typeof UNCODE.bigText !== 'undefined') {
					UNCODE.bigText();
				}
				isotopeObj.css('opacity', 1);
				isotopeObj.closest('.isotope-system').find('.isotope-footer').css('opacity', 1);

				requestTimeout(function() {
					if (startIndex > 0) {
						reloadIsotope(isotopeObj);
						if (SiteParameters.dynamic_srcset_active === '1') {
							UNCODE.refresh_dynamic_srcset_size(isotopeObj);
							UNCODE.adaptive_srcset(isotopeObj);
						}
						// window.dispatchEvent(UNCODE.boxEvent);
					} else if (needsReload) {
						reloadIsotope(isotopeObj);
					}

					UNCODE.adaptive();
					if (SiteParameters.dynamic_srcset_active === '1' && startIndex === 0) {
						UNCODE.refresh_dynamic_srcset_size(isotopeObj);
					}
					if (typeof MediaElement === "function") {
						$(isotopeObj).find('audio,video').each(function() {
							$(this).mediaelementplayer({
	 							pauseOtherPlayers: false,
							});
						});
					}
					if ($(isotopeObj).find('.nested-carousel').length) {
						if (typeof UNCODE.carousel !== 'undefined') {
							UNCODE.carousel($(isotopeObj).find('.nested-carousel'));
						}
						requestTimeout(function() {
							boxAnimation($('.tmb-iso', isotopeObj), startIndex, true, isotopeObj);
						}, 200);
					} else {
						boxAnimation($('.tmb-iso', isotopeObj), startIndex, true, isotopeObj);
					}
					isotopeObj.trigger('isotope-layout-complete');

				}, 100);

			},
			boxAnimation = function(items, startIndex, sequential, container) {
				var $allItems = items.length - startIndex,
					showed = 0,
					index = 0;
				if (container.closest('.owl-item').length == 1) return false;
				$.each(items, function(index, val) {
					var $this = $(val),
						elInner = $('> .t-inside', val);
					if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
						return;
					}
					if (val[0]) val = val[0];
					if (elInner.hasClass('animate_when_almost_visible') && !elInner.hasClass('force-anim')) {
						new Waypoint({
							context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
							element: val,
							handler: function() {
								var element = $('> .t-inside', this.element),
									parent = $(this.element),
									currentIndex = parent.index();
								var delay = (!sequential) ? index : ((startIndex !== 0) ? currentIndex - $allItems : currentIndex),
									delayAttr = parseInt(element.attr('data-delay'));
								if (isNaN(delayAttr)) delayAttr = 100;
								delay -= showed;
								var objTimeout = requestTimeout(function() {
									element.removeClass('zoom-reverse').addClass('start_animation');
									showed = parent.index();
									if ( container.data('isotope') ) {
										container.isotope('layout');
									}
								}, delay * delayAttr)
								parent.data('objTimeout', objTimeout);
								if (!UNCODE.isUnmodalOpen) {
									this.destroy();
								}
							},
							offset: '100%'
						})
					} else {
						if (elInner.hasClass('force-anim')) {
							elInner.addClass('start_animation');
						} else {
							elInner.css('opacity', 1);
						}
						container.isotope('layout');
					}

					index++;
				});
			},
			reloadIsotope = function(isotopeObj) {
				var isoIndex = $(isotopeObj).attr('data-iso-index');
				var $layoutMode = ($(isotopeObj).data('layout'));
				if ($layoutMode === undefined) {
					$layoutMode = 'masonry';
				}
				if (isotopeObj.data('isotope')) {
					isotopeObj.isotope({
						itemSelector: $itemSelector,
						layoutMode: $layoutMode,
						transitionDuration: transitionDuration[isoIndex],
						masonry: {
							columnWidth: colWidth(isoIndex)
						},
						vertical: {
							horizontalAlignment: 0.5,
						},
						sortBy: 'original-order',
						isOriginLeft: isOriginLeft
					});
				}
			}
			;
		if ($('.isotope-pagination').length > 0) {
			$('.isotope-system').on('click', '.pagination a', function(evt) {
				evt.preventDefault();

                var filterContainer = $(this).closest('.isotope-system').find('.isotope-filters'),
					container = $(this).closest('.isotope-system'),
                    calc_scroll = container.closest('.row-parent').offset().top;
                calc_scroll -= UNCODE.get_scroll_offset();

                var menu_container = $('.menu-sticky');
				var menu = menu_container.find('.menu-container');

				if (menu_container.length > 0 && menu.length > 0) {
					calc_scroll = calc_scroll - menu.outerHeight();
				}

				var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
					delta = bodyTop - calc_scroll,
					scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
				if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

				if ( !UNCODE.isFullPage ) {
					if (scrollSpeed == 0) {
						$('html, body').scrollTop(calc_scroll);
					} else {
						$('html, body').animate({
							scrollTop: calc_scroll
						},{
							easing: 'easeInOutQuad',
							duration: scrollSpeed,
							complete: function(){
								UNCODE.scrolling = false;
							}
						});
					}
				}

				loadIsotope($(this), true);
				evt.preventDefault();
			});
		}
		$filters.on('click', 'a.isotope-nav-link', function(evt) {
			if ($(this).hasClass('no-isotope-filter')) {
				return;
			}
			var $filter = $(this),
				filterContainer = $filter.closest('.isotope-filters'),
				filterValue = $filter.attr('data-filter'),
				container = $filter.closest('.isotope-system').find($('.isotope-layout')),
				transitionDuration = container.data().isotope.options.transitionDuration,
				delay = 300,
				filterItems = [];

			var filter_items = function(){
				if (filterValue !== undefined) {
					$.each($('> .tmb-iso > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					requestTimeout(function(){
						if ( filterValue == '*' ) {
							container.removeClass('isotope-filtered');
						} else {
							container.addClass('isotope-filtered');
						}
						container.isotope({
							filter: function() {
								var block = $(this),
								filterable = (filterValue == '*') || block.hasClass(filterValue),
								lightboxElements = $('[data-lbox^=ilightbox]', block);
								if (filterable) {
									if (lightboxElements.length) {
										lightboxElements.removeClass('lb-disabled');
										container.data('lbox', $(lightboxElements[0]).data('lbox'));
									}
									filterItems.push(block);
								} else {
									if (lightboxElements.length) lightboxElements.addClass('lb-disabled');
								}
								container.trigger('more-items-loaded');
								return filterable;
							}
						});
						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');

					}, delay);

					/** once filtered - start **/
					container.isotope('once', 'arrangeComplete', function() {
						if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
							var getLightbox = UNCODE.lightboxArray[container.data('lbox')];
							if (typeof getLightbox === 'object') {
								getLightbox.refresh();
							} else {
								UNCODE.lightbox();
							}
						}
						if (transitionDuration == 0) {
							requestTimeout(function() {
								boxAnimation(filterItems, 0, false, container);
							}, 100);
						}
						requestTimeout(function() {
							Waypoint.refreshAll();
						}, 2000);
					});
					/** once filtered - end **/
				} else {
					if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
						$.each(UNCODE.lightboxArray, function(index, val) {
							UNCODE.lightboxArray[index].destroy();
						});
					}
					$.each($('> .tmb-iso > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					container.parent().addClass('grid-loading');
					loadIsotope($filter);
				}
			};

			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
                    var calc_scroll = container.closest('.row-parent').offset().top;
                    calc_scroll -= UNCODE.get_scroll_offset();

					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - calc_scroll,
						scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed,
						filterTolerance = false,
						filter_timeout;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if ( !UNCODE.isFullPage ) {
						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
							filter_items();
						} else {

							if ( bodyTop <= (calc_scroll+20) && bodyTop >= (calc_scroll-20) ) {
								filter_items();
								filterTolerance = true;
							}

							$('html, body').animate({
								scrollTop: calc_scroll
							},{
								easing: 'easeInOutQuad',
								duration: scrollSpeed,
								complete: function(){
									UNCODE.scrolling = false;
									if ( !filterTolerance ) {
										filter_timeout = setTimeout(function(){
											clearTimeout(filter_timeout);
											filter_items();
										}, 200);
									}
								}
							});
						}
					}
				} else {
					filter_items();
				}
			}
			evt.preventDefault();
		});

		$(window).off('popstate.isotopegrid').on("popstate.isotopegrid", function(e) {
			var params = UNCODE.getURLParams(window.location);
			var old_params = UNCODE.getURLParams(UNCODE.lastURL, true);

			UNCODE.lastURL = window.location.href;

			if (UNCODE.hasEqualURLParams(params, old_params) || ($.isEmptyObject(params) && $.isEmptyObject(old_params))) {
				return;
			}

			if (params.id === undefined) {
				$.each($('.isotope-system'), function(index, val) {
					loadIsotope($(val));
				});
			} else {
				if (!params.hasOwnProperty(SiteParameters.ajax_filter_key_unfilter)) {
					loadIsotope($('#' + params.id));
				}
			}
		});

		var loadIsotope = function($href, $paginating) {
			var is_paginating = false;

			if (undefined !== $paginating && $paginating) {
				var is_paginating = $paginating;
			}

			var href = ($href.is("a") ? $href.attr('href') : location),
				isotopeSystem = ($href.is("a") ? $href.closest($('.isotope-system')) : $href),
				isotopeWrapper = isotopeSystem.find($('.isotope-wrapper')),
				isotopeFooter = isotopeSystem.find($('.isotope-footer-inner')),
				isotopeResultCount = isotopeSystem.find($('.woocommerce-result-count-wrapper')),
				isotopeContainer = isotopeSystem.find($('.isotope-layout')),
				isotopeId = isotopeSystem.attr('id');
			if ( $href.is("a") && ! isotopeSystem.hasClass('un-no-history') ) {
				UNCODE.lastURL = href;
				history.pushState({
					myIsotope: true
				}, document.title, href);
			}
			if (is_paginating) {
				isotopeWrapper.addClass('grid-filtering');
			}
			$.ajax({
				url: href
			}).done(function(data) {
				var $resultItems = $(data).find('#' + isotopeId + ' .isotope-layout').html(),
					$resultPagination = $(data).find('#' + isotopeId + ' .pagination')[0],
					$resultCount = $(data).find('#' + isotopeId + ' .woocommerce-result-count')[0];
				isotopeWrapper.addClass('isotope-reloaded');
				requestTimeout(function() {
					isotopeWrapper.removeClass('grid-loading');
					isotopeWrapper.removeClass('isotope-reloaded');
					isotopeWrapper.removeClass('grid-filtering');
				}, 500);
				$.each($('> .tmb > .t-inside', isotopeContainer), function(index, val) {
					var parent = $(val).parent(),
						objTimeout = parent.data('objTimeout');
					if (objTimeout) {
						$(val).removeClass('zoom-reverse').removeClass('start_animation')
						clearRequestTimeout(objTimeout);
					}
					if ($(val).hasClass('animate_when_almost_visible')) {
						$(val).addClass('zoom-reverse').removeClass('start_animation');
					} else {
						$(val).addClass('animate_when_almost_visible zoom-reverse zoom-in force-anim');
					}
				});
				requestTimeout(function() {
					if (isotopeContainer.data('isotope')) {
						isotopeContainer.html($resultItems).children('.tmb').addClass('tmb-iso');
						isotopeContainer.isotope('reloadItems', onLayout(isotopeContainer, 0, true));
						UNCODE.adaptive();
						if (SiteParameters.dynamic_srcset_active === '1') {
							UNCODE.adaptive_srcset(isotopeContainer);
						}
						if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
							var getLightbox = UNCODE.lightboxArray['ilightbox_' + isotopeContainer.closest('.isotope-system').attr('id')];
							if (typeof getLightbox === 'object') {
								getLightbox.refresh();
							} else {
								UNCODE.lightbox();
							}
						}
					}
					isotopeContainer.trigger('more-items-loaded');
				}, 300);
				$('.pagination', isotopeFooter).remove();
				isotopeFooter.append($resultPagination);

				if (isotopeResultCount.length > 0) {
					$('.woocommerce-result-count', isotopeResultCount).remove();
					isotopeResultCount.append($resultCount);
				}
			});
		};
		$filters.each(function(i, buttonGroup) {
			var $buttonGroup = $(buttonGroup);
			$buttonGroup.on('click', 'a:not(.no-isotope-filter)', function() {
				$buttonGroup.find('.active').removeClass('active');
				$(this).addClass('active');

			});

			var $cats_mobile_trigger = $('.menu-smart--filter-cats_mobile-toggle-trigger', $buttonGroup),
				$cats_mobile_toggle = $('.menu-smart--filter-cats_mobile-toggle', $buttonGroup),
				$cats_filters = $('.menu-smart--filter-cats', $buttonGroup);
			$buttonGroup.on('click', 'a.menu-smart--filter-cats_mobile-toggle-trigger', function(e) {
				e.preventDefault();
				$cats_filters.slideToggle(400, 'easeInOutCirc');
			});

		});
		window.addEventListener('boxResized', function(e) {
			if (UNCODE.printDialogOpen !== false) {
				return false;
			}
			$.each($('.isotope-layout'), function(index, val) {
				var $layoutMode = ($(this).data('layout'));
				if ($layoutMode === undefined) $layoutMode = 'masonry';
				if ($(this).data('isotope')) {
					$(this).isotope({
						itemSelector: $itemSelector,
						layoutMode: $layoutMode,
						transitionDuration: transitionDuration[index],
						masonry: {
							columnWidth: colWidth(index)
						},
						vertical: {
							horizontalAlignment: 0.5,
						},
						sortBy: 'original-order',
						isOriginLeft: isOriginLeft
					});
					$(this).isotope('unbindResize');
					if (SiteParameters.dynamic_srcset_active === '1') {
						UNCODE.refresh_dynamic_srcset_size($(this));
					}
				}
				$(this).find('.mejs-video,.mejs-audio').each(function() {
					$(this).trigger('resize');
				});
			});
		}, false);

		init_isotope();
	};
}

UNCODE.lightbox = function() {
	if ( SiteParameters.lbox_enhanced ) {
		return true;
	}
	UNCODE.lightboxArray = {};
	requestTimeout(function() {
		var groupsArr = {};
		$('[data-lbox^=ilightbox]:not(.lb-disabled):not([data-lbox-init]), .uncode-lbox:not(.lb-disabled):not([data-lbox-init])').each(function() {
			var group = this.getAttribute("data-lbox"),
				values = $(this).data();
			$(this).attr('data-lbox-init','true')
			groupsArr[group] = values;
		});
		for (var i in groupsArr) {
			var skin = groupsArr[i].skin || 'black',
				path = groupsArr[i].dir || 'horizontal',
				thumbs = !groupsArr[i].notmb || false,
				arrows = !groupsArr[i].noarr || false,
				social = groupsArr[i].social || false,
				deeplink = groupsArr[i].deep || false,
				$els = $('[data-lbox="' + i + '"]:not(.lb-disabled), .uncode-lbox:not(.lb-disabled)'),
				counter = $els.length,
				dataAlbum = $els.attr('data-album');
			if (social) social = {
				facebook: true,
				twitter: true,
				reddit: true,
				digg: true
			};
			UNCODE.lightboxArray[i] = $els.iLightBox({
				selector: '[data-lbox="' + i + '"]:not(.lb-disabled), .uncode-lbox:not(.lb-disabled)',
				skin: skin,
				path: path,
				linkId: deeplink,
				infinite: false,
				//fullViewPort: 'fit',
				smartRecognition: false,
				fullAlone: true,
				maxScale: 1,
				minScale: .02,
				//fullStretchTypes: 'flash, video',
				overlay: {
					opacity: .94
				},
				controls: {
					arrows: (counter > 1 || ( typeof dataAlbum !== 'undefined' ) ? arrows : false),
					fullscreen: true,
					thumbnail: thumbs,
					slideshow: (counter > 1 || ( typeof dataAlbum !== 'undefined' ) ? true : false)
				},
				show: {
					speed: 200
				},
				hide: {
					speed: 200
				},
				social: {
					start: false,
					buttons: social
				},
				caption: {
					start: false
				},
				styles: {
					nextOpacity: 1,
					nextScale: 1,
					prevOpacity: 1,
					prevScale: 1
				},
				effects: {
					switchSpeed: 400
				},
				slideshow: {
					pauseTime: 5000
				},
				thumbnails: {
					maxWidth: 60,
					maxHeight: 60,
					activeOpacity: .2
				},
				html5video: {
					preload: true
				},
				callback: {
					onOpen: function(){
						$(window).trigger('uncode-custom-cursor');
						if ( $('body').hasClass('ilb-no-bounce') && typeof iNoBounce !== 'undefined' ) {
							iNoBounce.enable();
						}
					},
					onHide: function(){
						if ( $('body').hasClass('ilb-no-bounce') && typeof iNoBounce !== 'undefined' ) {
							iNoBounce.disable()
						}
					},
				}
			});

			$(document).on('infinite-loaded', function(){
				UNCODE.lightboxArray[i].refresh();
			});

			$(window).on('gdprOpen', function(){
				UNCODE.lightboxArray[i].close();
			});
		};
	}, 100);

	$(document).on('click', '.lb-disabled', function(e){
		e.preventDefault();
	});
};

UNCODE.lightgallery = function( $el ) {
	var createSelectors = function(){
		$('a[data-lbox]:not([data-lbox-init]):not([data-album])').each(function(){
			if ( !$(this).closest('.nested-carousel').length && !$(this).closest('.owl-item.cloned').length && !$(this).hasClass('lb-disabled') ) {
				$(this).addClass('lbox-trigger-item');
			} else if ( $(this).closest('.nested-carousel').length && !$(this).closest('.owl-item.cloned').length && !$(this).hasClass('lb-disabled') ) {
				$(this).addClass('lbox-nested-item');
			} else {
				$(this).removeClass('lbox-trigger-item');
				$(this).removeClass('lbox-nested-item');
			}
		});
	};

	createSelectors();

	var galleries = [],
		nested_a = $('a[data-lbox]:not(.lb-disabled):not([data-lbox-init]):not([data-album])').filter(function( index ) {
			return !$(this).closest('.nested-carousel').length;
		}),
		$_galleries = $('.isotope-container:not([data-lbox-init]), .owl-carousel:not([data-lbox-init]), .custom-grid-container:not([data-lbox-init]), .index-scroll-wrapper:not([data-lbox-init]), .justified-gallery:not([data-lbox-init]), .uncode-single-media-wrapper:not([data-lbox-init]), .woocommerce-product-gallery:not([data-lbox-init]), .icon-box:not([data-lbox-init]), .grid-container:not([data-lbox-init]), .btn-container').has('.lbox-trigger-item').not('.isotope-container *, .owl-carousel *, .index-scroll-wrapper *, .justified-gallery *, .woocommerce-product-gallery *, .grid-container *'),
		$galleries = $_galleries.filter(function( index ) {
			return !$(this).closest('.owl-carousel').length || $(this).is('.owl-carousel');
		}),
		$nested = $('.nested-carousel:not([data-lbox-init])').has('.lbox-nested-item');

	if ( typeof $el === 'undefined' ) {
		$el = $galleries.add( $nested );
	}

	var $disabled = $('a.lb-disabled');
	$disabled.on('click', function(e){
		e.preventDefault();
	});

	var beforeSlide = function(event) {
		var detail = event.detail,
			info = detail.info,
			item = detail.item,
			$slide = $(detail.currentSlide.selector),
			$video = $('video', $slide),
			$previous = $(detail.previousSlide.selector),
			$prevVideo = $('video', $previous),
			isAudio = false;

		if ( typeof info.src !== 'undefined' ) {
			isAudio = info.src.search(/.mp3|.m4a/i) > -1;
		}

		if ( ! $video.length && ( info.video || isAudio ) ) {
			if ( info.video ) {
				if ( typeof info.video === 'object' ) {
					var infoJson = info.video;
				} else {
					var infoJson = JSON.parse(info.video);
				}
				var src = infoJson.source[0].src,
					autoplay = $(item).attr('data-autoplay'),
					loop = $(item).attr('data-loop');

			} else if ( isAudio ) {
				var src = info.src,
					autoplay = true,
					loop = false;
			}
			if ( typeof src !== 'undefined' ) {
				$slide.addClass('has-html5');
				var video = document.createElement('video');
				video.src = src;
				video.preload = 'auto';
				video.controls = 'controls';
				video.controlsList = 'nodownload';
				if ( autoplay ) {
					video.autoplay = 'autoplay';
				}
				if ( loop ) {
					video.loop = 'loop';
				}
				$(video).appendTo($slide);
			}
		} else {
			var $video = $('video', $slide);
			if ( $video.length ) {
				$video[0].currentTime = 0;
				if ( $video[0].autoplay ) {
					$video[0].play();
				}
			}
		}
		if ( $prevVideo.length ) {
			$prevVideo[0].currentTime = 0;
			$prevVideo[0].pause();
		}
	};

	var beforeOpen = function(event) {
		var detail = event.detail,
			items = detail.items,
			galleryItems = detail.galleryItems,
			outer = detail.outer.selector,
			i, ii;
		for ( i = 0; i < galleryItems.length; i++ ) {
			var item = galleryItems[i];
			if ( typeof item.video !== 'undefined' || item.oembed === 'video' ) {
				$(outer).find('.lg-thumb-item[data-lg-item-id="' + i + '"]').addClass('thumbnail-video');
			}
		}
		for ( ii = 0; ii < items.length; ii++ ) {
			var item = items[ii];
			if ( $(item).attr('data-icon') === 'video' ) {
				$(outer).find('.lg-thumb-item[data-lg-item-id="' + ii + '"]').addClass('thumbnail-video');
			}
		}

	};

	//caption builder
	$el.each( function( index, val ) {
		var $gallery = $(this).attr('data-lbox-init','true'),
			$_a = '.lbox-trigger-item',
			$_nested_a = '.lbox-nested-item';

		$gallery.find($_a, $_nested_a).each(function(){
			var $a = $(this),
				$img = $('img', $a).first(),
				imgw = $img.attr('data-width'),
				imgh = $img.attr('data-height'),
				caption = $a.attr('data-caption'),
				title = $a.attr('data-title');

			if ( $img.length && $img.attr('data-crop') != true ) {
				if ( typeof $img.attr('data-guid') !== 'undefined' && $img.attr('data-guid') !== '' ) {
					$a.attr('data-external-thumb-image', $img.attr('data-guid'));
				} else if ( $img[0].src && typeof $img.attr('data-srcset') == 'undefined' && $a.attr('data-external-thumb-image') == '' ) {
					$a.attr('data-external-thumb-image', $img[0].src);
				}
			}

			if ( typeof title !== 'undefined' && title !== '' ) {
				title = '<h6>' + title + '</h6>';
			} else {
				title = '';
			}

			if ( typeof caption !== 'undefined' && caption !== '' ) {
				caption = '<p>' + caption + '</p>';
				title += caption;
			}

			if ( title !== '' ) {
				$a.attr( 'title', title );
			}

			if ( $img.attr('data-crop') != true && typeof imgw !== 'undefined' && typeof imgh !== 'undefined' && imgw !== '' && imgh !== '' && ( typeof $a.attr('data-lg-size') === 'undefined' || !$a.attr('data-lg-size') ) ) {
				$a.attr('data-lg-size', imgw + '-' + imgh);
			}
		});
	});

	//regular galleries
	$el.each( function( index, val ) {
		var $gallery = $(this),
			$_a = '.lbox-trigger-item',
			$_nested_a = '.lbox-nested-item',
			$_first = !$gallery.hasClass( 'nested-carousel' ) ? $($_a, $gallery).first() : $($_nested_a, $gallery).first(),
			galleryID = $_first.attr('data-lbox'),
			$_connected_a = $_a + '[data-lbox="' + galleryID + '"]',
			tmb = $_first.attr('data-notmb'),
			social = $_first.attr('data-social'),
			deep = $_first.attr('data-deep'),
			zoom = $_first.attr('data-zoom-origin'),
			actual = $_first.attr('data-actual-size'),
			download = $_first.attr('data-download'),
			controls = $_first.attr('data-arrows') !== 'no',
			fullScreen = $_first.attr('data-full'),
			counter = $_first.attr('data-counter'),
			transition = typeof $_first.attr('data-transition') !== 'undefined' ? $_first.attr('data-transition') : 'lg-slide',
			containerClass = $_first.closest('[data-skin="white"]').length ? 'lg-light-skin' : '',
			connect = $_first.attr('data-connect'),
			$currentVideo = false,
			lgPlugins = [lgVideo],
			itemsLoadedTimeOut;

		containerClass += $_first.attr('data-transparency') === 'opaque' ? ' lg-opaque' : '';
		containerClass += controls && $_first.attr('data-arrows-bg') === 'semi-transparent' ? ' lg-semi-transparent-arrows' : '';

		if ( typeof tmb == 'undefined' || !tmb ) {
			lgPlugins.push(lgThumbnail);
		}
		if ( ( typeof actual != 'undefined' && actual != '' ) || $gallery.is('.woocommerce-product-gallery') ) {
			lgPlugins.push(lgZoom);
		}
		if ( typeof deep != 'undefined' && deep != '' ) {
			lgPlugins.push(lgHash);
		}
		if ( typeof fullScreen != 'undefined' && fullScreen != '' ) {
			lgPlugins.push(lgFullscreen);
		}
		if ( social ) {
			lgPlugins.push(lgShare);
		}

		if ( galleries.indexOf( galleryID ) !== -1 ) {
			return true;
		}

		galleries.push( galleryID );
		var $triggerGal = connect ? $('.page-wrapper') : $gallery,
			$selector = !$triggerGal.hasClass( 'nested-carousel' ) ? ( connect ? $_connected_a : $_a ) : $_nested_a;
		var gallery = lightGallery( $triggerGal[0], {
			addClass: containerClass,
			plugins: lgPlugins,
			mode: transition,
			selector: $selector,
			galleryId: galleryID,
			thumbnail: ( typeof tmb == 'undefined' || !tmb ),
			iframeWidth: '848px',
			iframeMaxWidth: '90%',
			iframeMaxHeight: '90%',
			exThumbImage: 'data-external-thumb-image',
			loadYouTubeThumbnail: false,
			// autoplayFirstVideo: false,
			pager: false,
			startClass: 'lg-start-opacity',
			zoomFromOrigin: zoom,
			controls: controls,
			download: ( typeof download != 'undefined' && download != '' ),
			thumbWidth: 50,
			thumbHeight: '50px',
			counter: $triggerGal.find($selector).length > 1 ? counter : false,
			loadYouTubePoster: false,
			enableDrag: $triggerGal.find($selector).length > 1
		});

		$('.owl-item.cloned', $gallery).find(nested_a).on('click', function(e){
			e.preventDefault();
			var index = $(this).closest('.owl-item.cloned').attr('data-index');
			gallery.openGallery(index-1);
		});

		$triggerGal.on('more-items-loaded', function(e, items) {
			clearRequestTimeout(itemsLoadedTimeOut);
			itemsLoadedTimeOut = requestTimeout(function(){
				createSelectors();
				gallery.refresh();
			}, 100);
		});

		if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
			window.parent.vc.events.once('shortcodeView:beforeUpdate', function(model) {
				$el = model.view.$el;
				if ( $el.find($triggerGal).length ) {
					gallery.destroy();
				}
			});
		}

		$triggerGal[0].addEventListener('lgBeforeSlide', beforeSlide);
		$triggerGal[0].addEventListener('lgBeforeOpen', beforeOpen);
		$triggerGal[0].addEventListener('lgAfterOpen', function(){
			$(window).trigger('uncode-custom-cursor');
		});

	});

	if ( typeof $el !== 'undefined' ) {

		//album galleries
		$('a[data-album]:not([data-lbox-init])').each(function(index, val) {
			var album = val,
				galleryID = index,
				$album = $(album),
				params = $album.attr('data-album'),
				tmb = $(val).attr('data-notmb'),
				social = $(val).attr('data-social'),
				deep = $(val).attr('data-deep'),
				zoom = $(val).attr('data-zoom-origin'),
				actual = $(val).attr('data-actual-size'),
				download = $(val).attr('data-download'),
				controls = $(val).attr('data-arrows') !== 'no',
				fullScreen = $(val).attr('data-full'),
				counter = $(val).attr('data-counter'),
				transition = typeof $(val).attr('data-transition') !== 'undefined' ? $(val).attr('data-transition') : 'lg-slide',
				containerClass = $(val).closest('[data-skin="white"]').length ? 'lg-light-skin' : '',
				$currentVideo = false,
				lgPlugins = [lgVideo];

			$(val).attr('data-lbox-init','true');

			containerClass += $(val).attr('data-transparency') === 'opaque' ? ' lg-opaque' : '';
			containerClass += controls && $(val).attr('data-arrows-bg') === 'semi-transparent' ? ' lg-semi-transparent-arrows' : '';

			if ( typeof tmb == 'undefined' || !tmb ) {
				lgPlugins.push(lgThumbnail);
			}
			if ( typeof actual != 'undefined' && actual != '' ) {
				lgPlugins.push(lgZoom);
			}
			if ( typeof deep != 'undefined' && deep != '' ) {
				lgPlugins.push(lgHash);
			}
			if ( typeof fullScreen != 'undefined' && fullScreen != '' ) {
				lgPlugins.push(lgFullscreen);
			}
			if ( social ) {
				lgPlugins.push(lgShare);
			}

			var gallery = window.lightGallery(album, {
				dynamic: true,
				plugins: lgPlugins,
				dynamicEl: JSON.parse(params),
				galleryId: galleryID,
				addClass: containerClass,
				mode: transition,
				thumbnail: ( typeof tmb == 'undefined' || !tmb ),
				iframeWidth: '848px',
				iframeMaxWidth: '90%',
				iframeMaxHeight: '90%',
				loadYouTubeThumbnail: false,
				// autoplayFirstVideo: false,
				pager: false,
				startClass: 'lg-start-opacity',
				zoomFromOrigin: false,
				controls: controls,
				download: ( typeof download != 'undefined' && download != '' ),
				thumbWidth: 50,
				thumbHeight: '50px',
				loadYouTubePoster: false,
				counter: counter
			});

			$album.on('click', function(){
				gallery.openGallery(0);
			});

			album.addEventListener('lgBeforeSlide', beforeSlide);
			album.addEventListener('lgBeforeOpen', beforeOpen);
			album.addEventListener('lgAfterOpen', function(){
				$(window).trigger('uncode-custom-cursor');
			});

			if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
				window.parent.vc.events.once('shortcodeView:beforeUpdate', function(model) {
					$el = model.view.$el;
					if ( $el.find($album).length ) {
						gallery.destroy();
					}
				});
			}

		});

		//single images
		$('.uncode-lbox:not(.lb-disabled):not([data-lbox-init])').each(function(index, val) {
			var gallery = lightGallery( $('.page-wrapper')[0], {
				selector: '.uncode-lbox:not(.lb-disabled):not([data-lbox-init])',
				iframeWidth: '848px',
				iframeMaxWidth: '90%',
				iframeMaxHeight: '90%',
				loadYouTubeThumbnail: false,
				// autoplayFirstVideo: false,
				startClass: 'lg-start-opacity',
				thumbWidth: 50,
				thumbHeight: '50px',
				download: false,
				loadYouTubePoster: false,
				counter: false
			});

			$('.page-wrapper')[0].addEventListener('lgBeforeSlide', beforeSlide);
			$('.page-wrapper')[0].addEventListener('lgBeforeOpen', beforeOpen);
		});
	}
};

UNCODE.carousel = function(container) {
	var $owlContainers = $('.owl-carousel-container', container);
	$owlContainers.each(function() {
		var $owlContainer = $(this),
			$owlWrapper = $owlContainer.closest('.owl-carousel-wrapper'),
			$owlSelector = $('> [class*="owl-carousel"]', $owlContainer),
			values = {},
			tempTimeStamp,
			currentIndex,
			$owlInsideEqual = [];
		$owlSelector.each(function() {
			var itemID = $(this).attr('id'),
				$elSelector = $(('#' + itemID).toString());
			values['id'] = itemID;
			values['items'] = 1;
			values['columns'] = 3;
			values['fade'] = false;
			values['nav'] = false;
			values['navmobile'] = false;
			values['navskin'] = 'light';
			values['navspeed'] = 400;
			values['dots'] = false;
			values['dotsmobile'] = false;
			values['loop'] = false;
			values['autoplay'] = false;
			values['timeout'] = 3000;
			values['autoheight'] = false;
			values['stagepadding'] = 0;
			values['margin'] = 0;
			values['lg'] = 1;
			values['md'] = 1;
			values['sm'] = 1;
			$.each($(this).data(), function(i, v) {
				values[i] = v;
			});

			if ($(this).closest('.uncode-slider').length) {
				values['navskin'] = '';
				values['navmobile'] = false;
				//values['dotsmobile'] = true;
			} else {
				values['navskin'] = ' style-'+values['navskin']+' style-override';
			}

			var setIndexActive = function(event, init){
				var init = typeof init === 'undefined' ? false : init,
					thiis = $(event.currentTarget);
				if (tempTimeStamp != event.timeStamp && ( init || ( !UNCODE.isFullPage || ( UNCODE.isFullPage && thiis.closest('.fp-section').hasClass('uncode-scroll-active') ) ) ) ) {
					var scrolltop = $(document).scrollTop(),
						size = event.page.size,
						i;
					var setIndex = requestTimeout(function() {
						for ( i = 0; i < size; i++ ) {
							var itemCont = event.item.index != null ? (event.item.index + i) : i;
							var currentItem = thiis.find("> .owl-stage-outer > .owl-stage > .owl-item")[itemCont];
							if (thiis.closest('.row-slider').length) {
								if (currentItem == undefined) {
									currentItem = thiis.children()[i];
								}
								if ($(currentItem).closest('#page-header').length) {
									if ($('.row-container > .row > .row-inner > div > .style-dark', currentItem).closest('.uncode-slider').length) {
										UNCODE.switchColorsMenu(scrolltop, 'dark');
									} else if ($('.row-container > .row > .row-inner > div > .style-light', currentItem).closest('.uncode-slider').length) {
										UNCODE.switchColorsMenu(scrolltop, 'light');
									}
								}
							}
							var itendIndex = $(currentItem).attr('data-index');
							if ( isNaN(itendIndex) ) {
								itendIndex = 1;
							}
							$elSelector.find('.owl-item:not(.new-indexed)').removeClass('index-active');
							$elSelector.find('.owl-item[data-index="' + itendIndex + '"]').addClass('index-active').addClass('new-indexed');
							if ($.fn.counterUp) {
								$elSelector.find('.owl-item[data-index="' + itendIndex + '"] .uncode-counter').each(function(){
									var $counter = $(this);
									$counter.addClass('started').counterUp({
										delay: 10,
										time: 1500
									});
								});
							}
						}
						$elSelector.find('.owl-item.new-indexed').removeClass('new-indexed');
					}, 200);
				}
				tempTimeStamp = event.timeStamp;
			}

			/** Initialized */
			$elSelector.on('initialized.owl.carousel', function(event) {

				if ( $('.isotope-container', event.currentTarget).length ) {
					window.dispatchEvent(UNCODE.boxEvent);
				}

				$('.owl-dot.active', $elSelector).on('click', function(){
					return false;
				});

				var thiis = $(event.currentTarget),
					// get the time from the data method
					time = thiis.data("timer-id"),
					rowParent = thiis.closest('.row-parent');

				if ( typeof rowParent[0] !== 'undefined' ) {
					rowParent[0].dispatchEvent(new CustomEvent('owl-carousel-initialized'));
				}

				if (time) {
					clearRequestTimeout(time);
				}

				thiis.addClass('showControls');
				var new_time = requestTimeout(function() {
					thiis.closest('.owl-carousel-container').removeClass('owl-carousel-loading');
					if (thiis.hasClass('owl-height-viewport'))
						setItemsRelHeight(thiis);
					if (thiis.hasClass('owl-height-equal'))
						setItemsHeight(thiis);
					if (!UNCODE.isMobile && !$elSelector.closest('.header-wrapper').length) navHover($elSelector.parent());
					if (thiis.closest('.unequal, .unexpand').length) {
						UNCODE.setRowHeight(rowParent[0], true);
					}
					if (SiteParameters.dynamic_srcset_active === '1') {
						UNCODE.refresh_dynamic_srcset_size(thiis);
					}
				}, 350);
				// save the new time
				thiis.data("timer-id", new_time);

				var scrolltop = $(document).scrollTop();
				thiis.closest('.uncode-slider').find('video').removeAttr('poster');

				//if (!UNCODE.isMobile) {
					/** fix autoplay when visible **/
				$(window).on('load', function(){
					if (thiis.data('autoplay')) {
						if ( !thiis.closest('.sticky-element').length ) {
							thiis.trigger('stop.autoplay.owl');
						} else {
							thiis.trigger('play.owl.autoplay');
						}
					}
					if (UNCODE.isUnmodalOpen && !thiis.closest('#unmodal-content')) {
						return;
					}
					if ( ! thiis.closest('.sticky-element').length ) {
						var carouselInView = new Waypoint.Inview({
							context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
							element: thiis[0],
							exited: function() {
								var el = $(this.element);
								if (el.data('autoplay') ) {
									el.trigger('stop.owl.autoplay');
									el.data('stopped','true');
								}
							},
							enter: function(direction) {
								var el = $(this.element);
								requestTimeout(function() {
									if (el.data('autoplay')) {
										el.trigger('play.owl.autoplay');
										el.data('stopped','false');
									}
								}, 100);
							}
						});
					}
				});
				//}

				// $(window).on('frontend:carousel_updated', function(){
				// 	Waypoint.refreshAll();
				// });

				if (!thiis.closest('.isotope-system').length) {
					requestTimeout(function() {
						animate_thumb($('.t-inside', el), event);
					}, 400);
				} else {
					requestTimeout(function() {
						thiis.closest('.isotope-container').isotope('layout');
					}, 400);
				}

				var currentItem = thiis.find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
				currentIndex = $(currentItem).attr('data-index');

				$.each($('.owl-item:not(.active) .start_animation', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeClass('start_animation');
					}
				});
				$.each($('.owl-item:not(.active) .already-animated', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeClass('already-animated');
					}
				});

				$.each($('.owl-item:not(.active) [data-animated="yes"]', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeAttr('data-animated');
					}
				});

				$.each($('.owl-item.cloned', thiis), function(index, val) {
					$('.t-entry-visual-cont > a', $(val)).attr('data-lbox-clone', true);
				});

				$.each($('.owl-item:not(.active)', thiis), function(index, val) {
					if ($(val).attr('data-index') != currentIndex) {
						$('.start_animation:not(.t-inside)', val).removeClass('start_animation');
						$('.already-animated:not(.t-inside)', val).removeClass('already-animated');
					}
					if ($(val).attr('data-index') != currentIndex) {
						$('[data-animated="yes"]:not(.t-inside)', val).removeAttr('data-animated');
					}
					if ($(val).attr('data-index') == currentIndex) {
						$('.animate_when_almost_visible:not(.t-inside), .animate_inner_when_almost_visible:not(.t-inside)', val).addClass('start_animation');
					}
				});

				if (thiis.closest('.uncode-slider').length) {
					var el = thiis.closest('.row-parent')[0];
					if ($(el).data('imgready')) {
						firstLoaded(el, event);
					} else {
						el.addEventListener("imgLoaded", function(el) {
							firstLoaded(el.target, event);
						}, false);
					}
					var transHeight = $('.hmenu .menu-transparent.menu-primary .menu-container').height() - UNCODE.bodyBorder;
					if (transHeight != null) {
						requestTimeout(function() {
							thiis.closest('.uncode-slider').find('.owl-prev, .owl-next').css('paddingTop', transHeight / 2 + 'px');
						}, 100);
					}
				} else {
					var el = thiis;
					el.closest('.uncode-slider').addClass('slider-loaded');
				}

				requestTimeout(function() {
					if (typeof UNCODE.bigText !== 'undefined') {
						UNCODE.bigText(thiis);
					}
					if (thiis.closest('.uncode-slider').length) {
						if (thiis.data('autoplay')) pauseOnHover(thiis);
					}
				}, 500);

				if (thiis.closest('.unequal').length) {
					$owlInsideEqual.push(thiis.closest('.row-parent'));
				}

				var containerClasses = '',
					containerStyle = '';
				if ( $('.owl-dots-classes', $owlContainer).length ) {
					containerClasses = $('.owl-dots-classes', $owlContainer).attr('class');
					containerStyle = $('.owl-dots-classes', $owlContainer).attr('style');
					$('.owl-dots-classes', $owlContainer).remove();
				}

				if ( containerClasses !== '' ) {
					requestTimeout(function() {
						if ( containerClasses !== '' )
							$('.owl-dots', $owlContainer).attr('style', containerStyle);
						if ( containerStyle !== '' )
							$('.owl-dots', $owlContainer).addClass(containerClasses);
					}, 100);
				}

				$.each($('.column_child.pos-bottom', thiis), function(index, val) {
					$(val).closest('.row-inner').css({
						'margin-top': '-1px'
					});
				});

				if ($.fn.isotope) {
					if ( thiis.closest('.isotope-container').length ) {
						if (thiis.closest('.isotope-container').data('isotope')) {
							requestTimeout(function(){
								thiis.closest('.isotope-container').isotope('layout');
							}, 300);
						}
						$(window).on('load', function(){
							if (thiis.closest('.isotope-container').data('isotope')) {
								thiis.closest('.isotope-container').isotope('layout');
							}
						});
					}
				}

				if (thiis.data('autoplay')) {
					$(window).on('menuOpen', function(){
						thiis.trigger('stop.owl.autoplay');
						thiis.data('stopped','true');
					}).on('menuClose', function(){

					});
				}
				$(window).on('menuClose', function(){
					if (thiis.data('autoplay')) {
						thiis.trigger('play.owl.autoplay');
						thiis.data('stopped','false');
					}
				});

				setIndexActive(event, true);

				var nested_a = $('a[data-lbox]:not(.lb-disabled):not([data-lbox-init]):not([data-album])').filter(function( index ) {
						return !$(this).closest('.nested-carousel').length;
					}),
					$galleries = $('.isotope-container:not([data-lbox-init]), .owl-carousel:not([data-lbox-init]), .custom-grid-container:not([data-lbox-init]), .index-scroll-wrapper:not([data-lbox-init]), .justified-gallery:not([data-lbox-init]), .uncode-single-media-wrapper:not([data-lbox-init]), .woocommerce-product-gallery:not([data-lbox-init]), .icon-box:not([data-lbox-init]), .grid-container:not([data-lbox-init])', thiis).has(nested_a);


				if (typeof UNCODE.lightgallery !== 'undefined' && SiteParameters.lbox_enhanced) {
					UNCODE.lightgallery( $galleries );
				}


			});

			$elSelector.on('resized.owl.carousel', function(event) {
				var thiis = $(event.currentTarget);
				// if ($(this).closest('.nested-carousel').length) {
				// 	requestTimeout(function() {
				// 		window.dispatchEvent(UNCODE.boxEvent);
				// 	}, 200);
				// }
				if ( thiis.hasClass('owl-height-equal') )
					setItemsHeight(thiis);

				setItemsRelHeight($elSelector);

				setIndexActive(event);

				if (SiteParameters.dynamic_srcset_active === '1') {
					UNCODE.refresh_dynamic_srcset_size(thiis);
				}

				if ($.fn.isotope) {
					$(window).on('load', function(){
						if ($(event.currentTarget).closest('.isotope-container').data('isotope')) {
							$(event.currentTarget).closest('.isotope-container').isotope('layout');
						}
					});
				}
			});

			/** detect resize window for fluid height layout */
			var setFluidResize;
			function manageFluidCarouseHeight() {
				clearRequestTimeout(setFluidResize);
				setFluidResize = requestTimeout(function(){
					setItemsRelHeight($elSelector);
				}, 100);
			}
			window.addEventListener('resize', manageFluidCarouseHeight);

			/** Change */
			$elSelector.on('change.owl.carousel', function(event) {
				if (!UNCODE.isMobile) UNCODE.owlStopVideo(event.currentTarget);
			});

			/** Changed */
			$elSelector.on('changed.owl.carousel', function(event) {
				var $row = $elSelector.parents('.row')[0];
				if ( typeof $row !== 'undefined' ) {
					$row.dispatchEvent(new CustomEvent('owl-carousel-changed'));
				}
				setIndexActive(event);
			});

			var checkDrag = function(e) {
				$elSelector.addClass('owl-dragging');
			};
			$elSelector.on('drag.owl.carousel', function(event) {
				document.addEventListener("mousemove", checkDrag);
			});

			$elSelector.on('dragged.owl.carousel', function(event) {
				$elSelector.removeClass('owl-dragging');
				document.removeEventListener("mousemove", checkDrag);
			});

			$elSelector.on('translate.owl.carousel', function(event) {
				if (UNCODE.isMobile) {
					$(event.currentTarget).addClass('owl-translating');
				}
			});

			/** Translated */
			$elSelector.on('translated.owl.carousel', function(event) {

				var thiis = $(event.currentTarget),
					currentItem = thiis.find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
					currentIndex = $(currentItem).attr('data-index'),
					stagePadding = thiis.data('stagepadding');

				stagePadding = (stagePadding == undefined || stagePadding == 0) ? false : true;

				if (!UNCODE.isMobile) {
					UNCODE.owlPlayVideo(thiis);
				}

				requestTimeout(function(){
					var lastDelayElems = animate_elems($('.owl-item.index-active', thiis));
					var lastDelayThumb = animate_thumb($('.owl-item' + (stagePadding ? '' : '.active') + ' .t-inside', thiis), event);
					if (thiis.closest('.uncode-slider').length && thiis.data('autoplay')) {
						if (lastDelayElems == undefined) lastDelayElems = 0;
						if (lastDelayThumb == undefined) lastDelayThumb = 0;
						var maxDelay = Math.max(lastDelayElems, lastDelayThumb);
						thiis.trigger('stop.owl.autoplay');
						requestTimeout(function() {
							if (!thiis.hasClass('owl-mouseenter') && thiis.data('stopped') != 'true') thiis.trigger('play.owl.autoplay');
						}, maxDelay);
					}
				}, 200);

				$.each($('.owl-item:not(.active) .start_animation', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeClass('start_animation');
					}
				});

				$.each($('.owl-item:not(.active) .already-animated', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeClass('already-animated');
					}
				});

				$.each($('.owl-item:not(.active) [data-animated="yes"]', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeAttr('data-animated');
					}
				});

				$.each($('.owl-item:not(.active)', thiis), function(index, val) {
					if ($(val).attr('data-index') != currentIndex) {
						$('.start_animation:not(.t-inside)', val).removeClass('start_animation');
						$('.already-animated:not(.t-inside)', val).removeClass('already-animated');
					}
					if ($(val).attr('data-index') != currentIndex) {
						$('[data-animated="yes"]:not(.t-inside)', val).removeClass('start_animation');
					}
					if ($(val).attr('data-index') == currentIndex) {
						$('.animate_when_almost_visible:not(.t-inside), .animate_inner_when_almost_visible:not(.t-inside)', val).addClass('start_animation');
					}
				});

				if (UNCODE.isMobile) {
					thiis.removeClass('owl-translating');
				}

				setIndexActive(event);
			});

			if (UNCODE.wwidth < UNCODE.mediaQuery && $(this).data('stagepadding') > 25) values['stagepadding'] = 25;

			/** Init carousel */
			$elSelector.not('.showControls').owlCarousel({
				items: values['items'],
				animateIn: (values['fade'] == true) ? 'fadeIn' : null,
				animateOut: (values['fade'] == true) ? 'fadeOut' : null,
				nav: values['nav'],
				dots: values['dots'],
				loop: values['loop'],
				stagePadding: values['stagepadding'],
				margin: 0,
				video: true,
				autoWidth: false,
				autoplay: false,
				autoplayTimeout: values['timeout'],
				autoplaySpeed: values['navspeed'],
				autoplayHoverPause: $(this).closest('.uncode-slider').length ? false : true,
				autoHeight: ( $(this).hasClass('owl-height-equal') ? false : values['autoheight'] ),
				rtl: $('body').hasClass('rtl') ? true : false,
				fluidSpeed: true,
				navSpeed: values['navspeed'],
				dotsSpeed: values['navspeed'] / values['items'],
				navClass: [ 'owl-prev'+values['navskin'], 'owl-next'+values['navskin'] ],
				navText: ['<div class="owl-nav-container btn-default btn-hover-nobg"><i class="fa fa-fw fa-angle-left"></i></div>', '<div class="owl-nav-container btn-default btn-hover-nobg"><i class="fa fa-fw fa-angle-right"></i></div>'],
				navContainer: values['nav'] && ! SiteParameters.is_frontend_editor ? $elSelector : false,
				responsiveClass: true,
				responsiveBaseElement: '.box-container',
				responsive: {
					0: {
						items: values['sm'],
						nav: values['navmobile'],
						dots: values['dotsmobile'],
						dotsSpeed: values['navspeed'] / values['sm'],
					},
					480: {
						items: values['sm'],
						nav: values['navmobile'],
						dots: values['dotsmobile'],
						dotsSpeed: values['navspeed'] / values['sm'],
					},
					570: {
						items: values['md'],
						nav: values['navmobile'],
						dots: values['dotsmobile'],
						dotsSpeed: values['navspeed'] / values['md'],
					},
					960: {
						items: values['lg'],
						dotsSpeed: values['navspeed'] / values['lg'],
					}
				}
			});

			var transDuration = parseFloat(values['navspeed']) * 0.3;
			var transDuration2 = parseFloat(values['navspeed']) * 0.8;

			$('.owl-item .tmb', $elSelector).css({
				'-webkit-transition-delay': transDuration + 'ms',
				'-moz-transition-delay': transDuration + 'ms',
				'-o-transition-delay': transDuration + 'ms',
				'transition-delay': transDuration + 'ms',
				'-webkit-transition-duration': transDuration2 + 'ms',
				'-moz-transition-duration': transDuration2 + 'ms',
				'-o-transition-duration': transDuration2 + 'ms',
				'transition-duration': transDuration2 + 'ms',
			});

			requestTimeout(function() {
				for (var i = $owlInsideEqual.length - 1; i >= 0; i--) {
					UNCODE.setRowHeight($owlInsideEqual[i]);
				};
			}, 300);

			$(window).on('load', function(){
				var $elCarousel = $elSelector.data('owl.carousel');
				if ( typeof $elCarousel !== 'undefined' ) {
					$elCarousel.trigger('refreshed');
					for (var i = $owlInsideEqual.length - 1; i >= 0; i--) {
						UNCODE.setRowHeight($owlInsideEqual[i]);
					};
				}
			});

			$( document.body ).on( 'added-owl-item', function( e, carousel_id, $new_slide, randId ) {
				if ( $('#' + carousel_id).data( 'added-id' ) != randId ) {
					$('#' + carousel_id).data( 'added-id', randId ).trigger( 'add.owl.carousel', $new_slide ).trigger('refresh.owl.carousel');
					$('#' + carousel_id).find('.owl-item').each( function() {
						var $item = $(this),
							index = ( $item.index() + 1 );
						$item.attr('data-index', index);
					});
				}
			});

			if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
				window.parent.vc.events.on( 'removed-owl-item', function( carousel_id, item_index, randId ) {
					if ( $('#' + carousel_id).data( 'added-id' ) != randId ) {
						$('#' + carousel_id).data( 'added-id', randId ).trigger('remove.owl.carousel', [ (item_index-1) ]).trigger('refresh.owl.carousel');
						$('#' + carousel_id).find('.owl-item').each( function() {
							var $item = $(this),
								index = ( $item.index() + 1 );
							$item.attr('data-index', index);
						});
					}
				});
			}

		});

		function firstLoaded(el, event) {
			var el = $(el),
			uncode_slider = el.find('.uncode-slider');
			el.find('.owl-carousel').css('opacity', 1);
			uncode_slider.addClass('slider-loaded');
			if (typeof UNCODE.bigText !== 'undefined') {
				UNCODE.bigText(el.find('.owl-item.active'));
			}
			//if (!UNCODE.isMobile) {
				requestTimeout(function() {
					var lastDelayElems = animate_elems(el.find('.owl-item.index-active'));
					var lastDelayThumb = animate_thumb(el.find('.owl-item.active .t-inside'), event);
					if (uncode_slider.length && el.find('.owl-carousel').data('autoplay')) {
						if (lastDelayElems == undefined) lastDelayElems = 0;
						if (lastDelayThumb == undefined) lastDelayThumb = 0;
						var maxDelay = Math.max(lastDelayElems, lastDelayThumb);
						$('> .owl-carousel', uncode_slider).trigger('stop.owl.autoplay');
						requestTimeout(function() {
							$('> .owl-carousel', uncode_slider).trigger('play.owl.autoplay');
						}, maxDelay);
					}
				}, 500);

			//}
		}

		function navHover(el) {
			var $owlCont = el,
				$owlPrev = $owlCont.find('.owl-prev'),
				$owlNext = $owlCont.find('.owl-next'),
				$owlDots = $owlCont.find('.owl-dots-inside .owl-dots'),
				$owlPagination = $owlCont.next(),
				owlPrevW = $owlPrev.outerWidth(),
				owlNextW = $owlNext.outerWidth(),
				owlDotsH = $owlDots.innerHeight(),
				owlTime = 400,
				owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
			if ( $('body').hasClass('rtl') ) {
				$owlPrev.css("margin-right", -owlPrevW);
				$owlNext.css("margin-left", -owlNextW);
			} else {
				$owlPrev.css("margin-left", -owlPrevW);
				$owlNext.css("margin-right", -owlNextW);
			}
			if (!owlNested) $owlDots.css("bottom", -owlDotsH);
			$owlCont.mouseenter(function() {
				owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
				$owlPrev.add($owlNext).css({
					marginLeft: 0,
					marginRight: 0
				});
				if (!owlNested) {
					$owlDots.css({
						opacity: 1,
						bottom: 0
					});
				}
			}).mouseleave(function() {
				owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
				if ( $('body').hasClass('rtl') ) {
					$owlPrev.css("margin-right", -owlPrevW);
					$owlNext.css("margin-left", -owlNextW);
				} else {
					$owlPrev.css("margin-left", -owlPrevW);
					$owlNext.css("margin-right", -owlNextW);
				}
				if (!owlNested) {
					$owlDots.css({
						opacity: 1,
						bottom: -owlDotsH
					});
				}
			});
		};

		function animate_elems($this) {
			var lastDelay;
			$.each($('.animate_when_almost_visible:not(.t-inside), .animate_inner_when_almost_visible:not(.t-inside), .animate_when_parent_almost_visible:not(.t-inside)', $this), function(index, val) {
				var element = $(val),
					delayAttr = element.attr('data-delay'),
					$first_item = element.closest('.owl-item[data-index="1"]');

				if ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' && !$first_item.closest('#page-header').length ) {
					return false;
				}

				if (delayAttr == undefined) delayAttr = 0;
				requestTimeout(function() {
					element.addClass('start_animation');
				}, delayAttr);
				lastDelay = delayAttr;
			});
			return lastDelay;
		}

		function animate_thumb(items, event) {
			var lastDelay,
				itemIndex,
				thiis = $(event.currentTarget),
				tempIndex = (thiis.data('tempIndex') == undefined) ? $('.owl-item.active', thiis).first().index() : thiis.data('tempIndex'),
				numActives = $('.owl-item.active', thiis).length,
				stagePadding = thiis.data('stagepadding');

			stagePadding = (stagePadding == undefined || stagePadding == 0) ? false : true;

			thiis.data('tempIndex', event.item.index);
				$.each(items, function(index, val) {
					var parent = $(val).closest('.owl-item');
					if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
						return;
					}
					if (!$(val).hasClass('start_animation')) {
						if (parent.hasClass('active') || stagePadding || $owlWrapper.hasClass('carousel-animation-first')) {
							var thumbInView = new Waypoint.Inview({
							  context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
							  element: val,
							  enter: function(direction) {
								var element = $(this.element),
										delayAttr = parseInt(element.attr('data-delay')),
										itemIndex = element.closest('.owl-item').index() + 1,
										diffItem = Math.abs(itemIndex - tempIndex) - 1;
									if (itemIndex > tempIndex) {
										thiis.data('tempIndex', itemIndex);
									}
									if (isNaN(delayAttr)) delayAttr = 100;
									if (stagePadding) {
										var objTimeout = requestTimeout(function() {
											element.addClass('start_animation');
										}, index * delayAttr);
										lastDelay = index * delayAttr;
									} else {
										$('.owl-item.cloned[data-index="'+(element.closest('.owl-item').data('index'))+'"] .t-inside', thiis).addClass('start_animation');
										var objTimeout = requestTimeout(function() {
											element.addClass('start_animation');
										}, diffItem * delayAttr);
										lastDelay = diffItem * delayAttr;
									}
									parent.data('objTimeout', objTimeout);
									if (!UNCODE.isUnmodalOpen) {
										this.destroy();
									}
								}
							});
						}
					}
				});
				return lastDelay;
			}

		function setItemsHeight(item) {
			$.each($('.owl-item', item), function(index, val) {
				var availableThumbHeight = $('.t-inside', $(val)).height(),
				innerThumbHeight = $('.t-entry-text-tc', $(val)).outerHeight(),
				difference = availableThumbHeight - innerThumbHeight;
				if ($('.tmb-content-under', val).length) {
					var visualPart = $('.t-entry-visual', val);
					if (visualPart.length) {
						difference -= $('.t-entry-visual', val).height();
					}
				}
				if (! $('.tmb-content-lateral', val).length)
					$('.t-entry > *:last-child', val).css( 'transform', 'translateY('+difference+'px)' );
			});
		}

		function setItemsRelHeight(item) {
			$.each($('.owl-item', item), function(index, val) {
				var $rowContainer = $(item).parents('.row-parent').eq(0),
					paddingRow = parseInt($rowContainer.css('padding-top')) + parseInt($rowContainer.css('padding-bottom')),
					$colContainer = $(item).parents('.uncell').eq(0),
					paddingCol = parseInt($colContainer.css('padding-top')) + parseInt($colContainer.css('padding-bottom')),
					winHeight = UNCODE.wheight,
					multiplier_h = parseInt($(item).attr('data-vp-height')),
					data_viewport_h,
					consider_menu = $(item).data('vp-menu');

				if ( consider_menu ) {
					winHeight = winHeight - UNCODE.menuHeight;
				}

				data_viewport_h = Math.ceil(winHeight / (100 / multiplier_h) ) - ( paddingRow + paddingCol );
				$('.t-inside', val).css( 'height', data_viewport_h );
			});
		}

		function pauseOnHover(slider) {
			$('.owl-dots, .owl-prev, .owl-next', slider).on({
				mouseenter: function () {
					$(slider).addClass('owl-mouseenter');
					$(slider).trigger('stop.owl.autoplay');
				},
				mouseleave: function () {
					$(slider).removeClass('owl-mouseenter');
					$(slider).trigger('play.owl.autoplay');
				}
			});
		}
	});
};

UNCODE.owlPlayVideo = function(carousel) {
	var player, iframe;
	$('.owl-item.active .uncode-video-container', carousel).each(function(index, val) {
		var content = $(val).html();
		if (content == '') {
			var getCloned = $('.owl-item:not(.active) .uncode-video-container[data-id="'+$(this).attr('data-id')+'"]').children().first().clone();
			$(val).append(getCloned);
		}
		if ($(this).attr('data-provider') == 'vimeo') {
			iframe = $(this).find('iframe');
			player = new Vimeo.Player(iframe[0]);
			player.play();
		} else if ($(this).attr('data-provider') == 'youtube') {
			if (youtubePlayers[$(this).attr('data-id')] != undefined) youtubePlayers[$(this).attr('data-id')].playVideo();
		} else {
			var player = $(this).find('video');
			if (player.length) {
				$(this).find('video')[0].volume = 0;
				$(this).find('video')[0].play();
				$(val).css('opacity', 1);
			}
		}
	});
};

UNCODE.owlStopVideo = function(carousel) {
	$('.owl-item .uncode-video-container', carousel).each(function(index, val) {
		var player, iframe;
		if ($(this).attr('data-provider') == 'vimeo') {
			iframe = $(this).find('iframe');
			player = new Vimeo.Player(iframe[0]);
			player.pause();
		} else if ($(this).attr('data-provider') == 'youtube') {
			if (youtubePlayers[$(this).attr('data-id')] != undefined) youtubePlayers[$(this).attr('data-id')].pauseVideo();
		} else {
			var player = $(this).find('video');
			if (player.length) {
				$(this).find('video')[0].volume = 0;
				$(this).find('video')[0].play();
			}
		}
	});
};

UNCODE.animations = function() {

	var runWaypoints_TO,
		runWaypoints_carousel_TO,
		runWaypoints_delay = 0,
	highlightComplexFunc = function($wrap, ev){

		var $lines = $('.heading-line-wrap', $wrap),
			not_animate = false;

		if ( $wrap.data('animate') === true ) {
			not_animate = true;
		}

		var $rotatingTxt = $('.uncode-rotating-text-start', $wrap);
		if ( $rotatingTxt.length && $rotatingTxt.attr('data-animated') !== 'true' ) {
			return;
		}

		$lines.each(function(_key, _value){
			var $line = $(_value),
				$inners = $('.split-word-inner', $line),
				$highlights = $('.heading-text-highlight-inner', $line);

			var highlitInnerFunc = function(ev){
				var delay = 0;
				$highlights.each(function(h_key, high){
					var $highlight = $(high),
						$split = $highlight.closest('.split-word:not(.uncode-rotating-span)'),
						$nextSplit = $split.nextUntil(),
						$next = $('.heading-text-highlight-inner', $nextSplit),
						countCh = $split.text().length;

					$highlight.css({
						'-webkit-transition-duration': (30 * countCh) + 'ms',
						'-moz-transition-duration': (30 * countCh) + 'ms',
						'-o-transition-duration': (30 * countCh) + 'ms',
						'transition-duration': (30 * countCh) + 'ms',
					});

					delay += (30 * countCh);

					$next.css({
						'-webkit-transition-delay': delay + 'ms',
						'-moz-transition-delay': delay + 'ms',
						'-o-transition-delay': delay + 'ms',
						'transition-delay': delay + 'ms',
					});
				});
				$highlights.removeAttr('data-animated');
				if ( _key+1 === $lines.length ) {
					$wrap.data('animate', true);
				}
			};

			if ( $('.heading-text-highlight-inner[data-animated="yes"]', $line).length ) {
				if ( not_animate ) {
					$highlights.each(function(h_key, high){
						var $highlight = $(high);
						$highlight.css({
							'-webkit-transition-duration': '0ms',
							'-moz-transition-duration': '0ms',
							'-o-transition-duration': '0ms',
							'transition-duration': '0ms',
						});
					});
					$highlights.removeAttr('data-animated');
				} else {
					if ( typeof ev !== 'undefined' && ev.type === 'defer-highlights' ) {
						highlitInnerFunc();
					} else {
						$inners.last().one('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', highlitInnerFunc);
					}
				}
			}
		});
	};

	$.each($('.header-content-inner'), function(index, val) {
		var element = $(val),
			transition = '';
		if (element.hasClass('top-t-bottom')) transition = 'top-t-bottom';
		if (element.hasClass('bottom-t-top')) transition = 'bottom-t-top';
		if (element.hasClass('left-t-right')) transition = 'left-t-right';
		if (element.hasClass('right-t-left')) transition = 'right-t-left';
		if (element.hasClass('zoom-in')) transition = 'zoom-in';
		if (element.hasClass('zoom-out')) transition = 'zoom-out';
		if (element.hasClass('alpha-anim')) transition = 'alpha-anim';
		if (transition != '') {
			$(val).removeClass(transition);
			var container = element,
				containerDelay = container.attr('data-delay'),
				containerSpeed = container.attr('data-speed'),
				items = $('.header-title > *, .post-info', container);
			$.each(items, function(index, val) {
				var element = $(val),
					//speedAttr = (containerSpeed == undefined) ? containerSpeed : '',
					delayAttr = (containerDelay != undefined) ? containerDelay : 400;
				if (!element.hasClass('animate_when_almost_visible')) {
					delayAttr = Number(delayAttr) + (400 * index);
					if (containerSpeed != undefined) element.attr('data-speed', containerSpeed);
					element.addClass(transition + ' animate_when_almost_visible').attr('data-delay', delayAttr);
				}
			});
			container.css('opacity', 1);
		}
	});

	function animate_css_grids_on_load() {
		$('.cssgrid-system').each(function() {
			var grid = $(this);
			var sequential = grid.hasClass('cssgrid-animate-sequential') ? true : false;
			UNCODE.animate_css_grids(grid, grid.find('.tmb-grid'), 0, sequential, false);
		});
	}

	window.waypoint_animation = function(ev) {
		$.each($('.animate_when_almost_visible:not(.start_animation):not(.t-inside):not(.drop-image-separator), .index-scroll .animate_when_almost_visible, .tmb-media .animate_when_almost_visible:not(.start_animation), .animate_when_almost_visible.has-rotating-text, .custom-grid-container .animate_when_almost_visible:not(.start_animation)'), function(index, val) {
			if ( $(val).hasClass('el-text-split') || ( ( $(val).closest('.unscroll-horizontal').length || $(val).closest('.index-scroll').length ) && !SiteParameters.is_frontend_editor ) ) {
				return true;
			}
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var run = true,
				$carousel = $(val).closest('.owl-carousel');
			if ( $carousel.length ) {
				run = false;
			}
			if (run) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var element = $(this.element),
							index = element.index(),
							delayAttr = element.attr('data-delay');
						if (delayAttr == undefined) delayAttr = 0;
						requestTimeout(function() {
							element.addClass('start_animation');
						}, delayAttr);
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				});
			}
		});
		$.each($('.animate_inner_when_almost_visible'), function(index, val) {
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var run = true,
				$carousel = $(val).closest('.owl-carousel');
			if ( $carousel.length ) {
				run = false;
			}
			if (run) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var $element = $(this.element),
							$childs = $('.animate_when_parent_almost_visible', $element);
						$childs.each(function(key,el){
							var $child = $(el),
								delaySpeed = $child.attr('data-speed'),
								delayAttr = $child.attr('data-delay'),
								intervalAttr = $child.attr('data-interval');
							if (delayAttr == undefined) {
								delayAttr = 50*key;
							}
							requestTimeout(function() {
								$child.addClass('start_animation');
								if ( $child.hasClass('anim-line-checker') ) {
									$child.on('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', function(e) {
										var $line = $child.closest('.heading-line-wrap');
									});
								}
								var $wrapText = $child.closest('.animate_inner_when_almost_visible');
								highlightComplexFunc($wrapText, ev);
								if ( $child.hasClass('anim-tot-checker') ) {
									$child.on('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', function(e) {
										if ( $child.hasClass('anim-tot-checker') ) {
											$wrapText.addClass('already-animated');
											$element.trigger('already-animated');
										}
									});
								}
							}, delayAttr );
						});
						$element.addClass('start_animation');
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				});
			}
		});
	}
	window.waypoint_carousel_animation = function(ev) {
		$.each($('.owl-carousel').find('.animate_when_almost_visible:not(.start_animation):not(.t-inside):not(.drop-image-separator), .tmb-media .animate_when_almost_visible:not(.start_animation)'), function(index, val) {
			if ( $(val).hasClass('el-text-split') ) {
				return true;
			}
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var run = true,
				$carousel = $(val).closest('.owl-carousel'),
				$first_item = $(val).closest('.owl-item[data-index="1"]'),
				$all_first = $('.owl-item[data-index="1"]', $carousel);
			if ( ! ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) && $carousel.attr('data-front-edited') !== 'true' ) {
				run = false;
			}
			if (run) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var element = $(this.element),
							index = element.index(),
							delayAttr = element.attr('data-delay');
						if (delayAttr == undefined) delayAttr = 0;
						requestTimeout(function() {
							if ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) {
								$all_first.attr('data-already-reached', 'true');
							}
							element.addClass('start_animation');
						}, delayAttr);
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				});
			}
		});
		$.each($('.owl-carousel').find('.animate_inner_when_almost_visible'), function(index, val) {
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var run = true,
				$carousel = $(val).closest('.owl-carousel'),
				$first_item = $(val).closest('.owl-item[data-index="1"]'),
				$all_first = $('.owl-item[data-index="1"]', $carousel);
			if ( ! ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) && $carousel.attr('data-front-edited') !== 'true' ) {
				run = false;
			}
			if (run) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var $element = $(this.element),
							$childs = $('.animate_when_parent_almost_visible', $element);
						$childs.each(function(key,el){
							var $child = $(el),
								delaySpeed = $child.attr('data-speed'),
								delayAttr = $child.attr('data-delay'),
								intervalAttr = $child.attr('data-interval');
							if (delayAttr == undefined) {
								delayAttr = 50*key;
							}
							requestTimeout(function() {
								if ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) {
									$all_first.attr('data-already-reached', 'true');
								}
								$child.addClass('start_animation');
								if ( $child.hasClass('anim-line-checker') ) {
									$child.on('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', function(e) {
										var $line = $child.closest('.heading-line-wrap');
									});
								}
								var $wrapText = $child.closest('.animate_inner_when_almost_visible');
								highlightComplexFunc($wrapText, ev);
								if ( $child.hasClass('anim-tot-checker') ) {
									$child.on('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', function(e) {
										if ( $child.hasClass('anim-tot-checker') ) {
											$wrapText.addClass('already-animated');
										}
									});
								}
							}, delayAttr );
						});
						$element.addClass('start_animation');
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				});
			}
		});
	}

	var runWaypoints = function(ev){
		if ( typeof runWaypoints_TO !== 'undefined' && runWaypoints_TO !== '' ) {
			runWaypoints_delay = 400;
		}
		clearRequestTimeout(runWaypoints_TO);
		runWaypoints_TO = requestTimeout(function() {
			window.waypoint_animation(ev);
		}, runWaypoints_delay);

		clearRequestTimeout(runWaypoints_carousel_TO);
		runWaypoints_carousel_TO = requestTimeout(function() {
			window.waypoint_carousel_animation(ev);
		}, 400);
	};
	runWaypoints();
	animate_css_grids_on_load();

	$( document.body ).on( 'uncode_waypoints defer-highlights', function(ev) {
		runWaypoints(ev);
	});
	if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
		window.parent.vc.events.on( 'shortcodeView:updated', runWaypoints );
	}
};

UNCODE.animate_css_grids = function(container, elements, startIndex, sequential, filtering) {
	var $allItems = elements.length - startIndex,
		showed = 0,
		index = 0,
		use_index = false
		;

	if (filtering) {
		if (sequential) {
			use_index = true;
		}
		sequential = false;
	}

	$.each(elements, function(index, val) {
		var $this = $(val),
			elInner = $('> .t-inside', val);

		if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
			return;
		}
		if (val[0]) val = val[0];

		if (elInner.hasClass('animate_when_almost_visible') && !elInner.hasClass('force-anim')) {
			new Waypoint({
				context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
				element: val,
				handler: function() {
					var element = $('> .t-inside', this.element),
						parent = $(this.element);
					var _index = use_index? index : 0;

					var delay = (!sequential) ? _index : ((startIndex !== 0) ? index - $allItems : index),
						delayAttr = parseInt(element.attr('data-delay'));
					if (isNaN(delayAttr)) delayAttr = 100;
					if (sequential || use_index) {
						delay -= showed;
					}
					var objTimeout = requestTimeout(function() {
						element.removeClass('zoom-reverse').addClass('start_animation');
						showed = index;
					}, delay * delayAttr);
					parent.data('objTimeout', objTimeout);
					if (!UNCODE.isUnmodalOpen) {
						this.destroy();
					}
				},
				offset: UNCODE.isFullPage ? '100%' : '90%'
			});
		}

		index++;
	});
};

UNCODE.tapHover = function() {

	var $el = $('html.touch .tmb:not(.tmb-no-double-tap)').find('.t-entry-visual-cont > a, .drop-hover-link'), //.length //html.touch a.btn
		elClass = "hover";

	$(window).on('click', function() {
		$el.removeClass(elClass);
	});

	$el.on("click", function(e) { // cambia click con touch start 'touchstart'
		e.stopPropagation();
		var link = $(this);
		if ( ! link.hasClass(elClass)) {
			e.preventDefault();
			link.addClass("hover");
			$el.not(this).removeClass(elClass);
			return false;
		}
	});
};

UNCODE.onePage = function(isMobile) {
	var current = 0,
		last = 0,
		lastScrollTop = 0,
		forceScroll = false,
		lastScrolled = 0,
		isSectionscroller = ($('.main-onepage').length) ? true : false,
		isOnePage = false,
		getOffset = function () {
			var calculateOffset = (($('.menu-sticky .menu-container:not(.menu-hide)').length && ($(window).width() > UNCODE.mediaQuery)) ? $('.menu-sticky .menu-container:not(.menu-hide)').outerHeight() : 0);
			return calculateOffset;
		}

	// if ( UNCODE.isFullPage || UNCODE.isFullPageSnap )
	// 	return false;

	function init_onepage() {
		if (isSectionscroller && !isMobile && !$('body').hasClass('uncode-scroll-no-dots') && !UNCODE.isFullPageSnap) {
			$("<ul class='onepage-pagination'></ul>").prependTo("body");
		}
		last = $('.onepage-pagination li').last().find('a').data('index');
		$.each($('div[data-parent="true"]'), function(index, val) {
			$(this).attr('data-section', index);
			if (isMobile) return;
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var sectionDown = new Waypoint({
				context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
				element: val,
				handler: function(direction) {
					if (direction == 'down') {
						changeMenuActive(this.element, index);
					}
				},
				offset: function() {
					return 5 + getOffset()
				}
			});
			var sectionUp = new Waypoint({
				context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
				element: val,
				handler: function(direction) {
					if (direction == 'up') {
						changeMenuActive(this.element, index);
					}
				},
				offset: function() {
					return -5 - getOffset()
				}
			});

			if (isSectionscroller) {
				var label;
				if ($(this).attr('data-label') != undefined) label = $(this).attr('data-label');
				else label = '';
				var getName = $(this).attr('data-name');
				if (getName == undefined) getName = index;
				if (label != '') {
					isOnePage = true;
					label = '<span class="cd-label style-accent-bg border-accent-color">' + label + '</span>';
					$('ul.onepage-pagination').append("<li><a class='one-dot-link' data-index='" + (index) + "' href='#" + (getName) + "'><span class='cd-dot-cont'><span class='cd-dot'></span></span>"+label+"</a></li>");
				}
			}
		});

		if (isSectionscroller) {
			$.each($('ul.onepage-pagination li'), function(index, val) {
				var $this = $(val),
					$a = ('a', $this);
				$a.on('click', function(evt) {
					if ( $('.is-selected', $this).length ) {
						return false;
					}
					if ( $('body').hasClass('uncode-scroll-no-history') ) {
						evt.preventDefault();
					}
					Waypoint.refreshAll();
					var el = $('a', evt.currentTarget);
					current = lastScrolled = parseInt(el.attr('data-index'));
					lastScrolled += 1;
					scrollBody(current);
				});
			});
		}

		var goToSection = parseInt((window.location.hash).replace(/[^\d.]/g, ''));
		if (isNaN(goToSection) && window.location.hash != undefined && window.location.hash != '' ) {
			goToSection = String(window.location.hash).replace(/^#/, "");
			goToSection = Number($('[data-name="' + goToSection + '"]').attr('data-section'));
		}

		if (typeof goToSection === 'number' && !isNaN(goToSection)) {
			current = lastScrolled = goToSection;
			$(window).on('load', function(){
				if ( $('.owl-carousel').length ) {
					requestTimeout(function(){
						scrollBody(goToSection);
					}, 400);
				} else {
					scrollBody(goToSection);
				}
			});
		}

	}

	function changeMenuActive(section, index) {
		current = lastScrolled = parseInt($(section).attr('data-section'));
		if (isOnePage) {
			var newSection = $('.onepage-pagination li a[data-index="' + index + '"]');
			if (newSection.length) {
				$('ul.onepage-pagination li a').removeClass('is-selected');
				newSection.addClass('is-selected');
			}
			var getName = $('[data-section="' + index + '"]').attr('data-name');
			if (getName != undefined && getName !== '') {
				$.each($('.menu-container .menu-item > a, .widget_nav_menu .menu-smart .menu-item > a'), function(i, val) {
					var get_href = $(val).attr('href');
					if (get_href != undefined && get_href.substring(get_href.indexOf('#')+1) == getName) {
						$(val).closest('.menu-smart').find('.active').removeClass('active');
						$(val).parent().addClass('active');
					}
				});
			}
		}
	}

	if (isOnePage) {
		$(window).on('scroll', function() {
			var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'];
			if (bodyTop == 0) {
				$('ul.onepage-pagination li a').removeClass('is-selected');
				$('.onepage-pagination li a[data-index="0"]').addClass('is-selected');
				var getName = $('[data-section=0]').attr('data-name');
				if (getName != undefined && getName !== '') {
					$.each($('.menu-container .menu-item > a'), function(i, val) {
						var get_href = $(val).attr('href');
						if (get_href != undefined && get_href.substring(get_href.indexOf('#')+1) == getName) {
							$(val).closest('ul').find('.active').removeClass('active');
							$(val).parent().addClass('active');
						}
					});
				}
			} else if ((window.innerHeight + bodyTop) >= $('.box-container').height()) {
				var lastSection = $('.onepage-pagination li a[data-index="' + last +'"]');
				if (lastSection.length) {
					$('ul.onepage-pagination li a').removeClass('is-selected');
					lastSection.addClass('is-selected');
				}
			}
		});
	}

	var scrollBody = function(index) {
		$('ul.onepage-pagination li a').removeClass('is-selected');
		$('.onepage-pagination li a[data-index="' + index + '"]').addClass('is-selected');

		var getSection = $('[data-section=' + index + ']'),
			scrollTo;

		if (getSection == undefined) return;

		var body = $("html, body"),
			bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
			delta = bodyTop - ($('[data-section="' + index + '"]').length ? $('[data-section="' + index + '"]').offset().top : 0),
			getOffset = UNCODE.get_scroll_offset(index);
		if ( typeof getSection.offset() === 'undefined' )
			return;
		scrollTo = getSection.offset().top;

		// if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) ) {
		if  ( !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) ) {
			var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;
			if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
				scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
			}

			if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length && $('.body').hasClass('vmenu') ) {
				if ( index === 0 ) {
					scrollTo = 0;
				} else {
					scrollTo -= $('.menu-sticky .menu-container').outerHeight();
				}
			} else {
				scrollTo -= getOffset;
			}
		}

		var scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
		if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

		if (index != 0) {
			UNCODE.scrolling = true;
		}

		if (scrollSpeed == 0) {
			body.scrollTop((delta > 0) ? scrollTo - 0.1 : scrollTo);
			UNCODE.scrolling = false;
		} else {
			body.on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
				$(this).stop();
			}).animate({
				scrollTop: (delta > 0) ? scrollTo - 0.1 : scrollTo
			}, scrollSpeed, 'easeInOutCubic', function() {
				$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
				UNCODE.scrolling = false;
				if  ( ( scrollTo != UNCODE.get_scroll_offset(index) && !( $('.menu-desktop-transparent').length && UNCODE.wwidth > UNCODE.mediaQuery ) && !( $('.menu-mobile-transparent').length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) )
				||
				$('.menu-hided').length ) {
					scrollTo = getSection.offset().top;
					getOffset = UNCODE.get_scroll_offset(index);
					scrollTo -= getOffset;
					body.on("scroll wheel DOMMouseScroll mousewheel touchmove", function(){
						$(this).stop();
					}).animate({
						scrollTop: (delta > 0) ? scrollTo - 0.1 : scrollTo
						}, scrollSpeed, 'easeInOutCubic', function() {
							$(this).off("scroll wheel DOMMouseScroll mousewheel touchmove");
							UNCODE.scrolling = false;
						}
					);
				}
			});
		}

	};

	init_onepage();
};

UNCODE.stickyElements = function() {
	var isMobile_wide = UNCODE.isMobile && UNCODE.wwidth < 1024;
	if (!isMobile_wide) {

		var $pageHeader = $('#page-header'),
			$headerRow = $('.vc_row', $pageHeader),
			startSticky = false;

		if ( $headerRow.hasClass('sticky-element') ) {
			$headerRow.removeClass('sticky-element');
			$pageHeader.addClass('sticky-element');
			startSticky = true;
		}

		var calculateOffset = function(el) {
			var getRowPadding = (!$(el).hasClass('with-bg')) ? $(el).closest('.row-parent').css("padding-top") : 0,
				sideOffset = (getRowPadding != undefined && getRowPadding != 0) ? parseInt(getRowPadding.replace("px", "")) : 0,
				shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 0;

			sideOffset += UNCODE.bodyBorder;

			if (UNCODE.adminBarHeight > 0) sideOffset += UNCODE.adminBarHeight;
			if ($('.menu-sticky .menu-container:not(.menu-hide)').length && !$('.menu-wrapper .menu-desktop-transparent').length) {
				if ($('.menu-shrink').length) {
					sideOffset += parseFloat( $('.navbar-brand').data('minheight') ) + shrink;
				} else {
					sideOffset += ($('body.hmenu-center').length ? $('#masthead .menu-container').outerHeight() : parseInt(UNCODE.menuMobileHeight));
				}
			}

			return sideOffset;

		},

		initStickyElement = function() {
			$.each($('.sticky-element'), function(index, element) {
				$(element).stick_in_parent({
					sticky_class: 'is_stucked',
					offset_top: calculateOffset(element),
					bottoming: true,
					inner_scrolling: SiteParameters.sticky_elements === 'on'
				});
			});
		};

		requestTimeout(function() {
			if ($('.sticky-element').length) {

				if ($(window).width() > UNCODE.mediaQuery) {
					initStickyElement();

					if ( startSticky === true ) {
						$('#page-header').trigger('sticky_kit:recalc');
					}
				}

				$(window).on('resize', function(event) {
					if ($(window).width() > UNCODE.mediaQuery) {
						initStickyElement();
					} else {
						$(".sticky-element").trigger("sticky_kit:detach");
					}
				});
			}
		}, 1000);

		if ($('.sticky-element').length) {
			$(window).on('uncode_wc_variation_gallery_loaded', function (event) {
				requestTimeout(function() {
					$(document.body).trigger("sticky_kit:recalc");
				}, 100);
			});
		}

		var $panels = $('.panel-collapse');
		if ( $panels.length ) {
			$panels.each(function(){
				var $panel = $(this);
				$panel.on('shown.bs.collapse hidden.bs.collapse', function(){
					$(document.body).trigger("sticky_kit:recalc");
				});
			});
		}
	}
};

UNCODE.twentytwenty = function() {

  if (!$('.twentytwenty-container').length) return;

// DOM.event.move
//
// 2.0.0
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:     Page coordinates of pointer.
// startX:
// startY:    Page coordinates of pointer at movestart.
// distX:
// distY:     Distance the pointer has moved since movestart.
// deltaX:
// deltaY:    Distance the finger has moved since last event.
// velocityX:
// velocityY: Average velocity over last few events.


(function(fn) {
	if (typeof define === 'function' && define.amd) {
        define([], fn);
    } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
        module.exports = fn;
	} else {
		fn();
	}
})(function(){
	var assign = Object.assign || window.jQuery && jQuery.extend;

	// Number of pixels a pressed pointer travels before movestart
	// event is fired.
	var threshold = 8;

	// Shim for requestAnimationFrame, falling back to timer. See:
	// see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	var requestFrame = (function(){
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(fn, element){
				return window.setTimeout(function(){
					fn();
				}, 25);
			}
		);
	})();

	// Shim for customEvent
	// see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
	(function () {
		if ( typeof window.CustomEvent === "function" ) return false;
		function CustomEvent ( event, params ) {
			params = params || { bubbles: false, cancelable: false, detail: undefined };
			var evt = document.createEvent( 'CustomEvent' );
			evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
			return evt;
		}

		CustomEvent.prototype = window.Event.prototype;
		window.CustomEvent = CustomEvent;
	})();

	var ignoreTags = {
			textarea: true,
			input: true,
			select: true,
			button: true
		};

	var mouseevents = {
		move:   'mousemove',
		cancel: 'mouseup dragstart',
		end:    'mouseup'
	};

	var touchevents = {
		move:   'touchmove',
		cancel: 'touchend',
		end:    'touchend'
	};

	var rspaces = /\s+/;


	// DOM Events

	var eventOptions = { bubbles: true, cancelable: true };

	var eventsSymbol = typeof Symbol === "function" ? Symbol('events') : {};

	function createEvent(type) {
		return new CustomEvent(type, eventOptions);
	}

	function getEvents(node) {
		return node[eventsSymbol] || (node[eventsSymbol] = {});
	}

	function on(node, types, fn, data, selector) {
		types = types.split(rspaces);

		var events = getEvents(node);
		var i = types.length;
		var handlers, type;

		function handler(e) { fn(e, data); }

		while (i--) {
			type = types[i];
			handlers = events[type] || (events[type] = []);
			handlers.push([fn, handler]);
			node.addEventListener(type, handler);
		}
	}

	function off(node, types, fn, selector) {
		types = types.split(rspaces);

		var events = getEvents(node);
		var i = types.length;
		var type, handlers, k;

		if (!events) { return; }

		while (i--) {
			type = types[i];
			handlers = events[type];
			if (!handlers) { continue; }
			k = handlers.length;
			while (k--) {
				if (handlers[k][0] === fn) {
					node.removeEventListener(type, handlers[k][1]);
					handlers.splice(k, 1);
				}
			}
		}
	}

	function trigger(node, type, properties) {
		// Don't cache events. It prevents you from triggering an event of a
		// given type from inside the handler of another event of that type.
		var event = createEvent(type);
		if (properties) { assign(event, properties); }
		node.dispatchEvent(event);
	}


	// Constructors

	function Timer(fn){
		var callback = fn,
		    active = false,
		    running = false;

		function trigger(time) {
			if (active){
				callback();
				requestFrame(trigger);
				running = true;
				active = false;
			}
			else {
				running = false;
			}
		}

		this.kick = function(fn) {
			active = true;
			if (!running) { trigger(); }
		};

		this.end = function(fn) {
			var cb = callback;

			if (!fn) { return; }

			// If the timer is not running, simply call the end callback.
			if (!running) {
				fn();
			}
			// If the timer is running, and has been kicked lately, then
			// queue up the current callback and the end callback, otherwise
			// just the end callback.
			else {
				callback = active ?
					function(){ cb(); fn(); } :
					fn ;

				active = true;
			}
		};
	}


	// Functions

	function noop() {}

	function preventDefault(e) {
		e.preventDefault();
	}

	function isIgnoreTag(e) {
		return !!ignoreTags[e.target.tagName.toLowerCase()];
	}

	function isPrimaryButton(e) {
		// Ignore mousedowns on any button other than the left (or primary)
		// mouse button, or when a modifier key is pressed.
		return (e.which === 1 && !e.ctrlKey && !e.altKey);
	}

	function identifiedTouch(touchList, id) {
		var i, l;

		if (touchList.identifiedTouch) {
			return touchList.identifiedTouch(id);
		}

		// touchList.identifiedTouch() does not exist in
		// webkit yet… we must do the search ourselves...

		i = -1;
		l = touchList.length;

		while (++i < l) {
			if (touchList[i].identifier === id) {
				return touchList[i];
			}
		}
	}

	function changedTouch(e, data) {
		var touch = identifiedTouch(e.changedTouches, data.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		// Chrome Android (at least) includes touches that have not
		// changed in e.changedTouches. That's a bit annoying. Check
		// that this touch has changed.
		if (touch.pageX === data.pageX && touch.pageY === data.pageY) { return; }

		return touch;
	}


	// Handlers that decide when the first movestart is triggered

	function mousedown(e){
		// Ignore non-primary buttons
		if (!isPrimaryButton(e)) { return; }

		// Ignore form and interactive elements
		if (isIgnoreTag(e)) { return; }

		on(document, mouseevents.move, mousemove, e);
		on(document, mouseevents.cancel, mouseend, e);
	}

	function mousemove(e, data){
		checkThreshold(e, data, e, removeMouse);
	}

	function mouseend(e, data) {
		removeMouse();
	}

	function removeMouse() {
		off(document, mouseevents.move, mousemove);
		off(document, mouseevents.cancel, mouseend);
	}

	function touchstart(e) {
		// Don't get in the way of interaction with form elements
		if (ignoreTags[e.target.tagName.toLowerCase()]) { return; }

		var touch = e.changedTouches[0];

		// iOS live updates the touch objects whereas Android gives us copies.
		// That means we can't trust the touchstart object to stay the same,
		// so we must copy the data. This object acts as a template for
		// movestart, move and moveend event objects.
		var data = {
			target:     touch.target,
			pageX:      touch.pageX,
			pageY:      touch.pageY,
			identifier: touch.identifier,

			// The only way to make handlers individually unbindable is by
			// making them unique.
			touchmove:  function(e, data) { touchmove(e, data); },
			touchend:   function(e, data) { touchend(e, data); }
		};

		on(document, touchevents.move, data.touchmove, data);
		on(document, touchevents.cancel, data.touchend, data);
	}

	function touchmove(e, data) {
		var touch = changedTouch(e, data);
		if (!touch) { return; }
		checkThreshold(e, data, touch, removeTouch);
	}

	function touchend(e, data) {
		var touch = identifiedTouch(e.changedTouches, data.identifier);
		if (!touch) { return; }
		removeTouch(data);
	}

	function removeTouch(data) {
		off(document, touchevents.move, data.touchmove);
		off(document, touchevents.cancel, data.touchend);
	}

	function checkThreshold(e, data, touch, fn) {
		var distX = touch.pageX - data.pageX;
		var distY = touch.pageY - data.pageY;

		// Do nothing if the threshold has not been crossed.
		if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

		triggerStart(e, data, touch, distX, distY, fn);
	}

	function triggerStart(e, data, touch, distX, distY, fn) {
		var touches = e.targetTouches;
		var time = e.timeStamp - data.timeStamp;

		// Create a movestart object with some special properties that
		// are passed only to the movestart handlers.
		var template = {
			altKey:     e.altKey,
			ctrlKey:    e.ctrlKey,
			shiftKey:   e.shiftKey,
			startX:     data.pageX,
			startY:     data.pageY,
			distX:      distX,
			distY:      distY,
			deltaX:     distX,
			deltaY:     distY,
			pageX:      touch.pageX,
			pageY:      touch.pageY,
			velocityX:  distX / time,
			velocityY:  distY / time,
			identifier: data.identifier,
			targetTouches: touches,
			finger: touches ? touches.length : 1,
			enableMove: function() {
				this.moveEnabled = true;
				this.enableMove = noop;
				e.preventDefault();
			}
		};

		// Trigger the movestart event.
		trigger(data.target, 'movestart', template);

		// Unbind handlers that tracked the touch or mouse up till now.
		fn(data);
	}


	// Handlers that control what happens following a movestart

	function activeMousemove(e, data) {
		var timer  = data.timer;

		data.touch = e;
		data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeMouseend(e, data) {
		var target = data.target;
		var event  = data.event;
		var timer  = data.timer;

		removeActiveMouse();

		endEvent(target, event, timer, function() {
			// Unbind the click suppressor, waiting until after mouseup
			// has been handled.
			setTimeout(function(){
				off(target, 'click', preventDefault);
			}, 0);
		});
	}

	function removeActiveMouse() {
		off(document, mouseevents.move, activeMousemove);
		off(document, mouseevents.end, activeMouseend);
	}

	function activeTouchmove(e, data) {
		var event = data.event;
		var timer = data.timer;
		var touch = changedTouch(e, event);

		if (!touch) { return; }

		// Stop the interface from gesturing
		e.preventDefault();

		event.targetTouches = e.targetTouches;
		data.touch = touch;
		data.timeStamp = e.timeStamp;

		timer.kick();
	}

	function activeTouchend(e, data) {
		var target = data.target;
		var event  = data.event;
		var timer  = data.timer;
		var touch  = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		removeActiveTouch(data);
		endEvent(target, event, timer);
	}

	function removeActiveTouch(data) {
		off(document, touchevents.move, data.activeTouchmove);
		off(document, touchevents.end, data.activeTouchend);
	}


	// Logic for triggering move and moveend events

	function updateEvent(event, touch, timeStamp) {
		var time = timeStamp - event.timeStamp;

		event.distX =  touch.pageX - event.startX;
		event.distY =  touch.pageY - event.startY;
		event.deltaX = touch.pageX - event.pageX;
		event.deltaY = touch.pageY - event.pageY;

		// Average the velocity of the last few events using a decay
		// curve to even out spurious jumps in values.
		event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
		event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
		event.pageX =  touch.pageX;
		event.pageY =  touch.pageY;
	}

	function endEvent(target, event, timer, fn) {
		timer.end(function(){
			trigger(target, 'moveend', event);
			return fn && fn();
		});
	}


	// Set up the DOM

	function movestart(e) {
		if (e.defaultPrevented) { return; }
		if (!e.moveEnabled) { return; }

		var event = {
			startX:        e.startX,
			startY:        e.startY,
			pageX:         e.pageX,
			pageY:         e.pageY,
			distX:         e.distX,
			distY:         e.distY,
			deltaX:        e.deltaX,
			deltaY:        e.deltaY,
			velocityX:     e.velocityX,
			velocityY:     e.velocityY,
			identifier:    e.identifier,
			targetTouches: e.targetTouches,
			finger:        e.finger
		};

		var data = {
			target:    e.target,
			event:     event,
			timer:     new Timer(update),
			touch:     undefined,
			timeStamp: e.timeStamp
		};

		function update(time) {
			updateEvent(event, data.touch, data.timeStamp);
			trigger(data.target, 'move', event);
		}

		if (e.identifier === undefined) {
			// We're dealing with a mouse event.
			// Stop clicks from propagating during a move
			on(e.target, 'click', preventDefault);
			on(document, mouseevents.move, activeMousemove, data);
			on(document, mouseevents.end, activeMouseend, data);
		}
		else {
			// In order to unbind correct handlers they have to be unique
			data.activeTouchmove = function(e, data) { activeTouchmove(e, data); };
			data.activeTouchend = function(e, data) { activeTouchend(e, data); };

			// We're dealing with a touch.
			on(document, touchevents.move, data.activeTouchmove, data);
			on(document, touchevents.end, data.activeTouchend, data);
		}
	}

	on(document, 'mousedown', mousedown);
	on(document, 'touchstart', touchstart);
	on(document, 'movestart', movestart);


	// jQuery special events
	//
	// jQuery event objects are copies of DOM event objects. They need
	// a little help copying the move properties across.

	if (!window.jQuery) { return; }

	var properties = ("startX startY pageX pageY distX distY deltaX deltaY velocityX velocityY").split(' ');

	function enableMove1(e) { e.enableMove(); }
	function enableMove2(e) { e.enableMove(); }
	function enableMove3(e) { e.enableMove(); }

	function add(handleObj) {
		var handler = handleObj.handler;

		handleObj.handler = function(e) {
			// Copy move properties across from originalEvent
			var i = properties.length;
			var property;

			while(i--) {
				property = properties[i];
				e[property] = e.originalEvent[property];
			}

			handler.apply(this, arguments);
		};
	}

	jQuery.event.special.movestart = {
		setup: function() {
			// Movestart must be enabled to allow other move events
			on(this, 'movestart', enableMove1);

			// Do listen to DOM events
			return false;
		},

		teardown: function() {
			off(this, 'movestart', enableMove1);
			return false;
		},

		add: add
	};

	jQuery.event.special.move = {
		setup: function() {
			on(this, 'movestart', enableMove2);
			return false;
		},

		teardown: function() {
			off(this, 'movestart', enableMove2);
			return false;
		},

		add: add
	};

	jQuery.event.special.moveend = {
		setup: function() {
			on(this, 'movestart', enableMove3);
			return false;
		},

		teardown: function() {
			off(this, 'movestart', enableMove3);
			return false;
		},

		add: add
	};
});

  $.fn.twentytwenty = function(options) {
    var options = $.extend({
      default_offset_pct: 0.5,
      orientation: 'horizontal',
      before_label: 'Before',
      after_label: 'After',
      no_overlay: false,
      move_slider_on_hover: false,
      move_with_handle_only: true,
      click_to_move: false
    }, options);

    return this.each(function() {

      var sliderPct = options.default_offset_pct;
      var container = $(this);
      var sliderOrientation = options.orientation;
      var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
      var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';


      container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
      if(!options.no_overlay) {
        container.append("<div class='twentytwenty-overlay'></div>");
        var overlay = container.find(".twentytwenty-overlay");
        overlay.append("<div class='twentytwenty-before-label' data-content='"+options.before_label+"'></div>");
        overlay.append("<div class='twentytwenty-after-label' data-content='"+options.after_label+"'></div>");
      }
      var beforeImg = container.find("img:first");
      var afterImg = container.find("img:last");
      container.append("<div class='twentytwenty-handle style-accent-bg border-accent-color'></div>");
      var slider = container.find(".twentytwenty-handle");
      slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
      slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
      container.addClass("twentytwenty-container");
      beforeImg.addClass("twentytwenty-before");
      afterImg.addClass("twentytwenty-after");

      var calcOffset = function(dimensionPct) {
        var w = beforeImg.width();
        var h = beforeImg.height();
        return {
          w: w+"px",
          h: h+"px",
          cw: (dimensionPct*w)+"px",
          ch: (dimensionPct*h)+"px"
        };
      };

      var adjustContainer = function(offset) {
      	if (sliderOrientation === 'vertical') {
          beforeImg.css("clip", "rect(0,"+offset.w+","+offset.ch+",0)");
          afterImg.css("clip", "rect("+offset.ch+","+offset.w+","+offset.h+",0)");
      	}
      	else {
          beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
          afterImg.css("clip", "rect(0,"+offset.w+","+offset.h+","+offset.cw+")");
    	}
        container.css("height", offset.h);
      };

      var adjustSlider = function(pct) {
        var offset = calcOffset(pct);
        slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
        adjustContainer(offset);
      };

      // Return the number specified or the min/max number if it outside the range given.
      var minMaxNumber = function(num, min, max) {
        return Math.max(min, Math.min(max, num));
      };

      // Calculate the slider percentage based on the position.
      var getSliderPercentage = function(positionX, positionY) {
        var sliderPercentage = (sliderOrientation === 'vertical') ?
          (positionY-offsetY)/imgHeight :
          (positionX-offsetX)/imgWidth;

        return minMaxNumber(sliderPercentage, 0, 1);
      };


      $(window).on("resize.twentytwenty", function(e) {
        adjustSlider(sliderPct);
      });

      var offsetX = 0;
      var offsetY = 0;
      var imgWidth = 0;
      var imgHeight = 0;
      var onMoveStart = function(e) {
        if (((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) && sliderOrientation !== 'vertical') {
          e.preventDefault();
        }
        else if (((e.distX < e.distY && e.distX < -e.distY) || (e.distX > e.distY && e.distX > -e.distY)) && sliderOrientation === 'vertical') {
          e.preventDefault();
        }
        container.addClass("active");
        offsetX = container.offset().left;
        offsetY = container.offset().top;
        imgWidth = beforeImg.width();
        imgHeight = beforeImg.height();
      };
      var onMove = function(e) {
        if (container.hasClass("active")) {
          sliderPct = getSliderPercentage(e.pageX, e.pageY);
          adjustSlider(sliderPct);
        }
      };
      var onMoveEnd = function() {
          container.removeClass("active");
      };

      var moveTarget = options.move_with_handle_only ? slider : container;
      moveTarget.on("movestart",onMoveStart);
      moveTarget.on("move",onMove);
      moveTarget.on("moveend",onMoveEnd);

      if (options.move_slider_on_hover) {
        container.on("mouseenter", onMoveStart);
        container.on("mousemove", onMove);
        container.on("mouseleave", onMoveEnd);
      }

      slider.on("touchmove", function(e) {
        e.preventDefault();
      });

      container.find("img").on("mousedown", function(event) {
        event.preventDefault();
      });

      if (options.click_to_move) {
        container.on('click', function(e) {
          offsetX = container.offset().left;
          offsetY = container.offset().top;
          imgWidth = beforeImg.width();
          imgHeight = beforeImg.height();

          sliderPct = getSliderPercentage(e.pageX, e.pageY);
          adjustSlider(sliderPct);
        });
      }

      $(window).trigger("resize.twentytwenty");
    });
  };


  $(window).on("load", function(e) {
  	$('.twentytwenty-container').each(function(){
  		var $container = $(this);
  		if ( ! $('.twentytwenty-wrapper', $container).length ) {
  			$container.twentytwenty();
  		}
  		$('img', $container).on('async-done', function(){
	  		if ( ! $('.twentytwenty-wrapper', $container).length ) {
	  			$container.twentytwenty();
	  		}
	    });
  	});
  });
}

UNCODE.justifiedGallery = function() {

	var breakPointMe = function( val ) {
		val = parseInt( val );
		if ( isNaN(val) ) {
			return false;
		}
		if ( val >= 1500 ) {
			return 1;
		} else if ( val < 1500 && val >= 960 ) {
			return 2;
		} else if ( val < 960 && val >= 570 ) {
			return 3;
		} else if ( val < 570 ) {
			return 4;
		}
	}

	var gutterByBreakpoint = function( bp, gutter ) {
		var ret;
		switch(gutter) {
		    case 'no-gutter':
		    	ret = 0;
		        break;
		    case 'px-gutter':
		    	ret = 1;
		        break;
		    case 'half-gutter':
		    	ret = 18;
		        break;
		    case 'double-gutter':
				switch(bp) {
				    case 3:
				    case 4:
				    	ret = 36;
				        break;
				    default:
				    	ret = 72;
				        break;
				}
		        break;
		    case 'triple-gutter':
				switch(bp) {
				    case 3:
				    case 4:
				    	ret = 36;
				        break;
				    default:
				    	ret = 108;
				        break;
				}
		        break;
		    case 'quad-gutter':
				switch(bp) {
				    case 2:
				    	ret = 108;
				        break;
				    case 3:
				    	ret = 72;
				        break;
				    case 4:
				    	ret = 36;
				        break;
				    default:
				    	ret = 144;
				        break;
				}
		        break;
		    default:
		    	ret = 36;//single-gutter
		}
		return ret;
	}

	if ($('.justified-layout').length > 0) {
		var justifiedContainersArray = [],
			typeGridArray = [],
			layoutGridArray = [],
			transitionDuration = [],
			$filterItems = [],
			$filters = $('.justified-system .isotope-filters'),
			$itemSelector = '.tmb',
			$items,
			itemMargin,
			correctionFactor = 0,
			firstLoad = true,
			isOriginLeft = $('body').hasClass('rtl') ? false : true,
			prevW = breakPointMe(UNCODE.wwidth);
		$('[class*="justified-container"]').each(function() {
			var isoData = $(this).data();
			transitionDuration.push($('.t-inside.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
			if (isoData.type == 'metro') typeGridArray.push(true);
			else typeGridArray.push(false);
			if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
			else layoutGridArray.push('justified');
			justifiedContainersArray.push($(this));
		});
		var init_justifiedGallery = function() {
			for (var i = 0, len = justifiedContainersArray.length; i < len; i++) {
				var justifiedSystem = $(justifiedContainersArray[i]).closest($('.justified-system')),
					justifiedId = justifiedSystem.attr('id'),
					$layoutMode = layoutGridArray[i],
					gutter = $(justifiedContainersArray[i]).data('gutter'),
					rowHeight = $(justifiedContainersArray[i]).data('row-height'),
					maxRowHeight = $(justifiedContainersArray[i]).data('max-row-height'),
					lastRow = $(justifiedContainersArray[i]).data('last-row'),
					margins;

				rowHeight = typeof rowHeight === 'undefined' || rowHeight === '' ? 250 : parseFloat(rowHeight);
				maxRowHeight = typeof maxRowHeight === 'undefined' || maxRowHeight === '' ? false : parseFloat(maxRowHeight);
				lastRow = typeof lastRow === 'undefined' || lastRow === '' ? 'nojustify' : lastRow;

				margins = gutterByBreakpoint(prevW, gutter);

				$(justifiedContainersArray[i]).justifiedGallery({
					rowHeight: rowHeight,
					maxRowHeight: maxRowHeight,
					margins: margins,
					cssAnimation: true,
					lastRow: lastRow,
					waitThumbnailsLoad: false
				}).one('jg.complete', function(){ onLayout($(this), 0); } );

				if ($(justifiedContainersArray[i]).hasClass('isotope-infinite') && $.fn.infinitescroll) {
					$(justifiedContainersArray[i]).infinitescroll({
							navSelector: '#' + justifiedId + ' .loadmore-button', // selector for the pagination container
							nextSelector: '#' + justifiedId + ' .loadmore-button a', // selector for the NEXT link (to page 2)
							itemSelector: '#' + justifiedId + ' .justified-layout .tmb, #' + justifiedId + ' .isotope-filters li', // selector for all items you'll retrieve
							animate: false,
							behavior: 'local',
							debug: false,
							loading: {
								selector: '#' + justifiedId + '.justified-system .justified-footer-inner',
								speed: 0,
								finished: undefined,
								msg: $('#' + justifiedId + ' .loadmore-button'),
							},
							errorCallback: function() {
								var justified_system = $(this).closest('.justified-system');
								$('.loading-button', justified_system).hide();
								$('.loadmore-button', justified_system).attr('style', 'display:none !important');
							}
						},
						// append the new items to galleryJustified on the infinitescroll callback function.
						function(newElements, opts) {
							var $galleryJustified = $(this),
								justifiedId = $galleryJustified.closest('.justified-system').attr('id'),
								filters = new Array(),
								$loading_button = $galleryJustified.closest('.justified-system').find('.loading-button'),
								$infinite_button = $galleryJustified.closest('.justified-system').find('.loadmore-button'),
								$numPages = $('a', $infinite_button).data('pages'),
								delay = 300;
							$('a', $infinite_button).html($('a', $infinite_button).data('label'));
							$infinite_button.show();
							$loading_button.hide();
							if ( $numPages != undefined && opts.state.currPage == $numPages) $infinite_button.hide();
							$('> li', $galleryJustified).remove();
							$.each($(newElements), function(index, val) {
								$(val).addClass('tmb-iso');
								if ($(val).is("li")) {
									filters.push($(val)[0]);
								}
							});
							newElements = newElements.filter(function(x) {
								return filters.indexOf(x) < 0
							});
							$.each($(filters), function(index, val) {
								if ($('#' + justifiedId + ' a[data-filter="' + $('a', val).attr('data-filter') + '"]').length == 0) $('#' + justifiedId + ' .isotope-filters ul').append($(val));
							});
							$galleryJustified.justifiedGallery('norewind', onLayout($galleryJustified, newElements.length));
							if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
								var getLightbox = UNCODE.lightboxArray['ilightbox_' + justifiedId];
								if (typeof getLightbox === 'object') {
									getLightbox.refresh();
								} else {
									UNCODE.lightbox();
								}
							}
							if ( typeof twttr !== 'undefined' )
								twttr.widgets.load(justifiedContainersArray[i]);

							requestTimeout(function() {
								$galleryJustified.trigger('more-items-loaded');
							}, 1000);
						});
					if ($(justifiedContainersArray[i]).hasClass('isotope-infinite-button')) {
						var $infinite_justified = $(justifiedContainersArray[i]),
							$infinite_button = $infinite_justified.closest('.justified-system').find('.loadmore-button a');
						$infinite_justified.infinitescroll('pause');
						$infinite_button.on('click', function(event) {
							if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
								$.each(UNCODE.lightboxArray, function(index, val) {
									UNCODE.lightboxArray[index].destroy();
								});
							}
							event.preventDefault();
							var $justified_system = $(event.target).closest('.justified-system'),
							$infinite_justified = $justified_system.find('.justified-container'),
							justifiedId = $justified_system.attr('id');
							$(event.currentTarget).html(SiteParameters.loading);
							$infinite_justified.infinitescroll('resume');
							$infinite_justified.infinitescroll('retrieve');
							$infinite_justified.infinitescroll('pause');
							$infinite_justified.trigger('more-items-loaded');
						});
					}
				}
			}
		},
		onLayout = function(justifiedObj, startIndex) {
			justifiedObj.css('opacity', 1);
			justifiedObj.closest('.justified-system').find('.justified-footer').css('opacity', 1);
			$('.tmb', justifiedObj).addClass('justified-object-loaded');

			requestTimeout(function() {
				// window.dispatchEvent(UNCODE.boxEvent);
				UNCODE.adaptive();
				if (SiteParameters.dynamic_srcset_active === '1') {
					UNCODE.refresh_dynamic_srcset_size(justifiedObj);
				}
				if (typeof MediaElement === "function") {
					$(justifiedObj).find('audio,video').each(function() {
						$(this).mediaelementplayer({
								pauseOtherPlayers: false,
						});
					});
				}
				if ($(justifiedObj).find('.nested-carousel').length) {
					if (typeof UNCODE.carousel !== 'undefined') {
						UNCODE.carousel($(justifiedObj).find('.nested-carousel'));
					}
					requestTimeout(function() {
						boxAnimation($('.tmb', justifiedObj), startIndex, true, justifiedObj);
						justifiedObj.addClass('justified-gallery-finished')
						Waypoint.refreshAll();
					}, 200);
				} else {
					requestTimeout(function() {
						boxAnimation($('.tmb', justifiedObj), startIndex, true, justifiedObj);
						justifiedObj.addClass('justified-gallery-finished')
						Waypoint.refreshAll();
					}, 300);
				}
			}, 100);

		},
		boxAnimation = function(items, startIndex, sequential, container) {
			var $allItems = items.length - startIndex,
				showed = 0,
				index = 0;
			if (container.closest('.owl-item').length == 1) return false;
			$.each(items, function(index, val) {
				var elInner = $('> .t-inside', val);
				if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
					return;
				}
				if (val[0]) val = val[0];
				if (elInner.hasClass('animate_when_almost_visible') && !elInner.hasClass('force-anim')) {
					new Waypoint({
						context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
						element: val,
						handler: function() {
							var element = $('> .t-inside', this.element),
								parent = $(this.element),
								currentIndex = parent.index();
							var delay = (!sequential) ? index : ((startIndex !== 0) ? currentIndex - $allItems : currentIndex),
								delayAttr = parseInt(element.attr('data-delay'));
							if (isNaN(delayAttr)) delayAttr = 100;
							delay -= showed;
							var objTimeout = requestTimeout(function() {
								element.removeClass('zoom-reverse').addClass('start_animation');
								showed = parent.index();
							}, delay * delayAttr);
							parent.data('objTimeout', objTimeout);
							if (!UNCODE.isUnmodalOpen) {
								this.destroy();
							}
						},
						offset: '100%'
					})
				} else {
					elInner.removeClass('animate_when_almost_visible');
					$(val).addClass('no-waypoint-animation');
					/*if (elInner.hasClass('force-anim')) {
						elInner.addClass('start_animation');
					} else {
						elInner.css('opacity', 1);
					}*/
				}
				index++;
			});
		};
		$filters.on('click', 'a[data-filter]', function(evt) {
			var $filter = $(this),
				filterContainer = $filter.closest('.isotope-filters'),
				filterValue = $filter.attr('data-filter'),
				container = $filter.closest('.justified-system').find($('.justified-layout')),
				lastRow = container.data('last-row'),
				transitionDuration = 0,
				delay = 300,
				filterItems = [];

			lastRow = typeof lastRow === 'undefined' || lastRow === '' ? 'nojustify' : lastRow;

			var filter_items = function(){
				if (filterValue !== undefined) {
					$.each($('> .tmb > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse');
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});

					requestTimeout(function() {
						var $block,
							selector,
							lightboxElements,
							$boxes;

						if ( filterValue !== '' && filterValue !== '*' ) {
							$('[data-lbox^=ilightbox]', container).addClass('lb-disabled');
							selector = '.' + filterValue;
							$.each($(selector, container), function(index, block) {
								lightboxElements = $('[data-lbox^=ilightbox]', block);
								if (lightboxElements.length) {
									lightboxElements.removeClass('lb-disabled');
									container.data('lbox', $(lightboxElements[0]).data('lbox'));
								}
								filterItems.push(block);
							});
							container.justifiedGallery({
								filter: selector,
								lastRow: 'nojustify'
							});
						} else {
							container.justifiedGallery({
								filter: false,
								lastRow: lastRow
							});
							$('[data-lbox^=ilightbox]', $block).removeClass('lb-disabled');
							filterItems = $('> .tmb', container);
						}
						container.trigger('more-items-loaded');

						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');
						if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
							var getLightbox = UNCODE.lightboxArray[container.data('lbox')];
							if (typeof getLightbox === 'object') {
								getLightbox.refresh();
							} else {
								UNCODE.lightbox();
							}
						}

						if (transitionDuration == 0) {
							requestTimeout(function() {
								boxAnimation(filterItems, 0, false, container);
							}, 100);
						}
						requestTimeout(function() {
							Waypoint.refreshAll();
							container.trigger('more-items-loaded');
						}, 2000);

					}, delay);
				} else {
					if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
						$.each(UNCODE.lightboxArray, function(index, val) {
							UNCODE.lightboxArray[index].destroy();
						});
					}
					$.each($('> .tmb > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
						UNCODE.lightbox();
					}
					container.parent().addClass('justified-loading');
					container.trigger('more-items-loaded');
				}
			};

			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
                    var calc_scroll = container.closest('.row-parent').offset().top;
                    calc_scroll -= UNCODE.get_scroll_offset();

					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - calc_scroll,
						scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed,
						filterTolerance = false,
						filter_timeout;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if ( !UNCODE.isFullPage ) {
						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
							filter_items();
						} else {

							if ( bodyTop <= (calc_scroll+20) && bodyTop >= (calc_scroll-20) ) {
								filter_items();
								filterTolerance = true;
							}

							$('html, body').animate({
								scrollTop: calc_scroll
							},{
								easing: 'easeInOutQuad',
								duration: scrollSpeed,
								complete: function(){
									UNCODE.scrolling = false;
									if ( !filterTolerance ) {
										filter_timeout = setTimeout(function(){
											clearTimeout(filter_timeout);
											filter_items();
										}, 200);
									}
								}
							});
						}
					}
				} else {
					filter_items();
				}
			}
			evt.preventDefault();
		});

		$filters.each(function(i, buttonGroup) {
			var $buttonGroup = $(buttonGroup);
			$buttonGroup.on('click', 'a', function() {
				$buttonGroup.find('.active').removeClass('active');
				$(this).addClass('active');
			});

			var $cats_mobile_trigger = $('.menu-smart--filter-cats_mobile-toggle-trigger', $buttonGroup),
				$cats_mobile_toggle = $('.menu-smart--filter-cats_mobile-toggle', $buttonGroup),
				$cats_filters = $('.menu-smart--filter-cats', $buttonGroup);
			$buttonGroup.on('click', 'a.menu-smart--filter-cats_mobile-toggle-trigger', function(e) {
				e.preventDefault();
				$cats_filters.slideToggle(400, 'easeInOutCirc');
			});
		});
		window.addEventListener('boxResized', function(e) {
			if ( prevW !== breakPointMe(UNCODE.wwidth) ) {
				prevW = breakPointMe(UNCODE.wwidth);
				$.each($('.justified-layout'), function(index, val) {
					var gutter = $(this).data('gutter'),
						margins = gutterByBreakpoint( prevW, gutter);
					$(this).justifiedGallery({
						margins: margins
					});
					$(this).find('.mejs-video,.mejs-audio').each(function() {
						$(this).trigger('resize');
					});
				});
			}
		}, false);

		init_justifiedGallery();
	};
};

UNCODE.cssGrid = function() {
	if ($('.cssgrid-layout').length > 0) {
		var cssGridContainersArray = [];
		var transitionDuration = [];
		var $filters = $('.cssgrid-system .cssgrid-filters');

		$('[class*="cssgrid-container"]').each(function() {
			cssGridContainersArray.push($(this));
			transitionDuration.push($('.t-inside.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
		});

		var init_cssGridAjax = function() {
			for (var i = 0, len = cssGridContainersArray.length; i < len; i++) {
				var cssGridSystem = $(cssGridContainersArray[i]).closest($('.cssgrid-system')),
					cssGridId = cssGridSystem.attr('id');

				cssGridSystem.data('transitionDuration', transitionDuration[i]);

				if ($(cssGridContainersArray[i]).hasClass('cssgrid-infinite') && $.fn.infinitescroll) {
					$(cssGridContainersArray[i]).infinitescroll({
						navSelector: '#' + cssGridId + ' .loadmore-button', // selector for the pagination container
						nextSelector: '#' + cssGridId + ' .loadmore-button a', // selector for the NEXT link (to page 2)
						itemSelector: '#' + cssGridId + ' .cssgrid-layout .tmb, #' + cssGridId + ' .grid-filters li.filter-cat', // selector for all items you'll retrieve
						animate: false,
						behavior: 'local',
						debug: false,
						loading: {
							selector: '#' + cssGridId + '.cssgrid-system .cssgrid-footer-inner',
							speed: 0,
							finished: undefined,
							msg: $('#' + cssGridId + ' .loadmore-button'),
						},
						errorCallback: function() {
							var cssgrid_system = $(this).closest('.cssgrid-system');
							$('.loading-button', cssgrid_system).hide();
							$('.loadmore-button', cssgrid_system).attr('style', 'display:none !important');
						}
					},
					// append the new items to cssGrid on the infinitescroll callback function.
					function(newElements, opts) {
						var $cssGrid = $(this),
							cssGridSystemCont = $cssGrid.closest('.cssgrid-system'),
							cssGridId = cssGridSystemCont.attr('id'),
							filters = new Array(),
							$loading_button = $cssGrid.closest('.cssgrid-system').find('.loading-button'),
							$infinite_button = $cssGrid.closest('.cssgrid-system').find('.loadmore-button'),
							$numPages = $('a', $infinite_button).data('pages'),
							delay = 300;
						$('a', $infinite_button).html($('a', $infinite_button).data('label'));
						$infinite_button.show();
						$loading_button.hide();
						if ( $numPages != undefined && opts.state.currPage == $numPages) $infinite_button.hide();
						$('> li', $cssGrid).remove();
						$.each($(newElements), function(index, val) {
							$(val).addClass('tmb-grid');
							if ($(val).is("li")) {
								filters.push($(val)[0]);
							}
						});
						newElements = newElements.filter(function(x) {
							return filters.indexOf(x) < 0
						});
						$.each($(filters), function(index, val) {
							if ($('#' + cssGridId + ' a[data-filter="' + $('a', val).attr('data-filter') + '"]').length == 0) $('#' + cssGridId + ' .grid-filters ul').append($(val));
						});

						var filterValue = cssGridSystemCont.find('.grid-nav-link.active').attr('data-filter');
						var sequential = cssGridSystemCont.hasClass('cssgrid-animate-sequential') ? true : false;
						if (filterValue !== undefined && filterValue != '*') {
							$(newElements).hide();
							var els_to_show = $();
							$(newElements).each(function() {
								var el = $(this);
								if (el.hasClass(filterValue)) {
									els_to_show = els_to_show.add(el);
									el.show();
								}
							});
							UNCODE.animate_css_grids(cssGridSystemCont, els_to_show, els_to_show.length, sequential, true);
						} else {
							UNCODE.animate_css_grids(cssGridSystemCont, $(newElements), $(newElements).length, sequential, true);
						}

						UNCODE.adaptive();
						if (SiteParameters.dynamic_srcset_active === '1') {
							UNCODE.refresh_dynamic_srcset_size($cssGrid);
						}
						if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
							var getLightbox = UNCODE.lightboxArray['ilightbox_' + cssGridId];
							if (typeof getLightbox === 'object') {
								getLightbox.refresh();
							} else {
								UNCODE.lightbox();
							}
						}
						if ( typeof twttr !== 'undefined' ) {
							twttr.widgets.load(cssGridContainersArray[i]);
						}

						UNCODE.carousel($(newElements));
						requestTimeout(function() {
							$cssGrid.trigger('more-items-loaded');
						}, 1000);

					});
					if ($(cssGridContainersArray[i]).hasClass('cssgrid-infinite-button')) {
						var $cssgrid_el = $(cssGridContainersArray[i]),
							$infinite_button = $cssgrid_el.closest('.cssgrid-system').find('.loadmore-button a');
						$cssgrid_el.infinitescroll('pause');
						$infinite_button.on('click', function(event) {
							event.preventDefault();
							var $cssgrid_system = $(event.target).closest('.cssgrid-system'),
							$cssgrid_el = $cssgrid_system.find('.cssgrid-container'),
							cssGridId = $cssgrid_system.attr('id');
							$(event.currentTarget).html(SiteParameters.loading);
							$cssgrid_el.infinitescroll('resume');
							$cssgrid_el.infinitescroll('retrieve');
							$cssgrid_el.infinitescroll('pause');
						});
					}
				}
			}
		};

		init_cssGridAjax();

		if ($('.cssgrid-pagination').length > 0) {
			$('.cssgrid-system').on('click', '.pagination a', function(evt) {
				evt.preventDefault();

                var container = $(this).closest('.cssgrid-system'),
                	calc_scroll = container.closest('.row-parent').offset().top;

                calc_scroll -= UNCODE.get_scroll_offset();

				var menu_container = $('.menu-sticky');
				var menu = menu_container.find('.menu-container');

				if (menu_container.length > 0 && menu.length > 0) {
					calc_scroll = calc_scroll - menu.outerHeight();
				}

				var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
					delta = bodyTop - calc_scroll,
					scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
				if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

				if ( !UNCODE.isFullPage ) {
					if (scrollSpeed == 0) {
						$('html, body').scrollTop(calc_scroll);
					} else {
						$('html, body').animate({
							scrollTop: calc_scroll
						},{
							easing: 'easeInOutQuad',
							duration: scrollSpeed,
							complete: function(){
								UNCODE.scrolling = false;
							}
						});
					}
				}

				loadCssGrid($(this), true);
				evt.preventDefault();
			});
		}

		$filters.on('click', 'a.grid-nav-link', function(evt) {
			if ($(this).hasClass('no-grid-filter')) {
				return;
			}
			var $filter = $(this),
				filterContainer = $filter.closest('.cssgrid-filters'),
				filterValue = $filter.attr('data-filter'),
				containerSystem = $filter.closest('.cssgrid-system'),
				container = containerSystem.find($('.cssgrid-layout')),
				transitionDuration = containerSystem.data('transitionDuration'),
				delay = 300,
				filterItems = [],
				all_thumbs = container.find('.tmb-grid');

			var filter_items = function(){
				if (filterValue !== undefined) {
					$.each($('> .tmb-grid > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					requestTimeout(function(){
						if ( filterValue == '*' ) {
							all_thumbs.show();
							all_thumbs.each(function(index, val) {
								$(val).find('[data-lbox^=ilightbox]').removeClass('lb-disabled');
								filterItems.push($(this));
							});
						} else {
							all_thumbs.each(function() {
								var _tmb = $(this);
								if (_tmb.hasClass(filterValue)) {
									_tmb.show();
									_tmb.find('[data-lbox^=ilightbox]').removeClass('lb-disabled');
									filterItems.push(_tmb);
								} else {
									_tmb.find('[data-lbox^=ilightbox]').addClass('lb-disabled');
									_tmb.hide();
								}
							});
						}

						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');

						var sequential = containerSystem.hasClass('cssgrid-animate-sequential') ? true : false;
						UNCODE.animate_css_grids(containerSystem, filterItems, 0, sequential, true);
						var lightboxElements = $('[data-lbox^=ilightbox]', container);
						if (lightboxElements.length) {
							container.data('lbox', $(lightboxElements[0]).data('lbox'));
							if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
								var getLightbox = UNCODE.lightboxArray['ilightbox_' + container.closest('.cssgrid-system').attr('id')];
								if (typeof getLightbox === 'object') {
									getLightbox.refresh();
								} else {
									UNCODE.lightbox();
								}
							}
						}
						container.trigger('more-items-loaded');
					}, delay);
				} else {
					$.each($('> .tmb-grid > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearRequestTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					loadCssGrid($filter);
				}
			};

			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
                    var calc_scroll = container.closest('.row-parent').offset().top;
                    calc_scroll -= UNCODE.get_scroll_offset();

					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - calc_scroll,
						scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed,
						filterTolerance = false,
						filter_timeout;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if ( !UNCODE.isFullPage ) {
						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
							filter_items();
						} else {

							if ( bodyTop <= (calc_scroll+20) && bodyTop >= (calc_scroll-20) ) {
								filter_items();
								filterTolerance = true;
							}

							$('html, body').animate({
								scrollTop: calc_scroll
							},{
								easing: 'easeInOutQuad',
								duration: scrollSpeed,
								complete: function(){
									UNCODE.scrolling = false;
									if ( !filterTolerance ) {
										filter_timeout = setTimeout(function(){
											clearTimeout(filter_timeout);
											filter_items();
										}, 200);
									}
								}
							});
						}
					}
				} else {
					filter_items();
				}
			}
			evt.preventDefault();
		});

		$(window).off('popstate.cssgrid').on("popstate.cssgrid", function(e) {
			var params = UNCODE.getURLParams(window.location);
			var old_params = UNCODE.getURLParams(UNCODE.lastURL, true);

			UNCODE.lastURL = window.location.href;

			if (UNCODE.hasEqualURLParams(params, old_params) || ($.isEmptyObject(params) && $.isEmptyObject(old_params))) {
				return;
			}

			if (params.id === undefined) {
				$.each($('.cssgrid-system'), function(index, val) {
					loadCssGrid($(val));
				});
			} else {
				if (!params.hasOwnProperty(SiteParameters.ajax_filter_key_unfilter)) {
					loadCssGrid($('#' + params.id));
				}
			}
		});

		var loadCssGrid = function($href, $paginating) {
			var is_paginating = false;

			if (undefined !== $paginating && $paginating) {
				var is_paginating = $paginating;
			}

			var href = ($href.is("a") ? $href.attr('href') : location),
				cssgridSystem = ($href.is("a") ? $href.closest($('.cssgrid-system')) : $href),
				cssgridWrapper = cssgridSystem.find($('.cssgrid-wrapper')),
				cssgridFooter = cssgridSystem.find($('.cssgrid-footer-inner')),
				cssgridResultCount = cssgridSystem.find($('.woocommerce-result-count-wrapper')),
				cssgridContainer = cssgridSystem.find($('.cssgrid-layout')),
				cssgridId = cssgridSystem.attr('id');
			if ( $href.is("a") && ! cssgridSystem.hasClass('un-no-history') ) {
				UNCODE.lastURL = href;
				history.pushState({
					myCSSgrid: true
				}, document.title, href);
			}
			cssgridWrapper.addClass('cssgrid-loading');
			if (is_paginating) {
				cssgridWrapper.addClass('grid-filtering');
			}
			$.ajax({
				url: href
			}).done(function(data) {
				var $resultItems = $(data).find('#' + cssgridId + ' .cssgrid-layout').html(),
					$resultPagination = $(data).find('#' + cssgridId + ' .pagination')[0],
					$resultCount = $(data).find('#' + cssgridId + ' .woocommerce-result-count')[0];
				requestTimeout(function() {
					cssgridContainer.html($resultItems);
					cssgridWrapper.removeClass('cssgrid-loading');
					cssgridWrapper.removeClass('grid-filtering');
					var sequential = cssgridSystem.hasClass('cssgrid-animate-sequential') ? true : false;
					UNCODE.animate_css_grids(cssgridSystem, cssgridContainer.find('.tmb-grid'), 0, sequential, false);
					UNCODE.adaptive();
					if (SiteParameters.dynamic_srcset_active === '1') {
						UNCODE.refresh_dynamic_srcset_size(cssgridContainer);
					}
					if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
						var getLightbox = UNCODE.lightboxArray['ilightbox_' + cssgridContainer.closest('.cssgrid-system').attr('id')];
						if (typeof getLightbox === 'object') {
							getLightbox.refresh();
						} else {
							UNCODE.lightbox();
						}
					}
					cssgridContainer.trigger('more-items-loaded');
				}, 300);

				$('.pagination', cssgridFooter).remove();
				cssgridFooter.append($resultPagination);

				if (cssgridResultCount.length > 0) {
					$('.woocommerce-result-count', cssgridResultCount).remove();
					cssgridResultCount.append($resultCount);
				}
			});
		};

		$filters.each(function(i, buttonGroup) {
			var $buttonGroup = $(buttonGroup);
			$buttonGroup.on('click', 'a:not(.no-grid-filter)', function() {
				$buttonGroup.find('.active').removeClass('active');
				$(this).addClass('active');

			});

			var $cats_mobile_trigger = $('.menu-smart--filter-cats_mobile-toggle-trigger', $buttonGroup),
				$cats_mobile_toggle = $('.menu-smart--filter-cats_mobile-toggle', $buttonGroup),
				$cats_filters = $('.menu-smart--filter-cats', $buttonGroup);
			$buttonGroup.on('click', 'a.menu-smart--filter-cats_mobile-toggle-trigger', function(e) {
				e.preventDefault();
				$cats_filters.slideToggle(400, 'easeInOutCirc');
			});

		});
	};
};

UNCODE.preventDoubleTransition = function() {
	$('.sticky-element .animate_when_almost_visible').each(function(){
		var $el = $(this).one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function(e){
			$el.addClass('do_not_reanimate');
		});
	});
};

UNCODE.checkScrollForTabs = function(){
	var goToSection = window.location.hash.replace('#', ''),
		$index;

	goToSection = goToSection.replace(/[^-A-Za-z0-9+&@#/%?=~_]/g, "");
	goToSection = encodeURIComponent(goToSection);
	$index = $('[data-id="' + goToSection + '"]').closest('.uncode-tabs, .uncode-accordion');

	$index.attr('data-parent', 'parent-' + goToSection);

	if (window.location.hash != undefined && window.location.hash != '') {
		requestTimeout(function() {
			scrollBody('parent-' + goToSection);
		}, 500);
	}

	$('.page-body a[href*="#"]').not('[data-tab-history]').not('.scroll-top').click(function(e) {
		var hash = (e.currentTarget).hash,
			index = (e.currentTarget).closest('.uncode-tabs');
		if ( $('.uncode-tabs a[href="' + hash + '"][data-tab-history]').length ) {
			$('a[href="' + hash + '"][data-tab-history]').click();
			scrollBody(index);
		}
	});

	var scrollBody = function(index) {

		var getSection = $('a[href="' + index + '"][data-tab-history]'),
			scrollTo,
			safeGap = 27;

		if ( ! getSection.length ) {
			getSection = $('div[data-parent="' + index + '"]');

			if ( getSection.attr('data-target') == 'row' ) {
				getSection = getSection.closest('.vc_row');
				safeGap = 0;
			}
		}

		if (typeof getSection === 'undefined' || ! getSection.length ) {
			return;
		}

		var body = $("html, body"),
		bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
		delta = bodyTop - (getSection.length ? getSection.offset().top : 0),
		getOffset = UNCODE.get_scroll_offset();
		if ( typeof getSection.offset() === 'undefined' )
			return;
		scrollTo = getSection.offset().top - safeGap;
		scrollTo -= getOffset;

		var scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
		if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

		if (index != 0) {
			UNCODE.scrolling = true;
		}

		if (scrollSpeed == 0) {
			body.scrollTop((delta > 0) ? scrollTo - 0.1 : scrollTo);
			UNCODE.scrolling = false;
		} else {
			body.animate({
				scrollTop: (delta > 0) ? scrollTo - 0.1 : scrollTo
			}, scrollSpeed, 'easeInOutQuad', function() {
				requestTimeout(function() {
					UNCODE.scrolling = false;
					if (getOffset != UNCODE.get_scroll_offset()) {
						scrollBody(index);
					}
				}, 100);
			});
		}

	};
};

UNCODE.printScreen = function() {
	var inlineMediaStyle = null,
		setResize;

    function changeMediaStyle() {
		clearRequestTimeout(setResize);
		setResize = requestTimeout(function(){
	        var $head = document.getElementsByTagName('head')[0],
	        	$newStyle = document.createElement('style'),
	        	winW = window.innerWidth,
	        	printH = window.innerHeight;

	        $newStyle.setAttribute('type', 'text/css');
	        $newStyle.setAttribute('media', 'print');
	        $newStyle.appendChild(document.createTextNode('@page { size: ' + winW + 'px ' + printH + 'px; margin: 0; }'));

	        if (inlineMediaStyle != null) {
	            $head.replaceChild($newStyle, inlineMediaStyle)
	        } else {
	            $head.appendChild($newStyle);
	        }
	        inlineMediaStyle = $newStyle;
	    }, 1000);
    }

    changeMediaStyle();
    window.addEventListener('resize', changeMediaStyle);
};

UNCODE.fullPage = function() {
	if ( ( !UNCODE.isFullPage && !UNCODE.isFullPageSnap ) || SiteParameters.is_frontend_editor ) {
		$('body').removeClass('uncode-fullpage').removeClass('uncode-fullpage-slide').removeClass('fp-waiting');
		return false;
	} else {
		requestTimeout(function() {
			window.scrollTo(0, 0);
		}, 10);
	}

	var $masthead = $('#masthead'),
		$logo = $('#logo-container-mobile'),
		$logolink = $('[data-minheight]', $logo),
		logoMinScale = $logolink.data('minheight'),
		logoMaxScale = $('[data-maxheight]', $logo).data('maxheight'),
		$mainWrapper = $('.main-wrapper')[0],
		$container = $('.main-container .post-content'),
		$mobileMenuWrapper = $('.menu-wrapper'),
		mobMenuPos,
		$rows = $container.find('.vc_row[data-parent]').addClass('uncode-scroll-lock fp-auto-height'),
		$header = $('#page-header').addClass('uncode-scroll-lock fp-auto-height'),
		headerName = $('.vc_row[data-name]', $header).attr('data-name'),
		headerLabel = $('.vc_row[data-label]', $header).attr('data-label'),
		headerWithOpacity = $('.header-scroll-opacity', $header).length,
		menuHidden = ! $('body').hasClass('vmenu') && $('body').hasClass('uncode-fp-menu-hide') ? true : false,
		menuHeight = $masthead.hasClass('menu-transparent') || menuHidden ? 0 : UNCODE.menuHeight,
		footerAdd = ( $('body').hasClass('hmenu') && $('body').hasClass('uncode-fp-menu-shrink') && !$masthead.hasClass('menu-transparent') ) ? -18 : 0,
		$footer = $('#colophon').addClass('uncode-scroll-lock fp-auto-height'),
		$scrollTop = $('.scroll-top'),
		scrollBar = true,
		effect,
		animationEndTimeOut,
		fp_anim_time = 900,
		fp_easing = 'cubic-bezier(0.37, 0.31, 0.2, 0.85)',
		is_scrolling = false,
		dataNames = [],
		is_first = true,
		no_history = $('body').hasClass('uncode-scroll-no-history'),
		theres_footer = true;

	if ( $('> div', $footer).outerHeight() < 2 || !$footer.length ) {
		$('> div', $footer).each(function(index, el){
			if ( $(el).outerHeight() < 2 )
				theres_footer = false;
			else
				theres_footer = true;
		});
	}

	if ( !$footer.length )
		theres_footer = false;

	if ( !UNCODE.isFullPageSnap ) {
		/*if ( theres_footer )
			$footer.css({ marginTop: ( menuHeight + footerAdd + UNCODE.bodyBorder ) * -1 })*/

		if ( $('body').hasClass('uncode-fullpage-zoom') )
			effect = 'scaleDown';
		else if ( $('body').hasClass('uncode-fullpage-parallax') )
			effect = 'moveparallax';
		else
			effect = 'movecurtain';
	}

	if ( $('body').hasClass('uncode-fullpage-trid') )
		fp_anim_time = fp_anim_time*2;

	if ( $header.length ) {
		if ( headerName !== '' )
			$header.attr('data-name', headerName);
		if ( headerLabel !== '' )
			$header.attr('data-label', headerLabel);
		$container.prepend($header);
	}
	if ( theres_footer ) {
		$container.append($footer);
		$footer.attr('data-anchor', SiteParameters.slide_footer).data('name', SiteParameters.slide_footer);
		$('aside.widget ul', $footer).addClass('no-list');
	}

	var $all = $rows.add($header);

	if ( theres_footer )
		$all = $all.add($footer);

	$all.each(function(index, row) {
		if( index === 0 )
			$(row).addClass('uncode-scroll-active');
	});

	if ( !UNCODE.isMobile && !$('body').hasClass('uncode-scroll-no-dots') )
		$("<ul class='onepage-pagination'></ul>").prependTo("body");

	$all.each(function(index, val) {
		var getName = $(val).data('name'),
			label;

		if (typeof getName == 'undefined' || getName == 'undefined')
			getName = SiteParameters.slide_name + '-' + index;

		//if ( dataNames.includes(getName) ) {
		if ( dataNames.indexOf(getName) > 0 ) {
			getName += '_' + index;
			$(val).data('name', getName);
		}

		dataNames.push(getName);

		$(val).attr('data-section', (index+1)).attr('data-anchor', getName);

		if (typeof $(val).attr('data-label') !== 'undefined')
			label = $(val).attr('data-label');
		else label = '';

		if ( $(val).is($footer) )
			return;

		if (label != '' ) {
			label = '<span class="cd-label style-accent-bg border-accent-color">' + label + '</span>';
			$('ul.onepage-pagination').append("<li><a class='one-dot-link' data-index='" + (index) + "' href='#" + (getName) + "'><span class='cd-dot-cont'><span class='cd-dot'></span></span>"+label+"</a></li>");
		} else if ( label == '' && $('body').hasClass('uncode-empty-dots') ) {
			$('ul.onepage-pagination').append("<li><a class='one-dot-link' data-index='" + (index) + "' href='#" + (getName) + "'><span class='cd-dot-cont'><span class='cd-dot'></span></span></a></li>");
		}
	});

	var checkVisible = function( el, off ) {
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		off = typeof off=='undefined' ? 50 : off;

		var rect = el.getBoundingClientRect();

		return (
			(
				( rect.top >= 0 && (rect.top + off) <= (window.innerHeight || document.documentElement.clientHeight) ) ||
				( rect.bottom >= off && (rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) ) ||
				( rect.top <= 0 && (rect.bottom) >= (window.innerHeight || document.documentElement.clientHeight) )
			)
		);
	};

	var animationEndAction = function( index, nextIndex ) {
		var $currentSlide = $('.uncode-scroll-lock[data-section="' + index + '"]', $container),
			$nextSlide = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			player, iframe;

		if ( !$nextSlide.is($footer) ) {
			$('.no-scrolloverflow').removeClass('no-scrolloverflow');
		}

		if ( !UNCODE.isFullPageSnap ) {
			activateKBurns( nextIndex );
		}

		$('body:not(.uncode-fullpage-zoom) .background-video-shortcode, .uncode-video-container.video', $currentSlide).each(function(index, val) {
			if ($(this).attr('data-provider') == 'vimeo') {
				iframe = $(this).find('iframe');
				player = new Vimeo.Player(iframe[0]);
				player.pause();
			} else if ($(this).attr('data-provider') == 'youtube') {
				if (youtubePlayers[$(this).attr('data-id')] != undefined) youtubePlayers[$(this).attr('data-id')].pauseVideo();
			} else {
				if ($(this).is('video')) {
					$(this)[0].volume = 0;
					$(this)[0].pause();
				}
			}
		});

		if ( ! UNCODE.isMobile && headerWithOpacity ) {
			if ( $nextSlide.is($header) )
				$header.removeClass('header-scrolled');
		}

		var $otherEl = $('.uncode-scroll-lock:not(.hidden-scroll)', $container).not($nextSlide);
		$otherEl.each(function(){
			var $otherThis = $(this),
				$bgwrapperOther = $('.background-inner', $otherThis);
			if ( !checkVisible($otherThis) )
				$bgwrapperOther.removeClass('uncode-kburns').removeClass('uncode-zoomout');

		});

		if ( !checkVisible($currentSlide) ) {
			$currentSlide.removeClass('uncode-scroll-visible');
			var currentScroll = $('.fp-scrollable', $currentSlide).data('iscrollInstance');
			if ( typeof currentScroll != 'undefined' && !UNCODE.isFullPageSnap )
				currentScroll.scrollTo(0, 0, 0);
		}

		clearRequestTimeout(animationEndTimeOut);
		animationEndTimeOut = requestTimeout(function(){
			Waypoint.refreshAll();
			$( document.body ).trigger('uncode_waypoints');
			var eventFP = new CustomEvent('fp-slide-changed');
			window.dispatchEvent(eventFP);
			is_scrolling = false;

			if ( is_first ) {
				$('ul.onepage-pagination a').removeClass('is-selected');
				$('ul.onepage-pagination a[data-index="' + (nextIndex-1) + '"]').addClass('is-selected');
				is_first = false;
			}

		}, 500);
	};

	var postLeaveActions = function( nextIndex ){
		if ( menuHidden && ! UNCODE.isMobile )
			return false;

		var $el = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			$cols = $('.uncol', $el),
			anchor = $el.data('anchor');

		if ( ! UNCODE.isFullPageSnap ) {
			$.each($cols, function(index, val){
				if ( $(val).hasClass('style-light') ){
					$masthead.removeClass('style-dark-override').addClass('style-light-override');
					return false;
				} else if ( $(val).hasClass('style-dark') ) {
					$masthead.removeClass('style-light-override').addClass('style-dark-override');
					return false;
				}
			});
		}

		if ( typeof anchor !== 'undefined' && anchor !== '' && $('.menu-item > a[href*="#' + anchor + '"]' ).length ) {
			$('.menu-item' ).removeClass('active');
			$('.menu-item > a[href*="#' + anchor + '"]' ).closest('.menu-item').addClass('active');
		}

		if ( !UNCODE.isFullPageSnap ) {
			activateBackWash( nextIndex );
		}
	};

	var activateBackWash = function( nextIndex ){
		var $el = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			$bgwrapper;

		if ( $el.length ) {
			if ( $el.hasClass('with-zoomout') ) {
				$bgwrapper = $('.background-inner:nth-child(1)', $el);
			} else if ( $('.with-zoomout', $el).length ) {
				$bgwrapper = $('.with-zoomout .background-inner:nth-child(1)', $el);
			} else {
				return false;
			}
		} else {
			return false;
		}

		$bgwrapper.addClass('uncode-zoomout');

	};

	var activateKBurns = function( nextIndex ){
		var $el = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			$bgwrapper;

		if ( $el.length ) {
			if ( $el.hasClass('with-kburns') ) {
				$bgwrapper = $('.background-inner:nth-child(1)', $el);
			} else if ( $('.with-kburns', $el).length ) {
				$bgwrapper = $('.with-kburns .background-inner:nth-child(1)', $el);
			} else {
				return false;
			}
		} else {
			return false;
		}

		$bgwrapper.addClass('uncode-kburns');

	};

	var activateParallax = function( nextIndex, direction ){

		var $el = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			$cell = $('.fp-tableCell', $el),
			animationEnd = 'webkitAnimationEnd animationend',
			cellAnim;

		switch( direction ) {
			case 'up':
				cellAnim = 'moveFromTopInner';
				break;
			default:
				cellAnim = 'moveFromBottomInner';
		}

		$cell.css({
			'animation-name': cellAnim,
			'animation-duration': fp_anim_time + 'ms',
			'animation-delay': '',
			'animation-timing-function': fp_easing,
			'animation-fill-mode': 'both',
		}).off(animationEnd)
		.on(animationEnd, function(event) {
			if ( event.originalEvent.animationName === cellAnim ) {
				$cell
					.css({
						'animation-name': '',
						'animation-duration': '',
						'animation-delay': '',
						'animation-timing-function': '',
						'animation-fill-mode': '',
					});
			}
		});
	};

	var scrollHashes = function(){
		var hash = window.location.hash.replace('#', '').split('/'),
			hashInd;
		if ( hash[0] !== '' && hash[0] !== SiteParameters.slide_footer ) {
			if ( $('.uncode-scroll-lock[data-anchor="' + hash[0] + '"]').length ) {
				hashInd = $('.uncode-scroll-lock[data-anchor="' + hash[0] + '"]').index('[data-anchor]');
				$.fn.fullpage.moveTo(hashInd+1);
			}
		} else if( hash[0] === '' ) {
			$.fn.fullpage.moveTo(1);
		}
	};

	var hideMenu = function( index, nextIndex ){
		if ( $('body').hasClass('vmenu') || UNCODE.isFullPageSnap || !$('body').hasClass('uncode-fp-menu-hide') )
			return false;

		var hMenu = UNCODE.menuHeight,
			transTime = hMenu * 2;

		if ( index === 1 && nextIndex > 1 ) {
			hMenu = hMenu * -1;
		} else if  ( index !== 1 && nextIndex === 1 ) {
			hMenu = 0;
		} else {
			return false;
		}

		$masthead.css({
			'-webkit-transform': 'translate3d(0, ' + hMenu + 'px, 0)',
			'transform': 'translate3d(0, ' + hMenu + 'px, 0)',
			'-webkit-transition': 'transform 0.5s ease-in-out',
			'transition': 'transform 0.5s ease-in-out'
		});
	};

	var shrinkMenu = function( index, nextIndex ){
		if ( $('body').hasClass('vmenu') || !$('body').hasClass('uncode-fp-menu-shrink') )
			return false;

		if ( index === 1 && nextIndex > 1 ) {
			$logo.addClass('shrinked');
			$('div', $logo).each(function(index, val){
				$(val).css({
					'height': logoMinScale,
					'line-height': logoMinScale
				});
				if ($(val).hasClass('text-logo')) {
					$(val).css({
						'font-size': logoMinScale + 'px'
					});
				}
			});
			requestTimeout(function() {
				UNCODE.menuMobileHeight = $masthead.outerHeight();
			}, 300);
		} else if ( index !== 1 && nextIndex === 1 ) {
			$logo.removeClass('shrinked');
			$('div', $logo).each(function(index, val){
				$(val).css({
					'height': logoMaxScale,
					'line-height': logoMaxScale
				});
				if ($(val).hasClass('text-logo')) {
					$(val).css({
						'font-size': logoMaxScale + 'px'
					});
				}
			});
			requestTimeout(function() {
				UNCODE.menuMobileHeight = $masthead.outerHeight();
			}, 300);
		} else {
			return false;
		}

	};

	var anchorLink = function(){

		$container.add('.menu-item').find('a[href*="#"]').click(function(e) {
			var $this = $(e.currentTarget),
				hash = e.currentTarget.href.split('#'),
				current = window.location.href.split('#'),
				ind,
				currentMenuOpened = UNCODE.menuOpened,
				go = false;

			var hash_url = hash[0].replace(/\/?$/, '/'),
				current_url = current[0].replace(/\/?$/, '/');

			if ( ( hash_url == current_url || hash_url == '' ) && hash[1] != '' ) {
				hash = '#'+hash[1];
				e.preventDefault();
				go = true;
			}

			if ( go ) {

				if ( $(hash).length ) {
					ind = $(hash).closest('.fp-section').index();
				} else {
					hash = hash.slice(1);
					ind = $('.fp-section[data-anchor="' + hash + '"]').index('.fp-section');
				}

				if ( typeof $this.attr('data-filter') !== 'undefined' && $this.attr('data-filter') != '' )
					ind = $this.closest('.fp-section').index();

				UNCODE.menuOpened = false;

				$.fn.fullpage.moveTo(ind+1);

				UNCODE.menuOpened = currentMenuOpened;
				if (UNCODE.menuOpened) {
					if (UNCODE.wwidth < UNCODE.mediaQuery) {
						window.dispatchEvent(UNCODE.menuMobileTriggerEvent);
					} else {
						$('.mmb-container-overlay .overlay-close').trigger('click');
						$('.mmb-container .trigger-overlay.close')[0].dispatchEvent(new Event("click"));;
					}
				}

			}

		});

		$('.header-scrolldown').on('click', function(event) {
			event.preventDefault();
			var scrollDown = $(this),
				ind = scrollDown.closest('.fp-section').index();

			$.fn.fullpage.moveTo(ind+2);
		});

		var anchor = $('.fp-section.active').data('anchor');

		if ( typeof anchor !== 'undefined' && anchor !== '' && $('.menu-item > a[href="#' + anchor + '"]' ).length ) {
			$('.menu-item').removeClass('active');
			$('.menu-item > a[href="#' + anchor + '"]' ).closest('.menu-item').addClass('active');
		}

	};

	var slideLeave = function( index, nextIndex, direction ) {
		var $currentSlide = $('.uncode-scroll-lock[data-section="' + index + '"]', $container),
			$nextSlide = $('.uncode-scroll-lock[data-section="' + nextIndex + '"]', $container),
			animationEnd = 'webkitAnimationEnd animationend',
			transitionEnd = 'webkitTransitionEnd transitionend',
			animOut = effect != 'scaleDown' ? effect + direction : effect,
			animIn,
			animInDelay = effect == 'scaleDown' ? 0 : 0,
			isFooter = false,
			isFooterNext = false,
			isHeader = false,
			isHeaderNext = false,
			containerOff = $container.offset().top,
			footerH = $footer.outerHeight(),
			timeout,
			dataHash = $nextSlide.attr('data-anchor'),
			player, iframe,
			footerCoeff;
		switch( direction ) {
			case 'up':
				animIn = 'moveFromTop';
				break;
			default:
				animIn = 'moveFromBottom';
		}

		if ( $('body').hasClass('uncode-fullpage-trid') ) {
			animOut = animIn + 'trid';
			animIn = animOut + 'In';
		} else if ( UNCODE.isFullPageSnap ) {
			animIn = animOut = 'none';
		}

		hideMenu(index, nextIndex);
		shrinkMenu(index, nextIndex);

		$('.uncode-fullpage-zoom .background-video-shortcode, .uncode-video-container.video', $currentSlide).each(function(index, val) {
			if ($(this).attr('data-provider') == 'vimeo') {
				iframe = $(this).find('iframe');
				player = new Vimeo.Player(iframe[0]);
				player.pause();
			} else if ($(this).attr('data-provider') == 'youtube') {
				if (youtubePlayers[$(this).attr('data-id')] != undefined) youtubePlayers[$(this).attr('data-id')].pauseVideo();
			} else {
				if ($(this).is('video')) {
					$(this)[0].volume = 0;
					$(this)[0].pause();
				}
			}
		});

		$('.background-video-shortcode, .uncode-video-container.video', $nextSlide).each(function(index, val) {
			if ($(this).attr('data-provider') == 'vimeo') {
				iframe = $(this).find('iframe');
				iframe.on('load', function(){
					player = new Vimeo.Player(iframe);
					player.setVolume(0);
					player.play();
				});
				player = new Vimeo.Player(iframe);
				player.setVolume(0);
				player.play();
			} else if ($(this).attr('data-provider') == 'youtube') {
				if (youtubePlayers[$(this).attr('data-id')] != undefined) youtubePlayers[$(this).attr('data-id')].playVideo();
			} else {
				if ($(this).is('video')) {
					$(this)[0].volume = 0;
					$(this)[0].play();
				}
			}
		});

		if ( $currentSlide.is($footer) )
			isFooter = true;

		if ( $nextSlide.is($footer) )
			isFooterNext = true;

		// if ( typeof dataHash && dataHash && !no_history && dataHash != SiteParameters.slide_footer )
		// 	window.location.hash = '#' + dataHash;

		if ( ! UNCODE.isMobile && headerWithOpacity ) {
			if ( $currentSlide.is($header) )
				$header.addClass('header-scrolled');
		}

		footerCoeff = footerH;

		if ( UNCODE.isFullPageSnap ) {
			postLeaveActions( nextIndex );
			activateBackWash( nextIndex );
			activateKBurns( nextIndex );
			requestTimeout(function(){
				animationEndAction( index, nextIndex );
			}, fp_anim_time+150);
		} else {
			if ( isFooterNext ) {

				var $iscrollWrapper = $currentSlide.find('.fp-scrollable');
				$iscrollWrapper.addClass('no-scrolloverflow');

				$nextSlide
				.add($currentSlide)
				.addClass('uncode-scroll-front')
				.addClass('uncode-scroll-active')
				.addClass('uncode-scroll-visible');
				$container.css({
					'-webkit-transform': 'translate3d(0, -' + ( footerCoeff ) + 'px, 0)',
					'transform': 'translate3d(0, -' + ( footerCoeff ) + 'px, 0)',
					'-webkit-transition': 'transform ' + (( footerCoeff )*2) + 'ms ' + fp_easing,
					'transition': 'transform ' + (( footerCoeff )*2) + 'ms ' + fp_easing,
				}).off(transitionEnd)
				.one(transitionEnd, function(){
					animationEndAction( index, nextIndex );
				});

			} else if ( isFooter ) {

				$('.uncode-scroll-lock[data-section="' + (index-1) + '"]', $container) // so it is always the section above the footer to be animated first
				.add($currentSlide)
				.addClass('uncode-scroll-front')
				.addClass('uncode-scroll-active')
				.addClass('uncode-scroll-visible');
				$container.css({
					'-webkit-transform': 'translate3d(0, 0, 0)',
					'transform': 'translate3d(0, 0, 0)',
					'-webkit-transition': 'transform ' + (( footerCoeff )*2) + 'ms ' + fp_easing,
					'transition': 'transform ' + (( footerCoeff )*2) + 'ms ' + fp_easing,
				})
				.one(transitionEnd, function(){
					if ( nextIndex !== index-1 ) { // if a bullet triggered a slide different than the one above the footer
						clearRequestTimeout(timeout);
						timeout = requestTimeout(function(){
							$.fn.fullpage.moveTo(nextIndex);
							slideLeave( index-1, nextIndex, 'up' );
							$container.off(transitionEnd);
						}, 50);
					}
					animationEndAction( index, nextIndex );
				});

			} else {

				postLeaveActions( nextIndex );

				if ( !$('body').hasClass('uncode-fullpage-trid') )
					activateParallax( nextIndex, direction );

				var $outBg = $('.background-wrapper', $currentSlide);

				$nextSlide
				.addClass('uncode-scroll-front')
				.addClass('uncode-scroll-active')
				.addClass('uncode-scroll-visible')
				.addClass('uncode-scroll-animating-in')
				.css({
					'z-index':4,
					'animation-name': animIn,
					'animation-duration': fp_anim_time + 'ms',
					'animation-delay': '',
					'animation-timing-function': fp_easing,
					'animation-fill-mode': 'both',
					'transition': 'initial',
				}).off(animationEnd)
				.on(animationEnd, function(event) {
					if ( event.originalEvent.animationName === animIn ) {
						$(this)
							.addClass('uncode-scroll-already')
							.removeClass('uncode-scroll-front')
							.removeClass('uncode-scroll-animating-in')
							.css({
								'animation-name': '',
								'animation-duration': '',
								'animation-delay': '',
								'animation-timing-function': '',
								'animation-fill-mode': '',
								'transition': 'initial',
							});

						$currentSlide
							.removeClass('uncode-scroll-active')
							.add($outBg)
							.css({
								'animation-name': '',
								'animation-duration': '',
								'animation-delay': '',
								'animation-timing-function': '',
								'animation-fill-mode': '',
								'transition': 'initial',
							});

						animationEndAction( index, nextIndex );

					}

					if ( nextIndex > 1 )
						$('body').addClass('window-scrolled');
					else
						$('body').removeClass('window-scrolled');
				});

				$currentSlide
					.addClass('uncode-scroll-animating-out')
					.removeClass('uncode-scroll-front')
					.css({
						'z-index':'1',
						'animation-name': animOut,
						'animation-duration': fp_anim_time + 'ms',
						'animation-delay': '',
						'animation-timing-function': fp_easing,
						'animation-fill-mode': 'both',
						'transition': 'initial',
						'will-change': 'auto'
					}).off(animationEnd)
					.on(animationEnd, function(event) {
						if ( event.originalEvent.animationName === animOut ) {
							$currentSlide.removeClass('uncode-scroll-animating-out');
						}
					});

				if ( $('body').hasClass('uncode-fp-opacity') ) {
					$currentSlide.find('> div').css({
						'animation-name': 'opacityout',
						'animation-duration': fp_anim_time + 'ms',
						'animation-delay': '',
						'animation-timing-function': fp_easing,
						'animation-fill-mode': 'both',
						'transition': 'initial',
					}).off(animationEnd)
					.on(animationEnd, function(event) {
						if ( event.originalEvent.animationName === 'opacityout' ) {
							$(event.currentTarget).css({
								'animation-name': '',
								'animation-duration': '',
								'animation-delay': '',
								'animation-timing-function': '',
								'animation-fill-mode': '',
								'transition': '',
							});
						}
					});
				}
			}
		}

		$('.scroll-top').on('click', function(e){
			$.fn.fullpage.moveTo(1);
			return false;
		});

	};

	var init_fullPage = function(mode){

		// if ( typeof mode !== 'undefined' && mode === 'mobile' ) {
		// 	scrollBar = false;
		// }

		var checkFPeffects;

		$container.fullpage({
			sectionSelector: '.uncode-scroll-lock',
			scrollOverflow: true,
			scrollOverflowOptions: {
				click: false,
				preventDefaultException: { tagName:/.*/ }
			},
			navigation: false,
			scrollBar: scrollBar,
			scrollingSpeed: fp_anim_time,
			verticalCentered: true,
			anchors: no_history ? false : dataNames,
			recordHistory: !no_history,
			afterRender: function(){
				$('body').removeClass('fp-waiting');
				$('.uncode-scroll-lock', $container).not(':visible').each(function(){
					var $invisible = $(this).addClass('hidden-scroll');//,
				});
				$('.uncode-scroll-lock.active', $container).filter(':visible').each(function(){
					var $visible = $(this).addClass('uncode-scroll-visible'),
						visIndex = $visible.index('.uncode-scroll-lock:not(.hidden-scroll)');
					$('ul.onepage-pagination a[data-index="' + visIndex + '"]').addClass('is-selected');
				});

				$('ul.onepage-pagination a').on('click', function(e){
					e.preventDefault();
					var $a = $(this),
						toIndex = $a.data('index');

					$.fn.fullpage.moveTo(toIndex+1);
				});

				requestTimeout(function(){
					scrollHashes();
				}, 1000);

				$(window).on('hashchange', function(e){
					requestTimeout(function(){
						scrollHashes();
					}, 500);
				});

				anchorLink();

				if ( $('body').hasClass('uncode-fp-opacity') ) {
					$all.each(function(index, row) {
						var testmatch = $(row)[0].className.match(/\bstyle-.*?-bg\b/g, ''),
							classBg;

						if ( typeof testmatch !== 'undefined' && testmatch !== null ) {
							classBg = testmatch[0];
							$(row).removeClass(classBg).find('.fp-tableCell').addClass(classBg);
						}
					});
				}

				if ( !$('body').hasClass('vmenu') && !$('body').hasClass('menu-offcanvas') ) {
					$(window).on('menuOpen gdprOpen', function(){
						$.fn.fullpage.setAutoScrolling(false);
					}).on('menuClose gdprClose', function(){
						$.fn.fullpage.setAutoScrolling(true);
					});
				}

				$(window).on('menuMobileOpen menuCanvasOpen unmodal-open uncode-sidecart-open', function(){
					requestTimeout(function(){
						$.fn.fullpage.setAutoScrolling(false);
					}, 1000);
				}).on('menuMobileClose menuCanvasClose unmodal-close uncode-sidecart-closed', function(){
					$.fn.fullpage.setAutoScrolling(true);
				});

				if ( !UNCODE.isFullPageSnap ) {
					clearRequestTimeout(checkFPeffects);
					checkFPeffects = requestTimeout(function(){
						activateBackWash( 1 );
						activateKBurns( 1 );
					}, 100);
				}

			},
			onLeave: function( index, nextIndex, direction ){

				if ( UNCODE.menuOpened || is_scrolling )
					return false;

				is_scrolling = true;

				var event = new CustomEvent('fp-slide-leave');
				window.dispatchEvent(event);

				slideLeave( index, nextIndex, direction );

				if ( $('.uncode-scroll-lock', $container).eq(nextIndex-1).hasClass('hidden-scroll') ) {
					if ( direction === 'up' ) {
						$.fn.fullpage.moveTo(nextIndex-1);
					} else {
						$.fn.fullpage.moveTo(nextIndex+1);
					}
					return false;
				}

				$('ul.onepage-pagination a').removeClass('is-selected');
				$('ul.onepage-pagination a[data-index="' + (nextIndex-1) + '"]').addClass('is-selected');

			}
		});
	};

	init_fullPage();
	$(window).on('load', function(){
		requestTimeout(function(){
			$.fn.fullpage.reBuild();
		}, 3000);
	});

	var addScrollingClass,
		removeScrollingClass;

	window.addEventListener("fp-slide-scroll", function(){
		addScrollingClass = requestTimeout( function(){
			$('body').addClass('fp-slide-scrolling');
		}, 10 );

		clearRequestTimeout(removeScrollingClass);
		removeScrollingClass = requestTimeout( function(){
			$('body').removeClass('fp-slide-scrolling');
		}, 150 );

		Waypoint.refreshAll();
	}, false);

	var setFPheight = function(){
		var $body = document.body,
			$footer = document.getElementById('colophon'),
			$maincontainer = document.querySelector('.main-wrapper'),
			$boxcontainer = document.querySelector('.box-container'),
			rect = $maincontainer.getBoundingClientRect(),
			rect2 = $boxcontainer.getBoundingClientRect();
		$body.style.height = UNCODE.wheight + 'px';
		if ( theres_footer )
			$footer.style.top = (rect.height || rect2.height) + 'px';
	};

	setFPheight();

	window.addEventListener('resize', setFPheight, false);
	window.addEventListener('orientationchange', setFPheight, false);

};

UNCODE.particles = function() {
	$(".vc-particles-background").each(function() {
		var $particle = $(this);
		var $parent = $particle.closest('[data-parent]');

		$parent.prepend($particle);
		// $(window).trigger('resize');
	})
};


UNCODE.filters = function() {
	var $systems = $('.isotope-system, .cssgrid-system');

	$systems.each(function(index, val){
		var $system = $(this),
			$widget_trgr = $('.uncode-woocommerce-toggle-widgetized-cb__link', $system),
			$widgets = $('.widgetized-cb-wrapper', $system),
			$sorting_trgr = $('.uncode-woocommerce-sorting__link', $system),
			$sorting_dd = $('.uncode-woocommerce-sorting-dropdown', $system),
			$cats_trigger = $('.menu-smart--filter-cats_mobile-toggle-trigger', $system),
			$cats_filters = $('.menu-smart--filter-cats-mobile-dropdown', $system);

		if ($system.hasClass('isotope-processed')) {
			return;
		}

		$cats_trigger.on('click', function(e) {
			if ( ! $('html').hasClass('screen-sm') ) {
				// $widgets.add($sorting_dd).slideUp(400);
				e.preventDefault();
				$widgets.slideUp(400, 'easeInOutCirc');
			}
		});

		$('.filters-toggle-trigger', $system).on('click', function(e) {
			e.preventDefault();
			var $filters = $('.isotope-filters .menu-horizontal', $system);
			$filters.slideToggle(400, 'easeInOutCirc');
			$widgets.add($cats_filters).slideUp(400, 'easeInOutCirc');
		});

		$widget_trgr.on('click', function(e) {
			e.preventDefault();
			$widgets.slideToggle(400, 'easeInOutCirc');
			if (!$('html').hasClass('screen-sm')) {
				$cats_filters.slideUp(400, 'easeInOutCirc');
			}
			window.dispatchEvent(new CustomEvent('boxResized'));
		});

		$sorting_trgr.on('click', function(e) {
			e.preventDefault();
			if (!$('html').hasClass('screen-sm')) {
				$widgets.add($cats_filters).slideUp(400, 'easeInOutCirc');
			}
		});

		$system.addClass('isotope-processed');
	});

};

UNCODE.widgets = function() {
	var widget_collapses = $('.widget-collapse');

	widget_collapses.each(function(){
		var widget_collapse = $(this),
			widget_title = widget_collapse.find('.widget-title'),
			widget = widget_title.closest('.widget'),
			content = widget.children().not('.widget-title'),
			setCTA;

		if ( widget_collapse.hasClass( 'widget-tablet-collapse-open' ) && UNCODE.wwidth <= UNCODE.mediaQuery && UNCODE.wwidth > UNCODE.mediaQueryMobile ) {
			widget_title.toggleClass('open');
		}

		widget_title.each(function() {
			var _this = $(this);
			var content = _this.closest('.widget').find('.widget-collapse-content');

			$(window).on('load resize', function(){
				clearRequestTimeout(setCTA);
				setCTA = requestTimeout( function() {
					if ( content.is(':visible') ) {
						_this.addClass( 'open' );
					} else {
						_this.removeClass( 'open' );
					}
				}, 10 );
			})

			_this.on( 'click', function(){

				// Get content of :after element (+ icon) to check the visibility
				var icon_content = window.getComputedStyle(_this[0], ':after').getPropertyValue('content');

				if (icon_content === 'none' || !icon_content) {
					return false;
				}

				_this.toggleClass('open');
				var isOpen = _this.hasClass('open'),
					hasBorder = _this.closest('.widget-no-separator').length ? 9 : 27;
				content.animate({
					height: 'toggle',
					padding: 'toggle',
					opacity: 'toggle',
					top: isOpen ? 0 : hasBorder
				}, {
					duration: 400,
					easing: "easeInOutCirc",
				});

				return false;

			});
		});
	});

	var $widgets_without_title = $('.collapse-init').removeClass('collapse-init');
};

UNCODE.unmodal = function() {
	$(document).off('click', '.open-unmodal').on('click', '.open-unmodal', function() {
		$('.unmodal-overlay').fadeIn();
		$('.unmodal-overlay').addClass('loading');
		$('body').addClass('uncode-unmodal-overlay-visible');
		$(window).trigger('unmodal-open');
	});

	$(document).off('click', '.unmodal-overlay').on('click', '.unmodal-overlay, .unmodal-close', function() {
		$('.unmodal-overlay').fadeOut();
		$('.unmodal').fadeOut();
		$('body').removeClass('uncode-unmodal-overlay-visible');
		$('body').removeClass('uncode-unmodal-open');
		$('html').removeClass('uncode-unmodal-body-disable-scroll');
		$(document).trigger('unmodal-close');
		UNCODE.isUnmodalOpen = false;
	});

	$(document).on('uncode-unmodal-show-content', function() {
		$('.unmodal-overlay').removeClass('loading');
		$('.unmodal').show();
		$('.unmodal').addClass('show-unmodal-with-animation');
		$('.unmodal-content')[0].scrollTop = 0;
		$('body').addClass('uncode-unmodal-open');
		UNCODE.isUnmodalOpen = true;

		if ($('body').hasClass('qw-body-scroll-disabled')) {
			$('html').addClass('uncode-unmodal-body-disable-scroll');
		}

		if ($('.unmodal').hasClass('auto-height')) {
			set_modal_height();
		}
	});

	var set_modal_height = function() {
		var modal = $('.unmodal');
		var window_height = $(window).outerHeight();
		var modal_height = modal.outerHeight();

		modal.css('height', 'auto');

		if (modal_height > window_height) {
			modal.outerHeight(window_height);
		}
	}

	if ($('.unmodal').hasClass('auto-height')) {
		var setCTA;

		$(window).on('resize', function() {
			clearRequestTimeout(setCTA);
			setCTA = requestTimeout(function() {
				set_modal_height();
			}, 100);
		});
	}
};

UNCODE.bgChanger = function() {
	var $bg_changers = $('.vc_row[data-bg-changer]:visible'),
		$bg_first = $('.vc_row[data-bg-remove]'),
		bg_remove = $bg_first.attr('data-bg-remove'),
		$first = $bg_changers.first(),
		$last = $bg_changers.last(),
		$bg_wrapper = $('#changer-back-color'),
		$bg_changings = $('div[data-bg-changing]', $bg_wrapper),
		setCTA, localH = UNCODE.wheight,
		isScrolling;

	$bg_first.removeClass(bg_remove);

	var bgChange = function($col, bgColor, skin, tmbskin){
		$bg_wrapper.attr( 'class', bgColor );
		var menuskin;
		if ( typeof skin !== 'undefined' ) {
			menuskin = skin.replace('style', 'menu')
		}

		if ( $col.length ) {
			$('.uncol[data-skin-change]').each(function(){
				var $isoFooter = $('.isotope-footer', this);
				$(this).add($isoFooter).removeClass('style-dark').removeClass('style-light').addClass(skin);
				if ( menuskin !== '' ) {
					$(this).find('.isotope-filters:not(.with-bg)').removeClass('menu-dark').removeClass('menu-light').addClass(menuskin);
				}
			});

			$('.tmb[data-skin-change]').each(function(){
				$(this).removeClass('tmb-dark').removeClass('tmb-light').addClass(tmbskin);
			});
		}
	};

	var $masthead = $('#masthead'),
		transDesktop,
		transMobile,
		changeSkin,

	checkTransparencyAndChange = function( skin ){
		transDesktop = $masthead.hasClass('menu-desktop-transparent') && UNCODE.wwidth >= UNCODE.mediaQuery;
		transMobile = $masthead.hasClass('menu-mobile-transparent') && UNCODE.wwidth < UNCODE.mediaQuery;
		changeSkin = $masthead.hasClass('menu-change-skin');

		if ( ! transDesktop && ! transMobile ) {
			return false;
		}

		if ( ! changeSkin ) {
			return false;
		}

		if ( skin === 'style-light' ){
			$masthead.removeClass('style-dark-override').addClass('style-light-override');
			return false;
		} else if ( skin === 'style-dark' ) {
			$masthead.removeClass('style-light-override').addClass('style-dark-override');
			return false;
		}
	};

	var bg_waypoints = function(){
		if ( $bg_changers.length && !SiteParameters.is_frontend_editor ) {

			$.each($bg_changers, function(index, row) {

				var $row = $(row),
					$col = $('.uncol[data-skin-change]', $row).eq(0),
					skin,
					$tmbs,
					tmbskin,
					bgColor = $row.attr('data-bg-color');

				if ( ! $row.is(':visible') ) {
					return false;
				}

				if ( $col.length ) {
					skin = $col.attr('data-skin-change');
					$tmbs = $('.tmb[data-skin-change]', $row);
					tmbskin = skin.replace('style', 'tmb');
				}

				if ( ! $row.hasClass('unscroll-horizontal') ) {
					$row.waypoint(function( dir ) {
						if ( dir === 'down' ) {
							bgChange($col, bgColor, skin, tmbskin);
							checkTransparencyAndChange(skin);
						} else {
							return;
						}
					}, {
						offset: '50%'
		  			});

					$row.waypoint(function( dir ) {
						if ( dir === 'up' ) {
							bgChange($col, bgColor, skin, tmbskin);
							checkTransparencyAndChange(skin);
						} else {
							return;
						}
					}, {
						offset: function() {
							var clH = this.element.clientHeight,
								wH = window.innerHeight,
								ret = clH > 200 ? -100 : clH * -0.5;
							return ( wH / 2 ) - clH;
						}
					});
				}

			});

			$('body').addClass('bg-changer-init');

		}
	};

	var body = document.body,
	edges = false;

	var throttle = function(fn, wait) {
		var time = Date.now();
		return function() {
			if ((time + wait - Date.now()) < 0) {
				fn();
				time = Date.now();
			}
		}
	}

	var $wrapper = document.querySelector(".main-wrapper"),
		currentPixel = window.pageYOffset || window.document.documentElement.scrollTop;

	var $title = document.querySelector('#rotating');
	if ( $title !== null ) {
		$title.style.whiteSpace = 'nowrap';
		$title.style.transition = 'transform 200ms linear';
	}

	window.addEventListener( 'scroll', throttle( function() {
		window.clearRequestTimeout( isScrolling );

		isScrolling = requestTimeout(function() { //trick to make understand Waypoints when it reaches a small first or last row

			var scrolled = window.pageYOffset || window.document.documentElement.scrollTop,
				body = document.body,
				html = document.documentElement,
				docH = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
				$row = false,
				firstOff,
				lastOff;

			if ( scrolled < 100 && $first.length ) {
				firstOff = $first.offset().top;
				if ( firstOff < 100 ) {
					var $row = $first;
				}
			} else if ( ( scrolled + UNCODE.wheight ) > ( docH - 100 ) && $last.length ) {
				lastOff = $last.offset().top + $last.outerHeight();
				if ( lastOff > ( docH - 100 ) ) {
					var $row = $last;
				}
			}

			if ( $row.length ) {
				var $col = $('.uncol[data-skin-change]', $row).eq(0),
					skin,
					$tmbs,
					tmbskin,
					bgColor = $row.attr('data-bg-color');

				if ( $col.length ) {
					skin = $col.attr('data-skin-change');
					$tmbs = $('.tmb[data-skin-change]', $row);
					tmbskin = skin.replace('style', 'tmb');
				}

				bgChange($col, bgColor, skin, tmbskin);
				checkTransparencyAndChange(skin);
				edges = true;
			}

		}, 150);

		if ( edges === true ) { //trick to make understand Waypoints when, after reaching a small first or last row, it has to start detecting again
			bg_waypoints();
			Waypoint.refreshAll();
			edges = false;
		}

	}, 100), false);

	$(window).on('resize', function() {
		clearRequestTimeout(setCTA);
		setCTA = requestTimeout(function() {
			if ( localH != UNCODE.wheight ) {
				localH = UNCODE.wheight;
				bg_waypoints();
				Waypoint.refreshAll();
			}
		}, 100);
	});

	bg_waypoints();

};

UNCODE.skewIt = function() {

	if ( $('body').hasClass('compose-mode') ) {
		return;
	}

	var justscrolled = false;

	var loadSkewIt = function(){

		var $pageHeader = $('#page-header'),
			$page_body = $('.page-body'),
			$header_skew = $('.uncode-skew.vc_row[data-parent]', $pageHeader);

		if ( $header_skew.length ) {
			$pageHeader.addClass('uncode-skew').css({
				position: 'relative',
				zIndex: 1
			});
			$header_skew.removeClass('uncode-skew');
			$page_body.css({
				position: 'relative',
				zIndex: 0
			});
		}

		var $skew = $('.uncode-skew'),
			$horizontal = $skew.hasClass('index-scroll') ? $skew : $skew.closest('.index-scroll'),
			horizontal = $horizontal.length,
			stopSkewing,
			lastOffset = 0,
			lastDate = Date.now();

		if ( ! $skew.length ) {
			return;
		}

		var dropSkew = function(){
			if ( UNCODE.wwidth < UNCODE.mediaQuery )
				return;

			$skew.each(function(){
				var $this = $(this),
					$drop = $('.t-entry-drop:not(.drop-parent)', $this);

				if ( $drop.length ) {
					$this.css({
						'transform': 'skew(0)'
					});
					var bound = $this[0].getBoundingClientRect();
					$drop.css({
						left: bound.x * -1,
						top: bound.y * -1,
					});
				}
			});
		};
		dropSkew();

		$(window).on('resize', dropSkew);

		window.addEventListener( 'scroll', function() {

			if ( justscrolled !== true ) {
				justscrolled = true;
				return;
			}

			window.clearRequestTimeout( stopSkewing );

			var now = Date.now(),
				delayInMs = now - lastDate,
				offset = window.pageYOffset || window.document.documentElement.scrollTop,
				newOffset = offset - lastOffset,
				speed = Math.pow((newOffset / delayInMs), 3) * -1,
				body = document.body,
				html = document.documentElement,
				docH = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
				wait = 50,
				maxSpeed = UNCODE.wwidth > UNCODE.mediaQuery ? 1 : 2;

			if ((lastDate + wait - now) < 0) {

				lastDate = now;
				lastOffset = offset;

				if ( speed > 6 ) {
					speed = 6;
				} else if ( speed < -6 ) {
					speed = -6;
				}

				if ( speed > 2 && offset < UNCODE.wheight ) {
					speed = 2;
				} else if ( speed < -2 && ( offset + (UNCODE.wheight*2) ) > docH ) {
					speed = -2;
				}

				var speedY = speed,
					speedX = speed * 1.25;

				if ( horizontal ) {
					speedY = 0;
					if ( $horizontal.hasClass('row-scroll-no-md') && UNCODE.wwidth <= UNCODE.mediaQuery ) {
						speedX = 0;
						return;
					} else if ( $horizontal.hasClass('row-scroll-no-sm') && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) {
						speedX = 0;
						return;
					}
				} else {
					speedX = 0;
				}

				if ( ! $skew.closest('.enter-st').length ) {
					speedX = 0;
				}

				gsap.killTweensOf($skew);
				gsap.to( $skew, {
					duration: 0.2,
					skewY: (speedY * maxSpeed) + "deg",
					skewX: (speedX * maxSpeed) + "deg",
					ease: Power0.easeNone,
					transformOrigin: 'center',
				});

			}

			stopSkewing = requestTimeout(function() {
				gsap.killTweensOf($skew);
				gsap.to( $skew, {
					duration: 0.5,
					skewY: "0deg",
					skewX: "0deg",
					transformOrigin: 'center',
					ease: Expo.easeOut,
				});

				$skew.each(function(){
					var $this = $(this),
						$drop = $('.t-entry-drop:not(.drop-parent)', $this);

					if ( $drop.length ) {
						var bound = $this[0].getBoundingClientRect()
						$drop.css({
							left: bound.x * -1,
							top: bound.y * -1,
						});
					}
				});

			}, 200);

		}, false);

	};

	$(window).on('load', loadSkewIt);

};

UNCODE.rotateIt = function() {

	if ( $('body').hasClass('compose-mode') ) {
		return;
	}

	var loadRotateIt = function(){

		var $toRotate = $('.uncode-rotate');

		$toRotate.each(function(){
			var $rotate = $(this),
				deg = 0,
				dir = true,
				coeff = 1,
				lastOffset = 0,
				lastDate = Date.now();

			var checkScroll = function($rotate){
				// if ( ! $rotate.length ) {
				// 	return;
				// }

				var now = Date.now(),
					delayInMs = now - lastDate,
					offset = window.pageYOffset || window.document.documentElement.scrollTop,
					newOffset = offset - lastOffset,
					speed = (newOffset / delayInMs) * 5,
					body = document.body,
					html = document.documentElement,
					docH = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

				lastDate = now;
				lastOffset = offset;

				if ( Math.abs(deg) > 359 || isNaN(deg) ) {
					deg = 0;
				}

				if ( $rotate.hasClass('uncode-rotate-scroll') || $rotate.hasClass('uncode-rotate-speed') ) {
					deg = parseFloat(deg) + parseFloat(speed);
				}

				if ( $rotate.hasClass('uncode-rotate-hover') ) {
					$rotate.hover(function(){
						coeff = 1.75;
					}, function(){
						coeff = 1;
					});
				}

				// if ( speed > 0 ) {
				// 	dir = true
				// } else if ( speed < 0 ) {
				// 	dir = false
				// }

				if ( ! $rotate.hasClass('uncode-rotate-scroll') ) {
					deg = deg+coeff;
					// if ( dir ) {
					// 	deg = deg+coeff;
					// } else {
					// 	deg = deg-coeff;
					// }
				}

				$rotate[0].style.transform = 'rotate(' + deg + 'deg)';

				requestAnimationFrame(function() {
					checkScroll($rotate);
				});

			};

			checkScroll($rotate);

		});

	};

	$(window).on('load', loadRotateIt);

};

var marqueeAttempts = 0,
	marqueeTO;

UNCODE.textMarquee = function( $titles ) {

	if ( typeof $titles == 'undefined' ) {
		$titles = $('.un-text-marquee');
	}

	if ( ! $titles.length ) {
		return;
	}

	$titles.each(function(){
		var $title = $(this),
			$span = $('> span', $title),
			txt,
			first = true,
			newW = UNCODE.wwidth;

		$('.marquee-clone-wrap', $title).remove();

		txt = $title.text();

		if ( ! $('.marquee-original-core', $span).length ) {
			$span = $('> span', $title).wrapInner('<span class="marquee-original-core" />').addClass('marquee-original');
		}

		var checkResize,
			spanW,
			$prepended = $('<span class="marquee-clone-wrap wrap-prepended" />'),
			$appended = $('<span class="marquee-clone-wrap wrap-appended" />'),
			clearSpeed,
			speed = 10;

		$span.prepend($prepended);
		$span.append($appended);

		var continuousTextMarquee = function(){
			var bound = $title.css({
					'transform': 'none',
					'opacity': 0
				}).offset();

			var xStrt = first || $title.hasClass('un-marquee-infinite') ? 0 : UNCODE.wwidth - bound.left,
				xEnd = $title.hasClass('un-marquee-infinite') ? spanW : ( spanW + bound.left ),
				xSpeed = $title.hasClass('un-marquee-infinite') ? ( spanW + bound.left ) : ( xStrt + ( UNCODE.wwidth + bound.left ) ),
				direction = $title.hasClass('un-marquee-opposite') ? 1 : -1;

			var marqueeTL = new TimelineMax({paused:true, reversed:true});

			var inViewElement = $title.closest('.sticky-trigger').length || $title.closest('.pin-spacer').length ? $title.closest('.vc_row')[0] : $title[0];

			var inview = new Waypoint.Inview({
				element: inViewElement,
				enter: function(direction) {
					marqueeTL.play();
				},
				exited: function(direction) {
					marqueeTL.pause();
				}
			});

			//gsap.killTweensOf($title);
			marqueeTL.fromTo( $title, {
				opacity: 1,
				x: xStrt
			},
			{
				duration: xSpeed / UNCODE.wwidth * speed,
				x: xEnd * direction,
				onComplete: function(){
					first = false;
					continuousTextMarquee();
				},
				ease: Linear.easeNone
			});
		};

		var runTextMarquee = function(){
			var time = Date.now();

			var textMarqueeScroll = function(){
				var $row = $title.closest('.vc_row'),
					$bound = $title.closest('.pin-spacer').length ? $row : $title,
					bound = $bound[0].getBoundingClientRect(),
					wait = 100,
					direction = $title.hasClass('un-marquee-scroll-opposite') ? -1 : 1;

				if ( bound.top === 0 && bound.bottom === 0 && bound.left === 0 && bound.right === 0 &&
					bound.height === 0 && bound.width === 0 && bound.x === 0 && bound.y === 0 &&
					marqueeAttempts < 2 ) {

					clearRequestTimeout(marqueeTO);

					marqueeTO = requestTimeout(function(){
						marqueeAttempts++;
						UNCODE.textMarquee();
					}, 100);
				}

				//if ((time + wait - Date.now()) < 0) {
					//if ( bound.top > ( bound.height * -4 ) && ( bound.top - bound.height ) < UNCODE.wheight * 2 ) {
						// $title[0].style.transform = 'translateX(' + ( UNCODE.wheight * 0.5 - bound.top ) * 0.75 + 'px)';
						gsap.killTweensOf($title);
						gsap.to( $title, {
							duration: 0.24,
							x: ( UNCODE.wheight * 0.35 - bound.top ) * 0.5 * direction,
							//ease: Expo.easeOut,
						});
					//}
					//time = Date.now();
				//}
			};

			textMarqueeScroll();
			$(window).on( 'load scroll', function() {
				textMarqueeScroll();
			});

		};

		var cloneSpan = function($_title, cntnt){

			if ( $_title.hasClass('un-marquee-infinite') ) {
				$('> span.marquee-clone-wrap', $_title).text('');
			}

			gsap.to( $_title, {
				duration: 0,
				x: 0
			});
			spanW = $span.outerWidth();

			if ( !spanW ) {
				return;
			}

			var part = Math.ceil( UNCODE.wwidth / spanW ) * 2;

			if ( $_title.hasClass('un-marquee-infinite') ) {

				for ( var i = 0; i < part; i++ ) {
					$prepended[0].textContent += cntnt + "\u00A0";
					$appended[0].textContent += cntnt + "\u00A0";
				}
			}

			if ( $('body').hasClass('compose-mode') ) {
				return;
			}

			if ( $_title.hasClass('un-marquee') || $_title.hasClass('un-marquee-opposite') ) {
				continuousTextMarquee();
			}

			if ( $_title.hasClass('un-marquee-scroll') || $_title.hasClass('un-marquee-scroll-opposite') ) {
				runTextMarquee();
			}

		};

		var marqueResize = function(){
			clearRequestTimeout(checkResize);
			checkResize = requestTimeout(function(){
				if ( newW !== UNCODE.wwidth ) {
					gsap.killTweensOf($title);
					UNCODE.textMarquee();
					newW = UNCODE.wwidth;
				}
			}, 1000);
		};

		$(window).off('resize', marqueResize)
		.on( 'resize', marqueResize);

		cloneSpan($title, txt);

		if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
			window.parent.vc.events.on( 'shortcodeView:updated', function( e ){
				// imageHover();
				var $_titles = $('.un-text-marquee',e.view.$el);
				UNCODE.textMarquee($_titles);
			});
		}
	});

};

UNCODE.parallax = function() {
	if (!UNCODE.isFullPage && !UNCODE.isFullPageSnap && (UNCODE.wwidth > UNCODE.mediaQuery || SiteParameters.mobile_parallax_animation === '1')) {
		if ($('.parallax-el').length > 0) {
			var parallax_elements = new Rellax('.parallax-el');
			$( document.body ).trigger('uncode_parallax_done', parallax_elements);
			window.addEventListener('boxResized', function(e) {
				parallax_elements.refresh();
			}, false);
			$(window).on('uncode_wc_variation_gallery_loaded', function (event) {
				requestTimeout(function() {
					parallax_elements.refresh();
				}, 100);
			});

		}
	}
};

UNCODE.magicCursor = function(){
	var $customCursor = $('#uncode-custom-cursor'),
		$customPilot = $('#uncode-custom-cursor-pilot'),
		$postLists = $('.uncode-post-titles'),
		currentCursor = 'auto',
		setTime,
		isScrolling,
		mouseEvent;

	function delayChangeCursor(cursorType, delayt_time){
		clearRequestTimeout(setTime);
		setTime = requestTimeout(function() {
			$customCursor.attr('data-cursor', cursorType);
			if ( $customPilot.length ) {
				$customPilot.attr('data-cursor', cursorType);
			}
			currentCursor = cursorType;
		}, delayt_time);
	}

	function changeCursor($wrap){
		$wrap = typeof $wrap === 'undefined' ? $('body') : $wrap;
		var href = SiteParameters.custom_cursor_selector != '' ? SiteParameters.custom_cursor_selector : '[href]',
			$href = $wrap.find(href),
			cursorType,
			setTime, set_delay;

		$href.hover(function(e) {
			var $this = $(this),
				data_cursor = $this.closest('[data-cursor]').attr('data-cursor') || $this.attr('data-cursor'),
				is_frontend_editor = $this.closest('.vc_controls').length,
				hasSrcOrClck = $('[src]', $this).length || $('.t-background-cover', $this).length || $this.closest('.tmb-click-row').length,
				$parent_cursor = $this.closest('[class*="custom-cursor"]');
			if ( is_frontend_editor ) {
				cursorType = 'auto';
			} else if ( typeof data_cursor !== 'undefined' && data_cursor !== '' && hasSrcOrClck ) {
				cursorType = data_cursor;
			} else if ( $parent_cursor.length ) {
				if ( $parent_cursor.hasClass('custom-cursor-light') ) {
					cursorType = 'icon-light';
				} else if ( $parent_cursor.hasClass('custom-cursor-diff') ) {
					cursorType = 'icon-diff';
				} else if ( $parent_cursor.hasClass('custom-cursor-accent') ) {
					cursorType = 'icon-accent';
				} else {
					cursorType = 'icon-dark';
				}
			} else {
				cursorType = 'pointer';
			}
			delayChangeCursor(cursorType, 0);
		}, function(){
			delayChangeCursor('auto', 150);
		});

		$(window).on('disable-hover', function(event) {
			document.addEventListener("mousemove", function(e) {
				mouseEvent = e;
			});
			delayChangeCursor('auto', 0);
		});

		$(window).on('enable-hover', function(event) {
			if ( typeof mouseEvent !== 'undefined' ) {
				var x = mouseEvent.clientX,
					y = mouseEvent.clientY;

				var elements = document.elementsFromPoint(x, y),
					$element = $(elements[0]);

				$element.closest(href).trigger('mouseenter');
			}
		});

	}

	$(window).on('load uncode-custom-cursor uncode-quick-view-loaded', function(event) {
		changeCursor();
	});

	$(document).ajaxComplete(function( event, xhr, settings ) {
		changeCursor();
	});

	$('.isotope-container').on('isotope-layout-complete', function() {
		var $this = $(this);
		changeCursor($this);
	});

};

UNCODE.magneticCursor = function(){
	function magneticCursor($wrap){
		$wrap = typeof $wrap === 'undefined' ? $('body') : $wrap;
		var $magnetics = $wrap.find('.tmb-image-anim-magnetic .t-entry-visual').has('img:not(.avatar), .t-background-cover, .dummy.secondary-dummy-image, .t-secondary-background-cover').add($('.magnetic').has('.background-inner, .header-bg'));

		$magnetics.on('mousemove', function(e){
			var $el = $('img:not(.avatar), .t-background-cover, .fluid-object, .dummy.secondary-dummy-image, .t-secondary-background-cover, .background-inner, .header-bg', this),
				bound = e.currentTarget.getBoundingClientRect(),
				coeff = 30,
				hor = (bound.width / 2) - (e.clientX - bound.left),
				ver = (bound.height / 2) - (e.clientY - bound.top),
				toX = hor / bound.width * coeff,
				toY = ver / bound.height * coeff,
				scaleX = ((bound.width + coeff + 5) / bound.width).toFixed(2),
				scaleY = ((bound.height + coeff + 5) / bound.height).toFixed(2),
				toScale = Math.max(scaleX, scaleY);

			gsap.killTweensOf($el);
			gsap.to( $el, {
				duration: 0.75,
				x: toX,
				y: toY,
				scale: toScale,
				ease: Power1.easeOut,
				transformPerspective: 900,
				transformOrigin: 'center',
				force3D: true
			});
		}).on('mouseout', function(e){
			var $el = $('img:not(.avatar), .t-background-cover, .fluid-object, .dummy.secondary-dummy-image, .t-secondary-background-cover, .background-inner, .header-bg', this);
			gsap.killTweensOf($el);
			gsap.to( $el, {
				duration: 0.6,
				y: 0,
				x: 0,
				scale: 1,
				ease: Power1.easeOut,
				transformPerspective: 900,
				transformOrigin: 'center',
				force3D: true
			});
		});
	};

	$(window).on('load uncode-custom-cursor uncode-quick-view-loaded', function(event) {
		magneticCursor();
	});

	$(document).ajaxComplete(function( event, xhr, settings ) {
		magneticCursor();
	});

	$('.isotope-container').on('isotope-layout-complete', function() {
		var $this = $(this);
		magneticCursor($this);
	});

};

UNCODE.dropImage = function() {

	/****************************
	 * Image hover *
	****************************/
	function imageHover(){
		if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
			return;
		}

		var $postLists = $('.uncode-post-titles');
		$postLists.each(function(){
			var $list = $(this),
				timing = parseFloat( $list.attr('data-timing') ),
				default_image = $list.hasClass('uncode-post-titles-default-image'),
				default_title = $list.hasClass('uncode-post-titles-default-title'),
				$tmbs = $('.tmb', $list),
				$drop_moves = $('.t-entry-drop:not(.drop-parent)', $tmbs),
				clientX,
				clientY,
				$row_parent = $list.closest('.vc_row'),
				$drop_row_parents = $('.drop-parent.drop-parent-row', $list),
				$col_parent = $list.closest('.uncell'),
				$drop_col_parents = $('.drop-parent.drop-parent-column', $list),
				setCTA;

			timing *= 0.001;

			var drop_bgs = function(){
				$drop_row_parents.add($drop_col_parents).filter('[data-bgset]').each(function(e){
					var $drop = $(this),
						srcset = $drop.attr('data-bgset'),
						setArr = srcset.split(","),
						setArrOrder = [],
						biggest = 0,
						checkBg = false;

					if ( SiteParameters.uncode_adaptive == true ) {
						if (  typeof setArr[0] !== 'undefined' && setArr[0] !== null ) {
							$drop.css({
								'background-image' : 'url(' + setArr[0] + ')'
							});
						}
					} else {
						for ( var i = 0; i < setArr.length; i++ ) {
							var setLoop = setArr[i].trim().split(" ");
							if ( typeof setLoop[1] !== 'undefined' && setLoop[1] !== '' ) {
								var parseSet = parseFloat(setLoop[1]);
								if ( biggest < parseSet ) {
									biggest = parseSet;
								}
								setArrOrder[parseSet] = setLoop[0];
								if ( screenInfo.width <= parseSet && typeof setLoop[0] !== 'undefined' && setLoop[0] !== null ) {
									checkBg = true;
									$drop.css({
										'background-image' : 'url(' + setLoop[0] + ')'
									});
								}
							}
						}

						if ( !checkBg && typeof setArrOrder[biggest] !== 'undefined' && setArrOrder[biggest] !== null ) {
							$drop.css({
								'background-image' : 'url(' + setArrOrder[biggest] + ')'
							});
						}
					}

				});
			};

			drop_bgs();

			var dropMovesSize = function(){
				if ( UNCODE.wwidth < UNCODE.mediaQuery ) {
					return;
				}
				$drop_moves.each(function(){
					var $drop_move = $(this),
						dataW = $drop_move.attr('data-w'),
						$anim_parent = $drop_move.closest('.animate_when_almost_visible:not(.uncode-skew):not(.t-inside), .parallax-el');
					if ( typeof dataW !== 'undefined' && dataW !== null ) {
						dataW = screenInfo.width / 12 * parseFloat( dataW );
					}
					$drop_moves.css({
						width: dataW
					});

					if ( $anim_parent.length && $anim_parent.css('transform') !== '' && $anim_parent.css('transform') !== 'none' ) {
						$anim_parent.on('animationend', function(){
							var bound = $anim_parent[0].getBoundingClientRect();
							$drop_move.css({
								left: bound.x * -1,
								top: bound.y * -1,
							});
						});
					}
				});


			};

			dropMovesSize();

			$(window).on( 'resize', function(){
				clearRequestTimeout(setCTA);
				setCTA = requestTimeout( function() {
					drop_bgs();
					dropMovesSize();
				}, 100 );
			});

			if ( $drop_row_parents.length ) {
				$row_parent.addClass( 'drop-added' );
			}

			$drop_row_parents.each(function(index, val){
				var $drop = $(val);
				$row_parent.prepend($drop);
				manageVideos($drop, false);
				if ( typeof UNCODE.initVideoComponent !== 'undefined' ) {
					UNCODE.initVideoComponent($row_parent[0], '.uncode-video-container.video, .uncode-video-container.self-video');
				}
				if ( default_image && index == 0 ) {
					manageVideos($drop, true);
					var bg_img = $drop.css('background-image').match(/url\(["']?([^"']*)["']?\)/)[1],
						image_ph = new Image();
					if ( typeof bg_img !== 'undefined' && bg_img !== null ) {
						image_ph.onload = function() {
							$drop.addClass('active');
							if ( default_title ) {
								$list.addClass('drop-hover');
								$tmbs.first().addClass('drop-active');
							}
						};
						image_ph.src = bg_img;
					}
				}
			});

			if ( $drop_col_parents.length ) {
				$col_parent.addClass( 'drop-added' );
			}

			$drop_col_parents.each(function(index, val){
				var $drop = $(this);
				$col_parent.prepend($drop);
				manageVideos($drop, false);
				if ( typeof UNCODE.initVideoComponent !== 'undefined' ) {
					UNCODE.initVideoComponent($col_parent[0], '.uncode-video-container.video, .uncode-video-container.self-video');
				}
				if ( default_image && index == 0 ) {
					manageVideos($drop, true);
					var bg_img = $drop.css('background-image').match(/url\(["']?([^"']*)["']?\)/)[1],
						image_ph = new Image();
					if ( typeof bg_img !== 'undefined' && bg_img !== null ) {
						image_ph.onload = function() {
							$drop.addClass('active');
							if ( default_title ) {
								$list.addClass('drop-hover');
								$tmbs.first().addClass('drop-active');
							}
						};
						image_ph.src = bg_img;
					}
				}
			});

			function manageVideos( $el, start ) {
				var videoElem = $('video', $el),
					$iframe = $('iframe', $el),
					iframeID = $iframe.attr('id');
				if ( videoElem.length ) {
					if ( Object.prototype.toString.call( videoElem[0].setCurrentTime) == '[object Function]') {
						if ( start ) {
							videoElem[0].setCurrentTime(0);
							videoElem[0].play();
						} else {
							videoElem[0].pause();
							videoElem[0].setCurrentTime(0);
						}
					} else {
						if ( start ) {
							videoElem[0].currentTime = 0;
							videoElem[0].play();
						} else {
							videoElem[0].pause();
							videoElem[0].currentTime = 0;
						}
					}
				}

				$el.data('active', start);

				if ( $el.attr('data-provider') === 'vimeo' && typeof iframeID !== 'undefined' && iframeID !== null ) {
					var iframeIDv = iframeID.replace('okplayer-', ''),
						optionsV = $(window).data('okoptions-' + iframeIDv),
						vimeo = $iframe[0],
						playerV = new Vimeo.Player(vimeo),
						timeV = 0;

					if (optionsV.time != null) {
						var timeArr = (optionsV.time).replace('t=', '').split(/([^\d.-])/);
						for ( var i = 0; i < timeArr.length; i++ ) {
							if ( timeArr[i] === 'h' ) {
								timeV += parseFloat(timeArr[i-1]) * 3600;
							} else if ( timeArr[i] === 'm' ) {
								timeV += parseFloat(timeArr[i-1]) * 60;
							} else if ( timeArr[i] === 's' ) {
								timeV += parseFloat(timeArr[i-1]);
							}
						}
					}
					playerV.setCurrentTime(timeV);
					if ( start ) {
						playerV.setVolume(0);
						playerV.play();
					} else {
						playerV.pause();
					}
				} else if ( $el.attr('data-provider') === 'youtube' ) {
					if ( start ) {
						$el.trigger('uncode-resume');
					} else {
						$el.trigger('uncode-pause');
					}
				}

			}

			if ( UNCODE.wwidth >= UNCODE.mediaQuery ) {

				document.addEventListener("mousemove", function(e) {
					$drop_moves.each(function(){
						var $drop_move = $(this),
							duration = 0.4;

						if ( $('#uncode-custom-cursor:not(.in-content)').length ) {
							duration = 0.8;
						}

						clientX = e.clientX;
						clientY = e.clientY;

						gsap.to( $drop_move, {
							duration: duration,
							x: clientX,
							y: clientY,
							ease: Power1.easeOut,
						});
					});
				});

			} else {

				$(window).on("touchend scroll", function(e) {
					$list.removeClass('drop-hover');
					$drop_moves.removeClass('active');
					$tmbs.removeClass('drop-active');
				});

				$drop_moves.each(function(){
					var $drop_move = $(this),
						$tmb = $drop_move.closest('.tmb'),
						$anim_parent = $drop_move.closest('.animate_when_almost_visible, .uncode-skew, .parallax-el');

					if ( $anim_parent.hasClass('uncode-skew') ) {
						$anim_parent.css({
							'transform': 'skew(0)'
						});
					}

					$tmb.on('touchend', function(e){
						e.stopPropagation();

						$drop_moves.removeClass('active');
						$tmbs.removeClass('drop-active');

						$list.addClass('drop-hover');
						$tmb.addClass('drop-active');
						$drop_move.addClass('active');
						manageVideos($drop_move, true);
						clientX = e.changedTouches[0].clientX;
						clientY = e.changedTouches[0].clientY;

						if ( $anim_parent.length && $anim_parent.css('transform') !== '' && $anim_parent.css('transform') !== 'none' ) {
							var bound = $anim_parent[0].getBoundingClientRect();
							clientX = clientX - bound.x;
							clientY = clientY - bound.y;
						}

						$drop_move.css({
							left: clientX,
							top: clientY
						});
					});
				});

			}

			$tmbs.each(function(e){
				var $tmb = $(this),
					// $trgr = $('a', $tmb),
					$trgr = $tmb,
					$drop_move = $('.t-entry-drop:not(.drop-parent)', $tmb),
					$anim_parent = $drop_move.closest('.animate_when_almost_visible:not(.uncode-skew):not(.t-inside), .parallax-el'),
					$video = $('video', $tmb),
					$iframe = $('iframe', $tmb),
					$entryTxt = $('.t-entry-text', $tmb),
					stopBounding;

				$entryTxt.add($drop_move).css({
					'transition-duration': timing + 's'
				});

				if ( $video.length ) {
					var vidH = $video[0].videoHeight,
						vidW = $video[0].videoWidth;
					$video.css({
						'height': vidH,
						'width': vidW
					});
				}

				if ( $iframe.length ) {
					var vidH = $drop_move.attr('data-height'),
						vidW = $drop_move.attr('data-width');
					$iframe.css({
						'height': vidH,
						'width': vidW
					});
				}

				$iframe.each(function(){
					var $video = $(this),
						vidH = $video[0].videoHeight,
						vidW = $video[0].videoWidth;
					$video.css({
						'height': vidH,
						'width': vidW
					});
				});

				if ( $drop_move.length && UNCODE.wwidth >= UNCODE.mediaQuery ) {
					$trgr.on('mouseenter',function(e){
						$list.addClass('drop-hover');
						$tmbs.removeClass('drop-active');
						$tmb.addClass('drop-active');
						$drop_move.addClass('active');
						manageVideos($drop_move, true);

						var clientX = e.clientX,
							clientY = e.clientY;
						$drop_move.css({
							'transform': 'translate3d(' + clientX + 'px, ' + clientY + 'px, 0px)'
						});

					})
					.on('mouseleave', function(e){
						$list.removeClass('drop-hover');
						$drop_move.css({
							'transition-duration': ( timing*1.25 ) + 's'
						});
						$drop_move.removeClass('active');
						$tmb.removeClass('drop-active');
						$drop_move.on('transitionend', function(e){
							$drop_move.off('transitionend');
							$drop_move.css({
								'transition-duration': timing + 's'
							});
							manageVideos($drop_move,false);
						});
					});

					document.addEventListener('visibilitychange', function(){
						if ( document.visibilityState == 'hidden' && $drop_move.data('active') === true ) {
							$drop_move.css({
								'transition-duration': '0s'
							});
							$drop_move.removeClass('active');
							manageVideos($drop_move, false);
						}
					});

					document.addEventListener('scroll', function(){
						window.clearRequestTimeout( stopBounding );

						if ( $drop_move.hasClass('active') ) {
							$list.removeClass('drop-hover');
							$tmbs.removeClass('drop-active');
							$drop_move.removeClass('active');
							$drop_move.on('transitionend', function(e){
								$drop_move.off('transitionend');
								$drop_move.css({
									'transition-duration': timing + 's'
								});
								manageVideos($drop_move,false);
							});
						}

						stopBounding = requestTimeout(function() {
							if ( $anim_parent.length && $anim_parent.css('transform') !== '' && $anim_parent.css('transform') !== 'none' ) {
								var bound = $anim_parent[0].getBoundingClientRect();
								$drop_move.css({
									left: bound.x * -1,
									top: bound.y * -1,
								});
							}
						}, 200);

					});
				}

				var datatarget = $trgr.closest('[data-drop-target]').attr('data-drop-target'),
					$drop = $('[data-drop="' + datatarget + '"]', $row_parent);

				$drop.css({
					'transition-duration': timing + 's'
				});

				if ( ( $drop_row_parents.length || $drop_col_parents.length ) && $drop.length ) {
					$trgr.on('mouseenter',function(e){
						$row_parent.add($col_parent).addClass('drop-list-loaded');
						$list.addClass('drop-hover');

						if ( !$tmb.hasClass('drop-active') ) {
							$tmbs.removeClass('drop-active');
							$tmb.addClass('drop-active');
							if ( default_image && !$drop.hasClass('active') ) {
								var $prev = $('[data-drop].active', $row_parent);
								$prev.css({
									'transition-duration': (timing*1.5) + 's'
								});
								$prev.removeClass('active');
								$prev.on('transitionend', function(e){
									$prev.off('transitionend');
									manageVideos($prev,false);
								});
							}
							$drop.css({
								'transition-duration': timing + 's'
							});
							$drop.off('transitionend');
							$drop.addClass('active');
							manageVideos($drop, true);
						}
					})
					.on('mouseleave', function(e){
						if ( ( default_image && !default_title ) || !default_image ) {
							$list.removeClass('drop-hover');
							$tmb.removeClass('drop-active');
						}
						if ( ! default_image ) {
							$drop.css({
								'transition-duration': (timing*1.5) + 's'
							});
							$drop.removeClass('active');

							$drop.on('transitionend', function(e){
								$drop.off('transitionend');
								manageVideos($drop,false);
							});
						}
					});

					document.addEventListener('visibilitychange', function(){
						if ( document.visibilityState == 'hidden' && $drop.data('active') === true && ! default_image ) {
							$drop.css({
								'transition-duration': '0s'
							});
							$drop.removeClass('active');
							manageVideos($drop, false);
						}
					});
				}
			});

		});
	};

	$(window).on('load', function(event) {
		imageHover();
	});

	var drop_wp_animation = function() {
		var $postLists = $('.uncode-post-titles');
		$postLists.each(function(){
			$.each($('.t-inside.animate_when_almost_visible', $postLists), function(index, val) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var element = $(this.element),
							parent = element.closest('.tmb'),
							currentIndex = parent.index(),
							delay = currentIndex,
							delayAttr = parseInt(element.attr('data-delay'));
						if (isNaN(delayAttr)) delayAttr = 100;
						var objTimeout = requestTimeout(function() {
							element.addClass('start_animation');

							var nextTimeout = requestTimeout(function() {
								$('.drop-image-separator', parent).addClass('start_animation');
							}, 50);

						}, delay * delayAttr);
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				})
			});
		});
	}

	var runWaypoints_TO,
		runWaypoints_delay = 0;

	var runWaypoints = function(){
		if ( typeof runWaypoints_TO !== 'undefined' && runWaypoints_TO !== '' ) {
			runWaypoints_delay = 400;
		}
		clearRequestTimeout(runWaypoints_TO);
		runWaypoints_TO = requestTimeout(function() {
			drop_wp_animation();
		}, runWaypoints_delay);
	};
	runWaypoints();
	$( document.body ).on( 'uncode_waypoints', runWaypoints );
	if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
		window.parent.vc.events.on( 'shortcodeView:ready shortcodeView:updated', function(){
			// imageHover();
			runWaypoints();
		});
	}
};

UNCODE.postTable = function() {

	var clickRow = function(){
		var $postLists = $('.uncode-post-table');

		$postLists.each(function(){
			var $postList = $(this),
				$tmbClicks = $('.tmb.tmb-click-row', $postList);

			$tmbClicks.each(function(){
				var $tmb = $(this),
					$click = $('.table-click-row', $tmb);
				$('*:not(.table-click-row)', $tmb).on('click', function(e){
					e.preventDefault();
					e.stopPropagation();
					$click[0].click();
					return false;
				});
			});

		})
	};

	clickRow();

	var hoverRow = function(){
		var $postLists = $('.uncode-post-table.uncode-post-table-hover');

		$postLists.on('mouseenter', function(){
			$(this).addClass('post-table-hover');
		});
		$postLists.on('mouseleave', function(){
			$(this).removeClass('post-table-hover');
		});
	}

	hoverRow();

	var drop_wp_animation = function() {
		var $postLists = $('.uncode-post-table');
		$postLists.each(function(){
			$.each($('.t-inside.animate_when_almost_visible', $postLists), function(index, val) {
				new Waypoint({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: val,
					handler: function() {
						var element = $(this.element),
							parent = element.closest('.tmb'),
							currentIndex = parent.index(),
							delay = currentIndex,
							delayAttr = parseInt(element.attr('data-delay'));
						if (isNaN(delayAttr)) delayAttr = 100;
						var objTimeout = requestTimeout(function() {
							element.addClass('start_animation');
						}, delay * delayAttr);
						if (!UNCODE.isUnmodalOpen) {
							this.destroy();
						}
					},
					offset: UNCODE.isFullPage ? '100%' : '90%'
				})
			});
		});
	}

	var runWaypoints_TO,
		runWaypoints_delay = 0;

	var runWaypoints = function(){
		if ( typeof runWaypoints_TO !== 'undefined' && runWaypoints_TO !== '' ) {
			runWaypoints_delay = 400;
		}
		clearRequestTimeout(runWaypoints_TO);
		runWaypoints_TO = requestTimeout(function() {
			drop_wp_animation();
		}, runWaypoints_delay);
	};
	runWaypoints();
	$( document.body ).on( 'uncode_waypoints', runWaypoints );
	if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
		window.parent.vc.events.on( 'shortcodeView:ready shortcodeView:updated', function(){
			runWaypoints();
			// clickRow();
		});
	}
};

UNCODE.rotatingTxt = function($ctxt) {

	if ( $('body').hasClass('compose-mode') ) {
		return;
	}

	$ctxt = typeof $ctxt == 'undefined' ? $('body') : $ctxt;
	var setCTA;

	$('.el-text', $ctxt).has('.uncode-rotating-text-start[data-text]').each(function(){
		var $heading = $(this),
			// debug = 0,
			cycle = 0,
			$trgt,
			$toMove,
			$highl,
			$col = $heading.closest('.uncont'),
			txt,
			arrTxt,
			textFadeIn, textFadeOut,
			removeWraps;

		var defineObjs = function() {
			$('.uncode-rotating-text-start[data-text]', $heading).each(function(){
				var $rtx = $(this),
					fx = $rtx.attr('data-fx'),
					wait = $rtx.attr('data-wait'),
					$prev = $(this).prev().addClass('prev-rotating-start'),
					splitToMove = [],
					splitArray = [],
					lineArray = [],
					lineIndex = 0,
					lineStart = true,
					lineEnd = false,
					startSplit = false,
					$line_wrap = $rtx.closest('.heading-line-wrap'),
					same_line = true,
					$splits = $rtx.closest('.el-text').find('.split-word').removeClass('empty-span-hidden'),
					indexRtx = $splits.index($rtx);

				fx = typeof fx === 'undefined' ? '' : fx;
				wait = typeof wait === 'undefined' ? '' : wait;

				$splits.each(function(key, val){
					var $split = $(this),
						$new_line_wrap = $split.closest('.heading-line-wrap');

					if ( $split.text() == '' && !$split.hasClass('uncode-rotating-text-end') && !$split.hasClass('uncode-rotating-text-start') && !splitArray.length ) {
						splitArray.push( $split );
					}

					if ( $split.hasClass('uncode-rotating-text-end') && startSplit === true ) {
						startSplit = false;
					}

					if ( ! $split.hasClass('uncode-rotating-text-end') && startSplit === true ) {
						splitArray.push( $split );

						if ( same_line && ( !$new_line_wrap.length || $line_wrap[0] == $new_line_wrap[0] ) ) {
							same_line = true;
						} else {
							same_line = false;
						}
					}

					if ( key == indexRtx ) {
						if ( /\S/.test($split.text()) ) {
							startSplit = true;
							$line_wrap = $split.closest('.heading-line-wrap');
							splitArray.push( $split );
						} else {
							indexRtx++;
						}
					}

					$line_wrap = $new_line_wrap;
				});

				$toMove = $($.map(splitToMove, function(el){return el.get();}));
				$trgt = $($.map(splitArray, function(el){return el.get();}));

				if ( same_line ) {
					$trgt.wrapAll('<span class="uncode-rotating-wrap" data-fx="' + fx + '" data-wait="' + wait + '" />');
					$trgt.wrapAll('<span class="uncode-rotating-wrap-inner" />');
				}

				if ( $prev.hasClass('split-word-empty') && $rtx.is(':last-child') ) {
					$prev.addClass('empty-span-hidden');
				}

				$highl = $('.heading-text-highlight-inner', $trgt);

				$rtx.attr('data-animated', 'true');
				if ( cycle == 0 ) {
					$( document.body ).trigger('defer-highlights');
					cycle++;
					defineObjs();
					return;
				}
				cycle++;

				txt = $rtx.attr('data-text');
				arrTxt = txt.split("|");

				textFadeOut($trgt);

			});
		};

		removeWraps = function(){

			// if ( debug == 1 ) return;
			var $wraps = $heading[0].querySelectorAll('.uncode-rotating-wrap, .uncode-rotating-wrap-inner');
			for (var wrap_k = 0; wrap_k < $wraps.length; wrap_k++) {


				var $temp_highl = $($wraps[wrap_k]).find('> .heading-text-highlight-inner').clone(),
					$splitFlow = $($wraps[wrap_k]).find('.split-word-flow');

				$($wraps[wrap_k]).find('> .heading-text-highlight-inner').remove();

				$splitFlow.each(function(){
					$(this).append($temp_highl);
				});

				var $line_wrap = $wraps[wrap_k];
				var $parent_wrap = $line_wrap.parentNode;
				if ( $parent_wrap !== null ) {
					while ( $line_wrap.firstChild ) {
						$parent_wrap.insertBefore($line_wrap.firstChild, $line_wrap);
					}
					$parent_wrap.removeChild($line_wrap);
				}
			}
			// debug++;
			defineObjs();
		};

		var loop = 0;
		textFadeIn = function($trgt){
			var word = arrTxt[loop].split(" "),
				worsSpan = '',
				$wrap = $trgt.closest('.uncode-rotating-wrap'),
				$wrap_inner = $trgt.closest('.uncode-rotating-wrap-inner'),
				fx = $trgt.closest('.uncode-rotating-wrap').attr('data-fx');

			for (var w = 0; w < word.length; w++) {
				var highl;
				if ( $highl.length ) {
					highl = $highl[0].outerHTML;
				} else {
					highl = '';
				}

				if ( w > 0 ) {
					worsSpan += '<span class="split-word"><span class="split-word-flow"><span class="split-word-inner split-empty-inner">&nbsp;</span>' + highl + '</span></span>';
				}
				var charachters = word[w].split('');
				worsSpan += '<span class="split-word"><span class="split-word-flow"><span class="split-word-inner">';
				for (var c = 0; c < charachters.length; c++) {
					worsSpan += '<span class="split-char">' + charachters[c] + '</span>';
				}
				worsSpan += '</span>' + highl + '</span></span>';
			}

			if ( $wrap.length && $wrap_inner.length ) {
				var words_w = $wrap_inner.outerWidth();
				$wrap.css({
					width: words_w
				});

				$highl = $('.heading-text-highlight-inner', $wrap);
				$highl.prependTo($wrap);

				$wrap_inner.css({
					opacity: 0
				});

				$wrap_inner.html(worsSpan);
				$('.heading-text-highlight-inner', $wrap_inner).remove();
				words_w = $wrap_inner.innerWidth();

				var duration = 0.45;

				$heading.removeClass('auto-width');
				if ( words_w > $col.width() ) {
					$heading.addClass('auto-width');
					words_w = 'auto';
					duration = 0;
				}

				$wrap.css({
					'width': words_w,
					'transition': 'width ' + (duration*1000) + 'ms cubic-bezier(0.16, 1, 0.3, 1)',
				});

				var $word_inner = $('.split-word-inner', $wrap_inner),
					$extra_wrap_inner = $wrap_inner.closest('.uncode-rotating-wrap-inner');

				var $target_fx = fx === 'zoom' ? $wrap_inner : $word_inner;

				if ( !$target_fx.length ) {
					return;
				}

				gsap.killTweensOf($target_fx);

				if ( fx !== 'zoom' ) {
					gsap.fromTo( $target_fx, {
						y: fx === 'opacity' ? '0%' : '-10%'
					},{
						delay: duration,
						duration: 0.25,
						y: '0%',
						ease: Circ.easeOut,
					});

					if ( !$wrap_inner.length ) {
						return;
					}

					gsap.fromTo( $wrap_inner, {
						opacity: 0,
					},{
						delay: duration,
						duration: 0.25,
						opacity: 1,
						ease: Circ.easeOut,
						onComplete: function(){
							$('> .heading-text-highlight-inner', $wrap).remove();
							$wrap_inner.html(worsSpan);
							removeWraps();
						}
					})

				} else {
					gsap.fromTo( $target_fx, {
						transformOrigin: '50%',
						opacity: 0,
						scale: 0.875,
					},{
						opacity: 1,
						delay: duration,
						duration: 0.25,
						scale: 1,
						ease: Circ.easeOut,
						onComplete: function(){
							$('> .heading-text-highlight-inner', $wrap).remove();
							$wrap_inner.html(worsSpan);
							removeWraps();
						}
					});
				}

			} else {

				if ( !$wrap_inner.length ) {
					return;
				}

				gsap.to( $wrap_inner, {
					duration: 0.4,
					opacity: 0,
					ease: Power1.easeOut,
					onComplete: function(){
						$wrap_inner.html(worsSpan);
						words_w = $wrap_inner.innerWidth();

						gsap.to( $wrap_inner, {
							duration: 0.2,
							opacity: 1,
							ease: Power1.easeOut,
							onComplete: function(){
								$('> .heading-text-highlight-inner', $wrap).remove();
								$wrap_inner.html(worsSpan);
								removeWraps();
							}
						})
					}
				});
			}

			if ( loop < arrTxt.length-1 ) {
				loop++;
			} else {
				loop = 0;
			}

		};

		textFadeOut = function($trgt){
			var $word_inner = $('.split-word-inner', $trgt),
				$wrap = $trgt.closest('.uncode-rotating-wrap'),
				$wrap_inner = $trgt.closest('.uncode-rotating-wrap-inner'),
				fx = $trgt.closest('.uncode-rotating-wrap').attr('data-fx'),
				wait = $trgt.closest('.uncode-rotating-wrap').attr('data-wait');

			wait = typeof wait === 'undefined' || wait === '' ? 3 : parseFloat(wait)/1000;

			var gsap_param = {
					delay: wait,
					duration: 0.25,
					y: fx === '' ? '10%' : '0%',
					opacity: 0,
					ease: Circ.easeOut,
					onStart: function(){
						if ( $wrap.length && $wrap_inner.length && fx === 'zoom' ) {
							$highl = $('.heading-text-highlight-inner', $wrap);
							$highl.prependTo($wrap);
						}
					},
					onComplete: textFadeIn,
					onCompleteParams: [$trgt]
				};

			var $target_fx = fx === 'zoom' ? $wrap_inner : $word_inner;

			if ( fx === '' ) {
				gsap_param.y = '10%';
			} else if ( fx === 'zoom' ) {
				gsap_param.scale = '1.045';
			}

			if ( !$target_fx.length ) {
				return;
			}

			if ( $heading.data('waypoint') !== true ) {
				var textInView = new Waypoint.Inview({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: $heading[0],
					enter: function(direction) {
						$heading.data('waypoint',true);
						gsap.fromTo( $target_fx, {
							transformOrigin: '50%'
						}, gsap_param );
					}
				});
			} else {
				gsap.fromTo( $target_fx, {
					transformOrigin: '50%'
				}, gsap_param );
			}
		};

		if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
			window.parent.vc.events.on( 'shortcodeView:updated shortcodeView:ready', function(model){
				var $el = model.view.$el,
					shortcode = model.attributes.shortcode;

				UNCODE.rotatingTxt($el);
			});
		} else {
			if ( $heading.hasClass('animate_inner_when_almost_visible') ) {
				$heading.on('already-animated', function(){
					removeWraps();
					window.addEventListener('removeOldLines', function(){
						clearRequestTimeout(setCTA);
						setCTA = requestTimeout( removeWraps, 150 );
					});
				});
			} else {
				$(window).on('load', function(){
					removeWraps();
					window.addEventListener('removeOldLines', function(){
						clearRequestTimeout(setCTA);
						setCTA = requestTimeout( removeWraps, 150 );
					});
				});
			}
		}
	});

};

UNCODE.verticalText = function() {
	$(window).on('menuCanvasOpen', function(){
		$('.vertical-text--fixed').fadeOut(500);
		$('.horizontal-text--fixed').fadeOut(500);
	}).on('menuCanvasClose', function(){
		$('.vertical-text--fixed').fadeIn(500);
		$('.horizontal-text--fixed').fadeIn(500);
	});

	var hideOnBottomVerticalTexts = $('.vertical-text--vis-hide-bottom');
	var showOnTopVerticalTexts = $('.vertical-text--vis-show-top');
	var hideOnBottomHorizontalTexts = $('.horizontal-text--vis-hide-bottom');
	var showOnTopHorizontalTexts = $('.horizontal-text--vis-show-top');

	if (hideOnBottomVerticalTexts.length > 0 || showOnTopVerticalTexts.length > 0 || hideOnBottomHorizontalTexts.length > 0 || showOnTopHorizontalTexts.length > 0) {
		window.addEventListener('scroll', function(e) {
			var totalPageHeight = document.body.scrollHeight;
			var scrollPoint = window.scrollY + window.innerHeight;

			if (window.scrollY > 0) {
				showOnTopVerticalTexts.fadeOut();
				showOnTopHorizontalTexts.fadeOut();
			} else {
				showOnTopVerticalTexts.fadeIn();
				showOnTopHorizontalTexts.fadeIn();
			}

			if (scrollPoint >= totalPageHeight) {
				hideOnBottomVerticalTexts.fadeOut();
				hideOnBottomHorizontalTexts.fadeOut();
			} else {
				hideOnBottomVerticalTexts.fadeIn();
				hideOnBottomHorizontalTexts.fadeIn();
			}
		}, false);
	}
};

UNCODE.stickyScroll = function( $el ) {
	if ( typeof $el === 'undefined' || $el === null ) {
		$el = $('body');
	}
	var checkVisible = function( el, dir ) {
		if (typeof jQuery === "function" && el instanceof jQuery) {
			el = el[0];
		}

		var off = 50;
		dir = typeof dir=='undefined' ? 'right' : dir;
		var rect = el.getBoundingClientRect();

		return (
			(
				( rect.top >= 0 && (rect.top + off) <= (window.innerHeight || document.documentElement.clientHeight) ) ||
				( rect.bottom >= off && (rect.bottom) <= (window.innerHeight || document.documentElement.clientHeight) ) ||
				( rect.top <= 0 && (rect.bottom) >= (window.innerHeight || document.documentElement.clientHeight) )
			) &&
			(
				( rect.left >= 0 && (rect.left + (window.innerWidth || document.documentElement.clientWidth)/2) <= (window.innerWidth || document.documentElement.clientWidth) ) ||
				( rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth) ) ||
				( rect.right <= window.innerWidth && (rect.right - off) >= 0 ) ||
				( rect.right <= window.innerWidth && rect.left >= 0 )
			)
		);
	};

	var setItemsRelHeight = function(reset) {
		var $_el = $el;
		if ( $el.is('.index-scroll') ) {
			var $_el = $el.closest('.uncont');
		}
		$('.index-scroll:not(.hor-scroll-vh) .index-row', $_el).each(function(i, item){
			$.each($('.tmb', item), function(index, val) {
				if ( reset === true ) {
					$(val).css( 'visibility', 'hidden' );
				} else {
					$(val).css( 'visibility', 'visible' );
				}
			});
		});
		$('.index-scroll.hor-scroll-vh .index-row', $_el).each(function(i, item){
			$.each($('.tmb', item), function(index, val) {
				if ( reset === true ) {
					$(val).css( 'visibility', 'hidden' );
					$('img:not(.avatar), picture, .t-background-cover', val).css( 'height', 'auto' );
				} else {
					var $rowParent = $(item).closest('.row-parent'),
						rowRatio = $rowParent.attr('data-height-ratio'),
						$rowInner = $(item).closest('.row-child'),
						rowRatioInner = $rowInner.attr('data-height'),
						paddingRow = parseInt($rowParent.css('padding-top')) + parseInt($rowParent.css('padding-bottom')),
						$colContainer = $(item).closest('.uncell'),
						$uncont = $(item).closest('.uncont'),
						paddingCol = parseInt($colContainer.css('padding-top')) + parseInt($colContainer.css('padding-bottom')),
						safe_heigth = $(item).data('safe-height'),
						winHeight = safe_heigth ? UNCODE.wheight : $('#vh_layout_help').outerHeight(),
						offSet = $(item).offset().top - $uncont.offset().top,
						multiplier_h,
						data_viewport_h,
						body_border = $('.body-borders .top-border').outerHeight() * 2,
						remove_menu = $(item).data('vp-menu');

					if ( rowRatio === 'full' || rowRatio === '' ) {
						rowRatio = 1;
					} else {
						rowRatio = rowRatio / 100;
					}

					if ( typeof rowRatioInner === 'undefined' || rowRatioInner === 'full' || rowRatioInner === '' || rowRatioInner == null ) {
						rowRatio = rowRatio;
					} else {
						rowRatio = rowRatio * rowRatioInner / 100;
					}

					winHeight = winHeight * rowRatio;

					if ( UNCODE.wwidth >= UNCODE.mediaQuery ) {
						multiplier_h = parseInt($(item).attr('data-vp-height'));
					} else if ( UNCODE.wwidth < UNCODE.mediaQuery && UNCODE.wwidth >= UNCODE.mediaQueryMobile ) {
						multiplier_h = parseInt($(item).attr('data-vp-height-md'));
					} else if ( UNCODE.wwidth < UNCODE.mediaQueryMobile ) {
						multiplier_h = parseInt($(item).attr('data-vp-height-sm'));
					}

					if ( typeof multiplier_h !== 'undefined' && multiplier_h !== null && multiplier_h > 0) {
						data_viewport_h = winHeight*(multiplier_h/100) - ( paddingRow + paddingCol + body_border + offSet );
						if ( remove_menu === true ) {
							data_viewport_h = data_viewport_h - UNCODE.menuHeight;
						}
						$('img:not(.avatar), picture, .t-background-cover, .fluid-object', val).css( 'height', data_viewport_h );
					} else {
						$('img:not(.avatar), picture, .t-background-cover, .fluid-object', val).css( 'height', 'auto' );
					}

				}
			});
		});
		$('.index-scroll', $_el).each(function(i, item){
			var $uncoltable = $(item).closest('.uncoltable'),
				$rowParent = $(item).closest('.row-parent'),
				paddingRow = parseInt($rowParent.css('padding-top')) + parseInt($rowParent.css('padding-bottom')),
				body_border = $('.body-borders .top-border').outerHeight() * 2,
				$index_row = $('.index-row', item),
				safe_heigth = $index_row.data('safe-height'),
				winHeight = safe_heigth ? UNCODE.wheight : $('#vh_layout_help').outerHeight();
			if ( UNCODE.wwidth < UNCODE.mediaQuery ) {
				var data_viewport_h = winHeight - ( paddingRow + body_border );
				$uncoltable.css({
					'min-height': data_viewport_h
				});
			} else {
				$uncoltable.css({
					'min-height': 'auto'
				});
			}
		});

	}
	setItemsRelHeight();

	var $index_scrolls = $('.index-scroll', $el);

	$index_scrolls.each(function(key, value){
		var $index = $(this),
			$parent_row = $index.closest('.vc_row[data-parent]'),
			$index_row = $('.index-row', $index),
			dir = $index_row.attr('data-direction');
		dir = typeof dir === 'undefined' ? 'right' : dir;

		$parent_row.addClass('unscroll-horizontal').attr('data-direction', dir);
	});

	var $horScrolls = $('.unscroll-horizontal', $el);

	if ( $horScrolls.length ) {

		$('body').addClass('scrolling-trigger');

		$horScrolls.each(function(key, value){
			var $section = $(this),
				$index_scroll = $('.index-scroll', $section),
				$index_row = $('.index-row', $index_scroll),
				dir = $section.attr('data-direction'),
				wrap = $index_row.attr('data-wrap'),
				$pinWrap,
				$pinTrigger;

			dir = typeof dir === 'undefined' ? 'right' : dir;
			$pinTrigger = $('<div class="pin-trigger" data-direction="' + dir + '" />');
			$pinWrap = $('<div class="pin-wrap" />');
			if ( SiteParameters.is_frontend_editor ) {
				var gutterClass = $('.index-wrapper', $index_scroll).attr('class').match(/\b([^\s]+)-gutter\b/g, '');
				$('.index-wrapper', $index_scroll).wrapInner($pinWrap.addClass(gutterClass[0]));
			} else {
				if ( wrap === 'column' ) {
					$index_scroll.wrapInner( $pinWrap );
				} else {
					$('> .row', $section).wrap( $pinWrap );
				}
				$section.wrapInner( $pinTrigger );
			}

		});

		var $pinWraps = $('.pin-wrap', $el);

		var horScrollSizes = function(){

			$pinWraps.each(function(key, val){
				var $pinWrap = $(this).attr('id','pin_wrap_' + key),
					$pinTrigger = $pinWrap.closest('.pin-trigger'),
					dir = $pinTrigger.length ? $pinTrigger.attr('data-direction') : $pinWrap.closest('[data-direction]').attr('data-direction'),
					$index_scroll = SiteParameters.is_frontend_editor ? $pinWrap.closest('.index-scroll') : $('.index-scroll', $pinTrigger),
					$boxContainer = $('.box-container'),
					box_m = $boxContainer.css('margin-left'),
					st_active = true;

				var setHorW,
				horWidth = function(){
					$index_scroll.each(function(){
						var $this = $(this),
							$index_row = $('.index-row', $this),
							$rowContainer = $index_row.closest('.vc_row'),
							$rowInner = $index_row.closest('.wpb_row'),
							$rowParent = $index_row.closest('.row-parent'),
							$tmbs = $('.tmb', $index_row),
							padding_tmb = parseFloat( $tmbs.first().css('padding-right') ),
							$uncont = $index_row.closest('.uncont'),
							$parent_col = $index_row.closest('.wpb_column'),
							col_w = $uncont.width(),
							data_lg = parseFloat( $index_row.attr('data-lg') ),
							data_md = $this.hasClass('row-scroll-no-md') ? 1 : parseFloat( $index_row.attr('data-md') ),
							data_sm = $this.hasClass('row-scroll-no-sm') ? 1 : parseFloat( $index_row.attr('data-sm') ),
							tmb_w;

						col_w = col_w > UNCODE.wwidth ? UNCODE.wwidth : col_w;
						tmb_w = ( col_w + padding_tmb ) / data_lg;

						if ( typeof data_sm !== 'undefined' && data_sm !== '' && UNCODE.wwidth < 570 ) {
							tmb_w = ( col_w + padding_tmb ) / data_sm;
						} else if ( typeof data_md !== 'undefined' && data_md !== '' && UNCODE.wwidth >= 570 && UNCODE.wwidth < 960 ) {
							tmb_w = ( col_w + padding_tmb ) / data_md;
						}

						if ( !isNaN(tmb_w) ) {
							$tmbs.css({
								'width': tmb_w
							});
						}

						$tmbs.css({
							'visibility': 'visible'
						});

					});
				};

				horWidth();
				clearRequestTimeout(setHorW);
				setHorW = requestTimeout( function(){
					setItemsRelHeight();
					horWidth();
				}, 100 );

				if ( SiteParameters.is_frontend_editor ) {
					return;
				}

				var $vmenu = $('body.vmenu .vmenu-container'),
					vmenuW = $vmenu.length && UNCODE.wwidth > UNCODE.mediaQuery ? $vmenu.width() : 0,
					winWidth = window.innerWidth - vmenuW,
					$tmb = $('.tmb', $index_scroll).eq(0),
					paddingRight = parseFloat( $tmb.css('padding-right') ),
					stickyScrollLength = ( $('.index-row', $index_scroll).width() - ( $index_scroll.width() + paddingRight ) ),
					remove_menu = $('.index-row', $index_scroll).data('vp-menu'),
					scroll_anim;

				if ( $('body').hasClass('rtl') ) {
					if ( dir === 'left' ) {
						scroll_anim = gsap.fromTo( $pinWrap, {
							x: stickyScrollLength
						},{
							x: 0,
							ease: "none"
						});
					} else {
						scroll_anim = gsap.fromTo( $pinWrap, {
							x: 0
						},{
							x: stickyScrollLength,
							ease: "none"
						});
					}
				} else {
					if ( dir === 'left' ) {
						scroll_anim = gsap.fromTo( $pinWrap, {
							x: -stickyScrollLength
						},{
							x: 0,
							ease: "none"
						});
					} else {
						scroll_anim = gsap.fromTo( $pinWrap, {
							x: 0
						},{
							x: -stickyScrollLength,
							ease: "none"
						});
					}
				}

				if ( typeof ScrollTrigger.getById("stickySectionScrolling" + key) !== 'undefined' ) {
					ScrollTrigger.getById("stickySectionScrolling" + key).kill(true);
				}

				var animationIncrease;

				var checkForAnimations = function(){
					animationIncrease = 0
					$('.animate_when_almost_visible:not(.start_animation)', $pinTrigger).each(function(){
						var _this = this,
							isScrolling;
						if ( ScrollTrigger.isInViewport($pinTrigger[0]) && ScrollTrigger.isInViewport(_this, 0.5, true) ) {
							var delayAttr = parseFloat( $(_this).attr('data-delay') );
							if (delayAttr == undefined || isNaN(delayAttr)) delayAttr = 0;
							requestTimeout(function() {
								$(_this).addClass('start_animation');
							}, delayAttr + animationIncrease);
							animationIncrease += 150;
						}
					});
				};
				checkForAnimations();

				// var start = $index_scroll.length ? parseFloat($index_scroll.position().top) : 0;
				var start = 0;

				var horST = ScrollTrigger.create({
					id: "stickySectionScrolling" + key,
					scrub: true,
					trigger: $pinTrigger[0],
					pin: true,
					anticipatePin: 1,
					start: function() { return "top top+=" + parseFloat( $('.top-border').height() + ( remove_menu === true ? UNCODE.menuHeight : 0 ) ); },
					end: function() { return "+="+stickyScrollLength; },
					animation: scroll_anim,
					ease: Sine.easeOut,
					onUpdate: checkForAnimations,
					invalidateOnRefresh: true,
					onEnter: function(){
						$pinTrigger.addClass('enter-st');
					},
					onEnterBack: function(){
						$pinTrigger.addClass('enter-st');
					},
					onLeave: function(){
						$pinTrigger.removeClass('enter-st');
					},
					onLeaveBack: function(){
						$pinTrigger.removeClass('enter-st');
					}
				});

				window.dispatchEvent(new CustomEvent('dynamic_srcset_load'));
				window.dispatchEvent(new CustomEvent('boxResized'));

				var testSecondTrigger = function(){
					animationIncrease = 0
					$('.animate_when_almost_visible:not(.start_animation)', $pinTrigger).each(function(){
						var _this = this;
						if ( checkVisible(_this) ) {
							var delayAttr = parseFloat( $(_this).attr('data-delay') );
							if (delayAttr == undefined || isNaN(delayAttr)) delayAttr = 0;
							requestTimeout(function() {
								$(_this).addClass('start_animation');
							}, delayAttr + animationIncrease);
							animationIncrease += 150;
						}
					});

				};

				var verST = ScrollTrigger.create({
					id: "verticalSectionScrolling" + key,
					trigger: $pinTrigger[0],
					start: "top center",
					end: function() { return "+="+UNCODE.wheight; },
					onUpdate: testSecondTrigger,
					invalidateOnRefresh: true
				});

				var setCTA,

				dis_enable_ST = function(){
					if ( $('.row-scroll-no-md', $pinTrigger).length && UNCODE.wwidth <= UNCODE.mediaQuery ) {
						horST.kill();
						verST.kill();
						$pinTrigger.addClass('disabled');
						st_active = false;
					} else if ( $('.row-scroll-no-sm', $pinTrigger).length && UNCODE.wwidth <= UNCODE.mediaQueryMobile ) {
						horST.kill();
						verST.kill();
						$pinTrigger.addClass('disabled');
						st_active = false;
					}
				};

				$(window).on('resize load', function() {
					clearRequestTimeout(setCTA);
					setCTA = requestTimeout(function() {
						dis_enable_ST();
						checkForAnimations();
					}, 500);
				});

			});
		};

		$(window).on( 'load', function(){
			horScrollSizes();
		});
		var setResize,
			doubleResize = true,
			oldW = UNCODE.wwidth;
		$(window).on( 'resize orientationchange', function(){
			if ( 'onorientationchange' in window && oldW === UNCODE.wwidth ) {
				return;
			} else {
				oldW = UNCODE.wwidth;
			}
			setItemsRelHeight(true);
			var $row_inners = document.querySelectorAll('.pin-spacer .row-inner');
			Array.prototype.forEach.call($row_inners, function(el) {
				el.style.height = '';
				el.style.marginBottom = '';
			});
			clearRequestTimeout(setResize);
			setResize = requestTimeout( function(){
				setItemsRelHeight();
				horScrollSizes();
				ScrollTrigger.refresh();
				if ( doubleResize === true ) {
					window.dispatchEvent(new Event('resize'));
					doubleResize = false;
				} else {
					doubleResize = true;
				}
				UNCODE.setRowHeight(document.querySelectorAll('.page-wrapper .row-parent'), false, true);
			}, 100 );
		});

		var show_pins = function(){
			$('.index-scroll').css({'opacity':'1'});
			setResize = requestTimeout( function(){
			}, 10 );
		};
		ScrollTrigger.addEventListener("refresh", show_pins);
		$(window).on( 'uncode.re-layout', function(){
			$('.index-scroll').css({'opacity':'0'});
			ScrollTrigger.refresh(true);
		});
	}

};

UNCODE.stickyTrigger = function( $el ) {
	if ( SiteParameters.is_frontend_editor ) {
		return false;
	}

	var stickyTrigger = function(){
		var stickyTrick = $('.sticky-trigger').each(function(){
			var $sticky = $(this),
				$inside = $('> div', $sticky),
				insideH = $inside.outerHeight(),
				$row = $sticky.closest('.vc_row'),
				$uncont = $sticky.closest('.uncont'),
				rowBottom,
				uncontBottom ,
				diffBottom;

			ScrollTrigger.create({
				trigger: $sticky,
				start: function(){ return "top center-=" + insideH/2; },
				endTrigger: $row,
				end:  function(){
					rowBottom = $row.offset().top + $row.outerHeight();
					uncontBottom = $uncont.offset().top + $uncont.outerHeight();
					diffBottom = rowBottom - uncontBottom;
					return "bottom center+=" + ( insideH/2 + diffBottom );
				},
				anticipatePin: true,
				pin: true,
				pinSpacing: false,
				scrub: true,
				invalidateOnRefresh: true,
			});

		});
	},
	setResizeSticky;

	$(window).on( 'load', function(){
		stickyTrigger();
	});
	$(window).on( 'resize', function(){
		clearRequestTimeout(setResizeSticky);
		setResizeSticky = requestTimeout( function(){
			stickyTrigger();
			ScrollTrigger.refresh();
		}, 1000 );
	});

};

UNCODE.revslider = function() {
	$(window).on("load", function() {
		$('rs-module').each(function(){
			var $slider = $(this);

			$slider.on('revolution.slide.onloaded', function(e, data){
				if ( $(e.currentTarget).closest(".header-revslider").length ) {
					var style = $(e.currentTarget).find("rs-slide").eq(0).attr("data-skin"),
						scrolltop = $(document).scrollTop();
					if ( style != undefined ) {
						UNCODE.switchColorsMenu(scrolltop, style);
					}
				}
			});

			$slider.on('revolution.slide.onchange', function(e, data){
				if ( $(e.currentTarget).closest(".header-revslider").length ) {
					var style = $(e.currentTarget).find("rs-slide").eq(data.slideIndex - 1).attr("data-skin"),
						scrolltop = $(document).scrollTop();
					if ( style != undefined ) {
						UNCODE.switchColorsMenu(scrolltop, style);
					}
				}
			});

		});
	});
};

UNCODE.layerslider = function() {
	$(window).on("load", function() {

		$('.ls-wp-container').on('slideTimelineDidStart', function( event, slider ) {

			var slideData = slider.slides.current.data,
				scrolltop = $(document).scrollTop();
			if( slideData && slideData.skin ) {

				UNCODE.switchColorsMenu(scrolltop, slideData.skin);

			}
		});

	});
};

UNCODE.ajax_filters = function() {

/*************************
 *
 * Filters Menu and Widgets Area
 *
 ************************/

 	var clear_clicked = false;

 	var init_ajax_grid = function(){

		var $grids = $('.ajax-grid-system:not(.init-ajax-grid)');
		$grids.each(function(index, val){
			var $body = $('body'),
				$grid = $(val).addClass('init-ajax-grid'),
				starting_point = $grid.attr('data-toggle'),
				$trigger = $('.uncode-toggle-ajax-filters', $grid),
				$sidebar_wrapper = $('.ajax-filter-sidebar-wrapper', $grid),
				$isotope_wrapper = $('.isotope-wrapper', $grid),
				$sidebar = $('.ajax-filter-sidebar', $sidebar_wrapper),
				$sorting_trgr = $('.uncode-woocommerce-sorting__link', $grid),
				$footprint = $('.ajax-filter-footprint', $grid),
				sidebar_w,
				data_w = parseFloat( $sidebar.attr('data-max-width') ),
				$firstCol = $grid.closest('.uncol.style-light, .uncol.style-dark'),
				skin = $firstCol.hasClass('style-light') ? 'style-light' : 'style-dark',
				$positioned_top = $('.ajax-filter-position-horizontal', $grid),
				overlay_desktop = $('.ajax-filter-position-left-overlay, .ajax-filter-position-right-overlay', $grid).length,
				$close_btn = $('.close-ajax-filter-sidebar', $sidebar_wrapper),
				$vc_row = $('.vc_row', $sidebar_wrapper).eq(0),
				sidew,
				$inside_row = $('> .row-parent', $vc_row),
				bg_row,
				$side_header = $('.ajax-filter-sidebar-header', $sidebar_wrapper),
				$side_footer = $('.ajax-filter-sidebar-footer', $sidebar_wrapper),
				$apply_filters = $('.ajax-filter-sidebar__button', $side_footer),
				sidebar_overlay = false,
				sidebar_hover = false,
				switchMobile = false,
				scrollTop;

			if ( $vc_row.attr('class') ) {
				bg_row = $vc_row.attr('class').match(/style-color-([^-]+)-bg/);
			}

			if ( bg_row != null ) {
				$side_header.add($side_footer).addClass(bg_row[0]);
			}

			$trigger.add($apply_filters).on('click', function(e){
				e.preventDefault();
				e.stopPropagation();
				$grid = $('.ajax-grid-system').eq(0);
				$positioned_top = $('.ajax-filter-position-horizontal', $grid);
				overlay_desktop = $('.ajax-filter-position-left-overlay, .ajax-filter-position-right-overlay', $grid).length,
				$sidebar_wrapper = $('.ajax-filter-sidebar-wrapper').eq(0);
				sidebar_w = $sidebar_wrapper.width();
				$sidebar = $('.ajax-filter-sidebar', $sidebar_wrapper);
				if ($(this).hasClass('ajax-filter-sidebar__button--clear')) {
					$(this).trigger('uncode-ajax-clear-filters');
				}
				if ( $positioned_top.length && UNCODE.wwidth >= UNCODE.mediaQuery ) {
					$grid.toggleClass('ajax-hide-filters-blanks');
					$sidebar.slideToggle({
						duration: 400,
						easing: 'easeOutQuad',
					});
				} else {
					$grid.removeClass('ajax-hide-filters-blanks');
					$grid.toggleClass('ajax-hide-filters');
					if ( $grid.hasClass('ajax-hide-filters') ) {
						$body.addClass('ajax-hide-filters');
					} else {
						scrollTop = $('html, body').scrollTop();
						$body.removeClass('ajax-hide-filters');
					}
				}
				if ( overlay_desktop || UNCODE.wwidth < UNCODE.mediaQuery ) {
					$('html, body').scrollTop(scrollTop);
				}
				return false;
			});

			$close_btn.on('click', function(e){
				e.preventDefault();
				$grid = $('.ajax-grid-system').eq(0);
				$grid.addClass('ajax-hide-filters');
				if ( $grid.hasClass('ajax-hide-filters') ) {
					$body.addClass('ajax-hide-filters');
				} else {
					scrollTop = $('html, body').scrollTop();
					$body.removeClass('ajax-hide-filters');
				}
				$('html, body').scrollTop(scrollTop);
			});

			$sidebar_wrapper.on('mouseover',function(){
				sidebar_hover = true;
			}).on('mouseout', function(){
				sidebar_hover = false;
			});

			$body.off('click').on('click', function( e, from ){
				if ( $(e.target).closest('.ajax-filter-sidebar').length ) {
					return;
				}
				if (undefined !== from && from === 'select_active_attributes') {
					return;
				}
				if ( ! $body.hasClass('ajax-hide-filters') && !sidebar_hover && $body.hasClass('ajax-filter-sidebar-overlay') ) {
					$grid.add($body).addClass('ajax-hide-filters');
				}
			});

			$sorting_trgr.on('click', function(e) {
				e.preventDefault();
			});

			var inside_width = function(){
				$sidebar_wrapper = $('.ajax-filter-sidebar-wrapper').eq(0);
				$sidebar = $('.ajax-filter-sidebar', $sidebar_wrapper);
				$vc_row = $('.vc_row', $sidebar_wrapper).eq(0);
				$inside_row = $('> .row-parent', $vc_row);
				if ( ( UNCODE.wwidth < UNCODE.mediaQuery ) || overlay_desktop ) {
					sidew = $sidebar.width();
					$inside_row.css({
						width: sidew
					});
				} else {
					$inside_row.css({
						width: ''
					});
				}
			};
			inside_width();

			var ajax_sidebar_position = function(e, f_editor){
				$grid = $('.ajax-grid-system').eq(0);
				$sidebar_wrapper = $('.ajax-filter-sidebar-wrapper').eq(0);
				$positioned_top = $('.ajax-filter-position-horizontal', $grid);
				$sidebar = $('.ajax-filter-sidebar', $sidebar_wrapper);
				$vc_row = $('.vc_row', $sidebar_wrapper).eq(0);
				$inside_row = $('> .row-parent', $vc_row);
				scrollTop = $('html, body').scrollTop();
				if ( f_editor !== true && ( ( UNCODE.wwidth < UNCODE.mediaQuery && switchMobile !== true) || overlay_desktop ) ) {
					$grid.add($body).addClass('ajax-hide-filters');
					$sidebar_wrapper.after('<span class="ajax-sidebar-placeholder" />');
					$body.append($sidebar_wrapper.addClass('main-container ajax-filter-sidebar--offcanvas'));
					sidebar_overlay = true;
					$body.addClass('ajax-filter-sidebar-overlay');
					$sidebar_wrapper.addClass(skin);
					var sideHeadH = $side_header.outerHeight(),
						sideFooterH = $side_footer.outerHeight();
					if ( data_w !== '' && data_w > 0 ) {
						if ( UNCODE.wwidth >= UNCODE.mediaQuery ) {
							$sidebar.css({
								'max-width': data_w
							});
						} else {
							$sidebar.css({
								'max-width':'none'
							});
						}
					}
					$vc_row.css({
						'padding-top':sideHeadH,
						'padding-bottom':sideFooterH
					});
					var sidew = $sidebar.width();
					$inside_row.css({
						width: sidew
					});
					switchMobile = true;
				} else {
					if ( ( typeof e !== 'undefined' && e.type === 'wwResize' && starting_point === 'hidden' ) || f_editor === true ) {
						scrollTop = $('html, body').scrollTop();
						$grid.add($body).removeClass('ajax-hide-filters');
					}
					if ( typeof e !== 'undefined' && e.type === 'wwResize' && $positioned_top.length && UNCODE.wwidth < UNCODE.mediaQuery ) {
						$grid.addClass('ajax-hide-filters-blanks');
						$sidebar.hide();
					}
					$('.ajax-sidebar-placeholder', $grid).after($sidebar_wrapper.removeClass('main-container ajax-filter-sidebar--offcanvas'));
					$('.ajax-sidebar-placeholder', $grid).remove();
					sidebar_overlay = false;
					$body.removeClass('ajax-filter-sidebar-overlay');
					$sidebar_wrapper.removeClass(skin);
					if ( data_w !== '' && data_w > 0 ) {
						$sidebar.css({
							'max-width':'none'
						});
					}
					$vc_row.css({
						'padding-top':0,
						'padding-bottom':0,
					});

					$inside_row.css({
						width: ''
					});

					if ( f_editor === true ) {
						UNCODE.ajax_filters();
					}

					switchMobile = false;
				}
				if ( overlay_desktop || UNCODE.wwidth < UNCODE.mediaQuery ) {
					$('html, body').scrollTop(scrollTop);
				}
			};

			var sidebar_width = function(){
				if ( ! $body.hasClass('ajax-filter-sidebar-overlay') && ! $positioned_top.length && UNCODE.wwidth >= UNCODE.mediaQuery ) {
					sidebar_w = $footprint.width();
					$sidebar.css({ width: sidebar_w });
				} else {
					$sidebar.css({ width: '' });
				}
			};
			sidebar_width();

			if ( SiteParameters.is_frontend_editor ) {
				ajax_sidebar_position();
			}

			$(window).off('load.ajax_filters wwResize.ajax_filters').on('load.ajax_filters wwResize.ajax_filters', function(e){
				if ( ! SiteParameters.is_frontend_editor || e.type === 'wwResize' ) {
					ajax_sidebar_position(e);
				}
				sidebar_width();
			});

			$(window).off('uncode.ajax_filters').one('uncode.ajax_filters', function(e){
				ajax_sidebar_position(e, true);
			});

			$isotope_wrapper.on('transitionend', function(e){
				if ( $(e.target).hasClass('isotope-wrapper') ) {
					window.dispatchEvent(new CustomEvent('boxResized'));
				}
				return false;
			});

			if ( UNCODE.wwidth < UNCODE.mediaQuery && $body.hasClass('ajax-hide-filters') ) {
				var $grid = $('.ajax-grid-system').eq(0);
				$grid.addClass('ajax-hide-filters');
			}

		});
	};

	init_ajax_grid();
	$(document).on('uncode-ajax-filtered', init_ajax_grid);

/*************************
 *
 * Hover hack
 *
 ************************/
 	var widget_hover_hack = function() {
 		$('.widget, .uncode_widget').each(function(){
			var $widget = $(this),
				class_w = $widget.attr('class'),
				$lis = $('ul > li', $widget).has('a'),
				$footer = $widget.closest('#colophon');

			if ( class_w.indexOf('widget_yith') > 0 ) {
				return true;
			}

			$lis.each(function(){
 				var $li = $(this),
 					$a = $('a', $li),
 					$label = $a.closest('label');

				if ( !$footer.length ) {
					$li.addClass('no-evts');
				}
		
				if ( ! $('span', $a).length ) {
 					$li.addClass( 'li-hover' );
 				}

 				$('li', $li).hover(function(e){
 					$(e.target).parents('li').each(function(){
 						$(this).addClass( 'parent-li-hover' );
 					});
 				}, function(e){
 					$(e.target).parents('li').each(function(key, val){
 						if ( key === 0) {
	 						$(val).removeClass( 'parent-li-hover' );
	 					}
 					});
 				});

	 			$li.off('mouseup').on('mouseup', function(e){
	 				e.stopPropagation();
	 				var $a = $('a', this).first();
	 				$a[0].click();
	 			});
 			});
 		});
 	}
	widget_hover_hack();
	$(document).on('uncode-ajax-filtered', widget_hover_hack);

/*************************
 *
 * Init Filters
 *
 ************************/

	function init_filters() {
		$(document).on('click', '.term-filter-link', function(e) {
			var _this = $(this);
			var widget = _this.closest('.uncode_widget');
			var container = get_filters_container();

			if (widget.hasClass('widget-ajax-filters--no-ajax')) {
				return true;
			}

			e.preventDefault();

			if (widget.hasClass('widget-ajax-filters--checkbox')) {
				_this.parent().find('input[type="checkbox"]').trigger('click');
			} else {
				if (_this.hasClass('term-filter-link--active')) {
					_this.removeClass('term-filter-link--active');
				} else {
					_this.addClass('term-filter-link--active');

					if (widget.hasClass('widget-ajax-filters--single')) {
						widget.find('.term-filter-link').not(_this).removeClass('term-filter-link--active');
					}
				}

				var url = _this.attr('href');

				reload_items(container, url, true);
			}
		});

		$(document).on('click', '.term-filter input[type="checkbox"]', function(e) {
			var _this = $(this);
			var widget = _this.closest('.uncode_widget');
			var link = _this.closest('.term-filter').find('.term-filter-link');
			var url = link.attr('href');
			var container = get_filters_container();

			if (widget.hasClass('widget-ajax-filters--no-ajax')) {
				window.location = url;
				return;
			}

			if (widget.hasClass('widget-ajax-filters--single')) {
				widget.find('input[type="checkbox"]').each(function() {
					if (_this.attr('id') !== $(this).attr('id')) {
						$(this).prop('checked', false);
						$(this).closest('.term-filter').find('.term-filter-link').removeClass('term-filter-link--active');
					}
				});
			}

			if (_this.prop('checked')) {
				link.addClass('term-filter-link--active');
			} else {
				link.removeClass('term-filter-link--active');
			}

			reload_items(container, url, true);
		});

		$(document).on('change', 'select.select--term-filters', function(e) {
			var _this = $(this);
			var selected = _this.find('option:selected');
			var option = $(selected);
			var url = option.attr('data-term-filter-url');
			var container = get_filters_container();
			var widget = _this.closest('.uncode_widget');

			if (widget.hasClass('widget-ajax-filters--no-ajax')) {
				window.location = url;
			} else {
				reload_items(container, url, true);
			}
		});

		$(document).on('click', '.filter-list__link', function(e) {
			if (SiteParameters.is_frontend_editor) {
				return false;
			}

			e.preventDefault();

			var _this = $(this);
			var container = get_filters_container();
			var url = _this.attr('href');
			reload_items(container, url, true);
		});

		$('.ajax-filter-sidebar__button--clear').on('uncode-ajax-clear-filters', function(e) {
			var _this = $(this);
			var container = get_filters_container();
			var url = _this.attr('href');
			reload_items(container, url, true);
		});

		$(document).on('click', '.uncode-woocommerce-sorting-dropdown__link', function(e) {

			var _this = $(this);
			var container = get_filters_container();
			var url = _this.attr('href');

			if ( container.length ) {
				e.preventDefault();
				reload_items(container, url, true);
			}
		});

		$(document).on('click', '.uncode_woocommerce_widget--price-filter .button', function(e) {
			var _this = $(this);
			var container = get_filters_container();

			if (container.length > 0) {
				e.preventDefault();

				var min_price = $('#min_price').val();
				var max_price = $('#max_price').val();
				var location = window.location;
				var url = location.href;
				var page_uri = location.origin + location.pathname;
				var is_filtered = page_uri !== url;

				if (is_filtered) {
					url = remove_parameter_from_url(url, 'min_price');
					url = remove_parameter_from_url(url, 'max_price');
				}

				var concat = page_uri === url ? '?' : '&';
				var params = {'min_price': min_price, 'max_price': max_price};

				url = url + concat + $.param(params);

				reload_items(container, url, true);
			}
		});

		var search_timer;

		$(document).on('keyup', '.term-filters-search-input', function(e) {
			var _this = $(this);
			var container = get_filters_container();
			var value = _this.val();

			if (search_timer) {
				clearTimeout(search_timer);
			}

			search_timer = setTimeout(function() {
				update_search_url(container, value);
			}, 500);
		});
	}

	function update_search_url(container, search_value) {
		var location = window.location;
		var url = location.href;
		var page_uri = location.origin + location.pathname;
		var is_filtered = page_uri !== url;
		var key_search = SiteParameters.ajax_filter_key_search;
		var key_unfilter = SiteParameters.ajax_filter_key_unfilter;

		if (is_filtered) {
			url = remove_parameter_from_url(url, key_search);
			url = remove_parameter_from_url(url, key_unfilter);
		}

		if (search_value) {
			var concat = page_uri === url ? '?' : '&';
			var params = {};

			params[key_search] = search_value;
			params[key_unfilter] = 1;
			url = url + concat + $.param(params);
		} else {
			url = remove_parameter_from_url(url, key_search);
		}

		reload_items(container, url, true);
	}

	function remove_parameter_from_url(url, parameter) {
		return url.replace(new RegExp('[?&]' + parameter + '=[^&#]*(#.*)?$'), '$1').replace(new RegExp('([?&])' + parameter + '=[^&]*&'), '$1');
	}

	function get_filters_container() {
		var container = $('.ajax-grid-system');

		if (container.length == 0) {
			container = $('.ajax-filters');
		}

		return container;
	}

	function update_widgets_state(widgets_states, container) {
		for (var i = widgets_states.length - 1; i >= 0; i--) {
			var state = widgets_states[i];

			if (!state.collapse) {
				continue;
			}

			var new_widget = container.find('.uncode_widget[data-id="' + state.id + '"');

			if (state.open) {
				new_widget.find('.widget-title').addClass('open');
				if (state.css) {
					new_widget.find('.widget-collapse-content').attr('style', state.css);
				}
			} else {
				new_widget.find('.widget-title').removeClass('open');
				if (state.css) {
					new_widget.find('.widget-collapse-content').attr('style', state.css);
				}
			}
		}
	}

	// Reload items via AJAX
	function reload_items(container, url, push) {
		container.addClass('grid-filtering');

		$.ajax({
			url     : url,
			success : function(response) {
				if (!response) {
					return;
				}

				$(document).trigger('uncode-ajax-pre-filtered');

				var container_id = container.attr('id');
				var pagination = $('.row-navigation');

				if (container_id) {
					var container_to_append = $(response).find('#' + container_id);
					var pagination_to_append = $(response).find('.row-navigation');
					var offcanvas_sidebar_wrapper = $('.ajax-filter-sidebar--offcanvas');

					// Remember open/closed widgets
					var widgets = $('.uncode_widget');
					var widgets_container = widgets.closest('.ajax-filter-sidebar--offcanvas').length > 0 ? $('.ajax-filter-sidebar--offcanvas') : container_to_append;
					var widgets_states = [];

					widgets.each(function() {
						var widget = $(this);
						var id = widget.attr('data-id');
						var state = {
							'id': id,
							'collapse': false,
							'open': false,
							'css': false,
						};

						var collapse_wrapper = widget.find('.widget-collapse-content');

						if (collapse_wrapper.length > 0) {
							state.collapse = true;

							var collapse_wrapper_css = collapse_wrapper.attr('style');
							var title = widget.find('.widget-title');

							state.css = collapse_wrapper_css;

							if (title.hasClass('open')) {
								state.open = true;
							} else {
								state.open = false;
							}
						}

						widgets_states.push(state);
					});

					// Update widgets state
					if (offcanvas_sidebar_wrapper.length === 0) {
						update_widgets_state(widgets_states, container_to_append);
					}

					// Update default sidebar state
					if (!container.hasClass('ajax-hide-filters')) {
						container_to_append.removeClass('ajax-hide-filters');
					}

					// Update horizontal sidebar
					if (!container.hasClass('ajax-hide-filters-blanks')) {
						container_to_append.removeClass('ajax-hide-filters-blanks');
					}
					var horizontal_sidebar_wrapper = $('.ajax-filter-position-horizontal');
					if (horizontal_sidebar_wrapper.length > 0) {
						var horizontal_sidebar_wrapper = horizontal_sidebar_wrapper.find('.ajax-filter-sidebar');
						var horizontal_sidebar_wrapper_style = horizontal_sidebar_wrapper.attr('style');
						var horizontal_sidebar_row = horizontal_sidebar_wrapper.find('.ajax-filter-sidebar-body .vc_row').eq(0);
						var horizontal_sidebar_row_style = horizontal_sidebar_row.attr('style');

						container_to_append.find('.ajax-filter-position-horizontal .ajax-filter-sidebar').attr('style', horizontal_sidebar_wrapper_style);
						container_to_append.find('.ajax-filter-position-horizontal .ajax-filter-sidebar-body .vc_row').eq(0).attr('style', horizontal_sidebar_row_style);
					}

					// Append container
					container.replaceWith(container_to_append);

					// Append pagination
					if (pagination.length > 0) {
						if (pagination_to_append.length > 0) {
							pagination.html(pagination_to_append.html());
						} else {
							pagination.html('');
						}
					} else {
						if (pagination_to_append.length > 0) {
							$('.post-wrapper').append(pagination_to_append);
						}
					}

					// Update off canvas sidebar (mobile and overlay)
					var offcanvas_sidebar_wrapper = $('.ajax-filter-sidebar--offcanvas');

					if (offcanvas_sidebar_wrapper.length > 0 || UNCODE.wwidth < UNCODE.mediaQuery) {
						var sidebar_container = offcanvas_sidebar_wrapper.find('.vc_row').eq(0);
						var sidebar_to_append = $(response).find('.ajax-filter-sidebar-body').find('.vc_row').eq(0);
						container_to_append.find('.ajax-filter-sidebar-wrapper').after('<span class="ajax-sidebar-placeholder" />');
						container_to_append.find('.ajax-filter-sidebar-wrapper').remove();

						// Update widgets state
						update_widgets_state(widgets_states, sidebar_to_append);

						// Update sidebar
						sidebar_container.html(sidebar_to_append.html());
					}

					if (push) {
						UNCODE.lastURL = url;
						window.history.pushState(
							{ pageTitle: document.title },
							'',
							url
						);
					}

					if (typeof UNCODE.isotopeLayout !== 'undefined') {
						UNCODE.isotopeLayout();
					}
					if (typeof UNCODE.justifiedGallery !== 'undefined') {
						UNCODE.justifiedGallery();
					}
					if (typeof UNCODE.cssGrid !== 'undefined') {
						UNCODE.cssGrid();
					}
					if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
						UNCODE.lightbox();
					}
					if (typeof UNCODE.lightgallery !== 'undefined' && SiteParameters.lbox_enhanced) {
						UNCODE.lightgallery();
					}
					if (typeof UNCODE.carousel !== 'undefined') {
						UNCODE.carousel($('body'));
					}
					UNCODE.animations();
					if (typeof UNCODE.filters !== 'undefined') {
						UNCODE.filters();
					}
					if (typeof UNCODE.widgets !== 'undefined') {
						UNCODE.widgets();
					}

					if (SiteParameters.dynamic_srcset_active === '1') {
						UNCODE.refresh_dynamic_srcset_size();
					}

					if (typeof UNCODE.menuSmartInit !== 'undefined') {
						UNCODE.menuSmartInit();
					}

					maybe_scroll_to_top();

					$(document).trigger('uncode-ajax-filtered');
					$(document.body).trigger('init_price_filter');
				}
			},
			error: function() {
				container.removeClass('grid-filtering');

				if (SiteParameters.enable_debug == true) {
					// This console log is disabled by default
					// So nothing is printed in a typical installation
					//
					// It can be enabled for debugging purposes setting
					// the 'uncode_enable_debug_on_js_scripts' filter to true
					console.log('There was an error retrieving the products');
				}
			}
		});
	}

	// Scroll to top after filtering
	function maybe_scroll_to_top() {
		var offcanvas_sidebar_wrapper = $('.ajax-filter-sidebar--offcanvas');

		if (offcanvas_sidebar_wrapper.length > 0) {
			return;
		}

		var container = get_filters_container();
		var bound = container[0].getBoundingClientRect();

		if (bound.y < 0) {
			$(window).scrollTop(container.offset().top);
		}
	}

	// Back/forward browser buttons
	$(window).on("popstate.ajaxfilters", function(e) {
		var location = window.location;
		var url = location.href;
		var params = UNCODE.getURLParams(window.location);
		var old_params = UNCODE.getURLParams(UNCODE.lastURL, true);

		UNCODE.lastURL = url;

		if (UNCODE.hasEqualURLParams(params, old_params) || ($.isEmptyObject(params) && $.isEmptyObject(old_params))) {
			return;
		}

		var container = get_filters_container();

		reload_items(container, url, false);
	});

	// Destroy load more before to init a new one
	$(window).on('uncode-ajax-pre-filtered', function() {
		if ($.fn.infinitescroll) {
			$('.cssgrid-infinite, .isotope-infinite').infinitescroll('destroy');
		}
	});

	init_filters();
};

	UNCODE.init = function() {
		var wfl_check = false, wfl_request, waypoint_request;
		UNCODE.preventDoubleTransition();
		UNCODE.betterResize();
		UNCODE.utils();
		if (typeof UNCODE.changeSkinOnScroll !== 'undefined') {
			UNCODE.changeSkinOnScroll();
		}
		if (typeof UNCODE.share !== 'undefined') {
			UNCODE.share();
		}
		if (typeof UNCODE.tooltip !== 'undefined') {
			UNCODE.tooltip();
		}
		if (typeof UNCODE.counters !== 'undefined') {
			UNCODE.counters();
		}
		if (typeof UNCODE.countdowns !== 'undefined') {
			UNCODE.countdowns();
		}
		if (typeof UNCODE.tabs !== 'undefined') {
			UNCODE.tabs();
		}
		if (typeof UNCODE.collapse !== 'undefined') {
			UNCODE.collapse();
		}
		if (typeof UNCODE.bigText !== 'undefined') {
			UNCODE.bigText();
		}
		UNCODE.menuSystem();
		if (typeof UNCODE.bgChanger !== 'undefined') {
			UNCODE.bgChanger();
		}
		if (typeof UNCODE.magicCursor !== 'undefined') {
			UNCODE.magicCursor();
		}
		if (typeof UNCODE.magneticCursor !== 'undefined') {
			UNCODE.magneticCursor();
		}
		if (typeof UNCODE.dropImage !== 'undefined') {
			UNCODE.dropImage();
		}
		if (typeof UNCODE.postTable !== 'undefined') {
			UNCODE.postTable();
		}
		if (typeof UNCODE.rotatingTxt !== 'undefined') {
			UNCODE.rotatingTxt();
		}
		if (typeof UNCODE.okvideo !== 'undefined') {
			UNCODE.okvideo();
		}
		if (typeof UNCODE.backgroundSelfVideos !== 'undefined') {
			UNCODE.backgroundSelfVideos();
		}
		UNCODE.tapHover();
		if (typeof UNCODE.isotopeLayout !== 'undefined') {
			UNCODE.isotopeLayout();
		}
		if (typeof UNCODE.justifiedGallery !== 'undefined') {
			UNCODE.justifiedGallery();
		}
		if (typeof UNCODE.cssGrid !== 'undefined') {
			UNCODE.cssGrid();
		}
		if (typeof UNCODE.lightbox !== 'undefined' && !SiteParameters.lbox_enhanced) {
			UNCODE.lightbox();
		}
		if (typeof UNCODE.lightgallery !== 'undefined' && SiteParameters.lbox_enhanced) {
			$(window).on('load',function(){
				UNCODE.lightgallery();
			});
		}
		if (typeof UNCODE.carousel !== 'undefined') {
			UNCODE.carousel($('body'));
		}
		if (typeof UNCODE.lettering !== 'undefined') {
			UNCODE.lettering();
		}
		UNCODE.animations();
		if (typeof UNCODE.stickyElements !== 'undefined' && !SiteParameters.is_frontend_editor) {
			UNCODE.stickyElements();
		}
		if (typeof UNCODE.twentytwenty !== 'undefined') {
			UNCODE.twentytwenty();
		}
		UNCODE.disableHoverScroll();
		UNCODE.printScreen();
		if (typeof UNCODE.particles !== 'undefined') {
			UNCODE.particles();
		}
		if (typeof UNCODE.filters !== 'undefined') {
			UNCODE.filters();
		}
		if (typeof UNCODE.ajax_filters !== 'undefined') {
			UNCODE.ajax_filters();
		}
		if (typeof UNCODE.widgets !== 'undefined') {
			UNCODE.widgets();
		}
		if (typeof UNCODE.unmodal !== 'undefined') {
			UNCODE.unmodal();
		}
		if (typeof UNCODE.checkScrollForTabs !== 'undefined') {
			if ( !UNCODE.isFullPage ) {
				UNCODE.checkScrollForTabs();
			}
		}
		if (typeof UNCODE.onePage !== 'undefined') {
			UNCODE.onePage(UNCODE.isMobile);
		}
		if (typeof UNCODE.fullPage !== 'undefined') {
			$(document).ready(function(){
				UNCODE.fullPage();
			});
		}
		if (typeof UNCODE.skewIt !== 'undefined') {
			UNCODE.skewIt();
		}
		if (typeof UNCODE.rotateIt !== 'undefined') {
			UNCODE.rotateIt();
		}
		if (typeof UNCODE.textMarquee !== 'undefined') {
			UNCODE.textMarquee();
		}
		if (typeof UNCODE.stickyScroll !== 'undefined') {
			UNCODE.stickyScroll();
		}
		if (typeof UNCODE.stickyTrigger !== 'undefined') {
			UNCODE.stickyTrigger();
		}
		if (typeof UNCODE.verticalText !== 'undefined') {
			UNCODE.verticalText();
		}
		if (typeof UNCODE.revslider !== 'undefined') {
			UNCODE.revslider();
		}
		if (typeof UNCODE.layerslider !== 'undefined') {
			UNCODE.layerslider();
		}
		$(window).on('load',function(){
			clearRequestTimeout(waypoint_request);
			waypoint_request = requestTimeout( function(){
				Waypoint.refreshAll();
			}, 1000);

			if (typeof UNCODE.parallax !== 'undefined') {
				UNCODE.parallax();
			}
		});
	}

	if ( ! SiteParameters.is_frontend_editor ) {
		UNCODE.init();
	}


})(jQuery);
