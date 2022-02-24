/*!
 * ACSTK v4
 *
 */
console.log('youtube test video bg')
const ACSTK = {
    common: {
        init: function () {
            //console.log('main.js - Common')
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
                        if (state == 'on'){
                            console.log('this control is already on')
                            return;
                        }
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
                        });
                    });
                }
            };

            var $video = $(selectors$24.video);
            var $videoParant = $video.parent();


            if($video.length){

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
                    .then(function(){
                    $videoParant.addClass(classes$22.videoLoaded)
                })

                function onPlayerReady(event) {

                    event.target.mute();

                    setTimeout(function() {
                        event.target.playVideo();
                    }, 0);
                }
                function onPlayerStateChange(event) {

                    if (event.data === 0) {
                        event.target.seekTo(0);
                    }
                }
            }else{
                console.log('no video found');
            }


            /*
            End Video BG
             */

            $(document).on('mouseover', '[data-remodal-ajax]:not(.is-ajax-loaded,.is-ajax-failed)', function () {

                console.log('mouse over remodal control')
                let $clicker = $(this);
                let targetId = $clicker.attr('data-remodal-target')
                let $target = $('[data-remodal-id=' + targetId )
                let ajaxUrl = $(this).attr('data-ajax-id')

                let sizeGuideId = "knee"
                $.ajax({
                    url: ajaxUrl,
                    data: {ajax:1},
                    // data: JSON.stringify({var:'val'}), // send data in the request body
                    // contentType: "application/json; charset=utf-8",  // if sending in the request body
                }).done(function(data, textStatus, jqXHR) {
                    let response = $('<div />').html(data);
                    // because dataType is json 'data' is guaranteed to be an object

                    $clicker.addClass('is-ajax-loaded');

                    let temp = $(data);
                    temp.find('.c-size-guide-table').remove()

                    let contentTable = response.find('[data-ajax-content] .c-size-guide-table');

                    $('[data-ajax-content]', $target).append(temp.find('[data-ajax-content]').children());
                    $('[data-ajax-content] .rte', $target).after(contentTable);

                    $target.addClass('is-ajax-loaded');
                    $target.find('.c-size-guide__loading').remove();

                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $clicker.addClass('is-ajax-failed');
                    $target.addClass('is-ajax-failed')
                    let content = '<p>No size guide found</p>';
                    $('[data-ajax-content]', $target).html(content)
                }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
                    console.log('always');
                });



            });

            var $grid
            $grid = $('.l-thumb-list__list--blog').isotope({
                itemSelector: '.l-thumb-list__item--blog',
                percentPosition: true,
                layoutMode: 'packery',
                packery: {
                    gutter: 48
                }
            });
        }
    },
    collection: {
        init: function () {
            //console.log('main.js - Collection')

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

            console.log('main.js - Product')

            let wrapperClass = '.c-product-gallery__wrapper';
            let controlClass = '.c-product-gallery__link--thumb'
            ACSTK.fn.actGallery(wrapperClass, controlClass);

            ACSTK.fn.actUpdateVariant();

            // $(document).on('click', '[data-product-form] [data-variant-id]', function () {
            //     let $this = $(this);
            //     let variantId = $(this).attr('data-variant-id')
            //     let $parentForm = $(this).parents('form');
            //     let $variantIdInput = $('[name=id]', $parentForm)
            //
            //     //Update selected classes
            //     $('[data-variant-id]', $parentForm).removeClass('is-selected').queue(function (next) {
            //         $this.addClass('is-selected');
            //         next();
            //     });
            //
            //     //Update form input
            //     $variantIdInput.val(variantId);
            // })
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

                //Update selected classes
                $('[data-variant-id]', $parentForm).removeClass('is-selected').queue(function (next) {
                    $this.addClass('is-selected');
                    next();
                });

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
