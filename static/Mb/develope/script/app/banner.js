/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'jquery',
    'touchSlide',
],function ($){

    return {
        init:function (o) {
            var _o = $.extend(true,{
                slideCell:"#banner-inner",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                interTime:"4000",
                autoPlay:true,//自动播放
                autoPage:true //自动分页
            },o);
            TouchSlide(_o);
        }
    };

});
