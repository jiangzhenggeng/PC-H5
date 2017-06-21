/**
 +----------------------------------------------------------
 //直播
 +----------------------------------------------------------
 */

define([
    'global.fun',
    'app/iscroll',
    'app/tplEngine',
    'app/unitTool',
    'layer',
    'socket.io',
    'app/localDataCache'
],function (global,IScroll,tplEngine,unitTool,layer,socket,localDataCache){
    var $ = require('jquery');
    //倒计时容器
    var countdownArray = [],
        isScrollTop = false,
        currLen = 0;
    return {
        heartChat:function () {
            var W_H = $(window).height();
            var header_H = $('.chat-header').height();
            var query_H = $('.chat-query-header').height();
            var input_H = $('.chat-comment-input-warp').height(),
                body_H = W_H-header_H-query_H-input_H;
            $('head').append('<style>.heart-height{height:'+body_H+'px !important}</style>');

            window.body_H = body_H;

            //请求消息数据
            function getRequestData(myScroll,cacheFn,slide) {
                var _this = $(this);
                if(_this.data('loading')) return;

                $.get('/api/live/GetCommentList',{
                    id:window.DATA['id'],
                    type:1,
                    limit:_this.data('limit') || 0
                },function (replayData) {
                    if(replayData.result){
                        var reData = replayData.result.data,
                            html = cacheFn({data:reData}),
                            box = $('#heart-message-list-box');
                        if(slide=='slideDown' && box.find('li').length){
                            box.find('li').eq(0).before( html );
                        }else{
                            box.append( html );
                        }
                        box.resize(function () {
                            myScroll.refresh();
                            myScroll.scrollBy(0,-box.parent().outerHeight() + body_H );
                        });
                        myScroll.refresh();
                        myScroll.scrollBy(0,-box.parent().outerHeight() + body_H );
                        _this.data('limit',replayData.result.limit);
                        _this.data('loading',false);
                    }else{
                        _this.data('loading',true);
                    }
                },'json');
            }

            var cacheFn = tplEngine.init( $('#heart-message-list-box-tpl').html() ),
                myScroll,
                upIcon = $("#up-icon"),
                downIcon = $("#down-icon"),
                heartBodyList = $('.heart-body-list');

            var myScroll = new IScroll(heartBodyList.get(0), {
                mouseWheel: true,
                preventDefault:true,
                probeType: 3,
                click: true
            });
            window.myScroll = myScroll;
            window.cacheFn = cacheFn;

            //第一次请求数据
            getRequestData.apply(heartBodyList,[myScroll,cacheFn]);

            myScroll.on('scroll',function(){
                //scroll事件，可以用来控制上拉和下拉之后显示的模块中，
                //样式和内容展示的部分的改变。
                var y = this.y,
                    maxY = this.maxScrollY - y,
                    downHasClass = downIcon.hasClass("reverse_icon"),
                    upHasClass = upIcon.hasClass("reverse_icon");
                if(y >= 40){
                    !downHasClass && downIcon.addClass("reverse_icon");
                    return "";
                }else if(y < 40 && y > 0){
                    downHasClass && downIcon.removeClass("reverse_icon");
                    return "";
                }

                if(maxY >= 40){
                    !upHasClass && upIcon.addClass("reverse_icon");
                    return "";
                }else if(maxY < 40 && maxY >=0){
                    upHasClass && upIcon.removeClass("reverse_icon");
                    return "";
                }
            });

            myScroll.on("slideDown",function(){
                //当下拉，使得边界超出时，如果手指从屏幕移开，则会触发该事件
                if(this.y > 30){
                    //获取内容于屏幕拉开的距离
                    //可以在该部分中，修改样式，并且仅限ajax或者其他的一些操作
                    //此时只是为了能演示该功能，只添加了一个alert功能。
                    //并且，由于alert会阻塞后续的动画效果，所以，
                    //添加了后面的一行代码，移除之前添加上的一个样式
                    upIcon.removeClass("reverse_icon");
                    getRequestData.apply(heartBodyList,[this,cacheFn,'slideDown']);
                }
            });

            myScroll.on("slideUp",function(){
                if(this.maxScrollY - this.y > 40){
                    upIcon.removeClass("reverse_icon");
                }
                this.refresh();
            });

        },
        heartInput:function () {
            var triggerHander = $('[data-trigger-heart-input]'),
                heartInput = $('[data-heart-input]'),
                heartInputText = heartInput.find('.text');

            triggerHander.click(function () {
                heartInput.addClass('show');
                heartInputText.focus();
            });

            heartInputText.blur(function () {
                heartInput.removeClass('show');
            });
        },
        imgUpload:function () {

            function preImg(sourceId, targetId) {
                if (typeof FileReader === 'undefined') {
                    console.log('您的浏览器不支持FileReader');
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    var img = document.getElementById(targetId);
                    img.src = this.result;
                }
                reader.readAsDataURL(document.getElementById(sourceId).files[0]);
            }

            var hideUploadIframe = $('#hideUploadIframe'),
                hideUploadInputFile = $('#hideUploadInputFile'),
                blogFormCover = $('#blogFormCover'),
                kRid = '';

            hideUploadInputFile.change(function () {
                kRid = K.randomId();
                var html = tplEngine.init($('#heart-message-upload-img-tpl').html(),{
                    data:{
                        rId:kRid
                    }
                });
                //显示图片预览
                preImg('hideUploadInputFile',kRid);
                var box = $('#heart-message-list-box');

                $('#loading'+kRid).show();

                box.append( html );
                window.myScroll.scrollBy(0,-box.parent().outerHeight() + window.body_H );
                window.myScroll.refresh();
                blogFormCover.submit();
            });

            hideUploadIframe.load(function () {
                var
                    body = (this.contentDocument || this.contentWindow.document).body,
                    result = body.innerText || body.textContent || '{}',
                    json = {},
                    time = 1.5;
                try {
                    json = (new Function("return " + result))();
                }catch (e){
                    layer.open( {
                        skin: 'msg',
                        time: time || 2,
                        content:'上传失败,请重新试试'
                    });
                    return;
                }

                if( !('url' in json.result) ){
                    layer.open( {
                        skin: 'msg',
                        time: time || 2,
                        content:'没有url'
                    });
                    return;
                }

                var img = new Image(),
                    key = '?time='+(+~new Date());
                img.src = json.result.url  + key;

                img.onload = function () {
                    $('#'+kRid).attr('src',json.result.url + key);
                    $('#loading'+kRid).hide();
                    //提交数据到服务器
                    $.get('/api/live/PostComment',{
                        type:1,
                        msg:'',
                        commentid:'',
                        pic:['',''],
                    },function () {

                    },'json');
                };
                img.src = json.result.url  + key;
                window.myScroll.refresh();

            });
        },
        viewer:function (selector) {

            var imgWarp = $(selector),
                viewerWarp = $('.img-viewer-warp'),
                viewerInner = viewerWarp.find('.img-viewer-inner .viewer-box'),
                viewrTitle = viewerWarp.find('.viewer-title'),
                W_W = $(window).width(),
                W_H = $(window).height(),
                imgArray = [],
                imgLen = 0,
                Li = viewerInner.find('li'),
                curr = 0,
                currIndex,
                _src = '_src';

            Li.find('.item').height( W_H-70 ).width(W_W);

            imgWarp.on('click','img[data-viewer]',function (e) {
                imgArray = imgWarp.find('img[data-viewer]');
                imgLen = imgArray.length;
                viewerWarp.show();

                currIndex = imgArray.index( this );
                Li.attr('class','');
                viewerInner.attr('style','transition-duration:0ms;');

                Li.eq(1).attr('class','curr').find('img').attr('src',$(this).attr(_src));
                curr = 1;
                viewrTitle.eq(1).html($(this).attr('data-index'));

                if(currIndex-1>=0){//不是第一张
                    viewrTitle.eq(0).html($(this).attr('data-index'));
                    Li.eq(0).attr('class','prev').find('img').attr('src', imgArray.eq(currIndex-1).attr(_src) );
                }
                if(currIndex+1<imgLen){//不是最后一张
                    viewrTitle.eq(2).html($(this).attr('data-index'));
                    Li.eq(2).attr('class','next').find('img').attr('src', imgArray.eq(currIndex+1).attr(_src) );
                }
                e.preventDefault();

            });

            var startX = 0,endX = 0;
            viewerWarp.on('touchstart',function (e) {
                startX = pageX = e.originalEvent.targetTouches[0].pageX;
                e.preventDefault();
                viewerInner.attr('style','transition-duration:0ms;');
            }).on('touchmove',function (e) {
                e.preventDefault();
                var pageX = e.originalEvent.targetTouches[0].pageX;
                endX = pageX;
                viewerInner.attr('style','transition-duration:0ms;transform:translate3d('+(pageX - startX)+'px, 0px, 0px) translateZ(0px);');
            }).on('touchend',function (e) {
                e.preventDefault();
                var moveX = startX-endX,
                    endPos = 0,
                    c = currIndex,
                    currChangeIndex,
                    prevChangeIndex,
                    nextChangeIndex;

                if(moveX > 50){
                    //向右滑动
                    if(currIndex<imgLen-1){//不是最后一页

                        if(curr ==0 ){
                            prevChangeIndex= 0;
                            currChangeIndex = 1;
                            nextChangeIndex= 2;
                        }else if(curr ==1 ){
                            nextChangeIndex= 0;
                            prevChangeIndex = 1;
                            currChangeIndex= 2;
                        }else if(curr ==2 ){
                            currChangeIndex= 0;
                            nextChangeIndex = 1;
                            prevChangeIndex= 2;
                        }

                        endPos = -W_W;
                        curr++;
                        currIndex++;
                        if(curr>2) curr = 0;
                    }else{
                        endPos = 0;
                    }
                }else if(moveX < -50 ){
                    //向左滑动
                    if(currIndex>0){

                        if(curr ==0 ){
                            nextChangeIndex= 0;
                            prevChangeIndex = 1;
                            currChangeIndex= 2;
                        }else if(curr ==1 ){
                            currChangeIndex= 0;
                            nextChangeIndex = 1;
                            prevChangeIndex= 2;
                        }else if(curr ==2 ){
                            prevChangeIndex= 0;
                            currChangeIndex = 1;
                            nextChangeIndex= 2;
                        }

                        endPos = W_W;
                        curr--;
                        currIndex--;
                        if(curr<0) curr = 2;
                    }else{
                        endPos = 0;
                    }
                }

                viewerInner.attr('style','transform:translate3d('+( endPos )+'px, 0px, 0px) translateZ(0px);transition-duration:160ms;');

                if(endPos==0) return;

                setTimeout(function () {
                    viewerInner.attr('style','transform:translate3d(0px, 0px, 0px) translateZ(0px);transition-duration:0ms;');

                    viewrTitle.eq(prevChangeIndex).html( imgArray.eq(currIndex-1).attr('alt'));
                    viewrTitle.eq(currChangeIndex).html( imgArray.eq(currIndex).attr('alt'));
                    viewrTitle.eq(nextChangeIndex).html( imgArray.eq(currIndex+1).attr('alt'));

                    Li.eq(currChangeIndex).attr('class','curr');
                    Li.eq(prevChangeIndex).attr('class','prev')
                        .find('img').attr('src', imgArray.eq(currIndex-1).attr(_src) );
                    Li.eq(nextChangeIndex).attr('class','next')
                        .find('img').attr('src', imgArray.eq(currIndex+1).attr(_src) );

                    if(currIndex<=0){
                        Li.eq(prevChangeIndex).attr('class','');
                    }
                    if(currIndex>=imgLen-1){
                        Li.eq(nextChangeIndex).attr('class','');
                    }

                },160);
            });
        },
        closeOpenTag:function () {
            $('.open-all').click(function () {
                var parent = $(this).parent();
                if(parent.hasClass('on')){
                    parent.removeClass('on');
                }else{
                    parent.addClass('on');
                }
            });
        },
        //状态栏位置监听
        categoryPos:function () {


        },
        liveList:function () {

            var requireThis = this;
            function getRequestData(cacheFn) {
                var _this = this;

                if( _this.data('loading') ) return;

                _this.data('loading',true);

                _this.loadingObj.show();
                _this.noDataObj.hide();

                $.get('/api/live/GetCommentList',{
                    id:window.DATA['id'],
                    type:2,
                    limit:_this.data('limit') || 0,
                    tag:_this.data('tagid') || 0
                },function (replayData) {
                    if(replayData.result){
                        var reData = replayData.result.data,
                            html = cacheFn({data:reData});
                        currLen = unitTool.getLength(reData);

                        _this.append( html );
                        _this.data('limit',replayData.result.limit);
                        _this.data('loading',false);
                        localDataCache.setPageCacheData('limit',replayData.result.limit);

                        //触发倒计时
                        requireThis.countdown();

                        if(unitTool.getLength(replayData.result.data)<20){
                            _this.loadingObj.hide();
                            _this.data('loading',true);
                            _this.noDataObj.show();
                        }
                    }else{
                        _this.loadingObj.hide();
                        _this.data('loading',true);
                        _this.noDataObj.show();
                    }
                    if(window.myScroll){
                        window.myScroll.refresh();
                    }
                },'json');
            }

            var box = $('#live-list-data-warp'),
                boxHeight = box.height(),
                winHeight = $(window).height(),
                winScrollTop = $(window).scrollTop(),
                cacheFn = tplEngine.init($('#live-list-data-warp-tpl').html());

            box.loadingObj = $('.loading-more');
            box.noDataObj = $('.no-data');

            //切换标签
            var selectBox = $('.chat-select-box') , selectBoxLi = selectBox.find('li'),
                timer = null;
            selectBox.on('click','li',function () {

                var dataTagA = $(this).find('a');
                if( dataTagA.attr('data-tag-id')==box.data('tagid') ){
                    //return;
                }

                var winWidth = $(window).width();
                var winHeight = $(window).height();
                var winScrollTop = $(window).scrollTop();

                //记录id
                window.__tagId__ = dataTagA.attr('data-tag-id');
                box.data('tagid',window.__tagId__ );

                localDataCache.setPageCacheData('__tagId__',window.__tagId__);

                localDataCache.setPageCacheData('back','');

                //初始化状态
                selectBoxLi.removeClass('on');
                $(this).addClass('on');

                //如果是展开状态，就关闭菜单
                $(this).parent().parent().removeClass('on');
                //设置位置
                $(this).parent().animate({
                    'scrollLeft': $(this).offset().left + $(this).parent().scrollLeft() - (winWidth / 2 - $(this).width() / 2)
                },260);
                //box.parent().parent().css('min-height',(winScrollTop + winHeight ) - box.offset().top - 90 );

                //初始化数据
                box.html('');
                box.data('limit',0);
                box.data('loading',false);
                //请求数据
                getRequestData.apply(box,[cacheFn]);
                //情况倒计时
                countdownArray = [];


                if(window.myScroll){
                    window.myScroll.scrollTo(0,0);
                    window.myScroll.refresh();
                }
            });

            var myScroll = new IScroll($('#chat-iscroll-warp').get(0), {
                mouseWheel: true,
                preventDefault:true,
                probeType: 3,
                click: true
            });

            window.myScroll = myScroll;

            myScroll.on('scroll',function(){
                //scroll事件，可以用来控制上拉和下拉之后显示的模块中，
                //样式和内容展示的部分的改变。
            });

            box.data('loading',false);


            var chatHeaderCommonHide = $('.chat-header-common-hide'),
                chatHeaderCommonHideHeight = chatHeaderCommonHide.height();

            var chatCategoryItem = $('[chat-category-item]'),
                chatHeader = $('.chat-header'),
                chatHeaderHeight = chatHeader.outerHeight(),
                top = 0;

            var isTop = false,
                body = $('body'),
                posY = 0;

            myScroll.on("scroll",function(){

                posY = this.y;

                if( -(this.maxScrollY - this.y) <= 200 ){
                    getRequestData.apply(box,[cacheFn]);
                }

                if( -(this.maxScrollY - this.y) <= 20 ){
                    myScroll.refresh();
                }
                if(isTop) return false;

                top = this.y + chatHeaderCommonHideHeight;
                if( top<=0 ){
                    if(top>=-chatHeaderHeight ){
                        chatHeader.css('top', top);
                    }else{
                        chatHeaderCommonHide.remove();
                        myScroll.scrollBy(0,0);
                        body.append( chatCategoryItem.addClass('fixed') );
                        box.css('margin-top',90);
                        chatHeader.css('top', -50);
                        isTop = true;
                        myScroll.refresh();
                    }
                }else{
                    chatHeader.css('top', 0);
                }
            });

            body.on('click','a[href]',function () {
                localDataCache.setPageCacheData('back','true');
                localDataCache.setPageCacheData('pos',posY || 0);
                localDataCache.setPageCacheData('lidata',box.html() );
            });

            var __data_cache__ = localDataCache.getPageCacheData('lidata');
            if( localDataCache.getPageCacheData('back') && String(__data_cache__).replace(/\s/,'')!=''){
                isTop = true;
                top = -50;
                chatHeader.css('top', top);
                chatHeaderCommonHide.remove();
                box.html(__data_cache__);

                __data_cache__ = null;

                $('.card-kill[data-countdown-runing]').removeAttr('data-countdown-runing');

                requireThis.countdown();

                body.append( chatCategoryItem.addClass('fixed') );
                box.css('margin-top',90);

                isTop = true;
                myScroll.scrollBy(0, localDataCache.getPageCacheData('pos')-90 );

                myScroll.refresh();

                window.__tagId__ = localDataCache.getPageCacheData('__tagId__');

                box.data('limit',localDataCache.getPageCacheData('limit'));
                box.data('tagid',window.__tagId__);
                var __li__ = selectBox.find('li'),
                    winWidth = $(window).width();
                __li__.each(function () {
                    if($(this).find('a').attr('data-tag-id')==window.__tagId__){

                        //如果是展开状态，就关闭菜单
                        __li__.removeClass('on');
                        //设置位置
                        $(this).parent().animate({
                            'scrollLeft': $(this).offset().left + $(this).parent().scrollLeft() - (winWidth / 2 - $(this).width() / 2)
                        },260);
                        $(this).addClass('on');
                        return false;
                    }
                });

            }else{
                //第一次获取数据
                selectBox.find('li').first().trigger('click');
            }

        },
        socketIo:function (sin) {
            // 连接服务端
            var socketObj = socket('http://io.jiguo.com:2120');
            // 连接后登录
            socketObj.on('connect', function(){
                this.emit('login',sin+'&'+window.DATA['id']);
            });

            var requireThis = this;
            var tplEngine = require('app/tplEngine'),
                chcheFn = tplEngine.init($('#live-list-data-warp-tpl').html()),
                html = '',
                box = $('#live-list-data-warp'),
                liBox = null,
                len = 0,
                maxLen = 100,
                timer = null,
                sexTime = 1000,
                now,
                starttime;

            starttime = Date.parse(new Date());
            // 后端推送来消息时
            socketObj.on('live_'+window.DATA['id'], function(msg){

                msg = $.parseJSON(msg);

                if( /*(msg.type==3 && window.location.href.indexOf('mb/live/LiveList')>0 ) ||*/
                    (msg.type==0 && window.location.href.indexOf('mb/live/CommentList')>0 )
                ){

                    // if( msg.type==3 && window.__tagId__!=0 && msg.webtag != window.__tagId__ ){
                    //     return;
                    // }

                    currLen += unitTool.getLength(msg.comment);

                    html = chcheFn({data:[msg.comment]}) + html;

                    var fn = function () {
                        liBox = box.find('li');
                        len = liBox.length;
                        if(len){
                            liBox.first().before(html);
                            if(currLen>maxLen){
                                liBox.each(function (i) {
                                    if(i>maxLen ){
                                        $(this).remove();
                                        box.data('limit',0);
                                        box.data('loading',false);
                                    }
                                });
                            }
                        }else{
                            box.append(html);
                        }
                        html = '';
                        //触发倒计时
                        requireThis.countdown();
                    };

                    now = Date.parse(new Date());

                    if(timer) clearTimeout(timer);

                    if(now - starttime > sexTime){
                        fn();
                        starttime = now;
                    }else{
                        timer = setTimeout(function () {
                            fn();
                        },sexTime);
                    }
                }else if(msg.type==2){
                    //更新tag
                    var tag = msg.tag,
                        changeNum = 0,
                        changeAllNum = 0;
                    for ( var k in window.liveTag){
                        for ( var h in tag ){
                            if(
                                window.liveTag[k].id==tag[h].id &&
                                window.__tagId__ == tag[h].id &&
                                window.liveTag[k].num<tag[h].num &&
                                window.__tagId__ != 0
                            ){
                                changeNum += tag[h].num - window.liveTag[k].num;
                            }
                            if(
                                window.liveTag[k].id ==0 &&
                                tag[h].id  == 0
                            ){
                                changeAllNum = tag[h].num - window.liveTag[k].num;
                            }
                        }
                    }
                    window.liveTag2 = tag;
                    if( changeNum>0 && window.__tagId__>0 ){
                        $('.chat-update-warp').show().find('.chat-update-num').html(changeNum);
                    }else if(changeAllNum >0 && window.__tagId__<=0){
                        $('.chat-update-warp').show().find('.chat-update-num').html(changeAllNum);
                    }
                }
            });

            var select = $('.chat-select-box li');
            $('.chat-update-warp').click(function () {
                select.each(function () {
                    if($(this).hasClass('on')){
                        $(this).trigger('click');
                        return false;
                    }
                });
                $(this).hide();
                window.liveTag = window.liveTag2;
            });
        },
        commentLive:function () {

            var requireThis = this;

            function getRequestData(cacheFn) {
                var _this = this;

                if( _this.data('loading') ) return;

                _this.data('loading',true);

                _this.loadingObj.show();
                _this.noDataObj.hide();
                $.get('/api/live/GetCommentList',{
                    id:window.DATA['id'],
                    type:0,
                    limit:_this.data('limit') || 0,
                    tag:_this.data('tagid') || 0
                },function (replayData) {
                    _this.loadingObj.hide();
                    if(replayData.result && unitTool.getLength(replayData.result.data) > 0 ){
                        var reData = replayData.result.data,
                            html = cacheFn({data:reData});
                        _this.append( html );

                        _this.data('limit',replayData.result.limit);
                        _this.data('loading',false);
                        if( unitTool.getLength(replayData.result.data) <20 ){
                            _this.data('loading',true);
                            _this.noDataObj.show();
                        }
                        //触发倒计时
                        requireThis.countdown();
                    }else{
                        _this.data('loading',true);
                        _this.noDataObj.show();
                    }
                },'json');
            }

            var box = $('#live-list-data-warp'),
                boxHeight = box.height(),
                winHeight = $(window).height(),
                winScrollTop = $(window).scrollTop(),
                cacheFn = tplEngine.init($('#live-list-data-warp-tpl').html());

            box.loadingObj = $('.loading-more');
            box.noDataObj = $('.no-data');

            box.data('loading',false);

            //第一次获取数据
            getRequestData.apply(box,[cacheFn]);

            $(window).scroll(function () {
                boxHeight = box.height();
                winScrollTop = $(window).scrollTop();
                if(winScrollTop>= boxHeight - winHeight ){
                    getRequestData.apply(box,[cacheFn]);
                }
            });
        },
        //将倒计时信息存入数组
        countdown:function () {
            var countdownDomBox = $('.card-kill:not([data-countdown-runing])');
            countdownDomBox.attr('data-countdown-runing','runing');

            var elem,a;

            countdownDomBox.each(function () {
                elem = $(this).find('[data-card-kill-timer]');
                countdownArray.push({
                    startTime:elem.attr('data-starttime'),
                    endTime:elem.attr('data-endtime'),
                    elem:elem,
                    elemBox:$(this),
                    elemWarp:elem.parent(),
                    btn:$(this).find('.card-buy')
                });
            });

            if(countdownArray.length){
                //秒杀倒计时
                this.countdownRun();
            }
        },
        //运行倒计时
        countdownRun:function () {

            clearTimeout(window.timer);
            window.timer = null;

            var timestamp,elemBox,elem,currElem,startTime,endTime,intDiff,
                floor = Math.floor ,hour,minute,second,html,delectIndex=[],
                startMs = 9,millisecond = startMs,btn,a,timer=null,
                timerTag = Math.floor(1000/(startMs+1)),offset,windHeight = $(window).height(),scrollTop;

            var tempFunc = function (intDiff) {
                hour = floor(intDiff / (60 * 60) );
                minute = floor(intDiff / 60) - (hour * 60);
                second = intDiff - (hour * 60 * 60) - (minute * 60);

                if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                if (second <= 9) second = '0' + (second>=0?second:0);

                html  = '<span class="kill-timer-number">'+hour+'</span>时<!--';
                html += '--><span class="kill-timer-number">'+minute+'</span>分<!--';
                html += '--><span class="kill-timer-number">'+second+'</span>';
                return html;
            };

            var globalNow = new Date(),
                globalDate = globalNow.getDate(),
                dateHtml,
                chushiHUa = false;

            var runTimerFunc = function() {

                if(countdownArray.length<=0 && window.timer ){
                    clearTimeout(window.timer);
                    window.timer = null;
                    return;
                }

                scrollTop = $(window).scrollTop();

                for(var i=0;i<countdownArray.length;i++){

                    currElem = countdownArray[i];
                    offset = currElem.elemWarp.offset().top;

                    if( ( offset > windHeight + scrollTop || offset<scrollTop) ){
                        continue;
                    }
                    elemBox = currElem.elemBox;
                    elem = currElem.elem;
                    startTime = currElem.startTime;
                    endTime = currElem.endTime;
                    btn = currElem.btn;
                    timestamp = Math.ceil( Date.parse(new Date()) / 1000 );

                    if (startTime <= timestamp && endTime >= timestamp) {
                        //秒杀已经开始
                        html = tempFunc( (endTime - timestamp) >= 0 ? endTime - timestamp : 0 );
                        elem.html( html);
                        btn.addClass('on');
                    }
                    else if (currElem.startTime > timestamp) {
                        //秒杀未开始
                        var startTimp = new Date( parseInt(startTime) * 1000 );
                        var month=startTimp.getMonth() + 1;
                        var date=startTimp.getDate();
                        hour=startTimp.getHours();
                        minute=startTimp.getMinutes();
                        second=startTimp.getSeconds();

                        if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                        if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                        if (second <= 9) second = '0' + (second>=0?second:0);


                        var now12 = Math.floor( new Date(globalNow.getFullYear()+'/'+(globalNow.getMonth()+1)+'/'+globalNow.getDate()+' '+'23:59:59') / 1000 );

                        if( startTime - now12 <=0 ){
                            dateHtml = '今天';
                        }else if(startTime - now12 <= 24 * 60 *60 ){
                            dateHtml = '明天';
                        }else {
                            dateHtml =  '<span class="kill-timer-number">'+month+'</span>月'+
                                '<span class="kill-timer-number">'+date+'</span>日';
                        }
                        html = dateHtml+'<span class="kill-timer-number">'+hour+'</span>:' +
                            '<span class="kill-timer-number">'+minute+'</span>';

                        elem.html( html+'开始' );
                        btn.removeClass('on');
                        delectIndex.push(i);
                    }
                    else if (currElem.endTime <=0 || !currElem.endTime ) {
                        //秒杀已经开始，但没有结束时间
                        var startTimp = new Date( parseInt(startTime) * 1000 );
                        var month=startTimp.getMonth() + 1;
                        var date=startTimp.getDate();
                        hour=startTimp.getHours();
                        minute=startTimp.getMinutes();
                        second=startTimp.getSeconds();

                        if (date <= 9)   date = '0' + (date>=0?date:0);
                        if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                        if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                        if (second <= 9) second = '0' + (second>=0?second:0);

                        html = '已开始';

                        elem.html( html );
                        btn.addClass('on').html('马上抢');
                        delectIndex.push(i);
                    }
                    else if (currElem.endTime < timestamp) {
                        //秒杀已经结束
                        btn.removeClass('on').html('已结束');
                        elem.html('已结束');
                        delectIndex.push(i);
                    }
                }
                delectIndex.sort(function(a,b){
                    return a<=b;
                });
                if(delectIndex.length)console.log( delectIndex );
                for(var i=0;i<delectIndex.length;i++){
                    countdownArray.splice(delectIndex[i],1);
                }
                chushiHUa = true;
                delectIndex=[];
                millisecond--;
                millisecond = millisecond<0?startMs:millisecond;
                window.timer = setTimeout(runTimerFunc,1000);
            };

            window.timer = setTimeout(runTimerFunc,1000);
        }
    };

});
