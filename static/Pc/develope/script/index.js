/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'require',
    'global.fun',
    'app/banner',
    'app/common',
    'app/homeAjaxLoad',
    'app/hotEvent',
    'app/lazyload',
    'app/messageIO',
    'app/search',
    'app/tplEngine',
    'app/unitTool',
    'jquery',
    'app/scrollStatus',
    'app/hDownload'
],function (require,global,banner,common,homeAjaxLoad,hotEvent,
            lazyload,messageIO,search,tplEngine,unitTool,
            $,scrollStatus,hDownload){

    homeAjaxLoad.init();
    //公共模块
    common.collect();

    hotEvent.init();

});
