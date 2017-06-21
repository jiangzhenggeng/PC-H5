/**
 * 倒计时
 * @param intDiff
 */
function timerDaoJiShi(options){
    var options = $.extend({tplFn:''},options);
    function _t() {
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(options.intDiff > 0){
            day = Math.floor(options.intDiff / (60 * 60 * 24));
            hour = Math.floor(options.intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(options.intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(options.intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;

        if(typeof options.tplFn=='function'){
            options.tplFn(day,hour,minute,second);
        }else {
            var tpl = (day>0?(day+"天"):(''))+hour+'时'+minute+'分'+second+'秒'
            options.dom.html( tpl );
        }
        if(options<=0){
            options.callback();
            clearInterval(timer);
            return;
        }
        options.intDiff--;
    }
    var timer = window.setInterval(function(){
        _t();
    }, 1000);
    _t();
}
