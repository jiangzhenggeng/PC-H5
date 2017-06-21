/**
 +----------------------------------------------------------
 //首页banner图特效
 +----------------------------------------------------------
 */

define(['require','jquery','superSlide'],function (require,$){
    $(function () {
        $(".banner").slide({
            titCell: ".hd ul",
            mainCell: ".bd ul",
            effect: "fold",
            autoPlay: true,
            autoPage: true,
            trigger: "click",
            interTime:5000,
            prevCell:".prev",
            nextCell:".next"
        });
    });
});
