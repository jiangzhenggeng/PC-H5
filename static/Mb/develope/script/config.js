
/**
 +----------------------------------------------------------
 //requirejs全局配置
 +----------------------------------------------------------
 */

var js = document.scripts,script, jsPath;
for(var i = 0 ; i < js.length ;i++ ){
    if(js[i].src && js[i].src.indexOf('script/require.js')>0 ){
        script = js[i];
        jsPath = script.src;
        break;
    }
}

requirejs.config({

    baseUrl: jsPath.substring(0, jsPath.lastIndexOf("/") + 1),

    waitSeconds: 0,

    paths: {
        //试用模块百度编辑器依赖配置
        'jquery': 'lib/jquery-2.2.3',
        'cookie': 'lib/cookie',
        'touchSlide': 'lib/TouchSlide.1.1',
        'layer': 'lib/layer/layer',
        'socket.io': 'lib/socket.io',
        'touchSwipe': 'lib/jquery.touchSwipe',
        'ZeroClipboard': 'lib/zeroclipboard/ZeroClipboard',
        'swipebox':'lib/swipebox/jquery.swipebox',
    },
    shim: {
        'cookie': {
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'swipebox':{
            deps:['jquery','css!lib/swipebox/swipebox.css'],
            exports:'jQuery.fn.swipebox'
        },
        'touchSwipe': {
            deps: ['jquery'],
            exports: 'jQuery.fn.swipe'
        },
        'layer':{
            deps: ['css!lib/layer/need/layer.css'],
        }
    }
});

