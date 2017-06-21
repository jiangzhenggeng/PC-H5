/**
 +----------------------------------------------------------
 //图片延迟加载
 +----------------------------------------------------------
 */

define(['require','jquery','app/scrollStatus'],function (require,$){

    var WIN_H = $(window).height(),
        WIN_SCR_H = 0,
        _this_top = 0,
        _this_top2 = 0,
        defaultselecter = 'img[data-lazyload]:not([data-loaded])',
        loadUrl = require.toUrl('../../style/ext_img/lazyload_default.png'),
        _src2 = '_src2_',
        bodyW = 640;
    
    $(function () {
        $('#article-content-show img').attr({height:'auto',width:'auto'});
    });

    function scrollLoadImg(e) {
        WIN_SCR_H = $(window).scrollTop();
        window.____imgArray____.each(function () {
            _this_top = $(this).offset().top;
            if( WIN_H+WIN_SCR_H + 600 >=_this_top &&
                WIN_SCR_H - $(this).height() <_this_top ){
                $(this).attr({
                    'src':$(this).attr(_src2),
                    'data-loaded':'yes'
                });
            }
        });
    }

    return {
        init:function (selecter) {
            /**
             * 图片延迟加载处理
             */
            var src = '';
            WIN_SCR_H = $(window).scrollTop();

            //阻止图片加载
            window.____imgArray____ = $(selecter || defaultselecter).filter(function (index) {

                _this_top2 = $(this).offset().top;
                if( this.complete ||
                    (WIN_H + WIN_SCR_H + 300 >= _this_top2 &&
                    WIN_SCR_H - $(this).height() <_this_top2)
                ){
                    $(this).attr({'data-loaded':'yes', 'width':'auto'});
                    if( typeof($(this).attr(_src2))!="undefined" ){
                        src = $(this).attr(_src2);
                        $(this).attr({'src':src});
                    }
                    return false;
                }

                if( typeof($(this).attr(_src2))=="undefined" ){
                    src = $(this).attr('src');
                    var w = parseFloat($(this).attr('data-width'));
                    var b = parseFloat($(this).attr('data-ratio'));
                    w = !isNaN(w)?(w>bodyW?bodyW:w):0;
                    b = !isNaN(b)?b:0;
                    var h = 0;
                    try {
                        h = w / b;
                    }catch (e){}

                    if(w && h){
                        $(this).attr({
                            'width':w,
                            'height':h,
                            'src':loadUrl
                        });
                    }
                    $(this).attr(_src2,src);
                }
                return true;

            });

            if($(window).data('lazyload_scrollstop')!='scrollLoadImg'){
                $(window).bind('scroll',scrollLoadImg).data('lazyload_scrollstop','scrollLoadImg');
            }
        }
    };

});
