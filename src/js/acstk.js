/*!
 * ACSTK v4
 *
 */
console.log('product submit test')
const ACSTK = {
    common: {
        init: function () {
            //console.log('main.js - Common')
            $('body').addClass('jquery-loaded')

            fitvids();

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
                        console.log('radio click')
                        e.preventDefault();
                        const state = control.attr('data-state');
                        if (state == 'on'){
                            console.log('this control is already on')
                            //return;
                        }
                        // toggle state of this controller
                            ACSTK.fn.actStateToggleSelect(control, state);
                        // toggle state of this container
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



                    if(state == 'on'){
                        $('body').addClass('has-' + containerId + '-off')
                        $('body').removeClass('has-' + containerId + '-on')
                    }else{
                        $('body').addClass('has-' + containerId + '-on')
                        $('body').removeClass('has-' + containerId + '-off')
                    }

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

            /*
            Video BG
             */

            var selectors$24 = {
                buttons: '.slideshow__buttons',
                button: '.slideshow__button',
                pauseButton: '[data-pause-button]',
                label: '.slideshow__button-label',
                cta: '.slideshow__button-cta--desktop',
                ctaText: '.slideshow__heading-cta-text',
                slide: '.slideshow__slide',
                slideshow: '.slideshow',
                video: '.slideshow__video'
            };

            var classes$22 = {
                centredCta: 'slideshow--center-cta',
                buttonActive: 'slideshow__button--active',
                headingCtaActive: 'slideshow__heading-cta-text--active',
                headingCtaTransitioning: 'slideshow__heading-cta-text--transitioning',
                linkActive: 'slideshow__button--link',
                slideActive: 'slideshow__slide--active',
                slideActiveTransitioning: 'slideshow__slide--transitioning',
                videoLoaded: 'slideshow__video--loaded',
                videoPaused: 'slideshow__video--paused',
                paused: 'is-paused'
            };

            var promiseYoutubeAPI;

            var youtube = {
                promiseAPI: function() {
                    if (!promiseYoutubeAPI) {
                        var tag = document.createElement('script');

                        tag.src = 'https://www.youtube.com/iframe_api';
                        var firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                        promiseYoutubeAPI = $.Deferred(function(defer) {
                            window.onYouTubeIframeAPIReady = defer.resolve;

                            setTimeout(function() {
                                defer.reject('Request for YouTube API timed out after 30 seconds.');
                            }, 30000);
                        });
                    }

                    return promiseYoutubeAPI;
                },

                promisePlayer: function(id, options) {
                    return this.promiseAPI().then(function() {
                        return $.Deferred(function(defer) {
                            if (typeof window.YT === 'undefined') {
                                defer.reject(
                                    "We're sorry, something went wrong. The YouTube API has not loaded correctly."
                                );
                            }

                            /* eslint-disable no-undef */
                            console.log("YT ID");
                            console.log(id);
                            console.log("YT OPT");
                            console.log(options);
                            var player = new YT.Player(id, options); // global YT variable injected by YouTube API

                            console.log("YT player");
                            console.log(player);

                            player.addEventListener('onReady', function() {
                                defer.resolve(player);
                            });

                            setTimeout(function() {
                                defer.reject(
                                    'Request for YouTube player has timed out after 30 seconds.'
                                );
                            }, 30000);


                            $(document).on('click', selectors$24.pauseButton, function () {
                                console.log('Pause click player.pauseVideo():Void')

                                var isPaused = $(this).hasClass(classes$22.paused);

                                $(this).toggleClass(classes$22.paused, !isPaused).attr({
                                    'aria-label': isPaused
                                        ? $(this).data('label-pause')
                                        : $(this).data('label-play'),
                                    'aria-pressed': !isPaused
                                });

                                if (isPaused) {
                                    player.playVideo();
                                } else {
                                    player.pauseVideo();
                                }

                                $(this).closest('li').toggleClass(classes$22.videoPaused);
                            })
                        });
                    });
                }
            };

            var $video = $(selectors$24.video);
            var $videoParant = $video.parent();

            // Create a media condition that targets viewports at least 768px wide
            const mediaQuery = window.matchMedia('(min-width: 440px)')
// Check if the media query is true
            if (mediaQuery.matches) {
                // Then trigger an alert
                console.log('Media Query Matched!');


                if ($video.length) {

                    var blockId = $video.attr('data-block-id');
                    var videoId = $video.attr('data-video-id');

                    youtube
                        .promisePlayer($video[0], {
                            videoId: videoId,
                            ratio: 16 / 9,
                            playerVars: {
                                // eslint-disable-next-line camelcase
                                iv_load_policy: 3,
                                modestbranding: 1,
                                autoplay: 1,
                                controls: 0,
                                showinfo: 0,
                                wmode: 'opaque',
                                branding: 0,
                                autohide: 0,
                                rel: 0,
                                'playsinline': 1,
                            },
                            events: {
                                'onReady': onPlayerReady,
                                onStateChange: onPlayerStateChange
                            }
                        })
                        .then(function () {
                            $videoParant.addClass(classes$22.videoLoaded)
                        })

                    function onPlayerReady(event) {

                        event.target.mute();

                        setTimeout(function () {
                            event.target.playVideo();
                        }, 0);
                    }

                    function onPlayerStateChange(event) {

                        if (event.data === 0) {
                            event.target.seekTo(0);
                        }
                    }
                } else {
                    console.log('no video found');
                }
            }


            /*
            End Video BG
             */



            var $grid
            $grid = $('.l-thumb-list__list--blog').isotope({
                itemSelector: '.l-thumb-list__item--blog',
                percentPosition: true,
                layoutMode: 'packery',
                packery: {
                    gutter: 48
                }
            });


            const acsSlider= document.querySelectorAll('[data-acs-flickity]');
            console.log(acsSlider)


            if(acsSlider != null){

                for (let i = 0; i < acsSlider.length; i++) {
                    console.log(acsSlider[i])

                    let flktyGallery = new Flickity(acsSlider[i], {
                        // options
                        cellAlign: 'left',
                        contain: true,
                        pageDots: false,
                    });


                    $(document).on('click', '[data-thumbnail-id]', function (e, el) {
                        e.preventDefault();
                        var imageId = $(this).attr('data-thumbnail-id');
                        console.log($(this).attr('data-thumbnail-id'));
                        flktyGallery.selectCell('.is-id-' + imageId);
                    });

                    $(document).on('opened', '.remodal', function () {
                        flktyGallery.resize()
                    });

                    let flktyThumb = new Flickity('[data-acs-flickity-thumb]', {
                        cellAlign: 'left',
                        contain: true,
                        pageDots: false,
                        prevNextButtons: false,  // Disable prev/next buttons if you want
                        asNavFor: '[data-acs-flickity]',  // Link to the main gallery
                    });



                }
            }

            /*
            Cart remove item
             */

            $(document).on('click', '.c-btn--cart-remove', function (e) {
                e.preventDefault();
                let item = $(this).closest(".c-item-thumb--quick-cart");
                let variantId = item.attr('data-item-id');
                let itemQty = item.find(".c-item-thumb__qty").attr('data-item-qty');

                let itemData = {
                    quantity: itemQty - 1,
                    id : variantId
                }

                console.log(itemData);

                $.ajax({
                    type: 'POST',
                    url: '/cart/change.json',
                    data: itemData,
                    dataType: 'json',
                    beforeSend: function( xhr ) {
                        //submitText.text("Adding to Cart...");
                    },
                    success: function(data) {
                        // Product successfully added to cart

                        $.ajax({
                            type: 'GET',
                            url: window.location.pathname,
                            async: false,
                            cache: false,
                            dataType: 'html',
                            success: function(data) {
                                var ajaxForm = $(data).find('form.c-cart__form').html();
                                $('form.c-cart__form').html(ajaxForm);
                                // $('#ajaxCartOffPageContainer').attr('data-state', 'on');
                                // setTimeout(function () {
                                //     $('#ajaxCartOffPageContainer').attr('data-state', 'off');
                                // },3000)
                            }
                        });
                    },
                    error: function() {
                        // Failed to add product
                        alert('Could not add product to cart.');

                    },

                });
            })

        }
    },
    collection: {
        init: function () {
            console.log('main.js - Collection')

            //console.log('main.js - Product')
            let wrapperClass = '.c-product-gallery__wrapper';
            let controlClass = '.c-product-gallery__link--thumb'
            ACSTK.fn.actGallery(wrapperClass, controlClass);

            ACSTK.fn.actUpdateVariant();
        }
    },
    page: {
        init: function () {
            //console.log('main.js - Page')
        }
    },
    product: {
        init: function () {

            console.log('enable add btn');
            var addButton = document.getElementById('add-to-cart-button');
            var variantsContainer = document.getElementById('size-options-container');

            addButton.disabled = false; // Enable the Add to Cart button once the page is fully loaded
            variantsContainer.classList.remove('disabled'); // Remove 'disabled' class from the variants container
            console.log('PRODUCT OCT 2023');



            let productDescription = $("[data-container=tab-description] .c-tabbed-content__content");
            let childElements = productDescription.children();

            if (childElements.length > 7) {
                // Wrap the extra children in a container div and hide it
                childElements.slice(7).wrapAll('<div class="hidden-content"></div>');
                $('.hidden-content').hide();

                // Add a "Read More" link after the 7th child
                productDescription.append('<a href="#" class="toggle-content">Read More</a>');

                // Handle the "Read More" / "Close" click event
                $('.toggle-content').click(function (e) {
                    e.preventDefault();
                    $('.hidden-content').toggle();

                    // Change the button text based on visibility
                    if ($('.hidden-content').is(':visible')) {
                        $(this).text('Close');
                    } else {
                        $(this).text('Read More');
                    }
                });
            }

            let $questionBtn = $('.stamped-summary-actions-newquestion')

            $questionBtn.addClass('ac-some-btn-class')

            let faqHref = $('.c-nav-menu__list--mobile-2 a:first-of-type').attr('href')
            $questionBtn.after('<a class="ac-faq-btn">Read our FAQs</a>')
            $('.ac-faq-btn').attr('href', faqHref)

            let testReviews = "Test reviews btn"


            let wrapperClass = '.c-product-gallery__wrapper';
            let controlClass = '.c-product-gallery__link--thumb'
            //ACSTK.fn.actGallery(wrapperClass, controlClass);

            ACSTK.fn.actUpdateVariant();

            let $options = $('[data-multi-options] select');
            let variantHandle = '';
            let $selectorTarget = $('[name=id]');
            let $btnSubmit = $('[data-submit-button]')
            let $textSubmit = $('[data-submit-button-text]')

            if($options.length > 0 ) {

                $.each($options, function () {
                    variantHandle = variantHandle + $(this).val().toLowerCase();
                });

                $selectorTarget.find('[data-variant-handle=' + variantHandle + ']').prop('selected', true);

                $(document).on('change', $options, function () {
                    $options = $('[data-multi-options] select');
                    let variantHandle = '';
                    $.each($options, function () {
                        variantHandle = variantHandle + $(this).val().toLowerCase();
                    });
                    var $optionTarget = $selectorTarget.find('[data-variant-handle=' + variantHandle + ']')
                    $selectorTarget.find('[data-variant-handle=' + variantHandle + ']').prop('selected', true);
                    console.log(variantHandle);
                    console.log($optionTarget.length);

                    if ($optionTarget.length < 1) {
                        console.log('soldout');
                        $btnSubmit.prop('disabled', true);
                        $textSubmit.text('SOLD OUT')

                    } else {
                        $btnSubmit.prop('disabled', false)
                        console.log('instock')
                        $textSubmit.text('ADD TO CART')
                    }

                });
            }
            console.log('length '+$('[data-submit-ajax]').length);

                $('[data-submit-ajax]').on('submit', function(e) {
                    console.log('submited')
                    e.preventDefault();

                    var selectVariantId = $(this).find('select[name=id]').val();

                    var hiddenVariantId = $(this).find('input[type=hidden][name=id]').val();

                    var variantId = (selectVariantId) ? selectVariantId : hiddenVariantId;
                    var quantity = 1;
                    var submitBtn = $('[data-submit-button]')
                    var submitText = $('[data-submit-button-text]')
                    submitText.addClass("some-class")
                    //submitText.text("Adding to Cart")
                    console.log("hiddenVariantId")
                    console.log(hiddenVariantId)
                    console.log("selectVariantId")
                    console.log(selectVariantId)
                    console.log("variantId")
                    console.log(variantId)
                    $.ajax({
                        type: 'POST',
                        url: '/cart/add.json',
                        data: {
                            quantity: quantity,
                            id: variantId
                        },
                        dataType: 'json',
                        beforeSend: function( xhr ) {
                            submitText.text("Adding to Cart...");
                        },
                        success: function(data) {
                            // Product successfully added to cart
                            $.ajax({
                                type: 'GET',
                                url: '/cart.js',
                                async: false,
                                cache: false,
                                dataType: 'json',
                                success: function(data) {

                                    $('[data-cart-count] .c-cart-count').text(data.item_count)
                                    submitText.text("Added to Cart \u2713");

                                    setTimeout(function () {
                                        submitText.text("Add to Cart");
                                    },5500)
                                }
                            });
                            $.ajax({
                                type: 'GET',
                                url: window.location.pathname,
                                async: false,
                                cache: false,
                                dataType: 'html',
                                success: function(data) {
                                    var ajaxForm = $(data).find('form.c-cart__form').html();
                                    $('form.c-cart__form').html(ajaxForm);
                                    $('#ajaxCartOffPageContainer').attr('data-state', 'on');
                                    setTimeout(function () {
                                        $('#ajaxCartOffPageContainer').attr('data-state', 'off');
                                    },3000)

                                }
                            });
                        },
                        error: function() {
                            // Failed to add product
                            alert('Could not add product to cart.');

                        },

                    });
                });



            /*
Open Modal size guide with url hash and load ajax page
*/

            let urlHash = window.location.hash.substring(1);

            console.log(urlHash);

            if (urlHash == 'modalSizeGuide'){
                let remodalId = '[data-remodal-id='+urlHash+']'
                let $remodal = $(remodalId);
                console.log("$remodal length");
                console.log($remodal.length);
                if ($remodal.length > 0) {

                    let $target = $remodal;
                    let inst = $remodal.remodal();
                    let $clicker = $('[data-remodal-ajax]')
                    let ajaxUrl = $clicker.attr('data-ajax-id')
                    inst.open();

                    $remodal.addClass('is-ajax-loading')

                    $.ajax({
                        url: ajaxUrl,
                        data: {ajax: 1}
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function (data, textStatus, jqXHR) {
                        console.log('ajax is loaded')

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();
                        fitvids();

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('ajax NOT loaded')
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function (dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();

                    });
                }

            }else{
                console.log("no urlHash");
                console.log(urlHash);
            }

            /*
           END Open Modal
            */


            /*
            Ajax load size guid on mouse event
            */
            $(document).on('mouseenter', '[data-remodal-ajax]:not(.is-ajax-loading,.is-ajax-loaded,.is-ajax-failed)', function () {



                $(this).addClass('is-ajax-loading')
                console.log(this);
                console.log('mouse over remodal control')
                let $clicker = $(this);
                let targetId = $clicker.attr('data-remodal-target')
                let $target = $('[data-remodal-id=' + targetId )
                let ajaxUrl = $(this).attr('data-ajax-id')



                console.log('$target')
                console.log($target)


                $.ajax({
                    url: ajaxUrl,
                    data: {ajax:1},
                    // data: JSON.stringify({var:'val'}), // send data in the request body
                    // contentType: "application/json; charset=utf-8",  // if sending in the request body
                }).done(function(data, textStatus, jqXHR) {

                    let response = $('<div />').html(data);
                    // because dataType is json 'data' is guaranteed to be an object

                    $clicker.addClass('is-ajax-loaded');
                    $clicker.removeClass('is-ajax-loading');

                    let temp = $(data);
                    temp.find('.c-size-guide-table').remove()

                    let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                    $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                    $('[data-ajax-content] .rte', $target).after(contentTable);

                    $target.addClass('is-ajax-loaded');
                    $target.find('.c-size-guide__loading').remove();

                    fitvids();

                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $clicker.addClass('is-ajax-failed');
                    $clicker.removeClass('is-ajax-loading');
                    $target.addClass('is-ajax-failed')
                    let content = '<p>No size guide found</p>';
                    $('[data-ajax-content]', $target).html(content)
                }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                    console.log('always');
                    fitvids();
                });
            });

            /*
           END Ajax load
           */

            $(document).on('mouseenter', '[data-remodal-ajax-bundle]:not(.is-ajax-loading,.is-ajax-loaded,.is-ajax-failed)', function () {

                $(this).addClass('is-ajax-loading')
                console.log(this);
                console.log('mouse over remodal control')
                let $clicker = $(this);
                let targetId = $clicker.attr('data-remodal-target')
                let $target = $('[data-remodal-id=' + targetId )
                let ajaxUrl = $(this).data('ajax-id')

                $target.addClass('is-size-guide-bundle')



                console.log('$target')
                console.log($target)
                console.log('ajaxUrl')
                console.log(ajaxUrl[0])



                $.when(
                    $.ajax({
                        url: ajaxUrl[0],
                        data: {ajax:1},
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function(data, textStatus, jqXHR) {

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte:last', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();

                        fitvids();

                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();
                    })
                ).then(
                    $.ajax({
                        url: ajaxUrl[1],
                        data: {ajax:1},
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function(data, textStatus, jqXHR) {

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte:last', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();

                        fitvids();

                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();
                    })
                )

            });

        }

    },
    cart:{
        init: function () {
            console.log('main.js - CART');

            /*
            Open Modal size guide with url hash and load ajax page
            */

            let urlHash = window.location.hash.substring(1);

            console.log(urlHash);

            if (urlHash == 'modalSizeGuide'){
                let remodalId = '[data-remodal-id='+urlHash+']'
                let $remodal = $(remodalId);
                console.log("$remodal length");
                console.log($remodal.length);
                if ($remodal.length > 0) {

                    let $target = $remodal;
                    let inst = $remodal.remodal();
                    let $clicker = $('[data-remodal-ajax]')
                    let ajaxUrl = $clicker.attr('data-ajax-id')
                    inst.open();

                    $remodal.addClass('is-ajax-loading')

                    $.ajax({
                        url: ajaxUrl,
                        data: {ajax: 1}
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function (data, textStatus, jqXHR) {
                        console.log('ajax is loaded')

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();
                        fitvids();

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('ajax NOT loaded')
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function (dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();

                    });
                }

            }else{
                console.log("no urlHash");
                console.log(urlHash);
            }

            /*
           END Open Modal
            */


            /*
            Ajax load size guid on mouse event
            */
            $(document).on('mouseenter', '[data-remodal-ajax]:not(.is-ajax-loading,.is-ajax-loaded,.is-ajax-failed)', function () {

                // console.log('Remove old classes')
                // $('.is-ajax-loading,.is-ajax-loaded,.is-ajax-failed').removeClass('is-ajax-loading is-ajax-loaded is-ajax-failed');

                $(this).addClass('is-ajax-loading')
                console.log(this);
                console.log('mouse over remodal control')
                let $clicker = $(this);
                let targetId = $clicker.attr('data-remodal-target')
                let $target = $('[data-remodal-id=' + targetId )
                let ajaxUrl = $(this).attr('data-ajax-id')



                console.log('$target')
                console.log($target)


                $.ajax({
                    url: ajaxUrl,
                    data: {ajax:1},
                    // data: JSON.stringify({var:'val'}), // send data in the request body
                    // contentType: "application/json; charset=utf-8",  // if sending in the request body
                }).done(function(data, textStatus, jqXHR) {

                    let response = $('<div />').html(data);
                    // because dataType is json 'data' is guaranteed to be an object

                    $clicker.addClass('is-ajax-loaded');
                    $clicker.removeClass('is-ajax-loading');

                    let temp = $(data);
                    temp.find('.c-size-guide-table').remove()

                    let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                    $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                    $('[data-ajax-content] .rte', $target).after(contentTable);

                    $target.addClass('is-ajax-loaded');
                    $target.find('.c-size-guide__loading').remove();

                    fitvids();

                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $clicker.addClass('is-ajax-failed');
                    $clicker.removeClass('is-ajax-loading');
                    $target.addClass('is-ajax-failed')
                    let content = '<p>No size guide found</p>';
                    $('[data-ajax-content]', $target).html(content)
                }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                    console.log('always');
                    fitvids();
                });
            });

            /*
           END Ajax load
           */

            $(document).on('mouseenter', '[data-remodal-ajax-bundle]:not(.is-ajax-loading,.is-ajax-loaded,.is-ajax-failed)', function () {

                $(this).addClass('is-ajax-loading')
                console.log(this);
                console.log('mouse over remodal control')
                let $clicker = $(this);
                let targetId = $clicker.attr('data-remodal-target')
                let $target = $('[data-remodal-id=' + targetId )
                let ajaxUrl = $(this).data('ajax-id')

                $target.addClass('is-size-guide-bundle')



                console.log('$target')
                console.log($target)
                console.log('ajaxUrl')
                console.log(ajaxUrl[0])



                $.when(
                    $.ajax({
                        url: ajaxUrl[0],
                        data: {ajax:1},
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function(data, textStatus, jqXHR) {

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte:last', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();

                        fitvids();

                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();
                    })
                ).then(
                    $.ajax({
                        url: ajaxUrl[1],
                        data: {ajax:1},
                        // data: JSON.stringify({var:'val'}), // send data in the request body
                        // contentType: "application/json; charset=utf-8",  // if sending in the request body
                    }).done(function(data, textStatus, jqXHR) {

                        let response = $('<div />').html(data);
                        // because dataType is json 'data' is guaranteed to be an object

                        $clicker.addClass('is-ajax-loaded');
                        $clicker.removeClass('is-ajax-loading');

                        let temp = $(data);
                        temp.find('.c-size-guide-table').remove()

                        let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                        $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                        $('[data-ajax-content] .rte:last', $target).after(contentTable);

                        $target.addClass('is-ajax-loaded');
                        $target.find('.c-size-guide__loading').remove();

                        fitvids();

                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        $clicker.addClass('is-ajax-failed');
                        $clicker.removeClass('is-ajax-loading');
                        $target.addClass('is-ajax-failed')
                        let content = '<p>No size guide found</p>';
                        $('[data-ajax-content]', $target).html(content)
                    }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                        console.log('always');
                        fitvids();
                    })
                )

            });

        }
    },
    fn: {
        actStateToggleSelect : function (element, state) {
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
                    //console.log('compfail');
                    //console.log($(this).attr('data-state'));
                }
            })

        },
        actGallery : function (wrapperClass, controlClass){

            $('[data-gallery-image]:first-child '+ wrapperClass ).removeClass('u-hidden');
            $(document).on('click', controlClass , function (e) {
                e.preventDefault()

                let galleryThumb = $(this);
                let thumbId = galleryThumb.attr('data-thumbnail-id');
                let galleryImage = $(wrapperClass + '[data-image-id=' + thumbId + ']')

                $(wrapperClass).addClass('u-hidden').queue(function(next){
                    galleryImage.removeClass('u-hidden');
                    next();
                })

            })

        },
        actUpdateVariant : function(){

            let selectorProductForm =  ACSTK.setting.selector.productForm;
            let selectorControl = ACSTK.setting.selector.variantControl;
            let selectorTarget = ACSTK.setting.selector.variantInput

            $(document).on('click',   selectorProductForm + ' ' + selectorControl , function () {

                let $this = $(this);
                let variantId = $(this).attr('data-variant-id')
                let $parentForm = $(this).parents('form');
                let $variantIdInput = $(selectorTarget , $parentForm)
                let disabled = $(this).attr('disabled')
                let $btnSubmit = $('[data-submit-button]', $parentForm)
                let $textSubmit = $('[data-submit-button-text]' ,$parentForm)
                let $oosBtn = $('.klaviyo-bis-trigger')

                //Update selected classes
                $('[data-variant-id]', $parentForm).removeClass('is-selected').queue(function (next) {
                    $this.addClass('is-selected');
                    next();
                });

                console.log(disabled);


                if(disabled == 'disabled'){
                    console.log('disabled')
                    $btnSubmit.prop('disabled', true);
                    $textSubmit.text('SOLD OUT')
                    console.log("$oosBtn")
                    console.log($oosBtn)
                    $oosBtn.css('display', 'block')
                    $oosBtn.attr('data-variant-id', variantId)
                }else{
                    console.log('enabled')
                    $btnSubmit.prop('disabled', false);
                    $textSubmit.text('ADD TO CART')
                    console.log("$oosBtn")
                    console.log($oosBtn)
                    $oosBtn.css('display', 'none')
                    $oosBtn.attr('data-variant-id', variantId)
                }

                //Update form input
                $variantIdInput.val(variantId);
            })
        }
    },
    setting: {
        selector:{
            productForm : '[data-product-form]',
            variantControl : '[data-variant-id]',
            variantInput : '[name=id]'
        }
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
