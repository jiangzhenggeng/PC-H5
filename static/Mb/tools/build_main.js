({
    //appDir:'../develope',
    baseUrl: '../develope/script',
    out:'../compression_3.3/script/main.js',
    name:'main',
    //optimize: "none",
    optimizeCss:'standard',
    fileExclusionRegExp:'\.(less|html|php|psd|PSD|DS_Store)$',
    paths: {
        'jquery': 'lib/jquery-2.2.3',
        'cookie': 'lib/cookie',
        'touchSlide': 'lib/TouchSlide.1.1',
        'layer': 'lib/layer/layer',
        'touchSwipe': 'lib/jquery.touchSwipe',
        'swipebox': 'lib/swipebox/jquery.swipebox',
        'socket.io': 'empty:'
    },
    shim: {
        'cookie': {
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'touchSwipe': {
            deps: ['jquery'],
            exports: 'jQuery.fn.swipe'
        },
        'swipebox':{
            deps:['jquery'],
            exports:'jQuery.fn.swipebox'
        }
    }
})