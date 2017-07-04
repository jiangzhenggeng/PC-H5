/**
 +----------------------------------------------------------
 //socket.io消息实时推送
 +----------------------------------------------------------
 */

define(['require','jquery','socket.io'],function (require,$,io){

    /**
     * '<?php echo $_SESSION['uid'].'&'.md5('news'.$_SESSION['uid']);?>'
     * UID
     * @param userssid
     * @private
     */
    function _pushNotification(userssid){
        // 连接服务端
        var socket = io('http://io.jiguo.com:2126');
        // 连接后登录
        socket.on('connect', function(){
            socket.emit('login',userssid);
        });
        // 后端推送来消息时
        socket.on('pc-news', function(msg){
            eval('msg = '+msg);
            var tempFunc = function(number,selecter,tips){
                if(parseInt(number)>99){
                    html = '<font>99</font>';
                }else{
                    html = number;
                }
                $(selecter).find('>.badge').remove();
                $(selecter).parent('.badge-number').show();
                if(tips=='tips'){
                    $(selecter).each(function () {
                        if($(this).hasClass('badge-new')){
                            $(this).append('<em class="badge badge-new-dot dot"></em>');
                        }else{
                            $(this).append('<em class="badge dot"></em>');
                        }
                    });
                }else{
                    $(selecter).each(function () {
                        if($(this).hasClass('badge-new')){
                            $(this).append('<em class="badge number">('+html+')</em>');
                        }else{
                            $(this).append('<em class="badge number">'+html+'</em>');
                        }
                    });
                }
            };

            if(msg!=null){
                _msg=msg.data;

                var html = 0;

                //广播消息显示点
                if( msg.type=='broadcast'){
                    if($("[data-badge-warp]").find(">.badge").length>0){
                        return;
                    }
                    //系统消息显示
                    tempFunc(msg.tips,'.systemsnews','tips');
                    //外层角标显示
                    tempFunc(msg.tips,'[data-badge-warp]','tips');

                //非广播消息
                }else if(msg.type=='news'){
                    //系统消息、积分消息显示点     试用消息、评论消息、赞消息显示数字

                    if( typeof(_msg.event)!='undefined' && parseInt(_msg.event)>0 ){
                        tempFunc(_msg.event,'.eventnews');
                    }

                    if(typeof(_msg.systems)!='undefined' && parseInt(_msg.systems)>0){
                        tempFunc(_msg.systems,'.systemsnews','tips');
                    }

                    if(typeof(_msg.coin)!='undefined' && parseInt(_msg.coin)>0){
                        tempFunc(_msg.coin,'.coinnews','tips');
                    }

                    if(typeof(_msg.comment)!='undefined' && parseInt(_msg.comment)>0){
                        tempFunc(_msg.comment,'.commentnews');
                    }

                    if(typeof(_msg.zan)!='undefined' && parseInt(_msg.zan)>0){
                        tempFunc(_msg.zan,'.zannews');
                    }
                }

                //外层角标

                if(typeof(msg.num)!='undefined' && parseInt(msg.num)>0){
                    tempFunc(msg.num,'[data-badge-warp]');
                }else if(typeof(msg.tips)!='undefined' && parseInt(msg.tips)>0){
                    if($("[data-badge-warp]").find(">.badge").length>0){
                        return;
                    }
                    tempFunc(msg.tips,'[data-badge-warp]','tips');
                }
            }
        });
    }

    return {
        init:_pushNotification
    };
});

