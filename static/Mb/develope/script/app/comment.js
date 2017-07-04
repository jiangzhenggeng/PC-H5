/**
 +----------------------------------------------------------
 //评论模块
 +----------------------------------------------------------
 */

define([
    'jquery',
    'layer',
    'app/login',
    'app/tplEngine',
    'app/unitTool'
],function ($,layer,login,tplEngine,unitTool){
    if(typeof (blogid)=='undefined' || window.location.href.indexOf('article/article')==-1){
        return{};
    }
    var commentTopBox = $('#comment-top-content'),
        id = blogid,
        liBox = null,
        size = 5;
    window.commentSubView = [];
    window.commentSubView2 = [];

    $('body').on('focus','textarea',function () {
        if(!window.URL['login']){
            login.login();
            return;
        }
    });

    function closeView() {
        var temp = '';
        for(var i=0;i<window.commentSubView.length;i++){
            temp = window.commentSubView.pop();
            temp.hide();
            temp = temp.prev().find('[data-show-comment-replay]');
            temp.addClass('icon').find('.s-2').hide();
            temp.find('.s-1').show();
            temp.data('data-limit','');
        }
    }

    function closeView2() {
        var temp = '';
        for(var i=0;i<window.commentSubView2.length;i++){
            temp = window.commentSubView2.pop();
            temp.hide();
            temp = temp.prev().find('[data-show-comment-replay]');
            temp.addClass('icon').find('.s-2').hide();
            temp.find('.s-1').show();
        }
    }

    //加载更多子评论
    function getSubData(_this,first,size2) {
        var randomid = _this.attr('data-li'),
            UlBox = $('#sub-ul'+randomid);
        var cacheFun = tplEngine.init($('#ajax-loading-sub-tpl').html());

        var fireLoading = UlBox.next();
        var _size = size2 || size;
        fireLoading.find('.comment-click-loading').hide();
        fireLoading.find('.comment-is-loading').show();

        $.get('/api/comment/GetChildcomments', {
            limit: _this.data('data-limit'),
            id: _this.attr('data-cid'),
            size: _size
        }, function (replayData) {
            if(replayData.resultCode==0){

                fireLoading.find('.comment-is-loading').hide();

                var len = unitTool.getLength(replayData.result);
                window.randomid = randomid;
                if(len<=0){
                    fireLoading.hide();
                    return;
                }
                fireLoading.show();
                if(first){
                    UlBox.html(cacheFun({data:replayData.result})).parent().show();
                    if(len>=_size) {
                        fireLoading.find('.comment-click-loading').show();
                    }else{
                        fireLoading.hide();
                    }
                }else{
                    UlBox.append(cacheFun({data:replayData.result})).parent().show();
                    if(len>=_size){
                        fireLoading.find('.comment-click-loading').show();
                    }else{
                        fireLoading.hide();
                    }
                }

                _this.data('data-limit',replayData.limit);
            }else{
                layer.open({content: replayData.errorMsg || '系统错误', time: 1});
            }

        }, 'json');
    }

    //点击加载更多
    $('#ajax-loading-home-box').on('click','.comment-click-loading',function () {
        var _this = $('#fire-loading'+$(this).attr('data-li'));
        getSubData(_this);
    });

    $('body').on('click','[data-show-comment-replay]',function () {
        if(!window.URL['uid']){
            login.login();
            return;
        }

        var ua=navigator.userAgent;
        if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            $('body').css({'height':0});
        }

        var parent_id = $(this).attr('data-parent_id') || 0;
        var commentid = $(this).attr('data-cid') || 0;

        var selecter = $('#'+$(this).attr('data-selecter-warp')),
            cacheFun = tplEngine.init($('#ajax-loading-home-box-tpl').html());
        if(selecter.length<=0){
            selecter = $(this).parent().parent();
        }
        if(commentid){
            cacheFun = tplEngine.init($('#ajax-loading-sub-tpl').html())
        }
        var header_title = '写点评',
            default_title = '写点评...';
        var defaultName = decodeURI($(this).attr('data-username')) || '';
        if(parent_id && commentid){
            header_title = '回复评论';
            var c = decodeURI($(this).attr('data-content')).replace("\n",'');
            if(c.length>20){
                c = c.substr(0,20)+'...';
            }
            default_title = '回复 '+defaultName+'：'+c;
        }

        var noReplayName = false;
        if(this.hasAttribute('data-top-sub')){
            noReplayName = true;
        }

        var layerId = layer.open({
            type:1,
            anim: 'up',
            shade: false,
            style: 'position:absolute;top:0;left:0;width:100%;height:100%;',
            content: tplEngine.init($('#input-replay-comment-tpl').html(),{
                header_title:header_title,
                default_title:default_title
            }),
            success:function (l, i) {
                var send = false,
                    clickSendBtn = $(l).find('#input-replay-comment-send'),
                    clickCloseBtn=$(l).find('#input-replay-comment-warp-close');
                $(l).find('.layui-m-layercont').addClass('layui-m-layercont-my');
                $(l).find('textarea').keyup(function (e) {
                    if(String($(this).val()).replace(/^\s+|\s+$/,'')!==''){
                        send = true;
                        clickSendBtn.addClass('red').removeClass('gray');
                    }else{
                        send = false;
                        clickSendBtn.addClass('gray').removeClass('red');
                    }
                });
                setTimeout(function () {
                    $(l).find('textarea').focus();
                },1000);
                // setTimeout(function () {
                //     $(l).find('#input-replay-comment-warp-close').attr('onclick','layer.close('+layerId+')');
                // },100);
                //点击发送
                var sending = false;
                $('#input-replay-comment-centent').click(function () {
                    $(this).removeAttr('readonly');
                }).trigger('click');

                clickSendBtn.click(function () {
                    var content = String($(l).find('#input-replay-comment-centent').val()).replace(/^\s+|\s+$/,'');
                    if(sending){
                        return;
                    }
                    if(content.length<=0){
                        layer.open({content: '请先填写内容',skin: 'msg',time: 1.5});
                        return;
                    }

                    sending = true;
                    $.get('/api/comment/PostComment',{
                        id:blogid,
                        type:type,
                        content:content,
                        parent_id:parent_id,
                        commentid:commentid,
                    },function (replayData) {
                        
                        if(replayData.resultCode==-100){
                            login.login();
                        }else if(replayData.resultCode==0){
                            $('body').css({'height':'100%'});
                            var html = cacheFun({data:[{
                                uid:replayData.result.uid,
                                username:replayData.result.username,
                                content:content,
                                add_time:'刚刚',
                                avatar:replayData.result.avatar,
                                praise:0,
                                reply:0,
                                replyuser:noReplayName?'':(
                                    defaultName?defaultName:(
                                    ('replyuser' in replayData.result)?replayData.result.replyuser:'')),
                                cid:replayData.result.cid,
                                style:''
                            }]});

                            var setComment =  selecter.find('li:first');
                            if(selecter.parent().css('display')=='none'){
                                selecter.parent().show().find('.fire-loading').hide();
                            }

                            if(setComment.length){
                                setComment.before(html);
                            }else{
                                selecter.append(html);
                            }
                            if(!parent_id && !commentid){
                                var all = $('[data-dianping-number]');
                                all.html(parseInt(all.html())+1);
                            }
                            layer.open({content: '评论成功',skin: 'msg',time: 1,end:function () {
                                layer.closeAll();
                                sending = false;
                            }});

                        }else{
                            layer.open({content: replayData.errorMsg || '系统错误',skin: 'msg',time: 1,end:function () {
                                sending = false;
                            }});
                        }
                    },'json');
                });
                clickCloseBtn.click(function () {
                    layer.closeAll();
                    $('body').css({'height':'100%'});
                })
            }
        });
    });

    return {
        getFirstComment:function () {
            $('[data-first-loading]').each(function () {
                getSubData($(this),true,2);
                $(this).removeAttr('data-first-loading');
            });
        },
        praise:function (_this) {
            if($(_this).hasClass('on')){
                return;
            }
            $.get('/api/praise/praise',{
                'id_value':$(_this).attr('cid'),
                'status':'1',
                'type':3
            },function (replayData) {
                if(replayData.resultCode==0){
                    $(_this).addClass('on animate').html(parseInt($(_this).html())+1);
                }else if(replayData.resultCode==-100){
                    login.login();
                }
            },'json');
        },
        replySub:function (_this) {
            closeView2();
            var Box = $(_this).parent().next();
            window.commentSubView2.push(Box);
            Box.show();
        }
    };
});
