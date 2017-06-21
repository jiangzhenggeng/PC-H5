/**
 +----------------------------------------------------------
 //首页 热门试用 图特效
 +----------------------------------------------------------
 */
define([
    'require',
    'jquery',
    'superSlide',
    'app/common',
    'app/unitTool',
    'app/tplEngine',
    'app/lazyload',
],function (
    require,
    $,
    superSlide,
    common,
    unitTool,
    tplEngine,
    lazyload
){

    function _hotEvent() {

        //如果是首页
        var home = $(".hot-event-warp");

        if(home.length){
            home.slide({
                titCell: ".hd ul",
                mainCell: ".bd",
                effect: "left",
                autoPlay: true,
                autoPage: true,
                trigger: "click",
                pnLoop:false,
                interTime:5000,
                prevCell:".prev",
                nextCell:".next"
            });
        }


        var card_warp= $(".event-show-card-warp");

        if(card_warp.length){
            card_warp.on('mouseenter','li',function () {
                $(this).find('.e-item-hide').stop(true,false).slideDown(250);
            }).on('mouseleave','li',function () {
                $(this).find('.e-item-hide').stop(true,false).slideUp(250);
            });
        }
    }


    //加载数据
    function _ajaxLoading(options){//全局this
        var self = this;

        self.options = $.extend({
            url:'/api/event/EventList',
            fireDom:'.loading-more-btn',
            tplDom:'#loading-data-list-tpl',
            boxDom:'#blogAjaxLoad',
            firWarp:'body',
            data:{},
            size :20,
            triggerType:'',
            //数据转换器
            dataChange:function (data) {
                return data;
            },
        },options);

        //如果没有URL
        if(self.options.url==null){
            throw '没有URL';
        }

        //触发加载元素
        var firWarp = $(self.options.firWarp);
        self.options.fireDom = firWarp.find(self.options.fireDom);
        self.options.boxDom = $(self.options.boxDom);

        var fireLoading = firWarp.find('.click-loading');
        var loading = firWarp.find('.is-loading');
        var noData = firWarp.find('.no-data');

        //正在加载标志,避免连续加载
        self.load = true;
        self.limit = 0;

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

                    repalyData = self.options.dataChange(repalyData,self.options);

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
                },'json');
            }
        }

        //是否点击加载过
        self.clickFirst = false;

        //第一次点击加载
        self.options.fireDom.bind('click',function () {
            if(self.options.triggerType!='click'){
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
            }else{
                loadData();
            }
        });
        //第一次加载
        loadData();
    }


    return {
        init:_hotEvent,
        ajaxLoad:_ajaxLoading,
    };
});
