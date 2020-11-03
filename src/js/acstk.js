/*!
 * ACSTK
 *
 */
console.log('mainjs')
const ACSTK = {
    common: {
        init: function () {
            console.log('main.js - Common')
            $('body').addClass('jquery-loaded')
        }
    },
    collection: {
        init: function () {
            console.log('main.js - Collection')
        }
    },
    page: {
        init: function () {
            console.log('main.js - Page')
        }
    },
    product: {
        init: function () {
            console.log('main.js - Product')

            $('.c-product-gallery__focus-image:first-child .c-product-gallery__wrapper').removeClass('u-hidden');
            $(document).on('click', '.c-product-gallery__link--thumb', function (e) {
                console.log('clicker');
                e.preventDefault()
                let galleryThumb = $(this);
                let thumbId = galleryThumb.attr('data-thumbnail-id');
                console.log(thumbId);
                let galleryImage = $('.c-product-gallery__wrapper[data-image-id=' + thumbId + ']')
                $('.c-product-gallery__wrapper').addClass('u-hidden').queue(function(next){
                    galleryImage.removeClass('u-hidden');
                    next();
                })

                console.log(galleryImage);
            })
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
