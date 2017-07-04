/**
 +----------------------------------------------------------
 //定向锚点
 +----------------------------------------------------------
 */

define(['jquery','touchSwipe'],function ($){


    return {
        init:function ( offset ) {

            //定向锚点
            var _href = window.location.href.split('#');
            if(_href.length>1){
                var theAnchorObj = $('#'+_href[1]),
                    _time_ = + new Date();

                function __clear__() {
                    if(window.__timer__){
                        clearInterval(window.__timer__);
                        delete window.__timer__;
                    }
                }

                function __set__(theAnchorObj) {
                    if(window.__timer_init__){
                        return;
                    }
                    setTimeout(function () {
                        var top = theAnchorObj.offset().top + offset;
                        $(window).scrollTop( top );
                    },30);
                }

                if(theAnchorObj.length){
                    __set__(theAnchorObj);
                    window.__timer__ = setInterval(function () {
                        __set__(theAnchorObj);
                        if( (+ new Date())-_time_ > 1000 * 20 ){
                            __clear__();
                        }
                    },7);
                    window.onload = function () {
                        __set__(theAnchorObj);
                        __clear__();
                        setTimeout(function () {
                            __set__(theAnchorObj);
                            window.__timer_init__ = true;
                        },80);
                    };
                    var spaceName = 'subSpaceName'+String(Math.random()).replace('.','');

                    $(window).bind('scroll.'+spaceName,function () {
                        __clear__();
                        $(window).unbind('scroll.'+spaceName);
                    });
                }
            }
        },
        eventInit:function () {
            $('#goAnchor').on('click',function (e) {
                e.preventDefault();
                var top=$($(this).attr('href')).offset().top-52;
                $("html,body").animate({scrollTop: top}, 300);
            })
        },
        hrefInit:function () {
            var hash=window.location.href.split('#')[1];
            var top=0;
            if($('#'+hash+'').length>0){
                 top=$('#'+hash+'').offset().top-55;
            }
            $("html,body").animate({scrollTop: top}, 300);
        }
    }
});
