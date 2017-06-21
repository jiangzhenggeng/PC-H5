/**
 +----------------------------------------------------------
 //创建百度编辑器
 +----------------------------------------------------------
 */

define(['require','jquery','ueditor','layer'],function (require,$,UE,layer){
    layer.ready();
    function _createUE(id) {
        var _editor = UE.getEditor(id,{
            serverUrl:window.FILE_UPLOAD_URL,
            onready:function(){
                $(_editor.body).find('img[_url]').each(function () {
                    $(this).replaceWith('<embed ' +
                        'type="application/x-shockwave-flash" ' +
                        'class="edui-faked-video" ' +
                        'pluginspage="http://www.macromedia.com/go/getflashplayer" ' +
                        'src="'+$(this).attr('_url')+'" ' +
                        'width="'+$(this).attr('width')+'" ' +
                        'height="'+$(this).attr('height')+'" ' +
                        'wmode="transparent" ' +
                        'play="true" ' +
                        'loop="false" ' +
                        'menu="false" ' +
                        'allowscriptaccess="never" ' +
                        'allowfullscreen="true"/>');
                });

                var tipsHtml = '<div class="tooltip" style="display: none;"><div class="tooltip_inner"></div><i class="tooltip_arrow"></i></div>';
                $('body').append(tipsHtml);
                var tooltip = jQuery('.tooltip');
                $('.edui-toolbar > .edui-box').hover(function(event){
                    tooltip.show().find('.tooltip_inner').html($(this).find('[title]').eq(0).attr('title'));

                    var offset = $(this).offset() ,
                        left = offset.left - tooltip.width()/2 + $(this).width()/2 ,
                        top = offset.top - $(this).height()/2 - 15;
                    tooltip.css('left',left).css('top',top);
                },function(){
                    tooltip.hide();
                });
                // .end().on('click','img[data-img-type=1]',function () {
                //     var lId = layer.msg('图片加载中',{time:9999999999});
                //     var _src = $(this).attr('src').replace('_gif/640','/640');
                //     var img = new Image();
                //     img.onload = function () {
                //         layer.closeAll();
                //         layer.open({
                //             type: 1,
                //             title: false,
                //             closeBtn: 0,
                //             area:[this.width+'px',this.height+'px'],
                //             shadeClose: true,
                //             content: '<div style="margin: auto;">' +
                //             '<img src="'+_src+'" /></div>'
                //         });
                //     };
                //     img.src = _src;
                // });
                //设置gif样式
                // $(_editor.document).find('head').append('<style>' +
                //     'p img[data-img-type=1]{position: relative;}' +
                //     'p img[data-img-type=1]:after{' +
                //     'content:"GIF";' +
                //     'position: absolute;' +
                //     'color: red;' +
                //     'right: 0;' +
                //     'top: 0;' +
                //     'font-size: 14px}' +
                //     '</style>');
            }
        });
        _editor.addListener("beforepaste",function (type,html) {
            if(html.html){
                html.html = html.html.replace(/<img[^>](\/>|>)/ig,'');
            }
        });
        return _editor;
    }

    return {
        init:_createUE
    };

});
