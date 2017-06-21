/**
 +----------------------------------------------------------
 //视频自适应大小
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){
    function _adapt(options) {
        var options = $.extend({

        },options);
        /**
         * 腾讯 优酷 视频自适应高宽度
         */
        var selecterBox = $( options.selecter || 'body'),
            VideoWidth = options.width || selecterBox.width(),
            VideoHeight = VideoWidth*2/3,
            vidoeBox = selecterBox.find('embed,iframe:not([data-productid])').filter(function (index,elem) {
                var __src__ = String($(this).attr('src'));
                if(
                    !$(this).attr('src') ||
                    __src__.indexOf('jiguo.com')!=-1 ||
                    __src__.indexOf('xhcheng.com')!=-1
                ){
                    return false;
                }
                return true;
            }),
            src = null;

        function getKeyVal(src,key){
            var matchVidArray = src.toString().split('?')[1].toString().split('&') , vid=null;
            for(var i2=0;i2<matchVidArray.length;i2++){
                if(matchVidArray[i2].split('=')[0].toLowerCase()==key){
                    vid = matchVidArray[i2].split('=')[1];
                    return vid;
                }
            }
            return '';
        }

        vidoeBox.each(function () {
            src = $(this).attr('src');
            var id = 'iframe'+Math.random().toString().replace('.','');
            $(this).replaceWith('<div style="text-align: center;"><iframe id="'+id+'" frameborder="0"></iframe></div>');
            var _this = $('#'+id);

            if(src.match("v.qq.com") || src.match("video.qq.com")  || src.match("imgcache.qq.com") ){
                src = 'http://v.qq.com/iframe/player.html?vid='+getKeyVal(src,'vid')+'&width='+VideoWidth+'&height='+VideoHeight+'&auto=0';
            }else if(src.match("youku.com")){
                src.match(/http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/);
                src = 'http://player.youku.com/embed/'+RegExp.$1;
            }
            _this.attr({src:src, height:VideoHeight, width:VideoWidth});
        });
    }

    return {
        init:_adapt,
    };
});
