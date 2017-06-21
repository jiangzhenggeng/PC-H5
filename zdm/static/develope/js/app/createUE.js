/**
 * Created by jiguo on 17/4/11.
 */
define(['jquery','ueconfig','ueditor','zeroclipboard'],function ($,ueconfig,UE,zcl) {

    function createEditer(id){
        window.ZeroClipboard = zcl;
        var url='/protected/extensions/editor/php/controller.php?uid=11&code=c20ad4d76fe97759aa27a0c99bff6710';
        var _editor = UE.getEditor(id,{
            serverUrl:url,
            onready:function(){
                var tipsHtml = '<div class="tooltip" style="display: none;"><div class="tooltip_inner"></div><i class="tooltip_arrow"></i></div>';
                $('body').append(tipsHtml);
                var tooltip = $('.tooltip');
                $('.edui-toolbar > .edui-box').hover(function(event){
                    tooltip.show().find('.tooltip_inner').html($(this).find('[title]').eq(0).attr('title'));

                    var offset = $(this).offset() ,
                        left = offset.left - tooltip.width()/2 + $(this).width()/2 ,
                        top = offset.top - $(this).height()/2 - 15;
                    tooltip.css('left',left).css('top',top);
                },function(){
                    tooltip.hide();
                });
            }
        });

        return _editor;
    }
    return{
        init:createEditer
    }
});
