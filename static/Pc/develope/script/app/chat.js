/**
 +----------------------------------------------------------
 //直播
 +----------------------------------------------------------
 */

define([
    'global.fun',
    'app/tplEngine',
    'app/unitTool',
    'socket.io',
    'layer'
],function (global,tplEngine,unitTool,socket,layer){
    var $ = require('jquery');
    //倒计时容器
    var countdownArray = [],
        currLen = 0;

    var updateNumberBox = $('.update-number'),
        updateNumberBoxTop = updateNumberBox.css('top');

    return {
        getCommentItemData:function () {
            var selfObj = this;
            function getRequestData(cacheFn) {
                var _this = this;
                if( _this.data('loading') ) return;

                _this.data('loading',true);
                _this.loadingObj.stop(false,true).slideDown(160);

                $.get('/api/live/GetCommentList',{
                    id:window.DATA['id'],
                    type:0,
                    limit:_this.data('limit') || 0,
                    tag:_this.data('tagid') || 0
                },function (replayData) {
                    setTimeout(function () {
                        _this.loadingObj.stop(false,true).slideUp(160,function () {
                            _this.data('loading',false);
                        });
                    },800);

                    if(replayData.result && unitTool.getLength(replayData.result.data) > 0 ){
                        var reData = replayData.result.data,
                            html = cacheFn({data:reData});
                        if(_this.find('li').length){
                            _this.find('li').first().before( html );
                        }else{
                            _this.append( html );
                        }
                        _this.data('limit',replayData.result.limit);
                        selfObj.countdown();
                    }
                },'json');
            }

            var box = $('#comment-list-data-warp'),
                cacheFn = tplEngine.init($('#comment-list-data-warp-tpl').html());

            box.loadingObj = $('.right-loading-more');

            box.data('loading',false);

            //第一次获取数据
            getRequestData.apply(box,[cacheFn]);

            var time = Date.parse(new Date()),
                darenBox = $('.chat-daren-warp');

            darenBox.on("mousewheel DOMMouseScroll", function (e) {
                if( box.data('loading') || Date.parse(new Date()) - time <1000 ){
                    e.preventDefault();
                    return false;
                }
                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                    (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
                if (delta > 0) {
                    // 向上滚
                    if( $(this).scrollTop()<=0 ){
                        time = Date.parse(new Date());
                        getRequestData.apply(box,[cacheFn]);
                    }
                }
            });
        },
        getliveItemData:function () {
            var selfObj = this;

            function getRequestData(cacheFn,clear) {
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
                    _this.loadingObj.hide();
                    if(replayData.result && unitTool.getLength(replayData.result.data) > 0 ){
                        var reData = replayData.result.data,
                            html = cacheFn({data:reData});

                        if(clear){
                            _this.html( html );
                        }else{
                            _this.append( html );
                        }

                        _this.data('limit',replayData.result.limit);
                        _this.data('loading',false);
                        selfObj.countdown();
                        if( unitTool.getLength(replayData.result.data)<20 ){
                            _this.data('loading',true);
                            _this.noDataObj.show();
                        }
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

            var dataCategoryTag = $('[data-category-tag]'),
                dataCategoryTagHeight = dataCategoryTag.height(),
                chatRight = $('.chat-right'),
                headerH = $('body > .header').outerHeight(),
                innerHeadetrH = $('.chat-right-inner .headetr').outerHeight(),
                chatinputH = $('.chat-input').outerHeight(),
                bottomH = 10,
                darenBox = $('.chat-daren-warp'),
                HH = headerH + innerHeadetrH + chatinputH + 40 + bottomH - 2,
                dataCategoryTagOffsetH = dataCategoryTag.offset().top,
                chatRightOffsetH = chatRight.offset().top,
                winWidth = $(window).width(),
                _left = (winWidth - 1080) / 2;

            window.dataCategoryTagFixed = false;

            $(window).scroll(function () {
                boxHeight = box.height();
                winScrollTop = $(window).scrollTop();
                if(winScrollTop>= boxHeight - winHeight ){
                    getRequestData.apply(box,[cacheFn]);
                }
                if( $(window).scrollTop() + headerH >= dataCategoryTagOffsetH ){
                    dataCategoryTag.addClass('fixed');
                    dataCategoryTag.css('left', _left>=0?_left:0 );
                    window.dataCategoryTagFixed = true;
                }else{
                    dataCategoryTag.removeClass('fixed');
                    dataCategoryTag.css('left', '0' );
                    window.dataCategoryTagFixed = false;
                }

                if( $(window).scrollTop() + headerH >= chatRightOffsetH ){
                    chatRight.addClass('fixed');
                }else{
                    chatRight.removeClass('fixed');
                }
            });

            $(window).resize(function () {
                darenBox.css({
                    'height': $(window).height() - HH
                });
                if( $(window).width()>1080 ){
                    chatRight.css({
                        'right':($(window).width() - 1080) / 2,
                        'left':'auto'
                    });
                }else{
                    chatRight.css({
                        'left': 1080 - chatRight.width()
                    });
                }
            });
            $('.chat-main').css('min-height',$(window).height());
            darenBox.css({
                'height': $(window).height() - HH
            });
            if( $(window).width()>1080 ){
                chatRight.css({
                    'right':( $(window).width() - 1080) / 2,
                    'left':'auto'
                });
            }else{
                chatRight.css({
                    'left': 1080 - chatRight.width()
                });
            }
            chatRight.animate({
                opacity:1
            },160);

            updateNumberBox.click(function () {
                box.data('loading',false);
                box.data('limit',0);
                window.liveTag = window.liveTag2;
                getRequestData.apply(box,[cacheFn,true]);
                $(this).animate({
                    opacity:0
                },100,function () {
                    $(this).hide();
                });
            });

            var categoryTagBox = $('.category-tag'),
                categoryTagBoxUl = categoryTagBox.find('ul'),
                categoryTagBoxLi = categoryTagBox.find('li'),
                _offsetTop = $('.chat-content-body-warp').offset().top;

            categoryTagBox.on('click','li',function () {
                categoryTagBoxLi.removeClass('on');
                $(this).addClass('on');
                window.__tagId__ = $(this).find('a').attr('data-tag-id');

                box.data('loading',false);
                box.data('limit',0);
                box.data('tagid',window.__tagId__);

                getRequestData.apply(box,[cacheFn,true]);

                var _thisW = $(this).width(),
                    W_W = $(window).width() - 375,
                    _thisPos = $(this).offset().left,
                    UlW = categoryTagBoxUl.width(),
                    UlScr = categoryTagBoxUl.scrollLeft();

                if( _thisPos > W_W/2  ){
                    categoryTagBoxUl.animate({
                        'scrollLeft':UlScr + ( _thisPos - W_W / 2   - _thisW / 2 )
                    });
                }else{
                    categoryTagBoxUl.animate({
                        'scrollLeft':UlScr - ( W_W / 2 - _thisPos  - _thisW / 2 )
                    });
                }

                //设置当前标签id到url避免刷新丢失
                window.location = window.location.href.split('#')[0] + '#'+window.__tagId__;

                //设置滚动条位置
                if( window.dataCategoryTagFixed ){
                    $(window).scrollTop( _offsetTop - 70 - 38 - 6 );
                }

            });

            if(window.location.href.split('#').length==2){
                window.__tagId__ = window.location.href.split('#')[1];
            }else{
                window.__tagId__ = 0;
            }

            categoryTagBox.find('li a[data-tag-id='+window.__tagId__+']').parent().trigger('click');

            categoryTagBox.on('click','.category-tag-next',function () {
                categoryTagBoxUl.animate({
                    'scrollLeft':categoryTagBoxUl.scrollLeft() + 80
                });
                categoryTagBox.find('.category-tag-prev').addClass('on');

            }).on('click','.category-tag-prev',function () {
                categoryTagBoxUl.animate({
                    'scrollLeft':categoryTagBoxUl.scrollLeft() - 80
                });
                categoryTagBox.find('.category-tag-next').addClass('on');
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
                startMs = 99,millisecond = startMs,btn,a,timer=null,
                timerTag = Math.floor(1000/(startMs+1)),offset,windHeight = $(window).height(),scrollTop;

            $(window).resize(function () {
                windHeight = $(window).height();
            });

            var tempFunc = function (intDiff) {
                hour = floor(intDiff / (60 * 60) );
                minute = floor(intDiff / 60) - (hour * 60);
                second = intDiff - (hour * 60 * 60) - (minute * 60);

                if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                if (second <= 9) second = '0' + (second>=0?second:0);

                html  = '<span class="kill-timer-number">'+hour+'</span>时<!--';
                html += '--><span class="kill-timer-number">'+minute+'</span>分<!--';
                html += '--><span class="kill-timer-number">'+second+'</span>秒<!--';
                html += '--><span class="kill-timer-number millisecond">'+millisecond+'</span>';
                return html;
            };

            var globalNow = new Date(),
                globalDate = globalNow.getDate(),
                dateHtml,
                chushiHUa = false;

            var runTimerFunc = function() {

                if(countdownArray.length<=0 && window.timer){
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

                        html =
                            '<span class="kill-timer-number">'+month+'</span>月' +
                            '<span class="kill-timer-number">'+date+'</span>日' +
                            '<span class="kill-timer-number">'+hour+'</span>:' +
                            '<span class="kill-timer-number">'+minute+'</span>';

                        elem.html( '秒杀已于'+html+'开始' );
                        btn.addClass('on').html('购买');
                        delectIndex.push(i);
                    }
                    else if (currElem.endTime < timestamp) {
                        //秒杀已经结束
                        btn.removeClass('on').html('已结束');
                        elem.html('秒杀已结束');
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
                window.timer = setTimeout(runTimerFunc,timerTag);
            };

            window.timer = setTimeout(runTimerFunc,timerTag);
        },
        chatChangeView:function () {
            var chatRightBody = $('.chat-right-body > *'),
                chatChangeView = $('#chat-change-view'),
                _this = null;
            chatChangeView.on('click','li',function () {
                chatChangeView.find('li').removeClass('on');
                _this = $(this).addClass('on');

                chatRightBody.each(function () {
                    if($(this).attr('id')==_this.attr('data-target') ){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
            });
        },
        showDownApp:function () {
            layer.ready(function () {
                var id = K.randomId(),
                    html = $('#app-down-show-erweima-tpl').html();
                layer.ready(function () {
                    var lId = layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        shadeClose: true,
                        area:['350px','350px'],
                        content: '<div id="'+id+'">'+html+'</div>',
                        success:function (layero, index) {
                            setTimeout(function () {
                                $(layero).find('.apply-input-close').attr('onClick','layer.close(\''+lId+'\')');
                            });
                        }
                    });
                });
            });
        },
        socketIo:function (sin) {
            // 连接服务端
            var socketObj = socket('http://io.jiguo.com:2120');
            // 连接后登录
            socketObj.on('connect', function(){
                this.emit('login',sin+'&'+window.DATA['id'] );
            });

            var requireThis = this;
            var tplEngine = require('app/tplEngine'),
                chcheFn = tplEngine.init($('#comment-list-data-warp-tpl').html()),
                html = '',
                box = $('#comment-list-data-warp'),
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
                console.log(msg);

                msg = $.parseJSON(msg);

                if( msg.type==0 ){

                    currLen += unitTool.getLength(msg.comment);

                    html = chcheFn({data:[msg.comment]}) + html;

                    var fn = function () {
                        liBox = box.find('li');
                        len = liBox.length;
                        box.append(html);
                        box.parent().animate({scrollTop:99999999},260);

                        if(currLen>maxLen){
                            liBox.each(function (i) {
                                if(i>maxLen ){
                                    $(this).remove();
                                    box.data('limit',0);
                                    box.data('loading',false);
                                }
                            });
                        }
                        html = '';
                        if(msg.type==3) {
                            //触发倒计时
                            requireThis.countdown();
                        }
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

                }

                else if(msg.type==2){
                    //更新tag
                    var tag = msg.tag,
                        changeNum = 0,
                        changeAllNum = 0,
                        aNum = 0;
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
                        aNum = changeNum;
                    }else if(window.__tagId__<=0){
                        aNum = changeAllNum;
                    }
                    //console.log( aNum + '|' + changeAllNum +'|'+changeNum );

                    if(aNum>0){
                        updateNumberBox.css('opacity',0).show().animate({
                            opacity:1
                        },260).find('#update-number-box').html(aNum);
                    }
                }
            });
        }
    };

});
