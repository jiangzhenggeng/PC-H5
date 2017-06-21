/**
 +----------------------------------------------------------
 //左侧滑动菜单
 +----------------------------------------------------------
 */

define(['jquery','global.fun'],function ($,global){

    window.cssPrifx = ['','-webkit-','-o-','-moz-','-ms-'];

    function _getCss3(obj,type){
        var val = null;
        for(var i=0 , l = window.cssPrifx.length ; i < l ; i++ ){
            val = obj.css(window.cssPrifx[i]+type);
            if(val) return obj.css(window.cssPrifx[i]+type);
        }
    }

    function _setCss3(obj,type,value){
        for(var i=0 , l = window.cssPrifx.length ; i < l ; i++ ){
            obj.css(window.cssPrifx[i]+type,value);
        }
    }

    function preventDefault() {
        event.preventDefault();
    }

    return {
        init:function () {

            var sideMenu = $('#side-menu'),
                sideMenuInner = sideMenu.find('.menu-inner'),
                sideMenuWindth = sideMenuInner.width(),
                mask=sideMenu.find('.mask');

            //点击菜单按钮显示菜单
            $('[data-show-menue]').on('click',function (e) {
                e.preventDefault();
                sideMenu.addClass('show');
                sideMenu.css('zIndex',99);
                //阻止浏览器滑动
                $('body').on('touchmove',function (e) {
                    e.preventDefault();
                })
                _setCss3(sideMenuInner,'transform','translate3d(100%, 0px, 0px)  translateZ(0px)');
                //$(document).bind('touchstart',preventDefault);
            });
            //点击遮罩 菜单消失
            sideMenu.find('.mask').on('click touchmove',function (e) {
                e.preventDefault();
                sideMenu.removeClass('show');
                setTimeout(function () {
                    sideMenu.css('zIndex',-1);
                },400);
                _setCss3(sideMenuInner,'transform','translate3d(0px, 0px, 0px)  translateZ(0px)');
                //$(document).unbind('touchstart',preventDefault);
                //取消浏览器的滑动阻止
                $('body').off('touchmove');
            });


            //滑动菜单
            var parentBox=$('.swipe'),
                childBox=parentBox.find('ul'),
                parentHeight=parentBox.height()-80,
                childHeight=childBox.height(),
                maxPosition=0,
                minPosition=parentHeight-childHeight,
                currentY=0,
                distance=150,
                minSwipe=minPosition-distance,
                maxSwipe=maxPosition+distance;

            function addTransition() {
                _setCss3(childBox,'transition','all 0.3s')
            }
            function removeTransition() {
                _setCss3(childBox,'transition','none')
            }
            function setTranslateY(translateY) {
                _setCss3(childBox,'transform','translate3d(0px, '+translateY+'px, 0px)');
            }
            //        touchstart的坐标
            var startY=0,
//            touchmove的坐标
                endY=0,
//            移动距离
                distanceY=0;
            if(minPosition<0){
                childBox.on('touchstart',function (e) {
                    startY=e.originalEvent.targetTouches[0].clientY;
                });
                childBox.on('touchmove',function (e) {
                    endY=e.originalEvent.targetTouches[0].clientY;
                    distanceY=endY-startY;
                    removeTransition();
                    if((currentY+distanceY)<maxSwipe&&(currentY+distanceY)>minSwipe){
                        setTranslateY(currentY+distanceY);
                    }
                });
                childBox.on('touchend',function (e) {
                    if((currentY+distanceY)>maxPosition){
                        currentY=maxPosition;
                        addTransition();
                        setTranslateY(currentY);
                    }else if((currentY+distanceY)<minPosition){
                        currentY=minPosition;
                        addTransition();
                        setTranslateY(currentY);
                    }else{
                        currentY=currentY+distanceY;
                    }
                    startY=0;
                    endY=0;
                    distanceY=0;
                })
            }

        }
    };

});
