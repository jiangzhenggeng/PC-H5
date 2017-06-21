/**
 * Created by wuhongshan on 2017/2/15.
 */
define(['jquery','app/tplEngine'],function ($,tplEngine) {
    return {
        init: function (options) {
            //获取点赞列表
            $.get('/api/praise/GetPraiseList', {
                id: options.id,
                type: options.type,
            }, function (repalyData) {
                var tpl=options.tpl||$('#praise-list-tpl');
                var tplFunCache = tplEngine.init(tpl.html());
                var len = (repalyData.result).length;
                if (len) {
                    $('[data-praise-num]').html(len);
                    $('#praise-list-box').removeClass('none');
                    var html = tplFunCache({data: repalyData.result});
                    var box = options.box||$('#praise-list');
                    box.html(html);
                }
            }, 'json');
        }
    }
})