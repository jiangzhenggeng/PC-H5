/**
 +----------------------------------------------------------
 //鼠标移上去显示下载二维码
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){
    function _init() {
        var menu_download = $('.app-download');
        menu_download.hover(function () {
            $(this).find('.app-download-erweima').show();
        },function () {
            $(this).find('.app-download-erweima').hide();
        });
    }

    return {
        init:_init
    };
});
