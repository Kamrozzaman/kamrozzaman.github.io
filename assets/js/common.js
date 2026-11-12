// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=

// Light/dark mode. The initial theme is set by an inline script in _layouts/default.html.
(function () {
    var root = document.documentElement;
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function savedTheme() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
        });
    }

    // Follow the OS setting live, until the visitor picks a theme themselves.
    if (media) {
        var onSystemChange = function (e) {
            if (!savedTheme()) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        };
        if (media.addEventListener) media.addEventListener('change', onSystemChange);
        else if (media.addListener) media.addListener(onSystemChange);
    }
})();
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });

    // re-layout [data-masonry] grids once fonts/images change item heights
    function relayoutDataMasonry() {
        document.querySelectorAll('[data-masonry]').forEach(function (el) {
            var msnry = Masonry.data(el);
            if (msnry) msnry.layout();
        });
    }
    $(window).on('load resize', relayoutDataMasonry);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(relayoutDataMasonry);
    }
})
