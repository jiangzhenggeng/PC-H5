/**
 +----------------------------------------------------------
 //文章显示页模块
 +----------------------------------------------------------
 */

define([
    'jquery', './global.fun', './index', 'app/comment',
    'app/videoAdapt', 'app/chat' ,'app/lazyload',
    'app/cardAuto','app/tplEngine', 'app/unitTool',
    'app/articleZan', 'app/scrollStatus', 'layer'
], function (
    $, global, index, comment,
    videoAdapt, chat, lazyload, cardAuto,
    tplEngine, unitTool,articleZan, scrollStatus,layer
) {

    function _comment() {
        window.comment = comment;
        window.__no_session_cache__ = true;
        new index.init({
            url: '/api/comment/GetComment',
            sendData: {
                type: type,
                id: blogid,
            },
            callBack: function (o) {
                comment.getFirstComment();
            }
        });
    }

    return {
        init:function () {
            _comment();

            //视频自适应
            videoAdapt.init({
                selecter: '.main-box',
            });
            chat.countdown();
            chat.countdownRun();
            //图片延迟加载
            lazyload.init('.main-box img');

            //卡片自适应大小
            // document['domain'] = 'jiguo.com';
            cardAuto.init();

            //获取相关文章
            var tplFunCache = tplEngine.init($('#ajax-loading-relative-articel-box-tpl').html());
            $.get('/api/article/BlogLinkBlog', {
                size: 4,
                type: 4,
                id: blogid,
                limit:0
            }, function (repalyData) {
                var html = tplFunCache({data: repalyData.result});
                $('#ajax-loading-relative-articel-box').html(html).attr('data-limit',repalyData.limit);

            }, 'json');



            //点赞
            articleZan.praise();
            articleZan.like();
            var appDownloadShow1 = $('.show-app-down-warp');
            var appDownloadShow2 = $('.app-down-touch-show');

            var start = 0, end = 0;

            window.addEventListener('touchstart', function (e) {
                start = e.touches[0].clientY;
            }, false);

            window.addEventListener('touchmove', function (e) {
                end = e.changedTouches[0].clientY;
                if (end - start < -1) {
                    appDownloadShow2.show();
                    appDownloadShow1.hide();
                } else if (end - start > 1) {
                    appDownloadShow2.hide();
                    appDownloadShow1.show();
                }
            }, false);


            //分享
            $('[data-article-share]').click(function () {
                var id = layer.open({
                    type: 1,
                    anim: 'up',
                    shade: 'background-color: rgba(0,0,0,.3)',
                    style: 'position:fixed; bottom:0;left:0; width: 100%;',
                    content: $('#share-tpl').html(),
                    success: function (l, i) {
                        setTimeout(function () {
                            $(l).find('.share-query').attr('onclick', 'layer.close(' + id + ')');
                        }, 100);
                    }
                });
            });
            //多连接显示
            $('body').on('click', '[data-lick-select-link]', function () {
                var id = layer.open({
                    type: 1,
                    anim: 'up',
                    shade: 'background-color: rgba(0,0,0,.3)',
                    style: 'position:fixed; bottom:0;left:0; width: 100%;',
                    content: tplEngine.init($('#data-lick-select-link-tpl').html(), {data: $.parseJSON($(this).attr('data-lick-select-link'))}),
                    success: function (l, i) {
                        setTimeout(function () {
                            $(l).find('.share-query').attr('onclick', 'layer.close(' + id + ')');
                        }, 100);
                    }
                });
            });

            var windowHeight = $(window).height();
            $('head').append(
                '<style> .hidden{display: none}.box{position: fixed;top: 0;left: 0;height:' + windowHeight + 'px;width:100%;background-color: #fff;z-index:19891015;}</style>'
            );


        }
    };
});
