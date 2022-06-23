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

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

UNCODE.utils = function() {
	$('.btn-tooltip').tooltip();
	$(document).on('mouseover', 'a', function() {
		$(this).attr('data-title', $(this).attr('title'));
		$(this).removeAttr('title');
	});
	$(document).on('mouseout', 'a', function() {
		$(this).attr('title', $(this).attr('data-title'));
		$(this).removeAttr('data-title');
	});
	var $counters = $('.counter:not(.counter-init)');
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
	var $countdowns = $('[data-uncode-countdown]:not(.counter-init)');
	$countdowns.each(function() {
		var $this = $(this).addClass('counter-init'),
			finalDate = $(this).data('uncode-countdown');
		$this.countdown(finalDate, function(event) {
			$this.html(event.strftime('%D <small>' + SiteParameters.days + '</small> %H <small>' + SiteParameters.hours + '</small> %M <small>' + SiteParameters.minutes + '</small> %S <small>' + SiteParameters.seconds + '</small>'));
		});
	});

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

	this.get_scroll_offset = function(e) {

		var scroll_offset = 0,
			is_first_link = false,
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

		if ( UNCODE.wwidth < UNCODE.mediaQuery && $('body').hasClass('menu-mobile-transparent') ) {
			scroll_offset += $('#logo-container-mobile').outerHeight();
		} else if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length ) {
			scroll_offset += $('.menu-sticky .menu-container').outerHeight();
		} else {
			if ( ($('.menu-sticky').length && !$('.menu-hide').length) || ($('.menu-sticky-vertical').length && !$('.menu-hide-vertical').length) ) {
				scroll_offset += UNCODE.menuMobileHeight;
			} else {
				if ( typeof target !== 'undefined' && target.closest('.main-menu-container') != null && UNCODE.wwidth < UNCODE.mediaQuery && ! $('body').hasClass('menu-mobile-transparent') && ! $('.menu-sticky').length ) {
					scroll_offset += $('.main-menu-container > div:first-child()').height() - 2;
				} else {
					if ( $(trigger).length && typeof $(trigger).offset() !== 'undefined' && window.scrollY > ($(trigger).offset().top + UNCODE.menuMobileHeight) ) {
						scroll_offset += UNCODE.menuMobileHeight;
					}
				}
			}
		}

		scroll_offset += UNCODE.bodyBorder;

		return scroll_offset;
	}

	if ( !UNCODE.isFullPage ) {
		$(document).on('click', 'a[href*="#"]:not(.woocommerce-review-link)', function(e) {

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

				var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;

				if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
					scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
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
					var scrollSection = (typeof anchor === 'string') ? $('[data-name=' + anchor + ']') : anchor;
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
							}
						}

						var calc_scroll = scrollSection.offset().top,
							getOffset = UNCODE.get_scroll_offset(e),
							$logo = $('#logo-container-mobile'),
							logoH,
							$menu = $('#masthead .menu-container'),
							menuH;

						calc_scroll -= getOffset;

						var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
							delta = bodyTop - calc_scroll,
							scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
						if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

						if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length ) {
							logoH = $logo.outerHeight(),
							menuH = $menu.outerHeight();
							if ( calc_scroll < ( logoH + menuH ) ) {
								calc_scroll = 0;
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
								if (getOffset != UNCODE.get_scroll_offset(e)) {
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

			var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;

			if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
				scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
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
						if (getOffset != UNCODE.get_scroll_offset(event)) {
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
	// TAB DATA-API
	// ============
	$(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
		e.preventDefault()
		$(this).tab('show');
		requestTimeout(function() {
			window.dispatchEvent(UNCODE.boxEvent);
		}, 300);
	});
	// COLLAPSE DATA-API
	// =================
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
	});
	// FitText
	// =================
	window.uncode_textfill = function(el, loaded) {
		if (el == undefined) el = $('body');
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
	}
	window.uncode_textfill();

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

	// REVSLIDER API
	// ============
	$(window).on("load", function() {
		$('.rev_slider_wrapper, rs-module-wrap').each(function(){
			var $this = jQuery(this),
   		id_array = $this.attr("id").split("_"),
   		id = id_array[2];
   		if (id != undefined && id != '') {
				$.globalEval('revapi'+id+'.bind("revolution.slide.onloaded",function (e, data) { if (jQuery(e.currentTarget).closest(".header-revslider").length) { var style = jQuery(e.currentTarget).find("li, rs-slide").eq(0).attr("data-skin"), scrolltop = jQuery(document).scrollTop(); if (style != undefined) UNCODE.switchColorsMenu(scrolltop, style);}})');
				$.globalEval('revapi'+id+'.bind("revolution.slide.onchange",function (e,data) { if (jQuery(e.currentTarget).closest(".header-revslider").length) { var style = jQuery(e.currentTarget).find("li, rs-slide").eq(data.slideIndex - 1).attr("data-skin"), scrolltop = jQuery(document).scrollTop(); if (style != undefined) UNCODE.switchColorsMenu(scrolltop, style);}})');
   		}
		});
	});

	// LAYERSLIDE API
	// ============
	$(window).on("load", function() {

		$('.ls-wp-container').on('slideTimelineDidStart', function( event, slider ) {

			var slideData = slider.slides.current.data,
				scrolltop = $(document).scrollTop();
			if( slideData && slideData.skin ) {

				UNCODE.switchColorsMenu(scrolltop, slideData.skin);

			}
		});

	});
	// Admin bar
	// ============
	$(window).resize(function() {
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
	});
	// Facebook
	// ===========
 	this.fb_timeout = undefined;
	$(window).resize(function() {
		$('.facebook-object').each(function(index, el) {
			var el = $(el),
			parentWidth = el.closest('.tmb').width();
			el.width(parentWidth);
		});
		if (this.fb_timeout == undefined) {
			if ($('.facebook-object').length) {
				window.clearTimeout(this.fb_timeout);
				this.fb_timeout = window.setTimeout(function(msg) {
		  	window.dispatchEvent(UNCODE.boxEvent);
			}, 1000);
			}
		}
	});
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

UNCODE.menuSystem = function() {

	function menuMobile() {
		var $body = $('body'),
			$mobileToggleButton = $('.mobile-menu-button'),
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
			if (UNCODE.wwidth <= UNCODE.mediaQuery) {
				$box = $(this).closest('.box-container').find('.main-menu-container');
				$el = $(this).closest('.box-container').find('.menu-horizontal-inner:not(.row-brand), .menu-sidebar-inner');
				$el_transp = $('.menu-absolute.menu-transparent');
				if (UNCODE.isMobile) {
					if ( $('.menu-wrapper.menu-sticky, .menu-wrapper.menu-hide-only, .main-header .menu-sticky-vertical, .main-header .menu-hide-only-vertical').length ) {
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
						$body.addClass('open-overlay-menu');
						window.dispatchEvent(menuOpen);
						animating = true;
						UNCODE.menuOpened = true;
						if ($('body[class*="vmenu-"], body.hmenu-center').length && ($('.menu-hide, .menu-sticky, .menu-transparent').length)) {
							$('.main-header > .vmenu-container').css({position:'fixed', top: ($('.menu-container').outerHeight() + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
							if ($('body.menu-offcanvas').length) {
								$('.menu-container:not(.sticky-element):not(.isotope-filters)').css({position:'fixed'});
								$('.vmenu-container.menu-container:not(.sticky-element):not(.isotope-filters)').css({position:'fixed', top: (UNCODE.menuMobileHeight + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
							} else {
								if ( $('.menu-hide, .menu-sticky').length ) {
									$('.menu-container:not(.sticky-element):not(.isotope-filters)').css({position:'fixed'});
								}
							}
						}
						if ($('body.hmenu-center').length && ($('.menu-hide, .menu-sticky').length)) {
							$('.menu-container:not(.sticky-element):not(.isotope-filters)').css({position:'fixed', top: (UNCODE.menuMobileHeight + UNCODE.bodyBorder + UNCODE.adminBarHeight) + 'px'});
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
						$box.animate({
							height: 0
						}, {
							duration: 600,
							easing: "easeInOutCirc",
							complete: function(elements) {
								$(elements).css('height', '');
								animating = false;
								if ($('body[class*="vmenu-"]').length && UNCODE.wwidth >= 960) {
									$('.main-header > .vmenu-container').add('.menu-container:not(.sticky-element):not(.isotope-filters)').css('position','relative');
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
		$('.menu-primary .menu-button-offcanvas').click(function(event) {
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
	function menuSmart() {
		var $menusmart = $('[class*="menu-smart"]');
		if ($menusmart.length > 0) {
			$menusmart.smartmenus({
				subIndicators: false,
				subIndicatorsPos: 'append',
				subMenusMinWidth: '13em',
				subIndicatorsText: '',
				showTimeout: 50,
				hideTimeout: 50,
				showFunction: function($ul, complete) {
					$ul.fadeIn(0, 'linear', complete);
					$ul.addClass('open-animated');
				},
				hideFunction: function($ul, complete) {
					var fixIE = $('html.ie').length;
					if (fixIE) {
						var $rowParent = $($ul).closest('.main-menu-container');
						$rowParent.height('auto');
					}
					$ul.fadeOut(0, 'linear', complete);
					$ul.removeClass('open-animated');
				},
				collapsibleShowFunction: function($ul, complete) {
					$ul.slideDown(400, 'easeInOutCirc', function() {
				12});
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
	menuSmart();
	menuOverlay();
	menuAppend();
	var setMenuOverlay;
	$(window).on( 'resize', function(){
		if ( $('.overlay').length && $(window).width() > 1024 ) {
			$('.overlay').addClass('hidden');
		}
		clearRequestTimeout(setMenuOverlay);
		setMenuOverlay = requestTimeout( menuOverlay, 150 );
	});
};

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
						$(tag).load(callback);
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
			jIframe = $('<iframe data-src="'+source+'" frameborder="0" id="okplayer-' + base.options.id +'" style="visibility: hidden;" class="vimeo-background" />');
			$(window).data('okoptions-' + base.options.id).jobject = jIframe;
			$('#okplayer-' + base.options.id).replaceWith(jIframe[0]);
			base.insertJS('//f.vimeocdn.com/js/froogaloop2.min.js', function() {
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
					var getPlayer = player.c || player,
					getContainer = $(getPlayer).closest('.background-element');
					if (getContainer.length) {
						UNCODE.initVideoComponent(getContainer[0], '.uncode-video-container.video');
					}
				}
			});
		}
	});
	$(".background-video-shortcode").each(function(index, el) {
		if ( SiteParameters.block_mobile_videos === true ) {
			return false;
		}
		if ( $(this).closest('mediaelementwrapper').length ) {
			return true;
		}
		var $video_el = $(this),
			$parent_carousel = $video_el.parents('.uncode-slider').eq(0),
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
							UNCODE.initVideoComponent(document.body, '.uncode-video-container.video, .uncode-video-container.self-video');
						}, 100);
					}
					if ( ($('html.firefox').length) && !$parent_carousel.length  ) {
						mediaElement.play();
					}

					mediaElement.addEventListener('play', function() {
						$(mediaElement).closest('.uncode-video-container').css('opacity', '1');
						$(mediaElement).closest('#page-header').addClass('video-started');
						$(mediaElement).closest('.background-wrapper').find('.block-bg-blend-mode.not-ie').css('opacity', '1');
					}, true);

				},
				// fires when a problem is detected
				error: function() {}
			});

		}
	});

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
					var resizeiFrame = function(){
						frW = $iframe.width();
						$iframe.css({
							height: frW * ratio
						});
					};
					resizeiFrame();
					$(window).on('resize load', resizeiFrame);

				}

			}

		});

	};

	manageVideoSize();
};

UNCODE.disableHoverScroll = function() {

    if (!UNCODE.isMobile && !UNCODE.isFullPage) {
        var body = document.body,
        timer;

        window.addEventListener('scroll', function() {
            clearRequestTimeout(timer);
            if (body.classList)  {
                if (!body.classList.contains('disable-hover')) {
                    body.classList.add('disable-hover')
                }

                timer = requestTimeout(function() {
                    body.classList.remove('disable-hover')
                }, 300);
            }
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
		$('[class*="isotope-container"]').each(function() {
			var isoData = $(this).data(),
			$data_lg,
			$data_md,
			$data_sm;
			$(this).children('.tmb').addClass('tmb-iso');
			if (isoData.lg !== undefined) $data_lg = $(this).attr('data-lg');
			else $data_lg = '1000';
			if (isoData.md !== undefined) $data_md = $(this).attr('data-md');
			else $data_md = '600';
			if (isoData.sm !== undefined) $data_sm = $(this).attr('data-sm');
			else $data_sm = '480';
			screenLgArray.push($data_lg);
			screenMdArray.push($data_md);
			screenSmArray.push($data_sm);
			transitionDuration.push($('.t-inside.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
			if (isoData.type == 'metro') typeGridArray.push(true);
			else typeGridArray.push(false);
			if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
			else layoutGridArray.push('masonry');
			isotopeContainersArray.push($(this));
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
				return columnWidth;
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
					if ($(isotopeContainersArray[i]).hasClass('isotope-infinite')) {
						$(isotopeContainersArray[i]).infinitescroll({
								navSelector: '#' + isotopeId + ' .loadmore-button', // selector for the pagination container
								nextSelector: '#' + isotopeId + ' .loadmore-button a', // selector for the NEXT link (to page 2)
								itemSelector: '#' + isotopeId + ' .isotope-layout .tmb, #' + isotopeId + ' .isotope-filters li', // selector for all items you'll retrieve
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
								var getLightbox = UNCODE.lightboxArray['ilightbox_' + isotopeId];
								if (typeof getLightbox === 'object') getLightbox.refresh();
								if ( typeof twttr !== 'undefined' )
									twttr.widgets.load(isotopeContainersArray[i]);

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
			onLayout = function(isotopeObj, startIndex) {
				window.uncode_textfill();
				isotopeObj.css('opacity', 1);
				isotopeObj.closest('.isotope-system').find('.isotope-footer').css('opacity', 1);

				requestTimeout(function() {
					window.dispatchEvent(UNCODE.boxEvent);
					UNCODE.adaptive();
					$(isotopeObj).find('audio,video').each(function() {
						$(this).mediaelementplayer({
 							pauseOtherPlayers: false,
						});
					});
					if ($(isotopeObj).find('.nested-carousel').length) {
						UNCODE.carousel($(isotopeObj).find('.nested-carousel'));
						requestTimeout(function() {
							boxAnimation($('.tmb-iso', isotopeObj), startIndex, true, isotopeObj);
						}, 200);
					} else {
						boxAnimation($('.tmb-iso', isotopeObj), startIndex, true, isotopeObj);
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
					}
					index++;
				});
			};
		if ($('.isotope-pagination').length > 0) {
			$('.isotope-system').on('click', '.pagination a', function(evt) {
				evt.preventDefault();

                var filterContainer = $(this).closest('.isotope-system').find('.isotope-filters'),
					container = $(this).closest('.isotope-system'),
					calc_scroll = container.closest('.uncol').offset().top,
                    getFilterSpanPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span', filterContainer).css("padding-bottom") : 0,
                    getFilterPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span a', filterContainer).css("padding-bottom") : 0,
                    filterOffset = (getFilterSpanPadding != undefined && getFilterSpanPadding != 0) ? parseInt(getFilterSpanPadding.replace("px", "")) : 0;
                filterOffset += (getFilterPadding != undefined && getFilterPadding != 0) ? parseInt(getFilterPadding.replace("px", "")) : 0;

                calc_scroll -= filterOffset - 1;
                calc_scroll -= UNCODE.get_scroll_offset();

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

				loadIsotope($(this));
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
			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
                    var calc_scroll = container.closest('.uncol').offset().top,
                    getFilterSpanPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span', filterContainer).css("padding-bottom") : 0,
                    getFilterPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span a', filterContainer).css("padding-bottom") : 0,
                    filterOffset = (getFilterSpanPadding != undefined && getFilterSpanPadding != 0) ? parseInt(getFilterSpanPadding.replace("px", "")) : 0;
                    filterOffset += (getFilterPadding != undefined && getFilterPadding != 0) ? parseInt(getFilterPadding.replace("px", "")) : 0;

                    calc_scroll -= filterOffset - 1;
                    calc_scroll -= UNCODE.get_scroll_offset();

					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - calc_scroll,
						scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if ( !UNCODE.isFullPage ) {
						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
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
				}
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
								return filterable;
							}
						});
						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');
					}, delay);

					/** once filtered - start **/
					container.isotope('once', 'arrangeComplete', function() {
						var getLightbox = UNCODE.lightboxArray[container.data('lbox')];
						if (typeof getLightbox === 'object') getLightbox.refresh();
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
					container.parent().addClass('isotope-loading');
					loadIsotope($filter);
				}
			}
			evt.preventDefault();
		});
		$(window).on("popstate", function(e) {
			if (e.originalEvent.state === null) return;
			var params = {};
			if (location.search) {
				var parts = location.search.substring(1).split('&');
				for (var i = 0; i < parts.length; i++) {
					var nv = parts[i].split('=');
					if (!nv[0]) continue;
					params[nv[0]] = nv[1] || true;
				}
			}
			if (params.id === undefined) {
				$.each($('.isotope-system'), function(index, val) {
					loadIsotope($(val));
				});
			} else loadIsotope($('#' + params.id));
		});

		var loadIsotope = function($href) {
			var href = ($href.is("a") ? $href.attr('href') : location),
				isotopeSystem = ($href.is("a") ? $href.closest($('.isotope-system')) : $href),
				isotopeWrapper = isotopeSystem.find($('.isotope-wrapper')),
				isotopeFooter = isotopeSystem.find($('.isotope-footer-inner')),
				isotopeResultCount = isotopeSystem.find($('.woocommerce-result-count-wrapper')),
				isotopeContainer = isotopeSystem.find($('.isotope-layout')),
				isotopeId = isotopeSystem.attr('id');
			if ( $href.is("a") && ! isotopeSystem.hasClass('un-no-history') ) {
				history.pushState({
					myIsotope: true
				}, document.title, href);
			}
			$.ajax({
				url: href
			}).done(function(data) {
				var $resultItems = $(data).find('#' + isotopeId + ' .isotope-layout').html(),
					$resultPagination = $(data).find('#' + isotopeId + ' .pagination'),
					$resultCount = $(data).find('#' + isotopeId + ' .woocommerce-result-count');
				isotopeWrapper.addClass('isotope-reloaded');
				requestTimeout(function() {
					isotopeWrapper.removeClass('isotope-loading');
					isotopeWrapper.removeClass('isotope-reloaded');
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
						isotopeContainer.isotope('reloadItems', onLayout(isotopeContainer, 0));
						UNCODE.adaptive();
						var getLightbox = UNCODE.lightboxArray['ilightbox_' + isotopeContainer.closest('.isotope-system').attr('id')];
						if (typeof getLightbox === 'object') getLightbox.refresh();
					}
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
	UNCODE.lightboxArray = {};
	requestTimeout(function() {
		var groupsArr = {};
		$('[data-lbox^=ilightbox]:not(.lb-disabled):not([data-lbox-init])').each(function() {
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
				$els = $('[data-lbox="' + i + '"]:not(.lb-disabled)'),
				counter = $els.length,
				dataAlbum = $els.attr('data-album');
			if (social) social = {
				facebook: true,
				twitter: true,
				reddit: true,
				digg: true,
				delicious: true
			};
			UNCODE.lightboxArray[i] = $els.iLightBox({
				selector: '[data-lbox="' + i + '"]:not(.lb-disabled)',
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
						if ( $('body').hasClass('ilb-no-bounce') && typeof iNoBounce !== 'undefined' )
							iNoBounce.enable();
					},
					onHide: function(){
						if ( $('body').hasClass('ilb-no-bounce') && typeof iNoBounce !== 'undefined' )
							iNoBounce.disable()
					},
				}
			});

			$(document).on('infinite-loaded', function(){
				UNCODE.lightboxArray[i].refresh();
			});
		};
	}, 100);

	$(document).on('click', '.lb-disabled', function(e){
		e.preventDefault();
	});
};

/*UNCODE.backVideo = function() {
	$(function() {
		$.each($('.background-video-shortcode'), function() {
			var video_id = $(this).attr('id');
			if (typeof MediaElement === "function") {
				new MediaElement(video_id, {
					startVolume: 0,
					loop: true,
					success: function(mediaElement, domObject) {
						mediaElement.play();
						$(mediaElement).closest('.uncode-video-container').css('opacity','1');
						domObject.volume = 0;
					},
					// fires when a problem is detected
					error: function() {}
				});
			}
		});
	});
};*/
UNCODE.carousel = function(container) {
	var $owlContainer = $('.owl-carousel-container', container),
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
			var init = typeof init === 'undefined' ? false : init;
			if (tempTimeStamp != event.timeStamp && ( init || ( !UNCODE.isFullPage || ( UNCODE.isFullPage && $(event.currentTarget).closest('.fp-section').hasClass('uncode-scroll-active') ) ) ) ) {
				var scrolltop = $(document).scrollTop(),
					size = event.page.size,
					i;
				var setIndex = requestTimeout(function() {
					for ( i = 0; i < size; i++ ) {
						var itemCont = event.item.index != null ? (event.item.index + i) : i;
						var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[itemCont];
						if ($(event.currentTarget).closest('.row-slider').length) {
							if (currentItem == undefined) {
								currentItem = $(event.currentTarget).children()[i];
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
						$elSelector.find('.owl-item[data-index="' + itendIndex + '"] .counter').each(function(){
							var $counter = $(this);
							$counter.addClass('started').counterUp({
								delay: 10,
								time: 1500
							});
						});
					}
					$elSelector.find('.owl-item.new-indexed').removeClass('new-indexed');
				}, 200);
			}
			tempTimeStamp = event.timeStamp;
		}

		/** Initialized */
		$elSelector.on('initialized.owl.carousel', function(event) {

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
					setItemsRelHeight(event.currentTarget);
				if (thiis.hasClass('owl-height-equal'))
					setItemsHeight(event.currentTarget);
				if (!UNCODE.isMobile && !$elSelector.closest('.header-wrapper').length) navHover($elSelector.parent());
				if (thiis.closest('.unequal, .unexpand').length) {
					UNCODE.setRowHeight(rowParent[0], true);
				}
			}, 350);
			// save the new time
			thiis.data("timer-id", new_time);

			var scrolltop = $(document).scrollTop();
			$(event.currentTarget).closest('.uncode-slider').find('video').removeAttr('poster');

			//if (!UNCODE.isMobile) {
				/** fix autoplay when visible **/
			$(window).on('load', function(){
				if ($(event.currentTarget).data('autoplay')) {
					$(event.currentTarget).trigger('stop.autoplay.owl');
				}
				if (UNCODE.isUnmodalOpen && !$(event.currentTarget).closest('#unmodal-content')) {
					return;
				}
				var carouselInView = new Waypoint.Inview({
					context: UNCODE.isUnmodalOpen ? document.getElementById('unmodal-content') : window,
					element: $(event.currentTarget)[0],
					exited: function() {
						var el = $(this.element);
						if (el.data('autoplay')) {
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
			});
			//}

			// $(window).on('frontend:carousel_updated', function(){
			// 	Waypoint.refreshAll();
			// });

			if (!$(event.currentTarget).closest('.isotope-system').length) {
				requestTimeout(function() {
					animate_thumb($('.t-inside', el), event);
				}, 400);
			}

			var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
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

			$.each($('.owl-item.cloned', event.currentTarget), function(index, val) {
				$('.t-entry-visual-cont > a', $(val)).attr('data-lbox-clone', true);
			});

			$.each($('.owl-item:not(.active)', event.currentTarget), function(index, val) {
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

			if ($(event.currentTarget).closest('.uncode-slider').length) {
				var el = $(event.currentTarget).closest('.row-parent')[0];
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
						$(event.currentTarget).closest('.uncode-slider').find('.owl-prev, .owl-next').css('paddingTop', transHeight / 2 + 'px');
					}, 100);
				}
			} else {
				var el = $(event.currentTarget);
				el.closest('.uncode-slider').addClass('slider-loaded');
			}

			requestTimeout(function() {
				window.uncode_textfill(thiis);
				if ($(event.currentTarget).closest('.uncode-slider').length) {
					if ($(event.currentTarget).data('autoplay')) pauseOnHover(event.currentTarget);
				}
			}, 500);

			if ($(event.currentTarget).closest('.unequal').length) {
				$owlInsideEqual.push($(event.currentTarget).closest('.row-parent'));
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

			$.each($('.column_child.pos-bottom', event.currentTarget), function(index, val) {
				$(val).closest('.row-inner').css({
					'margin-top': '-1px'
				});
			});

			setIndexActive(event, true);
		});

		$elSelector.on('resized.owl.carousel', function(event) {
			if ($(this).closest('.nested-carousel').length) {
				requestTimeout(function() {
					window.dispatchEvent(UNCODE.boxEvent);
				}, 200);
			}
			if ( $(event.currentTarget).hasClass('owl-height-equal') )
				setItemsHeight(event.currentTarget);

			setItemsRelHeight($elSelector);

			setIndexActive(event);
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

		$elSelector.on('translate.owl.carousel', function(event) {
			if (UNCODE.isMobile) {
				$(event.currentTarget).addClass('owl-translating');
			}
		});

		/** Translated */
		$elSelector.on('translated.owl.carousel', function(event) {

			var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
				currentIndex = $(currentItem).attr('data-index'),
				stagePadding = $(event.currentTarget).data('stagepadding');

			stagePadding = (stagePadding == undefined || stagePadding == 0) ? false : true;

			if (!UNCODE.isMobile) {
				UNCODE.owlPlayVideo(event.currentTarget);
			}

			requestTimeout(function(){
				var lastDelayElems = animate_elems($('.owl-item.index-active', event.currentTarget));
				var lastDelayThumb = animate_thumb($('.owl-item' + (stagePadding ? '' : '.active') + ' .t-inside', event.currentTarget), event);
				if ($(event.currentTarget).closest('.uncode-slider').length && $(event.currentTarget).data('autoplay')) {
					if (lastDelayElems == undefined) lastDelayElems = 0;
					if (lastDelayThumb == undefined) lastDelayThumb = 0;
					var maxDelay = Math.max(lastDelayElems, lastDelayThumb);
					$(event.currentTarget).trigger('stop.owl.autoplay');
					requestTimeout(function() {
						if (!$(event.currentTarget).hasClass('owl-mouseenter') && $(event.currentTarget).data('stopped') != 'true') $(event.currentTarget).trigger('play.owl.autoplay');
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

			$.each($('.owl-item:not(.active)', event.currentTarget), function(index, val) {
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
				$(event.currentTarget).removeClass('owl-translating');
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
			autoHeight: ( $(this).hasClass('owl-height-equal') ? false : ( $(this).hasClass('owl-height-auto') ? true : values['autoheight'] ) ),
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
		window.uncode_textfill(el.find('.owl-item.active'));
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
			tempIndex = ($(event.currentTarget).data('tempIndex') == undefined) ? $('.owl-item.active', event.currentTarget).first().index() : $(event.currentTarget).data('tempIndex'),
			numActives = $('.owl-item.active', event.currentTarget).length,
			stagePadding = $(event.currentTarget).data('stagepadding');

		stagePadding = (stagePadding == undefined || stagePadding == 0) ? false : true;

		$(event.currentTarget).data('tempIndex', event.item.index);
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
									$(event.currentTarget).data('tempIndex', itemIndex);
								}
								if (isNaN(delayAttr)) delayAttr = 100;
								if (stagePadding) {
									var objTimeout = requestTimeout(function() {
										element.addClass('start_animation');
									}, index * delayAttr);
									lastDelay = index * delayAttr;
								} else {
									$('.owl-item.cloned[data-index="'+(element.closest('.owl-item').data('index'))+'"] .t-inside', event.currentTarget).addClass('start_animation');
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
			$(slider).removeClass('owl-mouseenter')
		  $(slider).trigger('play.owl.autoplay');
		}
		});
	}
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
			player = $f(iframe[0]);
			player.api('play');
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
			player = $f(iframe[0]);
			player.api('pause');
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
		highlightComplexFunc = function($wrap){

		var $lines = $('.heading-line-wrap', $wrap),
			not_animate = false;

		if ( $wrap.data('animate') === true ) {
			not_animate = true;
		}
		$lines.each(function(_key, _value){
			var $line = $(_value),
				$inners = $('.split-word-inner', $line),
				$highlights = $('.heading-text-highlight-inner', $line);

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
					$inners.last().one('webkitAnimationEnd oanimationend mozAnimationEnd msAnimationEnd animationEnd', function(e) {
						var delay = 0;
						$highlights.each(function(h_key, high){
							var $highlight = $(high),
								$split = $highlight.closest('.split-word'),
								$nextSplit = $split.next(),
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
					});
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

	window.waypoint_animation = function() {
		$.each($('.animate_when_almost_visible:not(.start_animation):not(.t-inside), .tmb-media .animate_when_almost_visible:not(.start_animation)'), function(index, val) {
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
			if ( $carousel.length && ( ! ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) && $carousel.attr('data-front-edited') !== 'true' ) ) {
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
		$.each($('.animate_inner_when_almost_visible'), function(index, val) {
			if (UNCODE.isUnmodalOpen && !val.closest('#unmodal-content')) {
				return;
			}
			var run = true,
				$carousel = $(val).closest('.owl-carousel'),
				$first_item = $(val).closest('.owl-item[data-index="1"]'),
				$all_first = $('.owl-item[data-index="1"]', $carousel);
			if ( $carousel.length && ( ! ( $first_item.length && $first_item.attr('data-already-reached') !== 'true' ) && $first_item.attr('data-front-edited') !== 'true' ) ) {
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
								highlightComplexFunc($wrapText);
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

	var runWaypoints = function(){
		clearRequestTimeout(runWaypoints_TO);
		runWaypoints_TO = requestTimeout(function() {
			window.waypoint_animation();
		}, 400);
	};
	runWaypoints();
	$( document.body ).on( 'uncode_waypoints', runWaypoints );
	if ( $('body').hasClass('compose-mode') && typeof window.parent.vc !== 'undefined' ) {
		window.parent.vc.events.on( 'shortcodeView:updated', runWaypoints );
	}

	// var tmbImgAnimMove = function(){

	// 	var $wraps = $('.tmb.tmb-image-anim-move .t-inside').has('.t-background-cover, img:not(.avatar)');
	// 	$wraps.each(function(){
	// 		var $wrap = $(this),
	// 			$pushed = $('.t-entry-visual', $wrap),
	// 			$img = $('.t-background-cover, .t-entry-visual img:not(.avatar)', $wrap),
	// 			$tmb = $wrap.closest('.tmb'),
	// 			parentOffset,
	// 			wrapW,
	// 			wrapH;
	// 		$pushed.on('mousemove', function(e){
	// 			parentOffset = $pushed.offset();
	// 			wrapW = $pushed.width();
	// 			wrapH = $pushed.height();

	// 	        var pageX = ( ( e.pageX - parentOffset.left ) / wrapW ) * 100 + '% ';
	// 	        var pageY = ( ( e.pageY - parentOffset.top ) / wrapH ) * 100 + '%';

	// 	        $img.css({
	// 	        	'transform-origin': pageX + pageY
	// 	        });
	// 	    });
	// 	    $wrap.on('mouseover', function(e){
	// 			$img.css({
	// 				'transform': 'scale(1.05)',
	// 			});
	// 	    }).on('mouseleave', function(e){
	// 	        $img.css({
	// 	        	'transform': 'scale(1)',
	// 	        });
	// 	    });
	// 	});

	// };

	// tmbImgAnimMove();
	// $( document.body ).on( 'isotope-shortcodeView-updated', tmbImgAnimMove );
};

UNCODE.tapHover = function() {

	var $el = $('html.touch .tmb:not(.tmb-no-double-tap) .t-entry-visual-cont > a'), //.length //html.touch a.btn
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
		$.each($('div[data-parent=true]'), function(index, val) {
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
				var $this = $(val);
				$this.on('click', function(evt) {
					if ( $('body').hasClass('uncode-scroll-no-history') )
						evt.preventDefault();
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
			goToSection = Number($('[data-name=' + goToSection + ']').attr('data-section'));
		}

		if (typeof goToSection === 'number' && !isNaN(goToSection)) {
			current = lastScrolled = goToSection;
			$(window).on('load', function(){
				scrollBody(goToSection);
			});
		}

	}

	function changeMenuActive(section, index) {
		current = lastScrolled = parseInt($(section).attr('data-section'));
		if (isOnePage) {
			var newSection = $('.onepage-pagination li a[data-index=' + index + ']');
			if (newSection.length) {
				$('ul.onepage-pagination li a').removeClass('is-selected');
				newSection.addClass('is-selected');
			}
			var getName = $('[data-section=' + index + ']').attr('data-name');
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
				$('.onepage-pagination li a[data-index=0]').addClass('is-selected');
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
		$('.onepage-pagination li a[data-index=' + index + ']').addClass('is-selected');

		var getSection = $('[data-section=' + index + ']'),
			scrollTo;

		if (getSection == undefined) return;

		var body = $("html, body"),
		bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
		delta = bodyTop - ($('[data-section=' + index + ']').length ? $('[data-section=' + index + ']').offset().top : 0),
		getOffset = UNCODE.get_scroll_offset(index);
		if ( typeof getSection.offset() === 'undefined' )
			return;
		scrollTo = getSection.offset().top;



		var shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 36;
		if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && $('.menu-shrink').length ) {
			scrollTo += UNCODE.menuHeight - ( $('.navbar-brand').data('minheight') + shrink );
		}

		if ( $('.menu-sticky .menu-container:not(.menu-hide)').length && ! $('.menu-shrink').length ) {
			if ( index === 0 ) {
				scrollTo = 0;
			} else {
				scrollTo -= $('.menu-sticky .menu-container').outerHeight();
			}
		} else {
			scrollTo -= getOffset;
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
			body.animate({
				scrollTop: (delta > 0) ? scrollTo - 0.1 : scrollTo
			}, scrollSpeed, 'easeInOutQuad', function() {
				requestTimeout(function(){
					UNCODE.scrolling = false;
					if (getOffset != UNCODE.get_scroll_offset(index)) {
						scrollBody(index);
					}
				}, 100);
			});
		}

	};

	init_onepage();
};

UNCODE.stickyElements = function() {
	var isMobile_wide = UNCODE.isMobile && UNCODE.wwidth < 1024;
	if (!isMobile_wide) {

		var calculateOffset = function(el) {
			var getRowPadding = (!$(el).hasClass('with-bg')) ? $(el).closest('.row-parent').css("padding-top") : 0,
				sideOffset = (getRowPadding != undefined && getRowPadding != 0) ? parseInt(getRowPadding.replace("px", "")) : 0,
				shrink = typeof $('.navbar-brand').data('padding-shrink') !== 'undefined' ?  $('.navbar-brand').data('padding-shrink')*2 : 0;

			sideOffset += UNCODE.bodyBorder;

			if (UNCODE.adminBarHeight > 0) sideOffset += UNCODE.adminBarHeight;
			if ($('.menu-sticky .menu-container:not(.menu-hide)').length) {
				if ($('.menu-shrink').length) {
					sideOffset += parseFloat( $('.navbar-brand').data('minheight') ) + shrink;
				} else sideOffset += ($('body.hmenu-center').length ? $('#masthead .menu-container').outerHeight() : parseInt(UNCODE.menuMobileHeight));
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

  // jquery.event.move
  //
  // 1.3.6
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
  // pageY:   Page coordinates of pointer.
  // startX:
  // startY:  Page coordinates of pointer at movestart.
  // distX:
  // distY:  Distance the pointer has moved since movestart.
  // deltaX:
  // deltaY:  Distance the finger has moved since last event.
  // velocityX:
  // velocityY:  Average velocity over last few events.


  (function (module) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], module);
    } else {
      // Browser globals
      module(jQuery);
    }
  })(function(jQuery, undefined){

    var // Number of pixels a pressed pointer travels before movestart
        // event is fired.
        threshold = 6,

        add = jQuery.event.add,

        remove = jQuery.event.remove,

        // Just sugar, so we can have arguments in the same order as
        // add and remove.
        trigger = function(node, type, data) {
          jQuery.event.trigger(type, data, node);
        },

        // Shim for requestAnimationFrame, falling back to timer. See:
        // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestFrame = (function(){
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
        })(),

        ignoreTags = {
          textarea: true,
          input: true,
          select: true,
          button: true
        },

        mouseevents = {
          move: 'mousemove',
          cancel: 'mouseup dragstart',
          end: 'mouseup'
        },

        touchevents = {
          move: 'touchmove',
          cancel: 'touchend',
          end: 'touchend'
        };


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

    function returnTrue() {
      return true;
    }

    function returnFalse() {
      return false;
    }

    function preventDefault(e) {
      e.preventDefault();
    }

    function preventIgnoreTags(e) {
      // Don't prevent interaction with form elements.
      if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

      e.preventDefault();
    }

    function isLeftButton(e) {
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

    function changedTouch(e, event) {
      var touch = identifiedTouch(e.changedTouches, event.identifier);

      // This isn't the touch you're looking for.
      if (!touch) { return; }

      // Chrome Android (at least) includes touches that have not
      // changed in e.changedTouches. That's a bit annoying. Check
      // that this touch has changed.
      if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

      return touch;
    }


    // Handlers that decide when the first movestart is triggered

    function mousedown(e){
      var data;

      if (!isLeftButton(e)) { return; }

      data = {
        target: e.target,
        startX: e.pageX,
        startY: e.pageY,
        timeStamp: e.timeStamp
      };

      add(document, mouseevents.move, mousemove, data);
      add(document, mouseevents.cancel, mouseend, data);
    }

    function mousemove(e){
      var data = e.data;

      checkThreshold(e, data, e, removeMouse);
    }

    function mouseend(e) {
      removeMouse();
    }

    function removeMouse() {
      remove(document, mouseevents.move, mousemove);
      remove(document, mouseevents.cancel, mouseend);
    }

    function touchstart(e) {
      var touch, template;

      // Don't get in the way of interaction with form elements.
      if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

      touch = e.changedTouches[0];

      // iOS live updates the touch objects whereas Android gives us copies.
      // That means we can't trust the touchstart object to stay the same,
      // so we must copy the data. This object acts as a template for
      // movestart, move and moveend event objects.
      template = {
        target: touch.target,
        startX: touch.pageX,
        startY: touch.pageY,
        timeStamp: e.timeStamp,
        identifier: touch.identifier
      };

      // Use the touch identifier as a namespace, so that we can later
      // remove handlers pertaining only to this touch.
      add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
      add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
    }

    function touchmove(e){
      var data = e.data,
          touch = changedTouch(e, data);

      if (!touch) { return; }

      checkThreshold(e, data, touch, removeTouch);
    }

    function touchend(e) {
      var template = e.data,
          touch = identifiedTouch(e.changedTouches, template.identifier);

      if (!touch) { return; }

      removeTouch(template.identifier);
    }

    function removeTouch(identifier) {
      remove(document, '.' + identifier, touchmove);
      remove(document, '.' + identifier, touchend);
    }


    // Logic for deciding when to trigger a movestart.

    function checkThreshold(e, template, touch, fn) {
      var distX = touch.pageX - template.startX,
          distY = touch.pageY - template.startY;

      // Do nothing if the threshold has not been crossed.
      if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

      triggerStart(e, template, touch, distX, distY, fn);
    }

    function handled() {
      // this._handled should return false once, and after return true.
      this._handled = returnTrue;
      return false;
    }

    function flagAsHandled(e) {
      e._handled();
    }

    function triggerStart(e, template, touch, distX, distY, fn) {
      var node = template.target,
          touches, time;

      touches = e.targetTouches;
      time = e.timeStamp - template.timeStamp;

      // Create a movestart object with some special properties that
      // are passed only to the movestart handlers.
      template.type = 'movestart';
      template.distX = distX;
      template.distY = distY;
      template.deltaX = distX;
      template.deltaY = distY;
      template.pageX = touch.pageX;
      template.pageY = touch.pageY;
      template.velocityX = distX / time;
      template.velocityY = distY / time;
      template.targetTouches = touches;
      template.finger = touches ?
        touches.length :
        1 ;

      // The _handled method is fired to tell the default movestart
      // handler that one of the move events is bound.
      template._handled = handled;

      // Pass the touchmove event so it can be prevented if or when
      // movestart is handled.
      template._preventTouchmoveDefault = function() {
        e.preventDefault();
      };

      // Trigger the movestart event.
      trigger(template.target, template);

      // Unbind handlers that tracked the touch or mouse up till now.
      fn(template.identifier);
    }


    // Handlers that control what happens following a movestart

    function activeMousemove(e) {
      var timer = e.data.timer;

      e.data.touch = e;
      e.data.timeStamp = e.timeStamp;
      timer.kick();
    }

    function activeMouseend(e) {
      var event = e.data.event,
          timer = e.data.timer;

      removeActiveMouse();

      endEvent(event, timer, function() {
        // Unbind the click suppressor, waiting until after mouseup
        // has been handled.
        setTimeout(function(){
          remove(event.target, 'click', returnFalse);
        }, 0);
      });
    }

    function removeActiveMouse(event) {
      remove(document, mouseevents.move, activeMousemove);
      remove(document, mouseevents.end, activeMouseend);
    }

    function activeTouchmove(e) {
      var event = e.data.event,
          timer = e.data.timer,
          touch = changedTouch(e, event);

      if (!touch) { return; }

      // Stop the interface from gesturing
      e.preventDefault();

      event.targetTouches = e.targetTouches;
      e.data.touch = touch;
      e.data.timeStamp = e.timeStamp;
      timer.kick();
    }

    function activeTouchend(e) {
      var event = e.data.event,
          timer = e.data.timer,
          touch = identifiedTouch(e.changedTouches, event.identifier);

      // This isn't the touch you're looking for.
      if (!touch) { return; }

      removeActiveTouch(event);
      endEvent(event, timer);
    }

    function removeActiveTouch(event) {
      remove(document, '.' + event.identifier, activeTouchmove);
      remove(document, '.' + event.identifier, activeTouchend);
    }


    // Logic for triggering move and moveend events

    function updateEvent(event, touch, timeStamp, timer) {
      var time = timeStamp - event.timeStamp;

      event.type = 'move';
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

    function endEvent(event, timer, fn) {
      timer.end(function(){
        event.type = 'moveend';

        trigger(event.target, event);

        return fn && fn();
      });
    }


    // jQuery special event definition

    function setup(data, namespaces, eventHandle) {
      // Stop the node from being dragged
      //add(this, 'dragstart.move drag.move', preventDefault);

      // Prevent text selection and touch interface scrolling
      //add(this, 'mousedown.move', preventIgnoreTags);

      // Tell movestart default handler that we've handled this
      add(this, 'movestart.move', flagAsHandled);

      // Don't bind to the DOM. For speed.
      return true;
    }

    function teardown(namespaces) {
      remove(this, 'dragstart drag', preventDefault);
      remove(this, 'mousedown touchstart', preventIgnoreTags);
      remove(this, 'movestart', flagAsHandled);

      // Don't bind to the DOM. For speed.
      return true;
    }

    function addMethod(handleObj) {
      // We're not interested in preventing defaults for handlers that
      // come from internal move or moveend bindings
      if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
        return;
      }

      // Stop the node from being dragged
      add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

      // Prevent text selection and touch interface scrolling
      add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
    }

    function removeMethod(handleObj) {
      if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
        return;
      }

      remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
      remove(this, 'mousedown.' + handleObj.guid);
    }

    jQuery.event.special.movestart = {
      setup: setup,
      teardown: teardown,
      add: addMethod,
      remove: removeMethod,

      _default: function(e) {
        var event, data;

        // If no move events were bound to any ancestors of this
        // target, high tail it out of here.
        if (!e._handled()) { return; }

        function update(time) {
          updateEvent(event, data.touch, data.timeStamp);
          trigger(e.target, event);
        }

        event = {
          target: e.target,
          startX: e.startX,
          startY: e.startY,
          pageX: e.pageX,
          pageY: e.pageY,
          distX: e.distX,
          distY: e.distY,
          deltaX: e.deltaX,
          deltaY: e.deltaY,
          velocityX: e.velocityX,
          velocityY: e.velocityY,
          timeStamp: e.timeStamp,
          identifier: e.identifier,
          targetTouches: e.targetTouches,
          finger: e.finger
        };

        data = {
          event: event,
          timer: new Timer(update),
          touch: undefined,
          timeStamp: undefined
        };

        if (e.identifier === undefined) {
          // We're dealing with a mouse
          // Stop clicks from propagating during a move
          add(e.target, 'click', returnFalse);
          add(document, mouseevents.move, activeMousemove, data);
          add(document, mouseevents.end, activeMouseend, data);
        }
        else {
          // We're dealing with a touch. Stop touchmove doing
          // anything defaulty.
          e._preventTouchmoveDefault();
          add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
          add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
        }
      }
    };

    jQuery.event.special.move = {
      setup: function() {
        // Bind a noop to movestart. Why? It's the movestart
        // setup that decides whether other move events are fired.
        add(this, 'movestart.move', jQuery.noop);
      },

      teardown: function() {
        remove(this, 'movestart.move', jQuery.noop);
      }
    };

    jQuery.event.special.moveend = {
      setup: function() {
        // Bind a noop to movestart. Why? It's the movestart
        // setup that decides whether other move events are fired.
        add(this, 'movestart.moveend', jQuery.noop);
      },

      teardown: function() {
        remove(this, 'movestart.moveend', jQuery.noop);
      }
    };

    add(document, 'mousedown.move', mousedown);
    add(document, 'touchstart.move', touchstart);

    // Make jQuery copy touch event properties over to the jQuery event
    // object, if they are not already listed. But only do the ones we
    // really need. IE7/8 do not have Array#indexOf(), but nor do they
    // have touch events, so let's assume we can ignore them.
    if (typeof Array.prototype.indexOf === 'function') {
      (function(jQuery, undefined){
        var props = ["changedTouches", "targetTouches"],
            l = props.length;

        while (l--) {
          if (jQuery.event.props.indexOf(props[l]) === -1) {
            jQuery.event.props.push(props[l]);
          }
        }
      })(jQuery);
    };
  });

  $.fn.twentytwenty = function(options) {
    var options = $.extend({default_offset_pct: 0.5, orientation: 'horizontal'}, options);
    return this.each(function() {

      var sliderPct = options.default_offset_pct;
      var container = $(this);
      var sliderOrientation = options.orientation;
      var beforeDirection = (sliderOrientation === 'vertical') ? 'down' : 'left';
      var afterDirection = (sliderOrientation === 'vertical') ? 'up' : 'right';

      container.wrap("<div class='twentytwenty-wrapper twentytwenty-" + sliderOrientation + "'></div>");
      container.append("<div class='twentytwenty-overlay'></div>");
      var beforeImg = container.find("img:first");
      var afterImg = container.find("img:last");
      container.append("<div class='twentytwenty-handle style-accent-bg border-accent-color'></div>");
      var slider = container.find(".twentytwenty-handle");
      slider.append("<span class='twentytwenty-" + beforeDirection + "-arrow'></span>");
      slider.append("<span class='twentytwenty-" + afterDirection + "-arrow'></span>");
      container.addClass("twentytwenty-container");
      beforeImg.addClass("twentytwenty-before");
      afterImg.addClass("twentytwenty-after");

      var overlay = container.find(".twentytwenty-overlay");
      overlay.append("<div class='twentytwenty-before-label'></div>");
      overlay.append("<div class='twentytwenty-after-label'></div>");

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
      	}
      	else {
          beforeImg.css("clip", "rect(0,"+offset.cw+","+offset.h+",0)");
    	}
        container.css("height", offset.h);
      };

      var adjustSlider = function(pct) {
        var offset = calcOffset(pct);
        slider.css((sliderOrientation==="vertical") ? "top" : "left", (sliderOrientation==="vertical") ? offset.ch : offset.cw);
        adjustContainer(offset);
      }

      $(window).on("resize.twentytwenty", function(e) {
        adjustSlider(sliderPct);
      });

      var offsetX = 0,
      offsetY = 0,
      imgWidth = 0,
      imgHeight = 0;

      slider.on("movestart", function(e) {
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
      });

      slider.on("moveend", function(e) {
        container.removeClass("active");
      });

      slider.on("move", function(e) {
        if (container.hasClass("active")) {
          sliderPct = (sliderOrientation === 'vertical') ? (e.pageY-offsetY)/imgHeight : (e.pageX-offsetX)/imgWidth;
          if (sliderPct < 0) {
            sliderPct = 0;
          }
          if (sliderPct > 1) {
            sliderPct = 1;
          }
          adjustSlider(sliderPct);
        }
      });

      container.find("img").on("mousedown", function(event) {
        event.preventDefault();
      });

      $(window).trigger("resize.twentytwenty");
    });
  };

  $('.twentytwenty-container').twentytwenty();

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
			}
		},
		onLayout = function(justifiedObj, startIndex) {
			justifiedObj.css('opacity', 1);
			justifiedObj.closest('.justified-system').find('.justified-footer').css('opacity', 1);
			$('.tmb', justifiedObj).addClass('justified-object-loaded');

			requestTimeout(function() {
				window.dispatchEvent(UNCODE.boxEvent);
				UNCODE.adaptive();
				$(justifiedObj).find('audio,video').each(function() {
					$(this).mediaelementplayer({
							pauseOtherPlayers: false,
					});
				});
				if ($(justifiedObj).find('.nested-carousel').length) {
					UNCODE.carousel($(justifiedObj).find('.nested-carousel'));
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

			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
                    var calc_scroll = container.closest('.uncol').offset().top,
                    getFilterSpanPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span', filterContainer).css("padding-bottom") : 0,
                    getFilterPadding = (!filterContainer.hasClass('with-bg')) ? $('.filter-show-all span a', filterContainer).css("padding-bottom") : 0,
                    filterOffset = (getFilterSpanPadding != undefined && getFilterSpanPadding != 0) ? parseInt(getFilterSpanPadding.replace("px", "")) : 0;
                    filterOffset += (getFilterPadding != undefined && getFilterPadding != 0) ? parseInt(getFilterPadding.replace("px", "")) : 0;

                    calc_scroll -= filterOffset - 1;
                    calc_scroll -= UNCODE.get_scroll_offset();

					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - calc_scroll,
						scrollSpeed = (SiteParameters.constant_scroll == 'on') ? Math.abs(delta) / parseFloat(SiteParameters.scroll_speed) : SiteParameters.scroll_speed;
					if (scrollSpeed < 1000 && SiteParameters.constant_scroll == 'on') scrollSpeed = 1000;

					if ( !UNCODE.isFullPage ) {
						if (scrollSpeed == 0) {
							$('html, body').scrollTop(calc_scroll);
							UNCODE.scrolling = false;
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
				}
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

						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');

						var getLightbox = UNCODE.lightboxArray[container.data('lbox')];
						if (typeof getLightbox === 'object') getLightbox.refresh();

						if (transitionDuration == 0) {
							requestTimeout(function() {
								boxAnimation(filterItems, 0, false, container);
							}, 100);
						}
						requestTimeout(function() {
							Waypoint.refreshAll();
						}, 2000);

					}, delay);
				} else {
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
					container.parent().addClass('justified-loading');
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
	$index = $('[data-id="' + goToSection + '"]').closest('.uncode-tabs');

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
			scrollTo;

		if ( ! getSection.length ) {
			getSection = $('div[data-parent="' + index + '"]');
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
		scrollTo = getSection.offset().top - 27;
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
				player = $f(iframe[0]);
				player.api('pause');
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
					if (UNCODE.wwidth < UNCODE.mediaQuery) window.dispatchEvent(UNCODE.menuMobileTriggerEvent);
					else $('.mmb-container-overlay .overlay-close').trigger('click');
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
				player = $f(iframe[0]);
				player.api('pause');
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
				player = $f(iframe[0]);
				player.api('play');
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
			rect = $maincontainer.getBoundingClientRect();
		$body.style.height = UNCODE.wheight + 'px';
		if ( theres_footer )
			$footer.style.top = rect.height + 'px';
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
		$(window).trigger('resize');
	})
};

UNCODE.filters = function() {
	var $isotopes = $('.isotope-system');

	$isotopes.each(function(index, val){
		var $isotope = $(this),
			$widget_trgr = $('.uncode-woocommerce-toggle-widgetized-cb__link', $isotope),
			$widgets = $('.widgetized-cb-wrapper', $isotope),
			$sorting_trgr = $('.uncode-woocommerce-sorting__link', $isotope),
			$sorting_dd = $('.uncode-woocommerce-sorting-dropdown', $isotope),
			$cats_trigger = $('.menu-smart--filter-cats_mobile-toggle-trigger', $isotope),
			$cats_filters = $('.menu-smart--filter-cats-mobile-dropdown', $isotope);

		if ($isotope.hasClass('isotope-processed')) {
			return;
		}

		$cats_trigger.on('click', function(e) {
			if ( ! $('html').hasClass('screen-sm') ) {
				// $widgets.add($sorting_dd).slideUp(400);
				e.preventDefault();
				$widgets.slideUp(200, 'easeInOutCirc');
			}
		});

		$('.filters-toggle-trigger', $isotope).on('click', function(e) {
			e.preventDefault();
			var $filters = $('.isotope-filters .menu-horizontal', $isotope);
			$filters.slideToggle(200);
			$widgets.add($cats_filters).slideUp(200);
		});

		$widget_trgr.on('click', function(e) {
			$widgets.slideToggle(200);
			if (!$('html').hasClass('screen-sm')) {
				// $cats_filters.add($sorting_dd).slideUp(200);
				e.preventDefault();
				$cats_filters.slideUp(200);
			}
			window.dispatchEvent(new CustomEvent('boxResized'));
		});

		$sorting_trgr.on('click', function(e) {
			e.preventDefault();
			if ($('html').hasClass('screen-sm')) {
				return false;
			} else {
				$widgets.add($cats_filters).slideUp(200);
			}
		});

		$isotope.addClass('isotope-processed');
	})

};

UNCODE.widgets = function() {
	var widget_titles = $('.widget-mobile-collapse').find('.widget-title');
	var widgets = widget_titles.closest('.widget');

	widgets.each(function() {
		var _this = $(this);
		var content = _this.children().not('.widget-title');

		if (_this.hasClass('widget-mobile-done')) {
			return;
		}

		content.wrapAll( '<div class="widget-collapse-content"></div> ');
		_this.removeClass('collapse-init');
		_this.addClass('widget-mobile-done');
	});

	var widgets_without_title = $('.collapse-init');

	widgets_without_title.removeClass('collapse-init');

	widget_titles.on('click', function() {
		var _this = $(this);
		var content = _this.closest('.widget').find('.widget-collapse-content');

		// Get content of :after element (+ icon) to check the visibility
		var icon_content = window.getComputedStyle(_this[0], ':after').getPropertyValue('content');

		if (icon_content === 'none') {
			return false;
		}

		_this.toggleClass('open');
		content.slideToggle(400, 'easeInOutCirc');

		return false;
	});
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

	UNCODE.init = function() {
		var wfl_check = false, wfl_request, waypoint_request;
		UNCODE.preventDoubleTransition();
		UNCODE.utils();
		UNCODE.menuSystem();
		UNCODE.okvideo();
		UNCODE.tapHover();
		UNCODE.isotopeLayout();
		UNCODE.justifiedGallery();
		UNCODE.lightbox();
		UNCODE.carousel($('body'));
		UNCODE.lettering();
		UNCODE.animations();
		UNCODE.stickyElements();
		UNCODE.twentytwenty();
		UNCODE.disableHoverScroll();
		UNCODE.printScreen();
		UNCODE.particles();
		UNCODE.filters();
		UNCODE.widgets();
		UNCODE.unmodal();
		if ( !UNCODE.isFullPage ) {
			UNCODE.checkScrollForTabs();
		}
		UNCODE.onePage(UNCODE.isMobile);
		$(document).ready(function(){
			UNCODE.fullPage();
		});
		$(window).on('load',function(){
			clearRequestTimeout(waypoint_request);
			waypoint_request = requestTimeout( function(){
				Waypoint.refreshAll();
			}, 1000);
		});
	}

	if ( ! SiteParameters.is_frontend_editor ) {
		UNCODE.init();
	}


})(jQuery);
