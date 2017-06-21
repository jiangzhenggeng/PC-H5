/**
 * Created by wuhongshan on 2017/4/15.
 */
define(['jquery'], function ($) {

    function countDown(id, time) {
        var displayTime,html;

        function showTime() {
            var day = Math.floor(time / (60 * 60 * 24));
            var hour = Math.floor(time / (3600)) - (day * 24);
            var minute = Math.floor(time / (60)) - (day * 24 * 60) - (hour * 60);
            var second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            time = parseInt(time) - 1;
            if(time<=0){
                html='0天00小时00分00秒';
            }else{
                html = day + '天' + hour + '小时' + minute + '分' + second + '秒';
            }
            $(id).html(html);
        };
        showTime();
        displayTime = setInterval(function () {
            showTime();
        }, 1000);
        if (time <0) {
            clearInterval(displayTime);
            return;
        }

    };
    function countUp(id, time) {
        var displayTime;

        function showTime() {
            var day = Math.floor(time / (60 * 60 * 24));
            var hour = Math.floor(time / (3600)) - (day * 24);
            var minute = Math.floor(time / (60)) - (day * 24 * 60) - (hour * 60);
            var second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            if (hour <= 9) hour = '0' + hour;
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            time = parseInt(time) + 1;
            var html = day + '天' + hour + '小时' + minute + '分' + second + '秒';
            $(id).html(html);
        };
        // showTime();
        displayTime = setInterval(function () {
            showTime();
        }, 1000);
    };
    return {
        countDown: countDown,
        countUp: countUp,
    }
})