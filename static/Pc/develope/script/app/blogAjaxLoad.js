/**
 +----------------------------------------------------------
 //加载体验报告流数据
 +----------------------------------------------------------
 */

define([
    'require',
    'jquery',
    'app/common',
    'app/unitTool',
    'app/tplEngine',
    'app/lazyload',
    'layer'
],function (require,$,common,unitTool,tplEngine,lazyload,layer){

    //加载数据
    function _ajaxLoading(options){//全局this
        var self = this;

        self.options = $.extend({
            url:'/api/article/GetBlogLists',
            fireDom:'.loading-more-btn',
            tplDom:'#loading-data-list-tpl',
            boxDom:'#blogAjaxLoad',
            data:{},
            size :20,
            callBack:function () {}
        },options);

        //如果没有URL
        if(self.options.url==null){
            throw '没有URL';
        }

        //触发加载元素
        self.options.fireDom = $(self.options.fireDom);
        self.options.boxDom = $(self.options.boxDom);
        var lp1 = self.options.fireDom.parent(),
            lP = lp1.parent();

        var fireLoading = lP.find('.click-loading');
        var loading = lP.find('.is-loading');
        var noData = lP.find('.no-data');

        //正在加载标志,避免连续加载
        self.load = true;
        self.limit = 0;

        self.item = 0;

        //请求数据
        var sendData = $.extend({},self.options.data);

        var tplFunCache = tplEngine.init($(self.options.tplDom).html());

        //核心加载器
        function loadData (subCallback){
            if (self.load) {
                //改变加载状态
                self.load = false;

                fireLoading.hide();
                loading.show();

                sendData.limit = self.limit;
                sendData.size = self.options.size;

                $.get(self.options.url, sendData ,function(repalyData){

                    loading.hide();

                    var len = unitTool.getLength(repalyData.result);

                    if(len){

                        var html = tplFunCache({data: repalyData.result});
                        self.options.boxDom.append(html);

                        (subCallback || $.noop)();
                        self.limit = unitTool.has(repalyData,'limit')?repalyData.limit:0;
                        self.load = true;

                        fireLoading.show();

                        if(len<self.options.size){
                            self.load = false;
                            fireLoading.hide();
                            noData.show();
                        }
                        //图片延迟加载
                        lazyload.init();
                    }else{
                        self.load = false;
                        noData.show();
                    }
                    self.item++;
                    self.len = len;
                    self.options.callBack(self);
                },'json');
            }
        }

        //是否点击加载过
        self.clickFirst = false;

        //第一次点击加载
        self.options.fireDom.bind('click',function () {

            loadData(function () {
                //如果第一次点击加载成功,则解除点击加载事件
                self.options.fireDom.unbind('click');
                //绑定滚动事件自动加载
                $(window).scroll(function(){
                    var scrollTop = $(document).scrollTop()+$(window).height() + 400 ;
                    if(self.load && scrollTop>self.options.fireDom.offset().top ){
                        loadData();
                    }
                });
            });
        });
        //第一次加载
        loadData();
    }

    return {
        init:_ajaxLoading,
        /**
         +----------------------------------------------------------
         //文章点赞接口
         +----------------------------------------------------------
         */
        praise:function (options,collect) {
            options = $.extend({
                url:'/api/praise/praise',
                tips:'你已点赞'
            },options);
            var Model = this;

            var trigger = $(options.trigger);
            trigger.bind('click',function () {
                var _this = $(this);
                if(collect=='collect'){
                    $.get(options.url,options.data,function (replayData) {
                        if(replayData.resultCode==-100){
                            common.login();
                        }else if(replayData.resultCode==0){
                            if(replayData.result.zan==1) {
                                trigger.addClass('on').find('.icon').addClass('animate');
                            }else{
                                trigger.removeClass('on');
                            }
                        }else{
                            layer.msg('操作失败~请稍后试试');
                        }
                    },'json');
                }else{
                    if(_this.hasClass('on')){
                        layer.tips(options.tips,_this);
                        return;
                    }
                    $.get(options.url,options.data,function (replayData) {
                        if(replayData.resultCode==-100){
                            common.login();
                        }else if(replayData.resultCode==0){
                            trigger.addClass('on').find('.icon').addClass('animate');
                            var num = parseInt(trigger.find('[data-article-zan-num]').html());
                            trigger.find('[data-article-zan-num]').html( num + 1 );
                            Model.getPariseList(blogid);
                        }else{
                            layer.msg('操作失败~请稍后试试');
                        }
                    },'json');
                }
            });
        },
        getRelative:function (sendData) {

            $.get('/api/article/BlogLinkBlog', sendData,function(repalyData){
                var tplFunCache = tplEngine.init($('#loading-data-list-tpl').html());
                var len = unitTool.getLength(repalyData.result.data);
                var ulWidth=730;
                var slide=$(".choice-event-content-wrap");
                var slideWidth=slide.width();
                if(len){
                    var html = tplFunCache({data: repalyData.result});
                    $('#relative-article-warp').show();
                    $('#relative-article').append(html);
                    common.collect('#relative-article');
                    $(".next").attr("limit-data",repalyData.limit);

                    //判断是否首次加载
                    if(sendData.limit >0){
                        if(len<=4){
                            slide.children("ul:last-child").css({"width":ulWidth});
                            slide.css({"width":slideWidth+ulWidth});
                        }else{
                            slide.css({"width":slideWidth+2*ulWidth});
                        }
                        slide.animate({left:"-=730px"},500);
                    }

                    //切换默认图片
                    $("[data-src]:not([data-src-loaded])").one('load', function() {
                        var src=$(this).attr("data-src");
                        $(this).attr("src",src);
                        $(this).attr("data-src-loaded","loaded");

                    }).each(function() {
                        if(this.complete) $(this).load();
                    });

                }else if(sendData.limit ==0){
                    $('#relative-article-warp').remove();
                }else if(sendData.limit>0){
                    $(".next").addClass("next-stop");
                }
            },'json');
        }
        //点赞用户列表
        ,getPariseList:function (blogid) {
            $.get('/api/praise/GetPraiseList',{
                id:blogid,
                type:2
            },function(repalyData){
                var tplFunCache = tplEngine.init($('#article-pariset-list-tpl').html());
                var len = unitTool.getLength(repalyData.result);
                if(len){
                    var html = tplFunCache({data: repalyData.result});
                    $('#article-pariset-list').html(html);
                    $('.last-child').click(function () {
                        $(this).parent().parent().css('height','auto');
                        $(this).remove();
                    });
                }
            },'json');
        }
        //获取关联产品
        ,getLinkProduct:function (blogid) {
            $.get('/api/article/BlogLinkProduct',{
                id:blogid
            },function(repalyData){
                var tplFunCache = tplEngine.init($('#article-link-product-tpl').html());
                var len = unitTool.getLength(repalyData.result);

                if(len){
                    var html = tplFunCache({data: repalyData.result});
                    $('#article-link-product').append(html);
                    $('#article-link-product').parent().parent().show();
                }else{
                    $('#article-link-product').parent().parent().hide();
                }
            },'json');
        }
    };

});
