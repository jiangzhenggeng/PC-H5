/**
 * Created by wuhongshan on 2017/7/4.
 */
define(['jquery','layer','app/tplEngine'],function ($,layer,tplEngine) {
    return {
        init:function () {
            var cacheFn = tplEngine.init($('#share-tpl').html());
            var sharebox = layer.open({
                type: 1,
                anim: 'up',
                shade: 'background-color: rgba(0,0,0,.3)',
                style: 'position:fixed; bottom:0;left:0; width: 100%;',
                content: cacheFn({}),
                success: function (l, i) {
                    $('body').on('click', '.share-query', function () {
                        layer.close(sharebox);
                    });
                }
            });
        }
    }
})