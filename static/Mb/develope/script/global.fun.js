
/**
 +----------------------------------------------------------
 //全局函数库
 +----------------------------------------------------------
 */
+(function (window,require) {
    var k = function () {};

    k.prototype = {
        /**
         +----------------------------------------------------------
         //字符串扩展方法
         +----------------------------------------------------------
         */
        trim:function(string){
            if(typeof string!='string'){
                return '';
            }
            return string.replace(/(^\s*)|(\s*$)/g, "");
        },
        //字符串截取方法
        cutStr : function (string,number,fix){
            if(typeof string=='undefined' ){
                return '';
            }
            if(typeof string!='string' ){
                string =string.toString();
            }
            if(typeof fix == 'undefined'){
                fix = '...<p class="open-btn" data-show-html="隐藏" data-hide-html="展开">展开</p>';
            }
            if(typeof number == 'undefined'){
                number = 106;
            }
            if(string.length>number){
                return string.substr(0,number)+fix;
            }else{
                return string;
            }
        },
        //在a标签里扩展一个可以打开新页面的方法
        open:function (url,_this) {
            //(event || window.event).preventDefault();
            var a = $(_this).parents('a');
            var href = a.attr('href');
            a.attr('url',href);
            a.attr('href',url);
            setTimeout(function () {
                a.attr('href',href);
            },500);
        },
        //生成唯一ID
        randomId:function () {
            return 'id_'+Math.random().toString().replace('.','');
        },

    };

    window.K = new k();

    define([],function () {
        return window.K;
    });

})(window,require);
