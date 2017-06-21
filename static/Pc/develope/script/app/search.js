/**
 +----------------------------------------------------------
 //头部搜索
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){
    $(function () {
        var menu_box = $('.menu-box'),
            menu_box_li = menu_box.find('li'),
            search_warp = $('.search-input-warp'),
            search_close = search_warp.find('.search-close'),
            search_box = search_warp.find('.header-search-box'),
            timer = null,
            inPut = search_box.find('input[name=keyword]');

        $(".search .search-box").find('input[type=button]').click(function () {
            menu_box.css('opacity',1).animate({
                opacity:0
            },500,function () {
                $(this).hide();
            });

            search_warp.css({
                'opacity':0,
                'display':'block'
            }).animate({
                opacity:1
            },500);
            search_box.animate({
                width:'100%'
            },300);

            search_warp.find('#keyword').focus().focus(function () {
                if(timer){
                    clearTimeout(timer);
                }
            });

            // menu_box_li.animate({
            //     fontSize:12
            // },500);

            inPut.focus();
        });

        var close = function () {
            menu_box.css('display','block').animate({
                opacity:1
            },500);

            search_warp.animate({
                opacity:0
            },300,function () {
                $(this).hide();
            });

            search_box.animate({
                width:450
            },300);

            // menu_box_li.animate({
            //     fontSize:15
            // },300);
        };

        search_close.click(close);
        search_warp.find('#keyword').blur(function () {
            timer = setTimeout(function () {
                close();
            },1000);
        });
    });
});
