/**
 +----------------------------------------------------------
 //字符串扩展方法
 +----------------------------------------------------------
 */
;
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g,"");
}

/**
 +----------------------------------------------------------
 //全局函数库
 +----------------------------------------------------------
 */
+(function (window,require) {
    var k = function () {};

    k.prototype = {
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
        //分享微信专属方法
        share:function (type,url) {
            var id = this.randomId();
            require(['jquery','layer'],function ($,layer) {
                layer.ready(function () {

                    var _url_ = window.URL['shareCode'];

                    if(url){
                        _url_ = '/mb/api/qrcode?w=250&url='+url;
                    }

                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        shadeClose: true,
                        content: '<div id="'+id+'" style="padding: 20px">' +
                        '<img style="width: 300px;" src="'+_url_+'">' +
                        '<div class="tc ft16">扫描二维码分享至微信</div></div>',
                        success:function (layero, index) {
                            var img = new Image();
                            img.onload = function () {
                                $(window).trigger('resize');
                            };
                            img.src = _url_;
                        }
                    });
                });
            });
        }


    };

    window.K = new k();

    define([],function (){
        return window.K;
    });

})(window,require);
