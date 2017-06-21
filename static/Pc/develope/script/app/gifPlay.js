/**
 +----------------------------------------------------------
 //
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){

    var defaultselecter = 'img[data-img-type=1][data-original]',
        playUrl = require.toUrl('../../style/ext_img/gif_play_default.png');

    return {
        init:function (selecter) {

            var imgObj = $(selecter || defaultselecter).filter(function (index) {
                if( this.complete ){
                    return false;
                }
                return true;

            });
            var style = 'position:absoult;background:rgba(0,0,0,.7);';
            imgObj.each(function (i, ele) {
                var html = $('<div style="'+style+'width:'+$(this).width()+'px;height:'+$(this).height()+'px;' +
                    'left:'+$(this).offset().top+'px;top:'+$(this).offset().left+'px;">' +
                    '<img src="'+playUrl+'">' +
                    '</div>');
                var _this = $(this);
                _this.data('original',_this.attr('src'));

                html.click(function () {
                    _this.attr({
                        src:_this.data('original')
                    });
                    $(this).remove();
                });

                $(this).after(html);
            });
        }
    };

});
