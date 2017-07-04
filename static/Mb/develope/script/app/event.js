/**
 * Created by wuhongshan on 2017/5/4.
 */
define(['jquery', 'index', 'app/login', 'layer', 'app/tplEngine', 'app/countdown', 'app/videoAdapt', 'app/theAnchor','app/lazyload','app/function'], function ($, index, login, layer, tplEngine, countdown, videoAdapt, theAnchor,lazyload,fc) {
    function init(){
        var eventid=/(\d+)/.exec(window.location)[0];
        var WIN_W = $(window).width() - 24;
        var html = '<style>' +
            '.mian-stream li.large .stream-box .stream-img{height:' + (WIN_W * 320 / 640) + 'px !important;}' +
            '</style>';
        $('head').eq(0).append(html);
        $('a[data-login]').removeAttr('data-alert');
        // 内容展示更多
        var eventDescHight=$(window).height()*2;
        $('.event-desc').height(eventDescHight);
        $('.read-more').on('click',function () {
            $(this).css('z-index',-100);
            $('.event-desc').height('auto');
        });
        $('.desc-more img').each(function () {
            $(this).height($(this).width()/$(this).data('width')*$(this).data('height'));
        });

        if($('.desc-more').height()<=eventDescHight){
            $('.read-more').trigger('click');
        }
        if($('#apply-report-list').length>0){
            //           显示报告
            var p = 0;
            var tplFunCache = tplEngine.init($('#apply-report-list-tpl').html());

            function showReport() {
                $.get('/api/event/Getarticle', {
                    id: eventid,
                    p: p,
                    size: 3
                }, function (replyData) {
                    if (replyData.success == 'true') {
                        if (replyData.result.data.length < 3) {
                            $('.look-more-artical').removeClass('more').html('没有更多了~');
                        }
                        var html = tplFunCache({data: replyData.result.data});
                        $('#apply-report-list').append(html);
                    } else {
                        $('#apply-report-list').append('<span class="error">数据错误</span>');
                    }
                }, 'json');
            };

            showReport();
            $('body').on('click', '.more',function () {
                p++;
                showReport();
            });
        }



//            锚点
        theAnchor.eventInit();
        //视频
        var width = $('body').width() - 24;
        videoAdapt.init({
            width: width
        });
//            判断登录
        $('body').on('click', '[data-login]', function (e) {
            e.preventDefault();
            if (!window.URL['login']) {
                login.login();
                return false;
            }
        });
//            判断用户组
        $('body').on('click', '[data-alert]', function (e) {
            e.preventDefault();
            var group = tplEngine.init($('#alert-tpl').html());
            var html = $(this).data('alert');
            var groupBox = layer.open({
                type: 1,
                anim: 'up',
                shade: 'background-color: rgba(0,0,0,.3)',
                style: 'width:75%;border-radius:5px',
                content: group({html: html}),
                success: function (l, i) {
                    $('body').on('click', '.know-close', function () {
                        layer.close(groupBox);
                    });
                }
            });
        });
        //pc专享
        $('body').on('click', '[data-pc]', function (e) {
            e.preventDefault();
            var group = tplEngine.init($('#alert-tpl').html());
            var groupBox = layer.open({
                type: 1,
                anim: 'up',
                shade: 'background-color: rgba(0,0,0,.3)',
                style: 'width:75%;border-radius:5px',
                content: group({html: '请用电脑打开该试用进行申请'}),
                success: function (l, i) {
                    $('body').on('click', '.know-close', function () {
                        layer.close(groupBox);
                    });
                }
            });
        });
        //            收藏
        $('body').on('click', '[data-like]', function () {
            if (!window.URL['login']) {
                login.login();
                return false;
            }
            var $that = $(this);
            if ($(this).hasClass('on')) {
                $.get('/api/praise/praise', {
                    id_value:eventid,
                    type: 6,
                    status: -1
                }, function (replyData) {
                    $that.removeClass('on').find('i').removeClass('on animate');
                }, 'json')
            } else {
                $.get('/api/praise/praise', {
                    id_value:eventid,
                    type: 6,
                    status: 1
                }, function (replyData) {
                    if (replyData.resultCode == '-100') {
                        login.login();
                    } else if (replyData.resultCode == '0') {
                        $that.addClass('on').find('i').addClass('on animate');
                    } else {
                        layer.msg('操作失败~请稍后再试')
                    }
                }, 'json')
            }
        });
//            分享
        $('body').on('click', '[data-share]', function () {
           fc.share();
        });
        //多个购买链接
        $('body').on('click', '[data-buy]', function () {
            fc.buy();
        });
        //申请列表
        window.__no_session_cache__ = true;
        new index.init({
            url: '/api/comment/geteventapply.html',
            size: 10,
            boxDom: '#apply-list',
            tplDom: '#apply-list-tpl',
            sendData: {
                id:eventid
            },
            callBack: function () {
                $('#apply-list .ugc:not([data-show])').each(function () {
                    var dom = $(this).find('.line-num');
                    if (dom&&(dom.position().top > $(this).height())) {
                        $(this).attr('data-show','');
                        $(this).after('<a href="javascript:;" class="look-more">展开</a>');
                    }
                })
            }
        });
        $('body').on('click', '.look-more', function () {
            $(this).siblings('.ugc').removeClass('text-ellipsis-5');
            $(this).remove();
        });


        //倒计时
        $('[data-down-time]').each(function () {
            var time = $(this).text();
            var dom = $(this);
            countdown.timeDown({
                dom: dom,
                intDiff: time,
                callback:function(){
                    window.location.reload();
                }
            })
        });
    }
    return  {
        init:init
    }
})
