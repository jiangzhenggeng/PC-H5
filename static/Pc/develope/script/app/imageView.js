/**
 +----------------------------------------------------------
 // 图片查看器
 +----------------------------------------------------------
 */

define(['jquery','app/tplEngine','global.fun'],function ($,tplEngine,_){

    function Base() {
        this.imgArray = [];
    }

    Base.prototype = {
        getImg : function (selector) {
            selector = $(selector);
            var _this = this;
            _this.imgArray = [];
            selector.find('img').each(function () {
                _this.imgArray.push({
                    src:$(this).attr('src'),
                    title:$(this).attr('title') || $(this).attr('alt'),
                    width:$(this).attr('data-width'),
                    height:$(this).attr('data-height'),
                    type:$(this).attr('data-img-type'),
                    original:$(this).attr('data-original'),
                });
            });

            $('#'+this.viewId).remove();

        },
        setImgArray:function (array,clear) {
            if(clear){
                this.clearImgArray();
            }

            for (var i in array){
                this.imgArray.push(array[i]);
            }
            $('#'+this.viewId).remove();
        },
        clearImgArray:function () {
            this.imgArray = [];
            $('#'+this.viewId).remove();
        },
        createTpl:function (cuurObj) {

            var _this = this;

            if( $('#'+_this.viewId).length>0 ){
                return true;
            }
            _this.viewId = K.randomId();

            $('body').append(tplEngine.init($('#data-imgea-view-tpl').html(),{
                dataItem:_this.imgArray,
                tplId:_this.viewId,
                cuurObj:cuurObj,

            }));
            
            $('body').on('click',".image-show-content",function () {
                _this.close();
            }).on('click','.item-wrap',function () {
                _this.curr = $(this);

                var o = $(this).parent();
                o.parent().find('li.on').removeClass('on');
                o.addClass('on');

                if( !_this.imgShow ){
                    _this.imgShow = $('.image-show-item-real').find('img');
                }

                _this.imgShow.attr('src',$(this).find('img').attr('data-larg-src') );

                if( _this.curr.parent().prev('li').length<=0 ){
                    $('.image-view-prev').css('opacity',0.3);
                }else{
                    $('.image-view-prev').css('opacity',1);
                }

                if( _this.curr.parent().next('li').length<=0 ){
                    $('.image-view-next').css('opacity',0.3);
                }else{
                    $('.image-view-next').css('opacity',1);
                }
                return false;
            }).on('click','.image-view-prev',function () {
                if( _this.curr.parent().prev('li').length>0 ){
                    _this.curr.parent().prev('li').find('.item-wrap').trigger('click');
                }
                return false;
            }).on('click','.image-view-next',function () {
                if( _this.curr.parent().next('li').length>0 ){
                    _this.curr.parent().next('li').find('.item-wrap').trigger('click');
                }
                return false;
            }).on('click','.image-show-item-real',function(){
                return false;
            });

            _this.currAll = $('.bottom-item-wrap').find('li .item-wrap');
            _this.curr = _this.currAll.first();

            _this.currAll.each(function () {
                if($(this).find('img').attr('src')==cuurObj.attr('src')){
                    _this.curr = $(this);
                    return false;
                }
            });

            _this.curr.trigger('click');

        },
        run:function (options) {
            if(this._run) return true;

            var _this = this;

            $('.comment-list-box').on('click','img[data-show-larg]',function (e) {

                e.preventDefault();

                var a = $(this).closest('a'),
                    a_href = a.attr('href');
                a.attr('href','javascript:;');
                setTimeout(function () {
                    a.attr('href',a_href);
                },800);
                _this.clearImgArray();

                _this.getImg( $(this).closest('.comment-content-data-img') );

                _this.createTpl( $(this) );

                $(document.body).css("overflow","hidden");
            });

            this._run = true;
        },
        close:function () {
            $(document.body).css("overflow","visible");

            $('body')
                .off('click','.image-view-close')
                .off('click','.item-wrap')
                .off('click','.image-view-prev')
                .off('click','.image-view-next');
            this.imgShow = null;
            $('#'+this.viewId).remove();
        }
    };

    return {
        init: new Base()
    }
});
