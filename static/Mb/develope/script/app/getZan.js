/**
 * Created by wuhongshan on 2017/2/15.
 */
define(['jquery','app/tplEngine'],function ($,tplEngine) {
    return {
        init: function () {
            //获取点赞列表
            $.get('/api/praise/GetPraiseList', {
                id: blogid,
                type: 3
            }, function (repalyData) {
                var tplFunCache = tplEngine.init($('#praise-list-tpl').html());
                var len = (repalyData.result).length;
                if (len) {
                    $('#praise-list-box').removeClass('none');
                    var html = tplFunCache({data: repalyData.result});
                    var b = $('#praise-list');
                    b.html(html);
                    $('#pariset-number').html(len);
                    b.next('.icon').click(function () {
                        b.css('height', 'auto');
                        $(this).remove();
                    });
                }
            }, 'json');
        }
    }
})