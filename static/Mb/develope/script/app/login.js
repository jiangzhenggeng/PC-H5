/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'jquery'
],function ($){

    return {
        login:function () {
            window.location = '/mb/user/login.html?callbackurl='+encodeURIComponent(window.location.href);
        }
    };

});
