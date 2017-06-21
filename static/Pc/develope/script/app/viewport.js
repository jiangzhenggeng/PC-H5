/**
 +----------------------------------------------------------
 // ipad适配
 +----------------------------------------------------------
 */

define(['jquery'],function ($){
    function _init() {
        if( !/iPad/.test(window.navigator.userAgent) ){
            return true;
        }
        $(window).unbind('orientationchange');
        $(window).bind('orientationchange',function (e) {
            $('meta[name=viewport]').remove();
            $('head').append('<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">');

            setTimeout(function () {
                var windowWidth = $(window).width(),
                    body_W = 1080;
                $('meta[name=viewport]').remove();

                if( windowWidth<=body_W ){
                    var metaViewport = document.createElement('meta'),
                        initScale = ( windowWidth ) / body_W;
                    metaViewport.setAttribute('name','viewport');
                    metaViewport.setAttribute('content','width=device-width,initial-scale='+initScale+',minimum-scale='+initScale+', maximum-scale=1,user-scalable=no');
                    document.getElementsByTagName('head')[0].appendChild(metaViewport);
                    $('html,body').css('overflow-x','hidden').scrollLeft(0);
                }
            },300);
        }).trigger('orientationchange');
    }
    return {
        init:_init
    }
});
