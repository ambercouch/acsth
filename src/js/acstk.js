/*!
 * ACSTK v4
 *
 */
console.log('uncomment to debug js from acstk')
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
                        Slideshow Desktop Extension
                        --------------------------------------------------------------------------------
                            Manages all the desktop behaviour of the home page slideshow


                        Events
                        ------------

                            Name: slideshow_desktop_init_start
                        Description: Fired before the desktop slideshow begins to initialize
                        Payload: none

                        Name: slideshow_desktop_init_done
                        Description: Fired when the desktop slideshow is done initializing
                        Payload: none

                        Name: slideshow_desktop_destroy
                        Description: Fired when the desktop slideshow is destroyed
                        Payload: none

                        Name: slideshow_set_slide
                        Description: Fired when the user selects a specific slide
                        Payload: { number } Index of the slide being displayed

                        Name: slideshow_previous_slide
                        Description: Fired when the user selects the previous slide
                        Payload: { number } Index of the slide being displayed

                        Name: slideshow_next_slide
                        Description: Fired when the user selects the next slide
                        Payload: { number } Index of the slide being displayed

                        Name: slideshow_video_load
                        Description: Fired when a video is being loaded in the slideshow
                        Payload: { object } Video player DOM object

                        Name: slideshow_video_loaded
                        Description: Fired when the video is done loading in the slideshow
                        Payload: { object } Video player DOM object

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

            var config = {
                // Intensity for desktop mouse over effect (if more than 3 slides)
                easeIntensity: 10
            };

            var slideshowDesktop = {
                initDesktopSlideshow: function() {
                    this.trigger('slideshow_desktop_init_start');

                    this.$slideshow = $(selectors$24.slideshow, this.$container);
                    this.$slide = $(selectors$24.slide, this.$container);
                    this.$buttons = $(selectors$24.buttons, this.$container);
                    this.$button = $(selectors$24.button, this.$container);

                    this.desktopSlideshow = true;
                    this.isAnimating = false;
                    this.currentDesktopSlide = 0;
                    this.totalSlides = this.$buttons.data('count');
                    this.players = [];
                    this.desktopSlideshowNamespace = '.desktopSlideshow';

                    this.on(
                        'mouseover' + this.desktopSlideshowNamespace,
                        this._onHoverSlideshow.bind(this)
                    );
                    this.on(
                        'mousemove' + this.desktopSlideshowNamespace,
                        this._mouseMoveButtons.bind(this)
                    );
                    this.on(
                        'mouseleave' + this.desktopSlideshowNamespace,
                        this._resetButtonsPosition.bind(this)
                    );
                    this.on(
                        'keydown' + this.desktopSlideshowNamespace,
                        this._onTabButtons.bind(this)
                    );
                    this.on(
                        'click' + this.desktopSlideshowNamespace,
                        selectors$24.pauseButton,
                        this._onPauseButton.bind(this)
                    );
                    this.on(
                        'click' + this.desktopSlideshowNamespace,
                        selectors$24.label,
                        this._onClickButton.bind(this)
                    );
                    this.on(
                        'keydown' + this.desktopSlideshowNamespace,
                        this._addKeyBindingsDesktop.bind(this)
                    );

                    this.window().on(
                        'resize' + this.desktopSlideshowNamespace,
                        this._setButtonWrapperValues.bind(this)
                    );

                    utils.promiseStylesheet().then(
                        function() {
                            this._setButtonWrapperValues();
                            this._setSlideDesktop(0);
                            if (this.$container.hasClass(classes$22.centredCta)) {
                                this._setButtonStatus(0);
                            }
                            this.trigger('slideshow_desktop_init_done');
                        }.bind(this)
                    );
                },

                destroyDesktopSlideshow: function() {
                    this.trigger('slideshow_desktop_destroy');

                    this.desktopSlideshow = false;
                    this.off(this.desktopSlideshowNamespace);
                    this.window().off(this.desktopSlideshowNamespace);

                    this._setButtonsTranslateX(0);

                    // Loop over every video slide that is found as part of this.players
                    // and explicitly call the YouTube and/or Vimeo destroy method
                    // depending on the type of video player.
                    for (var key in this.players) {
                        if (!this.players.hasOwnProperty(key)) return;

                        var player = this.players[key];

                        if (typeof player.destroy === 'function') {
                            player.destroy();
                        } else if (typeof player.unload === 'function') {
                            player.unload();
                        }
                    }

                    this.players = [];
                },

                _onHoverSlideshow: function() {
                    this._animateButtonFrame();
                },

                _mouseMoveButtons: function(evt) {
                    if (this.totalSlides <= 3) return;

                    this.mousePosition = evt.pageX - this.centerOfButtonsWrapper;

                    if (!this.isAnimating) {
                        this.isAnimating = true;
                        this._animateButtonFrame();
                    }
                },

                _resetButtonsPosition: function() {
                    this.mousePosition = 0;
                },

                _onTabButtons: function(evt) {
                    if (evt.which !== utils.keyboardKeys.TAB) return;

                    var $nextButton;

                    if (!evt.shiftKey) {
                        $nextButton = $(evt.target)
                            .closest(this.$button)
                            .next();
                    } else {
                        $nextButton = $(evt.target)
                            .closest(this.$button)
                            .prev();
                    }

                    if (!$nextButton.length) return;

                    var division = $(window).width() / this.totalSlides;
                    var buttonIndex = $nextButton.index();

                    this.mousePosition = division * buttonIndex - $nextButton.width();
                    this._animateButtonFrame();
                },

                _onPauseButton: function(evt) {
                    var $currentSlide = this.$slide.eq(this.currentDesktopSlide);
                    var $pauseButton = $(evt.target);
                    var isPaused = $pauseButton.hasClass(classes$22.paused);
                    var blockId = this.$video.attr('data-block-id');

                    $pauseButton.toggleClass(classes$22.paused, !isPaused).attr({
                        'aria-label': isPaused
                            ? $pauseButton.data('label-pause')
                            : $pauseButton.data('label-play'),
                        'aria-pressed': !isPaused
                    });

                    if (this.players[blockId]) {
                        if (isPaused) {
                            this.players[blockId].playVideo();
                        } else {
                            this.players[blockId].pauseVideo();
                        }
                    }
                    $currentSlide.toggleClass(classes$22.videoPaused);
                },

                _onClickButton: function(evt) {
                    var $buttonClicked = $(evt.target).closest(selectors$24.button);

                    if ($buttonClicked.hasClass(classes$22.buttonActive)) return;

                    var index = $buttonClicked.index();

                    this._setSlideDesktop(index);

                    // Allow first slide to be clicked after initial load
                    if (!$buttonClicked.hasClass(classes$22.buttonActive)) {
                        this._setButtonStatus(index);
                    }
                },

                _setButtonStatus: function(index) {
                    var $button = this.$button.eq(index);
                    var $buttonText = $button.find(selectors$24.ctaText);

                    this.$button
                        .removeClass(classes$22.buttonActive)
                        .find(selectors$24.label)
                        .attr('aria-expanded', false);

                    $button
                        .addClass(classes$22.buttonActive)
                        .find(selectors$24.label)
                        .attr('aria-expanded', true)
                        .focus();

                    this.$buttons
                        .find(selectors$24.ctaText)
                        .empty()
                        .attr('aria-hidden', true)
                        .removeClass(classes$22.headingCtaActive)
                        .removeAttr('style');

                    if ($buttonText.parent().is('a')) {
                        this._showButtonContent($buttonText);
                    }

                    this.$button.find(selectors$24.cta).attr('tabindex', '-1');
                    if ($button.hasClass(classes$22.linkActive)) {
                        $button.find(selectors$24.cta).attr('tabindex', '0');
                    }
                },

                _animateButtonFrame: function() {
                    var deltaPosition = this.mousePosition - this.xPosition;
                    // Calculates the differential ratio between the width of the button wrapper
                    // and the overflowed button element that actually animates.
                    var widthDifferenceRatio =
                        this.buttonsInnerWidth / this.buttonsWrapperWidth - 1;

                    // deltaPosition represents the momentum and will increment down every frame
                    // until it reaches < 1, the buttons will then stop animating.
                    if (Math.abs(deltaPosition) < 1) {
                        this.isAnimating = false;
                        return;
                    }

                    // This represents the mouse position relative to the slideshow width
                    // where this.xPosition equals 0 if the mouse position is in the center.
                    this.xPosition += deltaPosition / config.easeIntensity;

                    this._setButtonsTranslateX(-(this.xPosition * widthDifferenceRatio));

                    // This function is called recursively until the condition above is met,
                    // meaning once the buttons have stopped animating.
                    requestAnimationFrame(this._animateButtonFrame.bind(this));
                },

                _showButtonContent: function($buttonText) {
                    var buttonText = $buttonText.data('button-text');

                    $buttonText.html(buttonText).attr('aria-hidden', false);

                    if (
                        !$buttonText.attr('data-new-width') ||
                        !$buttonText.attr('data-new-height')
                    ) {
                        $buttonText.attr('data-new-width', $buttonText.outerWidth());
                        $buttonText.attr('data-new-height', $buttonText.outerHeight());
                    }

                    var newButtonContentWidth = $buttonText.attr('data-new-width');
                    var newButtonContentHeight = $buttonText.attr('data-new-height');

                    $buttonText.empty();

                    requestAnimationFrame(function() {
                        $buttonText
                            .css({
                                minHeight: newButtonContentHeight + 'px',
                                minWidth: newButtonContentWidth + 'px'
                            })
                            .addClass(classes$22.headingCtaTransitioning);
                    });

                    utils.promiseTransitionEnd($buttonText).then(function() {
                        $buttonText
                            .html(buttonText)
                            .removeClass(classes$22.headingCtaTransitioning)
                            .addClass(classes$22.headingCtaActive);
                    });
                },

                _setButtonsTranslateX: function(xPosition) {
                    this.$buttons.css({
                        transform: 'translate3d(' + xPosition + 'px, 0, 0)'
                    });
                },

                _addKeyBindingsDesktop: function(evt) {
                    if (evt.which === utils.keyboardKeys.LEFTARROW) {
                        this._previousSlideDesktop();
                    } else if (evt.which === utils.keyboardKeys.RIGHTARROW) {
                        this._nextSlideDesktop();
                    }
                },

                _previousSlideDesktop: function() {
                    if (this.currentDesktopSlide === 0) return;

                    this._setSlideDesktop(this.currentDesktopSlide - 1);
                },

                _nextSlideDesktop: function() {
                    if (this.currentDesktopSlide === this.totalSlides - 1) return;

                    this._setSlideDesktop(this.currentDesktopSlide + 1);
                },

                _setSlideDesktop: function(slideIndex) {
                    var $currentSlide = this.$slide.eq(this.currentDesktopSlide);
                    var $nextSlide = this.$slide.eq(slideIndex);
                    var $video = $nextSlide.find(selectors$24.video);

                    // We call _loadVideo() before we check to see if
                    // this.currentDesktopSlide === slideIndex (below). This would never fire
                    // on initial load if it was after the condition below since 0 === 0
                    // would return true.
                    if ($video.length) {
                        this._loadVideo($video, $nextSlide);
                    }

                    if (this.currentDesktopSlide === slideIndex) return;

                    $nextSlide.addClass(classes$22.slideActive).attr('aria-hidden', false);
                    $currentSlide.addClass(classes$22.slideActiveTransitioning);

                    utils.promiseTransitionEnd($nextSlide).then(function() {
                        $currentSlide
                            .removeClass(classes$22.slideActive)
                            .removeClass(classes$22.slideActiveTransitioning)
                            .attr('aria-hidden', true);
                    });

                    this._setButtonStatus(slideIndex);

                    this.currentDesktopSlide = slideIndex;

                    this.trigger('slideshow_set_slide', [slideIndex]);

                    if (this.currentDesktopSlide - 1 >= 0) {
                        this.trigger('slideshow_previous_slide', [slideIndex - 1]);
                    }

                    if (this.currentDesktopSlide + 1 < this.totalSlides) {
                        this.trigger('slideshow_next_slide', [slideIndex + 1]);
                    }
                },

                _loadVideo: function($video, $slide) {
                    this.$video = $video;

                    this.trigger('slideshow_video_load', [$video[0]]);

                    return this._promiseVideo().then(
                        function() {
                            $slide.addClass(classes$22.videoLoaded);
                            $slide.find(selectors$24.pauseButton).prop('disabled', false);
                            this.trigger('slideshow_video_loaded', [$video[0]]);
                        }.bind(this)
                    );
                },

                _promiseVideo: function() {
                    var playerType = this.$video.attr('data-video-type');
                    var promiseVideoPlayer;

                    if (playerType === 'youtube') {
                        promiseVideoPlayer = this._loadYoutubePlayer();
                        this.$video.attr('tabindex', '-1');
                    } else if (playerType === 'vimeo') {
                        promiseVideoPlayer = this._loadVimeoPlayer();
                        this.$video.find('iframe').attr('tabindex', '-1');
                    }

                    return promiseVideoPlayer;
                },

                _loadYoutubePlayer: function() {
                    var blockId = this.$video.attr('data-block-id');
                    var videoId = this.$video.attr('data-video-id');

                    return youtube
                        .promisePlayer(this.$video[0], {
                            videoId: videoId,
                            ratio: 16 / 9,
                            playerVars: {
                                // eslint-disable-next-line camelcase
                                iv_load_policy: 3,
                                modestbranding: 1,
                                autoplay: 0,
                                controls: 0,
                                showinfo: 0,
                                wmode: 'opaque',
                                branding: 0,
                                autohide: 0,
                                rel: 0
                            },
                            events: {
                                onStateChange: function(evt) {
                                    // Video has ended, loop back to beginning
                                    if (evt.data === 0) {
                                        this.players[blockId].seekTo(0);
                                    }
                                }.bind(this)
                            }
                        })
                        .then(
                            function(player) {
                                this.players[blockId] = player;
                                player.playVideo().mute();
                                // The video will not play if the iframe is set to visibility: hidden
                                // Need to set it seperately from other styles in order to resolve the promise
                                $(player.a).css('visibility', 'visible');
                                // set player to visible
                                return $.Deferred(function(defer) {
                                    player.addEventListener('onStateChange', function(evt) {
                                        // Only resolve the promise if the video is playing
                                        if (evt.data === 1) {
                                            defer.resolve();
                                        }
                                    });
                                });
                            }.bind(this)
                        );
                },

                _loadVimeoPlayer: function() {
                    var blockId = this.$video.attr('data-block-id');
                    var videoId = this.$video.attr('data-video-id');

                    return vimeo
                        .promisePlayer(this.$video[0], {
                            id: videoId,
                            loop: true,
                            // This property isn't reliable. The user might see the Vimeo playbar flash
                            // as the video begins to play.
                            playbar: false,
                            background: true
                        })
                        .then(
                            function(player) {
                                this.players[blockId] = player;
                                player.play();
                                player.setVolume(0);

                                return $.Deferred(function(defer) {
                                    player.on('loaded', function() {
                                        defer.resolve();
                                    });
                                });
                            }.bind(this)
                        );
                },

                _setButtonWrapperValues: function() {
                    this.mousePosition = 0;
                    this.xPosition = 0;
                    this.buttonsWrapperWidth = this.$container.outerWidth();
                    this.buttonsInnerWidth = this.$button.first().width() * this.totalSlides;
                    this.centerOfButtonsWrapper = this.buttonsWrapperWidth / 2;
                    this.$button
                        .find(selectors$24.ctaText)
                        .removeAttr(
                            'style data-previous-width data-previous-height data-new-width data-new-height'
                        );

                    this._setButtonsTranslateX(0);
                }
            };

            /*

Slideshow Mobile Extension
--------------------------------------------------------------------------------
Manages all the mobile behaviour of the home page slideshow


Events
------------

Name: slideshow_mobile_init_start
Description: Fired before the mobile slideshow begins to initialize
Payload: none

Name: slideshow_mobile_init_done
Description: Fired when the mobile slideshow is done initializing
Payload: none

Name: slideshow_mobile_destroy
Description: Fired when the mobile slideshow is destroyed
Payload: none

Name: slideshow_set_slide
Description: Fired when the user selects a specific slide
Payload: { number } Index of the slide being displayed

Name: slideshow_previous_slide
Description: Fired when the user selects the previous slide
Payload: { number } Index of the slide being displayed

Name: slideshow_next_slide
Description: Fired when the user selects the next slide
Payload: { number } Index of the slide being displayed

*/

            var selectors$25 = {
                button: '.slideshow__button',
                buttons: '.slideshow__buttons',
                ctaMultipleSlides: '.slideshow__button-cta--multiple',
                ctaSingleSlide: '.slideshow__button-cta-single',
                label: '.slideshow__button-label',
                mobileTextContainer: '.slideshow__text-container-mobile',
                mobileTextContent: '.slideshow__text-content-mobile',
                navigationButtons: '[data-slider-navigation]',
                nextButton: '[data-slider-navigation-next]',
                previousButton: '[data-slider-navigation-previous]',
                slide: '.slideshow__slide',
                slideshow: '.slideshow',
                indicatorDots: '.slideshow__indicator'
            };

            var classes$23 = {
                buttonActive: 'slideshow__button--active',
                dotActive: 'slideshow__indicator--active',
                linkActive: 'slideshow__button--link',
                slideActive: 'slideshow__slide--active',
                slideActiveTransitioning: 'slideshow__slide--transitioning',
                navigationNoFocus: 'slideshow__navigation-item--no-focus'
            };

            var slideshowMobile = {
                initMobileSlideshow: function() {
                    this.trigger('slideshow_mobile_init_start');

                    this.$slideshow = $(selectors$25.slideshow, this.$container);
                    this.$buttons = $(selectors$25.buttons, this.$container);
                    this.$button = $(selectors$25.button, this.$container);
                    this.$navigationButtons = $(selectors$25.navigationButtons, this.$container);
                    this.$ctaMultipleSlides = $(selectors$25.ctaMultipleSlides, this.$container);
                    this.$ctaSingleSlide = $(selectors$25.ctaSingleSlide, this.$container);
                    this.$indicatorDots = $(selectors$25.indicatorDots, this.$container);
                    this.$mobileTextContainer = $(
                        selectors$25.mobileTextContainer,
                        this.$container
                    );
                    this.$mobileTextContent = $(selectors$25.mobileTextContent, this.$container);

                    this.mobileSlideshow = true;
                    this.currentMobileSlide = 0;
                    this.totalSlides = this.$buttons.data('count');
                    this.xPosition = 0;
                    this.mobileSlideshowNamespace = '.mobileSlideshow';

                    // The header is above the slideshow in the iOS editor, so we need to
                    // reduce it's height by the height of the header.
                    if ($('html').hasClass('is-ios') && Shopify.designMode) {
                        this.$slideshow.css('height', '-=60px');
                    }

                    this.on(
                        'click keyup' + this.mobileSlideshowNamespace,
                        selectors$25.indicatorDots,
                        this._onClickIndicatorDot.bind(this)
                    );
                    this.on(
                        'click keyup' + this.mobileSlideshowNamespace,
                        selectors$25.previousButton,
                        this._previousSlideMobile.bind(this)
                    );
                    this.on(
                        'click keyup' + this.mobileSlideshowNamespace,
                        selectors$25.nextButton,
                        this._nextSlideMobile.bind(this)
                    );
                    this.on(
                        'keydown' + this.mobileSlideshowNamespace,
                        this._addKeyBindingsMobile.bind(this)
                    );

                    if (this.totalSlides > 1) {
                        this.hammertime = new Hammer(this.$container[0]);

                        // Import swipe gestures and only allow these two events
                        this.hammertime
                            .on('swipeleft', this._nextSlideMobile.bind(this))
                            .on('swiperight', this._previousSlideMobile.bind(this));
                    }

                    this.$button.first().addClass(classes$23.buttonActive);

                    utils.promiseStylesheet().then(
                        function() {
                            this._setSlideMobile(0);
                            this._setMobileText(0);
                            this._setSlideshowA11y();
                            this.trigger('slideshow_mobile_init_done');
                        }.bind(this)
                    );
                },

                destroyMobileSlideshow: function() {
                    this.trigger('slideshow_mobile_destroy');

                    this.mobileSlideshow = false;
                    this.$container.off(this.mobileSlideshowNamespace);

                    if (this.totalSlides > 1) {
                        this.hammertime.destroy();
                    }
                },

                _onClickIndicatorDot: function(evt) {
                    var $indicatorDot = $(evt.target);
                    var index = $indicatorDot.data('slide-index');

                    evt.preventDefault();

                    if (
                        evt.type === 'keyup' &&
                        !(
                            evt.keyCode === utils.keyboardKeys.ENTER ||
                            evt.keyCode === utils.keyboardKeys.SPACE
                        )
                    )
                        return;

                    this._setSlideMobile(index);

                    if (evt.type === 'keyup' || evt.detail === 0) {
                        this.$slideshow.focus();
                    }
                },

                _addKeyBindingsMobile: function(evt) {
                    if (evt.which === utils.keyboardKeys.LEFTARROW) {
                        this._previousSlideMobile(evt);
                    } else if (evt.which === utils.keyboardKeys.RIGHTARROW) {
                        this._nextSlideMobile(evt);
                    }
                },

                _previousSlideMobile: function(evt) {
                    if (evt.type === 'click') {
                        $(evt.target).addClass(classes$23.navigationNoFocus);
                    }
                    if (
                        (evt.type === 'keyup' &&
                            !(
                                evt.keyCode === utils.keyboardKeys.ENTER ||
                                evt.keyCode === utils.keyboardKeys.SPACE
                            )) ||
                        this.currentMobileSlide === 0
                    ) {
                        return;
                    }

                    this._setSlideMobile(this.currentMobileSlide - 1);
                },

                _nextSlideMobile: function(evt) {
                    if (evt.type === 'click') {
                        $(evt.target).addClass(classes$23.navigationNoFocus);
                    }
                    if (
                        (evt.type === 'keyup' &&
                            !(
                                evt.keyCode === utils.keyboardKeys.ENTER ||
                                evt.keyCode === utils.keyboardKeys.SPACE
                            )) ||
                        this.currentMobileSlide === this.totalSlides - 1
                    ) {
                        return;
                    }

                    this._setSlideMobile(this.currentMobileSlide + 1);
                },

                _setSlideMobile: function(slideIndex) {
                    if (this.currentMobileSlide === slideIndex) return;

                    this.xPosition = slideIndex * 50;

                    this.$buttons.css({
                        transform: 'translate3d(-' + this.xPosition + '%, 0, 0)'
                    });

                    this._setActiveStates(slideIndex);
                    this._setSlideA11y(slideIndex);
                    this._setMobileText(slideIndex);

                    this.currentMobileSlide = slideIndex;

                    this.trigger('slideshow_set_slide', [slideIndex]);

                    this.$navigationButtons.attr('disabled', false);

                    if (this.currentMobileSlide === 0) {
                        this.$navigationButtons
                            .filter(selectors$25.previousButton)
                            .attr('disabled', true);
                    }

                    if (this.currentMobileSlide === this.totalSlides - 1) {
                        this.$navigationButtons
                            .not(selectors$25.previousButton)
                            .attr('disabled', true);
                    }

                    if (this.currentMobileSlide - 1 >= 0) {
                        this.trigger('slideshow_previous_slide', [slideIndex - 1]);
                    }

                    if (this.currentMobileSlide + 1 < this.totalSlides) {
                        this.trigger('slideshow_next_slide', [slideIndex + 1]);
                    }
                },

                _setActiveStates: function(slideIndex) {
                    this.$slide = this.$slide || $(selectors$25.slide, this.$container); // eslint-disable-line shopify/jquery-dollar-sign-reference
                    this.$button = this.$button || $(selectors$25.button, this.$container); // eslint-disable-line shopify/jquery-dollar-sign-reference
                    this.$dot = this.$dot || $(selectors$25.indicatorDots, this.$container); // eslint-disable-line shopify/jquery-dollar-sign-reference

                    var $currentSlide = this.$slide.eq(this.currentMobileSlide);
                    var $nextSlide = this.$slide.eq(slideIndex);

                    $nextSlide.addClass(classes$23.slideActive).attr('aria-hidden', false);
                    $currentSlide.addClass(classes$23.slideActiveTransitioning);

                    utils.promiseTransitionEnd($nextSlide).then(function() {
                        $currentSlide
                            .removeClass(classes$23.slideActive)
                            .removeClass(classes$23.slideActiveTransitioning)
                            .attr('aria-hidden', true);
                    });

                    this.$button.removeClass(classes$23.buttonActive);

                    this.$button.eq(slideIndex).addClass(classes$23.buttonActive);

                    this.$dot.removeClass(classes$23.dotActive);
                    this.$dot.eq(slideIndex).addClass(classes$23.dotActive);
                },

                _setSlideshowA11y: function() {
                    this.$labels = this.$labels || this.$button.find(selectors$25.label); // eslint-disable-line shopify/jquery-dollar-sign-reference
                    this.$ctaSingleSlide =
                        this.$ctaSingleSlide || this.$button.find(selectors$25.ctaSingleSlide); // eslint-disable-line shopify/jquery-dollar-sign-reference

                    this.$ctaSingleSlide.attr('tabindex', '0');
                    this.$labels.attr('tabindex', '-1');
                    this._setSlideA11y(0);

                    $.each(
                        this.$indicatorDots,
                        function(index, indicatorDot) {
                            $(indicatorDot).attr({
                                'aria-controls': 'Slide' + index
                            });
                        }.bind(this)
                    );
                },

                _setSlideA11y: function(slideIndex) {
                    var $button = this.$button.eq(slideIndex);

                    this.$ctasMultipleSlides =
                        this.$ctasMultipleSlides ||
                        this.$button.find(selectors$25.ctaMultipleSlides); // eslint-disable-line shopify/jquery-dollar-sign-reference

                    if (this.$ctasMultipleSlides) {
                        this.$ctasMultipleSlides.attr('tabindex', '-1');

                        // All slide titles are tabbable. If the currently active button has a CTA
                        // link, the CTA link becomes tabbable as well.
                        if ($button.hasClass(classes$23.linkActive)) {
                            this.$ctasMultipleSlides.eq(slideIndex).attr('tabindex', '0');
                        }
                    }

                    $.each(
                        this.$indicatorDots,
                        function(index, indicatorDot) {
                            $(indicatorDot).attr({
                                'aria-label': this._slideLabel(slideIndex, index),
                                'aria-current': slideIndex === index ? true : false
                            });
                        }.bind(this)
                    );
                },

                _setMobileText: function(slideIndex) {
                    var $currentTextContent = this.$mobileTextContent.eq(slideIndex);
                    this.$ctaSingleSlide =
                        this.$ctaSingleSlide || this.$button.find(selectors$25.ctaSingleSlide); // eslint-disable-line shopify/jquery-dollar-sign-reference

                    if (this.$ctaSingleSlide.length) {
                        // Adjust for buttons with labels on multiple lines.
                        var paddingAdjustment =
                            (this.$ctaSingleSlide.outerHeight() - 50) / 2 + 40;
                        this.$mobileTextContent.css('padding-top', paddingAdjustment + 'px');
                    }

                    this.$mobileTextContent.hide();
                    $currentTextContent.show();
                },

                _slideLabel: function(activeSlideIndex, currentIndex) {
                    var label =
                        activeSlideIndex === currentIndex
                            ? theme.strings.slideshow.activeSlideA11yString
                            : theme.strings.slideshow.loadSlideA11yString;

                    return label.replace('[slide_number]', currentIndex + 1);
                }
            };

            /*

Slideshow Section
--------------------------------------------------------------------------------
Manages the functionality of the both mobile and desktop slideshow

*/

// Extensions
// Libs
            var selectors$23 = {
                button: '.slideshow__button',
                slide: '.slideshow__slide'
            };

            var classes$21 = {
                buttonActive: 'slideshow__button--active',
                slideActive: 'slideshow__slide--active'
            };

            sections.register('slideshow-section', {
                onLoad: function() {
                    this.extend(slideshowDesktop);
                    this.extend(slideshowMobile);

                    this.$container.on('focusin' + this.namespace, this._onFocusIn.bind(this));
                    this.$container.on(
                        'focusout' + this.namespace,
                        this._onFocusOut.bind(this)
                    );
                    this._toggleViewState();

                    this.window().on('resize', this._toggleViewState.bind(this));
                },

                onUnload: function() {
                    this._destroyDesktopState();
                    this._destroyMobileState();
                },

                onBlockSelect: function(evt) {
                    utils.promiseStylesheet().then(
                        function() {
                            var index = $(evt.target).index();

                            if (this.mobileViewEnabled) {
                                this._setSlideMobile(index);
                            } else {
                                this._setSlideDesktop(index);
                            }
                        }.bind(this)
                    );
                },

                _toggleViewState: function() {
                    var windowWidth = $(window).innerWidth();
                    var enableMobileView;
                    var enableDesktopView;

                    if (typeof this.mobileViewEnabled === 'undefined') {
                        enableMobileView = windowWidth < theme.mediaQuerySmall;
                        enableDesktopView = windowWidth >= theme.mediaQuerySmall;
                    } else {
                        enableMobileView =
                            windowWidth < theme.mediaQuerySmall && !this.mobileViewEnabled;
                        enableDesktopView =
                            windowWidth >= theme.mediaQuerySmall && this.mobileViewEnabled;
                    }

                    if (enableMobileView) {
                        this.mobileViewEnabled = true;
                        this._destroyDesktopState();
                        this._enableMobileState();
                    }

                    if (enableDesktopView) {
                        this.mobileViewEnabled = false;
                        this._destroyMobileState();
                        this._enableDesktopState();
                    }
                },

                _enableDesktopState: function() {
                    this.initDesktopSlideshow();
                },

                _destroyDesktopState: function() {
                    if (!this.desktopSlideshow) return;

                    this.destroyDesktopSlideshow();
                    this._resetSlideshowValues();
                },

                _enableMobileState: function() {
                    this.initMobileSlideshow();
                },

                _destroyMobileState: function() {
                    if (!this.mobileSlideshow) return;

                    this.destroyMobileSlideshow();
                    this._resetSlideshowValues();
                },

                // This method is called when the viewport goes from mobile to desktop
                // and vice versa. It ensures the slideshow resets to the first slide,
                // which helps with potential conflicting values based on shared markup.
                _resetSlideshowValues: function() {
                    $(selectors$23.slide)
                        .removeClass(classes$21.slideActive)
                        .first()
                        .addClass(classes$21.slideActive);

                    $(selectors$23.button)
                        .removeClass(classes$21.buttonActive)
                        .first()
                        .addClass(classes$21.buttonActive);
                },

                _onFocusIn: function(evt) {
                    if (
                        this.$container.has(evt.target).length &&
                        this.$slideshow.attr('aria-live') === 'polite'
                    ) {
                        return;
                    }

                    this.$slideshow.attr('aria-live', 'polite');
                },

                _onFocusOut: function(evt) {
                    if (this.$container.has(evt.relatedTarget).length) {
                        return;
                    }

                    this.$slideshow.removeAttr('aria-live');
                }
            });

            var selectors$26 = {
                loadPlayerButton: '.video-section__load-player-button',
                closePlayerButton: '.video-section__player-close',
                playerContainer: '.video-section__player',
                cover: '.video-section__cover',
                errorMessage: '.video-section__error',
                bodyOverlay: '.video-section__body-overlay'
            };

            var classes$24 = {
                playerLoading: 'video-section--loading',
                playerLoaded: 'video-section--loaded',
                playerError: 'video-section--error',
                animateButton: 'animated pulse'
            };

            sections.register('video-section', {
                onLoad: function() {
                    this.$container = $(this.container);

                    this.$container
                        .on('click', selectors$26.loadPlayerButton, this._loadPlayer.bind(this))
                        .on('click', selectors$26.closePlayerButton, this._closePlayer.bind(this))
                        .on('click', selectors$26.bodyOverlay, this._closePlayer.bind(this));
                },

                _loadPlayer: function() {
                    var $container = this.$container;
                    var $loadButton = $(selectors$26.loadPlayerButton, $container);
                    var $playerContainer = $(selectors$26.playerContainer, $container);
                    var playerType = this.$container.attr('data-video-type');
                    var promiseVideoPlayer;

                    $loadButton.addClass(classes$24.animateButton);

                    this._scrollToPlayer($container);

                    if (playerType === 'youtube') {
                        promiseVideoPlayer = this._loadYoutubePlayer($playerContainer[0]);
                    } else if (playerType === 'vimeo') {
                        promiseVideoPlayer = this._loadVimeoPlayer($playerContainer[0]);
                    }

                    return promiseVideoPlayer
                        .then(this._onPlayerLoadReady.bind(this))
                        .catch(this._onPlayerLoadError.bind(this))
                        .always(function() {
                            $loadButton.removeClass(classes$24.animateButton);
                        });
                },

                _scrollToPlayer: function(container) {
                    var containerTop = container.offset().top;
                    var offset = ($(window).height() - container.height()) / 2;

                    $('html, body').animate(
                        {
                            scrollTop: containerTop - offset
                        },
                        400
                    );
                },

                _loadYoutubePlayer: function(container) {
                    return youtube
                        .promisePlayer(container, {
                            videoId: this.$container.attr('data-video-id'),
                            ratio: 16 / 9,
                            playerVars: {
                                modestbranding: 1,
                                autoplay: 1,
                                showinfo: 0,
                                rel: 0
                            }
                        })
                        .then(
                            function(player) {
                                this.player = player;
                            }.bind(this)
                        );
                },

                _loadVimeoPlayer: function(container) {
                    return vimeo
                        .promisePlayer(container, {
                            id: this.$container.attr('data-video-id')
                        })
                        .then(
                            function(player) {
                                this.player = player;
                                this.player.play();
                            }.bind(this)
                        );
                },

                _onPlayerLoadReady: function() {
                    $(selectors$26.closePlayerButton, this.$container)
                        .show()
                        .focus();
                    $(selectors$26.cover, this.$container)
                        .prepareTransition()
                        .addClass(classes$24.playerLoaded);
                    this.$container.addClass(classes$24.playerLoaded);

                    this._setScrollPositionValues();

                    $(document)
                        .one('keyup' + this.namespace, this._closeOnEscape.bind(this))
                        .on('scroll' + this.namespace, this._onScroll.bind(this));

                    $(window).on(
                        'resize' + this.namespace,
                        this._setScrollPositionValues.bind(this)
                    );
                },

                _onPlayerLoadError: function(err) {
                    this.$container.addClass(classes$24.playerError);
                    $(selectors$26.errorMessage, this.$container).text(err);
                },

                _closeOnEscape: function(evt) {
                    if (evt.keyCode !== 27) return;

                    this._closePlayer();
                    $(selectors$26.loadPlayerButton, this.$container).focus();
                },

                _onScroll: function() {
                    var scrollTop = $(window).scrollTop();

                    if (
                        scrollTop > this.videoTop + 0.25 * this.videoHeight ||
                        scrollTop + this.windowHeight < this.videoBottom - 0.25 * this.videoHeight
                    ) {
                        // Debounce DOM edits to the next frame with requestAnimationFrame
                        requestAnimationFrame(this._closePlayer.bind(this));
                    }
                },

                _setScrollPositionValues: function() {
                    this.videoHeight = this.$container.outerHeight(true);
                    this.videoTop = this.$container.offset().top;
                    this.videoBottom = this.videoTop + this.videoHeight;
                    this.windowHeight = $(window).innerHeight();
                },

                _closePlayer: function() {
                    $(selectors$26.cover, this.$container)
                        .prepareTransition()
                        .removeClass(classes$24.playerLoaded);
                    this.$container.removeClass(classes$24.playerLoaded);
                    $(selectors$26.closePlayerButton, this.$container).hide();

                    if (typeof this.player.destroy === 'function') {
                        this.player.destroy();
                    } else if (typeof this.player.unload === 'function') {
                        this.player.unload();
                    }

                    $(document).off(this.namespace);
                    $(window).off(this.namespace);
                }
            });

            // import templates.js and assign it to the global theme object
            window.theme.templates = templates;

// import all templates js
// import sections.js and assign it to the global theme object
            window.theme.sections = sections;
        }
    },
    collection: {
        init: function () {
            //console.log('main.js - Collection')
        }
    },
    page: {
        init: function () {
            //console.log('main.js - Page')
        }
    },
    product: {
        init: function () {
            //console.log('main.js - Product')

            $('.c-product-gallery__focus-image:first-child .c-product-gallery__wrapper').removeClass('u-hidden');
            $(document).on('click', '.c-product-gallery__link--thumb', function (e) {
                e.preventDefault()

                let galleryThumb = $(this);
                let thumbId = galleryThumb.attr('data-thumbnail-id');
                let galleryImage = $('.c-product-gallery__wrapper[data-image-id=' + thumbId + ']')

                $('.c-product-gallery__wrapper').addClass('u-hidden').queue(function(next){
                    galleryImage.removeClass('u-hidden');
                    next();
                })

            })
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
