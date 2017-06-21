/**
 +----------------------------------------------------------
 //文章评论模块
 +----------------------------------------------------------
 */

define([
    'jquery',
    'app/common',
    'app/unitTool',
    'app/tplEngine',
    'layer',
],function (
    $,
    common,
    unitTool,
    tplEngine,
    layer
){

    window.viewArray = [];
    function _closeView() {
        for(;window.viewArray.length;){
            window.viewArray.pop().slideUp('160',function () {
                $(this).prev().find('.s-1').show();
                $(this).prev().find('.s-2').hide();
            });
        }
    }

    function _isBarCloseCommentList(liIDObj) {
        var liIDObjSub = liIDObj.find('> .comment-list-box');
        var WIN_H =$(window).height();
        var sub = liIDObjSub.find('.comment-sub-shouqi');
        var fix = 100;
        var lit = liIDObjSub.offset().top;
        var wSt = $(window).scrollTop();
        var top = wSt + WIN_H - fix - lit - 62;
        if(top>liIDObjSub.height() - fix ){
            top = liIDObjSub.height() - fix;
        }
        if(top<=20) top = 20;

        sub.css({
            'top': top
        });
    }


    return {
        init:function () {

            var cacheFun = tplEngine.init($('#comment-show-list-tpl').html());
            var cacheSubFun = tplEngine.init($('#comment-show-list-sub-tpl').html());

            function _getList() {
                this.limit = 0;
                this.id=blogid;
                this.type=2;
                this.size=10;
                this.len = 0;
                this.is_loading = false;
                this.commentWarp = $('#comment-show-list');
                this.loadmore = $('.comment-load-more');
                this.loading = $('.comment-load-ing');
                this.nodata = $('.comment-load-no-data');

                this.commentWarp.on('blur','textarea[data-comment-replay-sub]',function () {
                    var _this = this;
                    setTimeout(function () {
                        $(_this).parent().parent().parent().hide();
                    },180);
                });
            }
            //原型扩展
            _getList.prototype = {

                getData:function () {
                    var _this = this;
                    if(_this.is_loading) return;
                    _this.is_loading = true;

                    _this.loadmore.hide();
                    _this.loading.show();

                    $.get('/api/comment/GetComment',{
                        limit:_this.limit,
                        id:_this.id,
                        type:_this.type,
                        size:_this.size
                    },function (replayData) {
                        _this.loading.hide();

                        _this.len = unitTool.getLength(replayData.result);
                        if(_this.len){
                            for(var ii in replayData.result){
                                replayData.result[ii].subString = '';
                                if(('child_comment' in replayData.result[ii]) && unitTool.getLength(replayData.result[ii].child_comment)>0 ){
                                    replayData.result[ii].subString = cacheSubFun({data:replayData.result[ii].child_comment});
                                }
                            }
                            _this.commentWarp.append( cacheFun({data:replayData.result}) );
                            _this.limit = replayData.limit;
                            _this.is_loading = false;
                            if(_this.len<_this.size){
                                _this.is_loading = true;
                                _this.nodata.show();
                            }else{
                                _this.loadmore.show();
                            }
                        }else{
                            _this.is_loading = true;
                            _this.nodata.show();
                        }
                    },'json');
                }
            };

            //加载评论
            var comment = new _getList();

            $('.comment-load-more').bind('click',function () {
                comment.getData();
            });
            comment.getData();

        }
        ,
        //发布评论
        sendComment:function () {

            var cacheFun = tplEngine.init($('#comment-show-list-tpl').html());
            var cacheSubFun = tplEngine.init($('#comment-show-list-sub-tpl').html());

            var commentBox = $('#comment-send-top-warp');
            var commentOutWarp = $('#comment-show-list');
            $('body').on('focus','textarea',function () {
                if(!window.URL['login']) {
                    //失去焦点,强制不允许输入
                    $(this).blur();
                    common.login();
                    return;
                }
            });
            var sendBtn = commentBox.find('[data-comment-send]');
            commentBox.on('keyup','[data-comment-textarea]',function () {
                if($(this).val().toString().trim()!='') {
                    sendBtn.removeClass('gray');
                }else{
                    sendBtn.addClass('gray');
                }
            }).on('focus','[data-comment-textarea]',function () {
                sendBtn._TopTextBoxHeight_ = $(this).outerHeight();
                $(this).height(60);
            }).on('blur','[data-comment-textarea]',function () {
                setTimeout(function () {
                    $(this).height(sendBtn._TopTextBoxHeight_);
                },1000);
            });

            layer.ready();

            var sendTopComment = false;
            //发布祝评论
            commentBox.on('click','[data-comment-send]',function () {
                var textBox = commentBox.find('[data-comment-textarea]');
                var content = textBox.val().toString().trim();
                if(content==''){
                    layer.msg('请填写评论内容',{time:window.URL['diagloaTime']});
                    return;
                }
                if(sendTopComment){
                    sendTopComment = true;
                    return;
                }
                $.get('/api/comment/PostComment',{
                    id:blogid,
                    type:2,
                    content:content,
                    parent_id:0,
                    commentid:0,
                },function (replayData) {
                    sendTopComment = false;
                    if(replayData.resultCode==0){
                        var html = cacheFun({data:[{
                            uid:replayData.result.uid,
                            username:replayData.result.username,
                            avatar:replayData.result.avatar,
                            content:content,
                            add_time:'刚刚',
                            praise:0,
                            reply:0,
                            cid:replayData.result.cid,
                            style:'display:none;'
                        }]});
                        var setComment =  commentOutWarp.find('li:first');
                        if(setComment.length){
                            setComment.before(html);
                        }else{
                            commentOutWarp.append(html);
                        }
                        textBox.val('');
                        commentOutWarp.find('li:first').slideDown(150);
                        var all = $('#comment-num-all-num');
                        all.html(parseInt(all.html())+1);
                        commentOutWarp.find('li:first').find('.comment-sub-list-warp').hide();
                    }else{
                        layer.msg(replayData.errorMsg || '系统错误',{time:window.URL['diagloaTime']});
                    }
                },'json')
            });

            var sendSubComment = false;
            //点击发送子评论
            commentOutWarp.on('click','[data-comment-sub-send]',function () {

                var _this = $(this);

                var parentTopLi = _this.parents('[data-top-li]');
                var randomLiId = parentTopLi.attr('id');
                var randomSubUlBox = $('#sub-ul'+randomLiId);

                var _parentInputBox = _this.parent().parent();
                var textBox = _parentInputBox.find('[data-comment-sub-textarea]');
                var content = textBox.val().toString().trim();

                if(content==''){
                    layer.msg('请填写评论内容',{time:window.URL['diagloaTime']});
                    return;
                }
                if(sendSubComment){
                    sendSubComment = true;
                    return;
                }
                $.get('/api/comment/PostComment',{
                    id:blogid,
                    type:2,
                    content:content,
                    parent_id:$(this).attr('data-parent_id'),
                    commentid:$(this).attr('data-cid'),
                },function (replayData) {
                    sendSubComment = false;
                    if(replayData.resultCode==0){
                        var html = cacheSubFun({data:[{
                            uid:replayData.result.uid,
                            username:replayData.result.username,
                            replyuser:textBox.attr('data-re-name'),
                            content:content,
                            avatar:replayData.result.avatar,
                            add_time:'刚刚',
                            praise:0,
                            reply:0,
                            cid:replayData.result.cid
                        }]});

                        var setComment =  randomSubUlBox.find('li:first');
                        if(setComment.length){
                            setComment.before(html);
                            randomSubUlBox.find('li:first').hide().slideDown(150);
                        }else{
                            randomSubUlBox.append(html);
                            randomSubUlBox.parent().slideDown(150);
                        }
                        textBox.val('');
                    }else{
                        layer.msg(replayData.errorMsg || '系统错误',{time:window.URL['diagloaTime']});
                    }
                },'json');

            });

            //点击回复按钮---
            commentOutWarp.on('click','[data-replay-top]',function () {

                var _this = $(this);

                var parentTopLi = $(this).parents('[data-top-li]');
                var randomLiId = parentTopLi.attr('id');
                var randomLiIdObjectDom = $('#sub'+randomLiId);

                var __oo_t__ = randomLiIdObjectDom.find('.comment-input-box-outer-warp');

                if(randomLiIdObjectDom.find('#sub-ul'+randomLiId).find('li').length<=0){
                    randomLiIdObjectDom.find('>.comment-list-box').hide();
                }
                if(!_this.data('data-first')){
                    _this.data('data-first',true);

                    if( !window.URL['login']){
                        common.login();
                        return;
                    }
                    __oo_t__.show();
                    __oo_t__.find('textarea').focus();

                    $(window).bind('scroll.a',function () {
                        _isBarCloseCommentList(randomLiIdObjectDom);
                    });

                    parentTopLi.find('.s-1').hide();
                    parentTopLi.find('.s-2').show();

                    randomLiIdObjectDom.slideDown(160,function () {
                        $('html,body').css({'scrollTop':__oo_t__.offset().top - 200});
                    });
                    return;
                }

                if( randomLiIdObjectDom.css('display')=='none' ){

                    randomLiIdObjectDom.slideDown(160,function () {
                        __oo_t__.show();
                        __oo_t__.find('textarea').focus();
                        $('html,body').css({'scrollTop':__oo_t__.offset().top - 200});
                    });

                    parentTopLi.find('.s-1').hide();
                    parentTopLi.find('.s-2').show();

                    randomLiIdObjectDom.off('keyup click');
                    $(window).bind('scroll',function () {
                        _isBarCloseCommentList(randomLiIdObjectDom);
                    });

                }else{
                    randomLiIdObjectDom.slideUp(160,function () {
                        parentTopLi.find('.s-1').show();
                        parentTopLi.find('.s-2').hide();
                    });
                    randomLiIdObjectDom.off('keyup click');
                    $(window).unbind('scroll.a');
                }
            });

            //键盘事件,调整按钮状态---
            commentOutWarp.on('keyup','[data-comment-sub-textarea]',function () {
                var b = $(this).parent().parent().next().find('.btn');
                if($(this).val().toString().trim()!='') {
                    b.removeClass('gray');
                }else{
                    b.addClass('gray');
                }
            });

            //点击自评论加载按钮---
            commentOutWarp.on('click','[data-sub-load-more]',function () {
                var _this = $(this);
                if( _this.data('loading')==true) return;
                _this.data('loading',true);

                var parentTopLi = _this.parents('[data-top-li]');

                var randomLiId = parentTopLi.attr('id');
                var randomLiIdObjectDom = $('#sub'+randomLiId);

                _this.hide();
                var _this_next = _this.nextAll('.comment-load-ing');
                _this_next.show();

                $.get('/api/comment/GetChildcomments',{
                    id:parentTopLi.attr('data-cid'),
                    size:200
                },function (replayData) {
                    _this_next.hide();
                    _this.hide();
                    _this.prev().html(cacheSubFun({data: replayData.result}));
                    _this.prev().prev().show();
                    $(window).bind('scroll.a',function () {
                        _isBarCloseCommentList(randomLiIdObjectDom);
                    });
                },'json');
            });

            //点赞---
            commentOutWarp.on('click','[data-sub-zan]',function () {
                if(!window.URL['login']){
                    common.login();
                    return;
                }
                var _this = $(this);
                if(_this.hasClass('red')){
                    return;
                }

                $.get('/api/praise/praise',{
                    id_value:$(this).attr('data-cid'),
                    status:'',
                    type:3
                },function (replayData) {
                    if(replayData.resultCode==-100){
                        common.login();
                        return;
                    }
                    if(replayData.resultCode==0){
                        var b = _this.find('[data-sub-zan-box]');
                        b.html(parseInt(b.html())+1);
                        _this.addClass('red like');
                    }
                },'json');
            });

            //点击回复图标---
            commentOutWarp.on('click','[data-sub-replay]',function () {
                if(!window.URL['login']){
                    common.login();
                    return;
                }
                var _o_ = $(this).parent().parent().next('.comment-input-box');
                _o_.show();
                _o_.find('textarea').focus();
            });

            //点击取消按钮---
            commentOutWarp.on('click','[data-sub-cansel]',function () {
                $(this).parent().parent().hide();
            });

            //点击回复图标---
            commentOutWarp.on('click','[data-cansel]',function () {
                $(this).parent().parent().hide();
            });



        },

    };
});
