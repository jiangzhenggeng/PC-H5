/**
 +----------------------------------------------------------
 //卡片高度自适应
 +----------------------------------------------------------
 */

define([
    'jquery',
],function ($){
    window.$ = window.jQuery = $;
    function _adapt(options) {
        var options = $.extend({

        },options);

        var selecterBox = $( options.selecter || 'body'),
            iframeBox = selecterBox.find('iframe').filter(function (index,elem) {
                if( $(this).attr('src')==undefined || $(this).attr('src') == '' ){
                    return false;
                }

                if( $(this).attr('src').indexOf('zdm.jiguo.com')!=-1 ){
                    return true;
                }
                return false;
            });

        iframeBox.each(function () {
            $(this).attr('frameborder','0').load(function () {
                try {
                    var doc = this.contentWindow.document || this.document
                    $(this).attr({
                        height:$('body',doc).height(),
                    });
                }catch (e){
                    $(this).attr({height:'auto'});
                }
            });

            $(this).attr({
                'style':'',
                width: '100%',
                'src':$(this).attr('src')+'&type=web'
            });

        });
    }

    return {
        init:_adapt,
    };
});
