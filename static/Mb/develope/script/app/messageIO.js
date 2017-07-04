/**
 +----------------------------------------------------------
 //socket.io消息实时推送
 +----------------------------------------------------------
 */

define(['require', 'jquery', 'socket.io'], function (require, $, io) {

    /**
     * '<?php echo $_SESSION['uid'].'&'.md5('news'.$_SESSION['uid']);?>'
     * UID
     * @param userssid
     * @private
     */
    function _pushNotification(userssid) {
        // 连接服务端
        var socket = io('http://io.jiguo.com:2126');
        // 连接后登录
        socket.on('connect', function () {
            socket.emit('login', userssid);
        });
        // 后端推送来消息时
        socket.on('h5-news', function (msg) {
            eval('msg = ' + msg);
            var tempFunc = function (number, selecter, tips) {
                if (parseInt(number) > 99) {
                    html = '99';
                } else {
                    html = number;
                }
                $(selecter).find('>.badge').remove();
                if (tips == 'tips') {
                    $(selecter).append('<em class="badge"></em>');
                } else {
                    $(selecter).append('<em class="badge number">' + html + '</em>');
                }
            };

            if (msg != null) {
                var html = 0;
                if (msg.type == 'news') {
                    //消息
                    if (typeof(msg.num) != 'undefined' && parseInt(msg.num) > 0) {
                        // 显示数字
                        tempFunc(msg.num, '[data-badge-warp]');
                    } else if (parseInt(msg.num) == 0 && typeof (msg.tips) != 'undefined' && parseInt(msg.tips) > 0) {
                        // 显示点
                        tempFunc(msg.tips, '[data-badge-warp]', 'tips');
                    }
                } else if (msg.type == 'broadcast') {
                    var unreadNum ;
                    if ($('[data-badge-warp] .number')) {
                        unreadNum = $('[data-badge-warp] .number').html();
                    }
                    if (typeof unreadNum != 'undefined') return false;
                    tempFunc(msg.tips, '[data-badge-warp]', 'tips');
                }
            }
        });
    }

    return {
        init: _pushNotification
    };
});

