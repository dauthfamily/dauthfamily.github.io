;window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
          return check;
};



!function(a){function b(){var a=document.createElement("p"),b=!1;if(a.addEventListener)a.addEventListener("DOMAttrModified",function(){b=!0},!1);else{if(!a.attachEvent)return!1;a.attachEvent("onDOMAttrModified",function(){b=!0})}return a.setAttribute("id","target"),b}function c(b,c){if(b){var d=this.data("attr-old-value");if(c.attributeName.indexOf("style")>=0){d.style||(d.style={});var e=c.attributeName.split(".");c.attributeName=e[0],c.oldValue=d.style[e[1]],c.newValue=e[1]+":"+this.prop("style")[a.camelCase(e[1])],d.style[e[1]]=c.newValue}else c.oldValue=d[c.attributeName],c.newValue=this.attr(c.attributeName),d[c.attributeName]=c.newValue;this.data("attr-old-value",d)}}var d=window.MutationObserver||window.WebKitMutationObserver;a.fn.attrchange=function(e,f){if("object"==typeof e){var g={trackValues:!1,callback:a.noop};if("function"==typeof e?g.callback=e:a.extend(g,e),g.trackValues&&this.each(function(b,c){for(var d,e={},f=0,g=c.attributes,h=g.length;h>f;f++)d=g.item(f),e[d.nodeName]=d.value;a(this).data("attr-old-value",e)}),d){var h={subtree:!1,attributes:!0,attributeOldValue:g.trackValues},i=new d(function(b){b.forEach(function(b){var c=b.target;g.trackValues&&(b.newValue=a(c).attr(b.attributeName)),"connected"===a(c).data("attrchange-status")&&g.callback.call(c,b)})});return this.data("attrchange-method","Mutation Observer").data("attrchange-status","connected").data("attrchange-obs",i).each(function(){i.observe(this,h)})}return b()?this.data("attrchange-method","DOMAttrModified").data("attrchange-status","connected").on("DOMAttrModified",function(b){b.originalEvent&&(b=b.originalEvent),b.attributeName=b.attrName,b.oldValue=b.prevValue,"connected"===a(this).data("attrchange-status")&&g.callback.call(this,b)}):"onpropertychange"in document.body?this.data("attrchange-method","propertychange").data("attrchange-status","connected").on("propertychange",function(b){b.attributeName=window.event.propertyName,c.call(a(this),g.trackValues,b),"connected"===a(this).data("attrchange-status")&&g.callback.call(this,b)}):this}return"string"==typeof e&&a.fn.attrchange.hasOwnProperty("extensions")&&a.fn.attrchange.extensions.hasOwnProperty(e)?a.fn.attrchange.extensions[e].call(this,f):void 0}}(jQuery);


jQuery(document).ready(function( $ ){

    if(window.mobilecheck() && IZ.enable_mobile != '1' ) {
        return;
    }

	var url = (window.location != window.parent.location) ? window.parent.location.href: window.location.href;

	// Is this an Elementor editor iframe.
	if ( $('body.elementor-editor-active').length > 0
			|| $('body.fl-builder-edit').length > 0
			|| url.indexOf('vc_action=vc_inline') > 0
			|| url.indexOf('vc_editable=true') > 0
			|| url.indexOf('et_fb=') > 0 ) {
		return;
	}

    var options = IZ.options;

    // Fix for the Lazy Load plugin with jQuery.sonar
    $("img[data-lazy-src]").each(function(){
        $(this).attr('data-zoom-image', $(this).data('lazy-src'));
    });

    // Fix for the lazy load functionality from the SG Optimizer plugin
    $("img[data-src].lazyload").each(function() {
        $(this).attr('data-zoom-image', $(this).data('src'));
    });
 

    // Add "zoooom" for the "is-style-zoooom" images added with Gutenberg
    $(".is-style-zoooom").each(function(){
        $(this).addClass('zoooom');
    });

    // Get the image url from data-large_image
    $("img[data-large_image]").each(function(){
        $(this).attr('data-zoom-image', $(this).data('large_image'));
    });

    // Attach the .zoooom class to the IMG children
    $(".zoooom").each(function(){
      if ( this.tagName !== 'IMG' ) {
        $(this).find("img").addClass('zoooom');
        $(this).removeClass('zoooom');
      }
    });

    // Start the zoom for the normal images
    options.zIndex = 112400;
	setTimeout( function() {
    	$("img.zoooom.jetpack-lazy-image").image_zoom(options);
	}, 300 );
	$("img.zoooom:not(.jetpack-lazy-image)").image_zoom( options );

    // WooCommerce category pages
    if ( IZ.woo_categories == '1' ) {
        var cat_class = '.tax-product_cat .products img, .post-type-archive-product .products img'; 
        $(cat_class).image_zoom(options);
        $(document).on('yith-wcan-ajax-filtered', function() {
            $('.zoomContainer').remove();
            $(cat_class).image_zoom(options);
        } );
    }

    // Fix for the LazyLoad (unveil.js) plugins
    if (typeof $.unveil === "function") {
        $("img.unveil").unveil(0, function() {
            $(this).load(function() {
                $("img.zoooom").image_zoom(options);
            });
        });
    }


    // Resize the zoom windows when resizing the page
    $(window).on('resize', function(e) {
        window.resizeEvt;
        $(window).on('resize', function() {
            clearTimeout(window.resizeEvt);
            window.resizeEvt = setTimeout(function() {
                $(".zoomContainer").remove();
                if ( IZ.with_woocommerce == '1' ) {
                    $("img.zoooom, .attachment-shop_single, .attachment-shop_thumbnail.flex-active-slide img").image_zoom(options);
                } else {
                    $("img.zoooom, .zoooom img").image_zoom(options);
                }
                if ( IZ.woo_categories == '1' ) {
                    $(".tax-product_cat .products img").image_zoom(options);
                }
            }, 500);
        });
    });


    // Remove the zoom when hovering on the submenu
    function restart_on_hover( elem ) {
        elem.on('mouseenter', function(){
            if ( $('.zoomContainer').length === 0 ) {
                $(this).image_zoom(IZ.options);
            }
        });
    };
    $('.sub-menu li').on('mouseenter', function(){
        $('.zoomContainer').remove();
    });
    restart_on_hover($('img.zoooom'));


    // Show zoom on the WooCommerce gallery
    if ( IZ.with_woocommerce == '1' ) {
    $(".attachment-shop_single").image_zoom(options);
    restart_on_hover($('.attachment-shop_single'));

    $("a[data-rel^='zoomImage']").each(function(index){
        $(this).on('click', function(event){
            // If there are more than one WooCommerce gallery, exchange the thumbnail with the closest .attachment-shop_single
            var obj1 = $(".attachment-shop_single");
            if ( obj1.length > 1 ) {
                var obj1 = $(this).closest('.images').find( $(".attachment-shop_single") );
            }
            var obj2 = $(this).find("img");

            event.preventDefault();

            if ( obj2.hasClass('attachment-shop_single') === false ) {

                // Remove the srcset and sizes
                obj1.removeAttr('srcset').removeAttr('sizes');
                obj2.removeAttr('srcset').removeAttr('sizes');

                var thumb_src = obj2.attr('src');

                // Exchange the attributes
                $.each(['src', 'alt', 'title'], function(key,attr) {
                    var temp;
                    if ( obj1.attr( attr ) ) temp = obj1.attr( attr );
                    if ( obj2.attr( attr ) ) {
                        obj1.attr(attr, obj2.attr(attr) );
                    } else {
                        obj1.removeAttr( attr );
                    }
                    if ( IZ.exchange_thumbnails == '1' ) {
                        if ( temp && temp.length > 0 ) {
                            obj2.attr(attr, temp);
                        } else {
                            obj2.removeAttr( attr );
                        }
                    }
                });

                // Exchange the link sources
                var temp;
                temp = obj2.parent().attr('href');
                if ( IZ.exchange_thumbnails == '1' ) {
                    obj2.parent().attr('href', obj1.parent().attr('href'));
                }
                obj1.parent().attr('href', temp );

                // Set the obj1.src = the link source
                obj1.attr('src', temp );

                // Set the obj2.src = data-thumbnail-src
                if ( obj1.data('thumbnail-src') && IZ.exchange_thumbnails == '1' ) {
                    obj2.attr( 'src', obj1.attr('data-thumbnail-src'));
                }

                // Set the obj1.data-thumbnail-src
                obj1.attr('data-thumbnail-src', thumb_src );

                // Replace the data-zoom-image
                temp = obj1.data('zoom-image');
                if ( !obj2.data('zoom-image') ) obj2.data('zoom-image', '');
                obj1.data('zoom-image', obj2.data('zoom-image'));
                if( ! temp ) temp = '';
                obj2.data('zoom-image', temp);

                // Remove the old zoom and reactive the new zoom
                $(".zoomContainer").remove();
                $(".attachment-shop_single").image_zoom(options);
                restart_on_hover($('.attachment-shop_single'));
            }

            });
        });
    }


    // Show zoom on the WooCommerce 3.0.+ gallery with slider
    if ( IZ.with_woocommerce == '1' && (IZ.woo_slider == '1' || $('.woo_product_slider_enabled').length > 0 )) {
        if ( $(".woocommerce-product-gallery img").length > 0 ) {

            var first_img = ".woocommerce-product-gallery__wrapper img";
            setTimeout( function() {
                if ( $(".woocommerce-product-gallery .flex-viewport").length > 0 ) {
                    first_img = ".woocommerce-product-gallery__wrapper .flex-active-slide img";
                }
                $(first_img).first().image_zoom( options );
                restart_on_hover($(first_img).first());
            }, 500 );

            var flexslider_counter = 0;
            var old_value = "";
            $(".woocommerce-product-gallery__wrapper").attrchange({
                trackValues: true,
                callback: function(event) {
                    if ( event.newValue != old_value ) {
                        $(".zoomContainer").remove();
                        setTimeout( function() {
                            $(first_img).first().image_zoom(options);
                            restart_on_hover($(first_img).first());
                        }, 550);
                    }
                    old_value = event.newValue;
                }
            });
            $(".pswp").attrchange({
                trackValues: true,
                callback: function(event) {
                    if ( event.newValue != old_value ) {
                        $(".zoomContainer").remove();
                    }
                }
            });



            // Resize the zoom windows when resizing the page
            $(window).on('resize', function(e) {
                window.resizeEvt;
                $(window).resize(function() {
                    clearTimeout(window.resizeEvt);
                    window.resizeEvt = setTimeout(function() {
                        $(".zoomContainer").remove();
                        restart_on_hover($(first_img).first());
                    }, 300);
                });
            });

            // Remove the click action on the images
            $(".woocommerce-product-gallery img").on('click', function(e){
                e.preventDefault();
            });

        }
    }




    // Show zoom on the WooCommerce 3.0.+ gallery without slider
    if ( IZ.with_woocommerce == '1' && (IZ.woo_slider == '0' || $('.woo_product_slider_disabled').length > 0)) {
        var first_img = $('.woocommerce-product-gallery__image:first-child img');

        // Zoom on the first image
        first_img.image_zoom(options);
        restart_on_hover(first_img);

        // Remove the click action on the images
        $('.woocommerce-product-gallery__image img').on('click', function(e){
            e.preventDefault();
        });


        $('.woocommerce-product-gallery__image img').each(function(i) {
            $(this).removeAttr('data-large_image');
            $(this).removeAttr('data-large_image_width');
            $(this).removeAttr('data-large_image_height');
            $(this).removeAttr('srcset');
            $(this).removeAttr('sizes');
        });

        // Switch the thumbnail with the main image
        $(".woocommerce-product-gallery__image:nth-child(n+2) img").each(function(i){
            $(this).on('click', function(e){
                var this_thumb = $(this);
                // Exchange the attributes
                $.each(['alt', 'title', 'data-src'], function(key,attr) {
                    var temp;
                    if ( first_img.attr( attr ) ) temp = first_img.attr( attr );
                    if ( this_thumb.attr( attr ) ) {
                        first_img.attr(attr, this_thumb.attr(attr) );
                    } else {
                        first_img.removeAttr( attr );
                    }
                    if ( IZ.exchange_thumbnails == '1' ) {
                        if ( temp && temp.length > 0 ) {
                            this_thumb.attr(attr, temp);
                        } else {
                            this_thumb.removeAttr( attr );
                        }
                    }

                });

                var thumb_src = this_thumb.attr('src');


                // Exchange the link sources
                var temp;
                temp = this_thumb.parent().attr('href');
                if ( IZ.exchange_thumbnails == '1' ) {
                    this_thumb.parent().attr('href', first_img.parent().attr('href'));
                }
                first_img.parent().attr('href', temp );

                // Set the first_img.src = the link source
                first_img.attr('src', temp );

                // Set the this_thumb.src = data-thumbnail-src
                if ( first_img.data('thumbnail-src') && IZ.exchange_thumbnails == '1' ) {
                    this_thumb.attr( 'src', first_img.attr('data-thumbnail-src'));
                }

                // Set the first_img.data-thumbnail-src
                first_img.attr('data-thumbnail-src', thumb_src );

                // Replace the data-zoom-image
                temp = first_img.data('zoom-image');
                if ( !this_thumb.data('zoom-image') ) this_thumb.data('zoom-image', '');
                first_img.data('zoom-image', this_thumb.data('zoom-image'));
                if( ! temp ) temp = '';
                this_thumb.data('zoom-image', temp);


                // Remove the old zoom and reactive the new zoom
                $(".zoomContainer").remove();
                first_img.image_zoom(options);
                restart_on_hover(first_img);

            });
        });
    }
});
