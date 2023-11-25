/**
* Copyright (c) Loft.Ocean
* http://www.loftocean.com
*/

( function( $ ) {
	"use strict";
	var llp_file_ext = [
		'jpg', 'jpeg', 'png', 'gif', 'mov', 'avi', 'mpg',
		'3gp', '3g2', 'midi', 'mid', 'pdf', 'doc', 'ppt',
		'odt', 'pptx', 'docx', 'pps', 'ppsx', 'xls', 'xlsx',
		'key', 'mp3', 'ogg', 'wma', 'm4a', 'wav', 'mp4',
		'm4v', 'webm', 'ogv', 'wmv', 'flv', 'svg', 'svgz'
	];
	var $DOMBody = $( 'body' ), leavingShowAll = loftloaderPro['insiteTransitionShowAll'] === 'undefined' ? false : loftloaderPro['insiteTransitionShowAll'],
		leavingProgressMax = ( typeof loftloaderPro['leavingProgressMax'] === 'undefined' ) ? 60 : loftloaderPro['leavingProgressMax'], $globalExcluded = $(),
		minTimer = '', maxTimer = '', rapidPercentage = parseInt( ( leavingProgressMax * 0.9 ), 10 ), LoftLoaderProSessionStorage = {
			getItem: function( name ) {
				try {
					return sessionStorage.getItem( name );
				} catch( msg ) {
					return false;
				}
			},
			setItem: function( name, value ) {
				try {
					sessionStorage.setItem( name, value );
				} catch ( msg ) { }
			}
		};
	function llp_check_a( $a ) {
		if ( $a && $a.length ) {
			var target = $a.attr( 'target' ),
				href = $a.attr( 'href' );
			return ( ( typeof target == 'undefined' ) || ( target.toLowerCase() !== '_blank' ) ) && llp_exclude_a( $a ) && ( href && llp_check_url( href ) );
		}
		return false;
	}
	function llp_check_random_message() {
		var $message = $( '#loftloader-wrapper .loader-message' ), message = llp_get_random_message();
		if ( $message.length && message ) {
			$message.html( message );
			LoftLoaderProSessionStorage.setItem( 'loftloader-pro-next-random-message', message );
		}
	}
	function register_smooth_transition_link( $item ) {
		var href = $item.attr( 'href' );
		if ( ! $item.data( 'loftloader-pro-checked' ) ) {
			if ( href && llp_check_a( $item ) ) {
				$item.off( 'click' ).on( 'click', function( e ) {
					e.preventDefault();
					var $loader = $( '#loftloader-wrapper' ), $closeBtn = $loader.find( '.loader-close-button' );
					llp_check_random_message();
					$( document ).trigger( 'loftloaderpro.spt.start' );
					$( 'html' ).removeClass( 'loftloader-pro-spt-hide' );
					$loader.length && ! loftloaderPro.insiteTransitionDisplayOption ? $loader.css( 'transition-delay', '' ) : '';
					$DOMBody.addClass( 'leaves' );
					if ( leavingShowAll ) {
						var leavingTimer = typeof loftloaderPro[ 'leavingTimer' ] === 'undefined' ? 900 : loftloaderPro[ 'leavingTimer' ];
						leavingTimer = isNaN( leavingTimer ) ? 900 : Math.max( 0, parseInt( leavingTimer, 10 ) );

						$DOMBody.addClass( 'spt-show-all' );
						$( document ).trigger( 'loftloaderpro.image.check' );
						Progress.initValue = 0;
						Progress.reset();
						Progress.render( rapidPercentage, leavingTimer * 0.7 );
						setTimeout( function() {
							Progress.render( ( loftloaderPro.insiteTransitionDisplayOnCurrent ? 100 : leavingProgressMax ), leavingTimer * 0.3 );
						}, leavingTimer * 0.7 );
						LoftLoaderProSessionStorage.setItem( 'loftloader-pro-smooth-transition', 'on' );

						setTimeout( function() {
							window.location.href = href;
							if ( $closeBtn.length && loftloaderPro.insiteTransitionShowCloseButton ) {
								$closeBtn.css( { 'display': '', 'opacity': 1 } );
							}
						}, leavingTimer );
					} else {
						window.location.href = href;
					}
				} );
			}
			$item.data( 'loftloader-pro-checked', true );
		}
	}
	function observe_DOM_changes() {
		var targetNode = $DOMBody.get( 0 ), // Select the node that will be observed for mutations
			config = { attributes: false, childList: true, subtree: true }, // Options for the observer (which mutations to observe)
			callback = function( mutationsList, observer ) { // Callback function to execute when mutations are observed
				//for ( let mutation of mutationsList ) {
				mutationsList.forEach( function( mutation ) {
					if ( mutation.type === 'childList' ) {
						var $links = ( 'A' === mutation.target.tagName ) ? $( mutation.target ) : $( mutation.target ).find( 'a' );
						if ( $links.length ) {
							$links.each( function() {
								register_smooth_transition_link( $( this ) );
							} );
						}
					}
				} );
			},
			observer = new MutationObserver( callback );

		// Start observing the target node for configured mutations
		observer.observe( targetNode, config );
	}
	function llp_update_percentage_progress( current ) {
	   llp_loader_update_style(
		   'loftloader-pro-progress-percentage-style',
		   '#loftloader-wrapper span.percentage:after, #loftloader-wrapper .load-count:after { content: "' + Math.ceil( current ) + '%"; };'
	   );
	}
	function llp_exclude_a( $a ) {
		var $loader = $( '#loftloader-wrapper' ),
			classes = $a.attr( 'class' ),
			ajax_enabled = classes && ( classes.indexOf( 'ajax' ) !== -1 ),
			cart = $a.parent( '.site-header-cart').length,
			excluded = loftloaderPro.insiteTransitionCustomExcluded ? loftloaderPro.insiteTransitionCustomExcluded : false;
		excluded = ( excluded && $( excluded ).length ) ? $( excluded ) : false;
		return ! $a.parent('.product-remove').length
			&& ( ( ! $globalExcluded.length ) || $a.not( $globalExcluded ).length )
			&& ( ( excluded && $a.not( excluded ).length ) || ! excluded )
			&& ( typeof $a.attr( 'onclick' ) == 'undefined' )
			&& ! ajax_enabled && ! cart;
	}
	// Check if url is to current site
	function llp_check_url( url ) {
		if ( url ) {
			var file_ext = false, site_root = document.createElement( 'a' ),
				current = document.createElement( 'a' ), target = document.createElement( 'a' );

			target.href = url;
			current.href = window.location.href;
			site_root.href = loftloaderPro.siteRootURL;
			file_ext = target.pathname.split( '.' ).pop();

			return ( target.href.replace( /https?:\/\//i, '' ).indexOf( site_root.href.replace( /https?:\/\//i, '' ) ) === 0 )
				&& ( url.substr( 0, 1 ) !== '#' )
				&& ! ( ( current.pathname == target.pathname ) && ( target.hash || ( url.indexOf( '#' ) !== -1 ) ) )
				&& ( llp_file_ext.indexOf( file_ext ) === -1 );
		}
		return false;
	}
	// Check if the smooth insite page transition enabled
	function llp_check_insite_transition() {
		return loftloaderPro && loftloaderPro.insiteTransition && ( 'on' == loftloaderPro.insiteTransition ) && loftloaderPro.siteRootURL;
	}
	/*
	 * @description Update the number when choose progress type bar+number
	 * @param int current percentage number 0 - 100
	 */
	function llp_update_progress_count( current, $load ) {
		if ( $load && $load.length ) {
			var $count = $load.next( '.load-count' ),
				container_width = $load.width() * current / 100,
				offset_x = ( container_width > $count.width() ) ? ( container_width - $count.width() ) : 0,
				offset_y = $load.parent().hasClass( 'bottom' ) ? '-100%' : '100%';
			$count.css( 'transform', 'translate(' + offset_x + 'px, ' + offset_y + ')' );
		}
	}
	$( window ).bind( 'pageshow', function( event ) {
		if ( event.originalEvent.persisted ) {
			var $body = $('body'), $loader = $( '#loftloader-wrapper' );
			$loader.length ? $loader.css( 'transition-delay', '0s' ) : '';
			if ( $body.length && $body.hasClass( 'leaves' ) ) {
				$body.removeClass( 'leaves' );
			}
			if ( $body.length && ! $body.hasClass( 'loftloader-loaded' ) ) {
				$body.addClass( 'loaded loftloader-loaded' );
			}
		}
	} );

	// Helper extention to test current element has any of the classes listed.
	$.fn.llpHasAnyClass = function( classes ) {
		var self = $( $( this )[0] ), ret = false;
		$.each( classes, function( i, cls ) {
			if ( self.hasClass( cls ) ) {
				ret = true;
				return false;
			}
		} );
		return ret;
	}
	// Helper function, updating style element in <head> with given id
	function llp_loader_update_style( id, style ) {
		var $style = $( 'head' ).find( '#' + id );
		if ( ! $style.length ) {
			$style = $( '<style>' ).attr( 'id', id ).html( '' ).appendTo( $( 'head' ) );
		}
		$style.html( style );
	}
	// Change bg image span width and height for loader type image loading
	function llp_loader_type_load_bg_span( $span, $image ) {
		if ( $span.length && $image.length ) {
			var values = llp_get_width_height( $image ),
				width = values && values.width ? parseInt( values.width * 10000 ) / 10000 : '100%',
				height = values && values.height ? parseInt( values.height * 10000 ) / 10000 : '100%';
			$span.css( { 'width': width, 'height': height, 'display': '' } );
			$image.length ? $image.attr( 'width', width ).attr( 'height', height ) : '';
		}
	}
	// Helper function to get the image width and height
	function llp_get_width_height( $elem ) {
		if ( $elem.length ) {
			var rect = $elem[0].getBoundingClientRect();
			return {
				'width': ( rect.width ? rect.width : ( rect.right - rect.left ) ),
				'height': ( rect.height ? rect.height : ( rect.bottom - rect.top ) )
			};
		}
		return false;
	}
	// Show random message by js
	function llp_show_random_message() {
		var $message = $( '#loftloader-wrapper .loader-message' ), message = llp_get_random_message(),
			presetMessage = LoftLoaderProSessionStorage.getItem( 'loftloader-pro-next-random-message' );
		if ( $message.length && message ) {
			$message.html( presetMessage ? presetMessage : message );
		}
	}
	// Get random message
	function llp_get_random_message() {
		var list = ( typeof loftloaderPro['randomMessage'] === 'undefined' ) ? false : loftloaderPro['randomMessage'];
		if ( $.isArray( list ) && ( list.length > 0 ) ) {
			var messageLength = list.length,
				random = Math.random() * ( messageLength - 1 );
			return list[ Math.round( random ) ];
		}
		return false;
	}

	var $loader = $( '#loftloader-wrapper' ),  // Loader container
		llp_is_customize_preview = loftloaderPro && loftloaderPro.isLoaderPreview && ( 'on' == loftloaderPro.isLoaderPreview ),
		llp_is_loader_customize = llp_is_customize_preview && ( typeof parent.wp.customize.settings.settings.loftloader_pro_main_switch !== 'undefined' ),
		llp_is_theme_customize = llp_is_customize_preview && ( typeof parent.wp.customize.settings.settings.loftloader_pro_main_switch === 'undefined' ),
		llp_load_time = loftloaderPro.minimalLoadTime ? parseFloat( loftloaderPro.minimalLoadTime ) : false,
		llp_flag_wait = llp_load_time ? true : false,
		llp_flag_running = true;
	llp_is_theme_customize ? $( '#loftloader-preview-style-css' ).remove() : '';
	llp_show_random_message();

	// Always run for both customize preview and normal front end.
	$( document ).on( 'loftloaderpro.image.check', function() {
		var $img_load_span = $( '#loftloader-wrapper .imgloading-container span' );
		if ( $img_load_span.length ) {
			var $image =  $( '#loftloader-wrapper #loader img' );
			llp_loader_type_load_bg_span( $img_load_span, $image );
			$image.on( 'load', function( e ) {
				llp_loader_type_load_bg_span( $img_load_span, $image );
			} );
			$( window ).on( 'resize', function( e ) {
				llp_loader_type_load_bg_span( $img_load_span, $image );
			} );
		}
	} ).ready( function() {
		$( this ).trigger( 'loftloaderpro.image.check' );
	} );

	// Test if in preview mode. If so, add the hover handler to <body> for loader with percentage progress.
	if ( llp_is_loader_customize ) {
		// Remove smooth page transition related styles
		if ( $( 'html' ).hasClass( 'loftloader-smooth-transition' ) ) {
			var $html = $( 'html' );
			$html.attr( 'data-original-styles' ) ? $html.attr( 'style', $html.attr( 'data-original-styles' ) ) : $html.removeAttr( 'style' );
			$html.removeAttr( 'data-original-styles' ).removeClass( 'loftloader-smooth-transition' );
		}

		if ( $( '#loftloader-wrapper .percentage' ).length || $( '#loftloader-wrapper .bar .load-count' ).length ) {
			var $loader = $( '#loftloader-wrapper .percentage' ).length ? $( '#loftloader-wrapper .percentage' ) : $( '#loftloader-wrapper .bar .load-count' ),
				$bar = $( '#loftloader-wrapper .bar' );
			$bar.children( '.load-count' ).length ? llp_update_progress_count( 100, $bar.children( '.load' ) ) : '';
			$loader.prop( 'percentage', 0 );

			$( 'body' ).hover( function() {
				$loader.prop( 'percentage', 0 ).animate(
					{ percentage: 100 },
					{ duration: 2850, easing: 'linear', step: function( now ) {
						$( this ).text( Math.ceil( now ) + '%' );
						$( this ).hasClass( 'load-count' ) ? llp_update_progress_count( now, $( this ).prev( '.load' ) ) : '';
					} }
				)
			}, function() {
				$loader.stop( true, true ).text( '100%' ).prop( 'percentage', 0 );
				$loader.hasClass( 'load-count' ) ? llp_update_progress_count( 100, $loader.prev( '.load' ) ) : '';
			});
		}
	}
	if ( ! llp_is_customize_preview || llp_is_theme_customize ) {  // Otherwise, roll the normal loader script
		var $progress = $( '#loftloader-wrapper .percentage' ),  // Progress element
			progress_once = $loader.hasClass( 'loftloader-once' ) && $loader.llpHasAnyClass( [ 'loftloader-imgloading', 'loftloader-rainbow', 'loftloader-circlefilling', 'loftloader-waterfilling', 'loftloader-petals' ] ),
			progress_type = $progress.hasClass( 'percentage' ) ? 'percentage' : 'bar';
		$progress = $progress.length ? $progress : $loader.find( '.bar .load' );
		var Progress = {
			finishPause: 800, $el: $loader, runDuration: 700, initValue: 0, startPercentage: 0,
			progress: $progress, type: progress_type, once: progress_once, max_timeup : false,
			start: function() {
				if ( LoftLoaderProSessionStorage.getItem( 'loftloader-pro-smooth-transition' ) && ( 'on' === LoftLoaderProSessionStorage.getItem( 'loftloader-pro-smooth-transition' ) ) ) {
					this.initValue = leavingProgressMax / 100;
					LoftLoaderProSessionStorage.setItem( 'loftloader-pro-smooth-transition', 0 );
				}
				$( 'body' ).removeClass( 'loaded loftloader-loaded' );
				this.reset();
			},
			reset: function() {
				( this.type == 'percentage' ) ? llp_update_percentage_progress( 100 * this.initValue ) : $progress.css( 'transform', 'scaleX(' + this.initValue + ')' );
				this.current = 100 * this.initValue;
				this.startPercentage = 100 * this.initValue;
				this.$el.prop( 'percentage', this.startPercentage );
				this.render( this.startPercentage, 1 );
			},
			stop: function( timeup ) {
				var cb = this.finish;
				this.render( 100, this.finishPause );
				if ( timeup ) {
					this.timeup = true;
				}
				setTimeout( function() {
					cb();
				}, ( this.finishPause + 100 ) );
			},
			update: function( percentage ) {
				this.render( percentage );
			},
			render: function( current, duration ) {
				if ( this.timeup || ! ( this.$el && this.$el.animate ) ) {
					return '';
				}
				var progress = this;
				duration = ( typeof duration === 'undefined' ) ? this.runDuration : duration;
				if ( current === 100 ) {
					this.$el.stop( true, false ).animate( {
						percentage: 100
					}, {
						duration: duration,
						easing: 'swing',
						step: function( now ) {
							progress.renderProgress( progress, now );
					} } );
				} else {
					this.$el.animate( {
						percentage: current
					}, {
						duration: duration,
						easing: 'linear',
						step: function( now ) {
							progress.renderProgress( progress, now );
					} } );
				}
			},
			renderProgress: function( progress, now ) {
				var once = progress.once, type = progress.type, $progress = progress.progress;
				if ( type == 'percentage' ) {
					llp_update_percentage_progress( Math.ceil( now ) );
				} else {
					$progress.css( 'transform', 'scaleX(' + ( now / 100 ) + ')' );
					if ( $progress.next( '.load-count' ).length ) {
						llp_update_percentage_progress( Math.ceil( now ) );
						llp_update_progress_count( now, $progress );
					}
				}
				if ( once ) {
					if ( $loader.hasClass( 'loftloader-imgloading' ) ) {
						var $img_load_container = $loader.find( '.imgloading-container' );
						if ( $loader.hasClass( 'imgloading-horizontal' ) ) {
							$img_load_container.css( 'width', ( now + '%' ) );
						} else {
							$img_load_container.css( 'height', ( now + '%' ) );
						}
					} else if ( $loader.hasClass( 'loftloader-rainbow' ) ) {
						var deg = now * 1.8 - 180;
						llp_loader_update_style(
							'loftloader_pro_once_rainbow',
							'#loftloader-wrapper.loftloader-rainbow #loader span { -webkit-transform: rotate(' + deg + 'deg); transform: rotate(' + deg + 'deg); }'
						);
					} else if ( $loader.hasClass( 'loftloader-circlefilling' ) ) {
						var scaleY = now / 100;
						llp_loader_update_style(
							'loftloader_pro_once_circlefilling',
							'#loftloader-wrapper.loftloader-circlefilling #loader span { -webkit-transform: scaleY(' + scaleY + '); transform: scaleY(' + scaleY + '); }'
						);
					} else if ( $loader.hasClass( 'loftloader-waterfilling' ) ) {
						var scaleY = now / 100, transY = now - 100;
						llp_loader_update_style(
							'loftloader_pro_once_waterfilling',
							'#loftloader-wrapper.loftloader-waterfilling #loader:before { transform: scaleY(' + scaleY + '); } #loftloader-wrapper.loftloader-waterfilling #loader span {-webkit-transform: translateY(' + transY + '%); transform: translateY(' + transY + '%); }'
						);
					} else if ( $loader.hasClass( 'loftloader-petals' ) ) {
						var petals = {
							petal0: '{box-shadow: 0 -15px 0 -15px transparent, 10.5px -10.5px 0 -15px transparent, 15px 0 0 -15px transparent, 10.5px 10.5px 0 -15px transparent, 0 15px 0 -15px transparent, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal1: '{box-shadow: 0 -25px 0 -15px currentColor, 10.5px -10.5px 0 -15px transparent, 15px 0 0 -15px transparent, 10.5px 10.5px 0 -15px transparent, 0 15px 0 -15px transparent, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal2: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 15px 0 0 -15px transparent, 10.5px 10.5px 0 -15px transparent, 0 15px 0 -15px transparent, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal3: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 10.5px 10.5px 0 -15px transparent, 0 15px 0 -15px transparent, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal4: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 17.5px 17.5px 0 -15px currentColor, 0 15px 0 -15px transparent, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal5: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 17.5px 17.5px 0 -15px currentColor, 0 25px 0 -15px currentColor, -10.5px 10.5px 0 -15px transparent, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal6: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 17.5px 17.5px 0 -15px currentColor, 0 25px 0 -15px currentColor, -17.5px 17.5px 0 -15px currentColor, -15px 0 0 -15px transparent, -10.5px -10.5px 0 -15px transparent;}',
							petal7: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 17.5px 17.5px 0 -15px currentColor, 0 25px 0 -15px currentColor, -17.5px 17.5px 0 -15px currentColor, -25px 0 0 -15px currentColor, -10.5px -10.5px 0 -15px transparent;}',
							petal8: '{box-shadow: 0 -25px 0 -15px currentColor, 17.5px -17.5px 0 -15px currentColor, 25px 0 0 -15px currentColor, 17.5px 17.5px 0 -15px currentColor, 0 25px 0 -15px currentColor, -17.5px 17.5px 0 -15px currentColor, -25px 0 0 -15px currentColor, -17.5px -17.5px 0 -15px currentColor;}'
						}, style = '', nums = [88, 75, 63, 50, 38, 25, 13], steps = {88: 'petal7', 75: 'petal6', 63: 'petal5', 50: 'petal4', 38: 'petal3', 25: 'petal2', 13: 'petal1'};
						$.each( nums, function( index, value ) {
							if ( now >= value ) {
								style = petals[ steps[ value ] ];
								return false;
							}
						} );
						style = ( now === 0 ) ? petals['petal0'] : ( ( now > 98 ) ? petals['petal8'] : style );
						llp_loader_update_style( 'loftloader_pro_once_petals', '#loftloader-wrapper.loftloader-petals #loader span' + style );
					}
				}
			},
			finish: function() {
				$( 'body' ).addClass( 'loaded loftloader-loaded' ).removeClass( 'leaves spt-show-all' );
				// Remove class for disable page scroll while loaded
				setTimeout( function() {
					$('body').removeClass( 'loftloader-disable-scrolling' );
					if ( $('#loftloader-pro-always-show-scrollbar').length ) {
						$('#loftloader-pro-always-show-scrollbar').remove();
					}
				}, 1000 );
				// Remove smooth page transition related styles
				if ( $( 'html' ).hasClass( 'loftloader-smooth-transition' ) ) {
					var $html = $( 'html' );
					$html.attr( 'data-original-styles' ) ? $html.attr( 'style', $html.attr( 'data-original-styles' ) ) : $html.removeAttr( 'style' );
					$html.removeAttr( 'data-original-styles' ).removeClass( 'loftloader-smooth-transition' );
				}
				// Remove settings for diagonally split effect
				var $loader_wrap = $( '#loftloader-wrapper' );
				if ( $loader_wrap.hasClass( 'split-diagonally' ) ) {
					$loader_wrap.find( '.loader-bg' ).css( 'background', 'none' );
				}

				setTimeout( function() {
					Progress.timeup = false;
					$( document ).trigger( 'loftloaderprodone' );
				}, 1100 );

				maxTimer ? clearTimeout( maxTimer ) : '';
				minTimer ? clearTimeout( minTimer ) : '';
			}
		}
		if ( $( 'html' ).hasClass( 'loftloader-pro-spt-hide' ) ) {
			$( 'body' ).addClass( 'loaded loftloader-loaded' ).removeClass( 'loftloader-disable-scrolling' );
			$( 'head' ).append( $( '<style>', { 'text': '#loftloader-wrapper.end-split-v.split-diagonally .loader-bg, #loftloader-wrapper.end-split-h.split-diagonally .loader-bg { background: none; }' } ) );
			$( 'html' ).removeClass( 'loftloader-pro-spt-hide' );
		} else {
			Progress.start();
			// If enable progress or loader with once option, run the loaded percentage calculation.
			if ( $progress.length || progress_once ) {
				if ( llp_load_time ) {
					minTimer = setTimeout( function() {
						if ( ! llp_flag_running ) {
							Progress.stop();
						}
						llp_flag_wait = false;
					}, llp_load_time );
				}
				$( 'body' ).loftloaderProWaitForMedia( {
					waitForAll: true,
					each: function( percentage ) {
						if ( percentage > Progress.startPercentage ) {
							Progress.update( percentage );
						}
					},
					finished: function( previousPercentage ) {
						if ( llp_flag_wait ) {
							Progress.render( Math.max( 95, previousPercentage ), llp_load_time );
						} else {
							Progress.stop();
						}
						llp_flag_running = false;
					}
				} );
			} else { // Otherwise, run the simple process, add the loaded class name to <body> after full content loaded.
				if ( llp_load_time ) {
					minTimer = setTimeout( function() {
						if ( ! llp_flag_running ) {
							Progress.finish();
						}
						llp_flag_wait = false;
					}, llp_load_time );
				}
				$( 'body' ).loftloaderProWaitForMedia( {
					waitForAll: true,
					each: function( percentage ) { },
					finished: function( previousPercentage ) {
						if ( llp_flag_wait ) {
							Progress.render( Math.max( 95, previousPercentage ), llp_load_time );
						} else {
							Progress.finish();
						}
						llp_flag_running = false;
					}
				} );
			}
			document.addEventListener( 'DOMContentLoaded', function() {
				var $loader_wrapper = $( '#loftloader-wrapper' ), $closeBtn = $( '#loftloader-wrapper .loader-close-button' ),
					show_close_time = '', max_load_time = 0;
				if ( $closeBtn.length && loftloaderPro.showCloseBtnTime ) {
					show_close_time = parseInt( loftloaderPro.showCloseBtnTime, 10 );
					if ( show_close_time ) {
						setTimeout( function() {
							$closeBtn.css( 'display', '' );
						}, show_close_time );
						$closeBtn.on( 'click', function() {
							Progress.finish();
							$( this ).css( 'opacity', '' );
						} );
					}
				}
				if ( loftloaderPro.maximalLoadTime ) {
					max_load_time = parseInt( loftloaderPro.maximalLoadTime, 10 );
					if( max_load_time ) {
						maxTimer = setTimeout( function( ) {
							Progress.stop( true );
						}, max_load_time );
					}
				}
			} );
		}
		$( window ).one( 'load', function( e ) {
			if ( llp_check_insite_transition() ) {
				if ( loftloaderPro.insiteTransitionURLExcluded && Array.isArray( loftloaderPro.insiteTransitionURLExcluded ) && loftloaderPro.insiteTransitionURLExcluded.length ) {
					loftloaderPro.insiteTransitionURLExcluded.forEach( function( url ) {
						if ( $( 'a[href^="' + url + '"]' ).length ) {
							$globalExcluded = $globalExcluded.add( $( 'a[href^="' + url + '"]' ) );
						}
					} );
				}
				if ( loftloaderPro.insiteTransitionButtons ) {
					var $sptButtons = $( loftloaderPro.insiteTransitionButtons );
					if ( $sptButtons.length ) {
						$sptButtons.on( 'click', function( e ) {
							var $loader = $( '#loftloader-wrapper' );
							llp_check_random_message();
							$( document ).trigger( 'loftloaderpro.spt.start' );
							$( 'html' ).removeClass( 'loftloader-pro-spt-hide' );
							$loader.length && ! loftloaderPro.insiteTransitionDisplayOption ? $loader.css( 'transition-delay', '' ) : '';
							$DOMBody.addClass( 'leaves' );
							if ( leavingShowAll ) {
								$DOMBody.addClass( 'spt-show-all' );
								$( document ).trigger( 'loftloaderpro.image.check' );
								Progress.initValue = 0;
								Progress.reset();
								Progress.render( ( loftloaderPro.insiteTransitionDisplayOnCurrent ? 100 : leavingProgressMax ), 400 );
								LoftLoaderProSessionStorage.setItem( 'loftloader-pro-smooth-transition', 'on' );
							}
						} );
					}
				}
				$( 'body a' ).each( function() {
					register_smooth_transition_link( $( this ) );
				} );
				observe_DOM_changes();
			}
		} );
	}
} ) ( jQuery );
