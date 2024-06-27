/*!
 * ACSTK v4
 *
 */
console.log('cart min qants 2024 123')
const ACSTK = {
    common: {
        init: function () {
            console.log('main.js - Common')
            $('body').addClass('jquery-loaded')

            // scroll top
            $("a[href='#top']").click(function() {
                $('html, body').animate({ scrollTop: 0 }, 1000 );
                return false;
            });

            /*
            Radio toggle controls
            */
            //get all the radio control Ids
            let aRadioIds = [];
            $('[data-control-radio]').each(function(){
                let radioId = $(this).attr('data-control-radio');
                aRadioIds.indexOf(radioId) === -1 ? aRadioIds.push(radioId) : '';
            });

            $.each(aRadioIds, function(i) {
                let currentRadioId = aRadioIds[i];
                let controls = $('[data-control-radio=' + currentRadioId + '][data-control]');
                let containers = $('[data-container-radio=' + currentRadioId + '][data-container]');

                $.each(controls, function(i) {
                    const containerId = $(this).attr('data-control');
                    const containerSelector = (containerId != '' )? '[data-container='+ containerId + ']' : '[data-container]';
                    const container = $(containerSelector);
                    const control = $(this);
                    $(this).on('click', function(e) {
                        e.preventDefault();
                        const state = control.attr('data-state');
                        // toggele state of this controller
                        ACSTK.fn.actStateToggleSelect(control, state);
                        // toggele state of this container
                        ACSTK.fn.actStateToggleSelect(container, state);
                        // toggle off all other container
                        containers.not(container).each(function() {
                            ACSTK.fn.actStateToggleSelect($(this), 'on');
                        });
                        // toggle off all other controllers
                        controls.not(control).each(function() {
                            ACSTK.fn.actStateToggleSelect($(this), 'on');
                        });
                    });
                });
            });

            $('[data-control]:not([data-control-radio])').each(function() {
                console.log("data-control");
                const containerId = $(this).attr('data-control');
                const controlSelector = (containerId != '' )? '[data-control='+ containerId + ']' : this;
                const control = $(controlSelector);
                const controlGroupId = control.attr('data-state-group');
                const containerSelector = (containerId != '' )? '[data-container='+ containerId + ']' : '[data-container]';
                const container = $(containerSelector);

                control.off('click');

                control.on('click',  function (e) {
                    console.log('clickered');
                    const state = control.attr('data-state');
                    e.preventDefault();
                    ACSTK.fn.actStateToggleSelect(control, state);

                    if (controlGroupId){
                        console.log('clickered group');
                        ACSTK.fn.actStateToggleGroup(control, controlGroupId, state);
                        ACSTK.fn.actStateToggleSelect(container, state);

                    }else{
                        console.log('clickered not group');
                        ACSTK.fn.actStateToggleSelect(container, state);
                    }
                });

            });

            var newVisitor = false;
            var repeatVisitor = Cookies.get("ac-repeat-visitor");
            var expiresSetting = $("#remodalPopupPromo").attr('data-expires');
            var expires = new Date(new Date().getTime() + expiresSetting * 60 * 60 * 24 * 1000);
            var expiresCookie = Cookies.get("ac-popup-expires");

            if(expiresCookie != expiresSetting){
                Cookies.set("ac-popup-expires", expiresSetting );
                expiresCookie = Cookies.get('ac-popup-expires');
                Cookies.set("ac-repeat-visitor", 1, { expires : expires  } )
            }

            console.log(expiresSetting);

            if (repeatVisitor != 1 ){
                newVisitor = true;
                Cookies.set("ac-repeat-visitor", 1, { expires : expires  } )
            }else{
                newVisitor = false;
            }

            if(newVisitor == true){
                $(function(){
                    var inst = $.remodal.lookup[$('[data-remodal-id=modal]').data('remodal')];
                    inst.open();
                })
            }

            //Flickity
            $('.hero__carousel').flickity({
                // options
                cellAlign: 'center',
                contain: true,
                autoPlay: 4000,
                imagesLoaded: true,
                wrapAround: true,
                adaptiveHeight: true
            });

            //Edit Address Cards
            // $('.customer-address__address-card').each(function () {
            //     var formId = $(this).data('form-id');
            //     //console.log('formId' + formId);
            //     //address button
            //     var showButton = $('.address-edit-toggle', this);
            //     var container = $(this);
            //     ACSHOPIFY.ac_fn.open(container, showButton);
            // })

            function refreshCart(cart) {
                var $cartBtn = $("[data-button-cart]");
                // console.log('$cartBtn');
                // console.log($cartBtn);
                // console.log('cart');
                // console.log(cart);
                if ($cartBtn) {
                    var $cartCount = $cartBtn.find('[data-cart-count]');
                    if(cart.item_count == 0) {

                    } else if ($cartCount.length) {
                        $cartCount.text(cart.item_count);
                    }
                }
            }

            $(document).on('click', '[data-close=continue-shopping-helper]' ,function (e) {
                e.preventDefault();
                $('.continue-shopping-helper').addClass('animated fadeOutRight');
                setTimeout(function(){
                    $('.continue-shopping-helper').hide().removeClass('fadeOutRight');
                }, 1000);

                //$('.continue-shopping-helper').unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            });

            $(".add-form__form").submit(function(e) {
                console.log('add click');
                e.preventDefault();
                var $addToCartForm = $(this);
                var $addToCartBtn = $addToCartForm.find('.add-form__submit-btn');

                $.ajax({
                    url: '/cart/add.js',
                    dataType: 'json',
                    type: 'post',
                    data: $addToCartForm.serialize(),
                    beforeSend: function() {
                        $addToCartBtn.attr('disabled', 'disabled').addClass('disabled');
                        //$addToCartBtn.find('span').text('Adding').removeClass("zoomIn").addClass('animated zoomOut');
                    },
                    success: function(itemData) {
                        //$addToCartBtn.find('span').text('Added to your Cart').removeClass('zoomOut').addClass('fadeIn');
                        // $addToCartForm.find('.add-form__submit-btn').show().addClass('animated fadeInLeft');
                        $addToCartForm.find('.continue-shopping-helper').show().addClass('animated fadeInDown');

                        window.setTimeout(function(){
                            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
                            $addToCartBtn.find('span').addClass("fadeOut").text($addToCartBtn.data('label')).removeClass('fadeIn').removeClass("fadeOut").addClass('zoomIn');
                        }, 2500);




                        $.getJSON("/cart.js", function(cart) {
                            refreshCart(cart);
                        });
                    },
                    error: function(XMLHttpRequest) {
                        var response = eval('(' + XMLHttpRequest.responseText + ')');
                        response = response.description;
                        // $('.warning').remove();

                        var warning = '<p>' + response.replace('All 1 ', 'All ') + '</p>';

                        // $('.continue-shopping-helper__notice').addClass(' warning animated bounceIn ');
                        $('.continue-shopping-helper__notice-content').html(warning);
                        $addToCartForm.find('.continue-shopping-helper').show();
                        $('.continue-shopping-helper__notice--added, .continue-shopping-helper__notice--warning').removeClass('continue-shopping-helper__notice--added animated bounceIn').addClass('continue-shopping-helper__notice--warning animated bounceIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $(this).removeClass('animated bounceIn');
                        });
                        $addToCartBtn.removeAttr('disabled').removeClass('disabled');
                        //$addToCartBtn.find('span').text({{ 'products.product.add_to_cart' | t | json }}).removeClass('zoomOut').addClass('zoomIn');
                    }
                });

                return false;
            });

            // Predictive search
            var $searchResults = $('#search-site-results');

            $('#Search').on('keyup',function() {
                var searchTerm = $(this).val();

                if ( searchTerm.length > 2 ) {
                    var data = {
                        'q': searchTerm,
                        'resources': {
                            'type': 'product',
                            'limit': 15,
                            'options': {
                              'unavailable_products': 'last',
                              'fields': 'title,product_type,variants.title'
                            }
                        }
                    };

                    $.ajax({
                        dataType: 'json',
                        url: '/search/suggest.json',
                        data: data,
                        success: function( response ) {
                            var productSuggestions = response.resources.results.products;

                            $searchResults.empty();

                            if ( productSuggestions.length === 0 ) {
                                // No results
                                var link = $('<div class="result-item no-results">No results were found.</div>');

                                $searchResults.append(link);

                            } else {
                                // If we have results.
                                $.each(productSuggestions, function(index, item) {
                                    console.log(item);
                                    var link = $('<a></a>').attr('href', item.url);
                                    link.append('<span class="thumbnail"><img src="' + item.image + '" /></span>');
                                    link.append('<div class="information"><div class="title">' + item.title + '</div><div class="vendor">' + item.vendor + '</div><div class="price">£' + item.price + '</div></div>');
                                    link.wrap('<div class="result-item"></div>');

                                    $searchResults.append(link.parent());
                                });

                                // The Ajax request will return at the most 10 results.
                                // If there are more than 10, let's link to the search results page.
                                if(response.resources.results.results_count > 10) {
                                    console.log("less than 10 results")
                                  $searchResults.append('<li><span class="title"><a href="' + searchURL + '">See all results (' + response.resources.results.results_count + ')</a></span></li>');
                                }else{
                                    console.log("less than 10 results")
                                }
                            }

                            $searchResults.fadeIn(200);
                        }
                    });

                } else {
                    $searchResults.hide();
                }
            });

            // Hide the predictive search results container if clicked outside

            $(document).on('click', function( event ) {
                var $target = $(event.target);

                if ( !$target.closest('#search-site-results').length && !$target.closest('#Search').length && $searchResults.is(':visible') ) {
                    $searchResults.empty();
                    $searchResults.hide();
                }
            });

            /*
           Ajax load size guid on mouse event
           */
            $(document).on('opening', '[data-remodal-id="modalProductVideo"]', function () {
                console.log('some Modal is opening');



               let $iframe = $('[data-remodal-id="modalProductVideo"]').find('iframe')

                $iframe.attr('src', $iframe.attr('data-src'))
                fitvids();



            });

            $(document).on('closing', '[data-remodal-id="modalProductVideo"]', function () {
                console.log('some Modal is opening');



                let $iframe = $('[data-remodal-id="modalProductVideo"]').find('iframe')

                $iframe.attr('src', '')



            });

            /*
           END Ajax load
           */

        }

    },
    collection: {
        init: function () {
            console.log('main.js - Collection')

            var currentUrlPath = $('body').attr('data-url-path');
            Cookies.set('lastCollectionPath', currentUrlPath,  { expires: 1 })

            //hover animation
            $(document).on('mouseenter', '.product-thumb.is-available-sold-out', function (event) {
                //console.log($(this));
                $(this).find('[data-hover-animation]').addClass(' animated fadeInUp ')
            })

            //hover over the reminder
            $(document).on('mouseenter', '[data-get-reminder]', function(event){
                console.log('hovered')
                var productUrl = $(this).parent().attr('href');
                console.log(productUrl);
                $(this).parent().removeAttr("href");
                $(this).parent().attr("data-href", productUrl);
                //$(this).parent().attr('href');
            });


            $(document).on('mouseleave', '[data-get-reminder]', function(event){
                console.log('Leave it out')
                var productUrl = $(this).parent().attr('data-href');
                //$(this).parent().removeAttr("href");
                $(this).parent().attr("href", productUrl);
            });

            $(document).on('click', '[data-get-reminder]', function(event){
                var productUrl = $(this).attr('data-get-reminder');
                Cookies.set('openStockReminder', 'true', {expires: 1});
                console.log('reminder click')
                window.location = productUrl

            });

            $(document).on('click', '.filter-menu h4', function(e){
                $(this).closest('.filter-group').not('.has_group_selected, .refine-header').toggleClass('expanded').find('ul,.filter-clear').toggle('fast');
                e.preventDefault();
            });

            /* Expand first non-selected group on page load */
            $('.filter-group').not('.has_group_selected, .refine-header').first().addClass('expanded').find('ul,.filter-clear').toggle('fast');



        }
    },
    page: {
        init: function () {
            console.log('main.js - Page')
        }
    },
    product: {
        init: function () {
            console.log('main.js - Product test gallery')

            //$('.c-product-gallery__focus-image:first-child .c-product-gallery__wrapper').removeClass('u-hidden');
            $(document).on('click', '.c-product-gallery__link--thumb', function (e) {
                console.log('Thumb click');
                e.preventDefault()

                let galleryThumb = $(this);
                let thumbId = galleryThumb.attr('data-thumbnail-id');
                let $realOption = $('option[data-image-id=' + thumbId + ']');
                let variantName = $realOption.attr('data-option-name');
                let $variantSelect = $('[data-single-option-selector]')

                $variantSelect.val(variantName).change();

                console.log('variant update')
                console.log("$realOption")
                console.log($realOption)
                console.log('variantName')
                console.log(variantName)
                console.log("$variantSelectedOption")
                console.log($variantSelectedOption)


                let galleryImage = $('.c-product-gallery__wrapper[data-image-id=' + thumbId + ']')



                $('.c-product-gallery__wrapper').addClass('u-hidden').queue(function(next){
                    galleryImage.removeClass('u-hidden');
                    next();
                })

            });

            $(document).on('change', '[data-single-option-selector]', function (e) {

                let $optionSelected = $("option:selected", this);
                let valueSelected = this.value;
                let $realOption = $('[data-option-name="' + valueSelected + '"]')
                let variantImageId = $realOption.attr('data-image-id')

                let galleryImage = $('.c-product-gallery__wrapper[data-image-id=' + variantImageId + ']')

                $('.c-product-gallery__wrapper').addClass('u-hidden').queue(function(next){
                    console.log('galleryImage 123')
                    console.log('.c-product-gallery__wrapper[data-image-id=' + variantImageId + ']')
                    galleryImage.removeClass('u-hidden');
                    next();
                })

            })

            // Trigger the change event on the variant select when clicking on the thumbnail (to update the variant image and details without page refresh)
            $('.product-gallery__item a').on('click', function(e) {
                var variantTitle = $(this).data('variant-title');
                var $variantSelect = $('.variant__input');

                if ($variantSelect.length) {
                    var $selectOption = $variantSelect.first().find('option[value="' + variantTitle + '"]');

                    if ($selectOption) {
                        $variantSelect.val(variantTitle).trigger('change');
                        e.preventDefault();
                    }
                }
            });
        }

    },
    cart: {
        init: function () {
            //uncomment to debug
            console.log('qty click');
            var lastCollectionPath = Cookies.get('lastCollectionPath');
            var lastProductPath = Cookies.get('lastProductPath');

            if (lastCollectionPath != 'undefined'){
                $('[data-continue-path]').attr('href', lastCollectionPath);
            }else if(lastProductPath != 'undefined'){
                $('[data-continue-path]').attr('href', lastProductPath);
            }else {
                $('[data-continue-path]').attr('href', '/');
            }

            //Min quantites
            let selectorInputQty = '.cart-table__qty-input';

            $(document).on('blur', selectorInputQty, function (e,el) {

               let $inputQty = $(this)
                let value = $inputQty.val();
               let min = $inputQty.attr('min')

                if (value < min){
                    $inputQty.val(min)
                }
            })
        }

    },
    fn: {
        actStateToggleSelect : function (element, state) {
            console.log('element');
            console.log(element);
            if('off' === state ){
                element.attr('data-state', 'on');
            }
            if('on' === state){
                element.attr('data-state', 'off');
            }
        },
        actStateToggleGroup : function (control, stateGroupId, state){
            $('[data-state-group='+stateGroupId+']').not(control).each(function(){
                if ('off' === $(this).attr('data-state') ) {
                    $(this).attr('data-state', 'on');
                } else if ('on' === $(this).attr('data-state') ) {
                    $(this).attr('data-state', 'off');
                } else{
                    console.log('compfail');
                    console.log($(this).attr('data-state'));
                }
            })

        },
    }
}

UTIL = {
    exec: function(template, handle) {
        const ns = ACSTK;
        handle = (handle === undefined) ? "init" : handle;

        if (template !== '' && ns[template] && typeof ns[template][handle] === 'function') {
            ns[template][handle]();
        }
    },
    init: function() {
        const body = document.body;
        const  template = body.getAttribute('data-template');
        const  handle = body.getAttribute('data-template-type');

        UTIL.exec('common');
        UTIL.exec(template);
        UTIL.exec(template, handle);
    }
};
$(window).on('load', UTIL.init);
