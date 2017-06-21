/**
 +----------------------------------------------------------
 //加载新品流数据
 //清单数据流
 +----------------------------------------------------------
 */

define([
    'require',
    'jquery',
    'app/unitTool',
    'app/tplEngine',
    'app/lazyload'
],function (require,$,unitTool,tplEngine,lazyload){

    //加载数据
    function _ajaxLoading(options){//全局this
        var self = this;

        self.options = $.extend({
            url:'/api/article/GetArticleList',
            fireDom:'.loading-more-btn',
            tplDom:'#loading-data-list-tpl',
            boxDom:'#productAjaxLoad',
            data:{},
            size :20
        },options);

        //如果没有URL
        if(self.options.url==null){
            throw '没有URL';
        }

        //触发加载元素
        self.options.fireDom = $(self.options.fireDom);
        self.options.boxDom = $(self.options.boxDom);
        var lP = self.options.fireDom.parent().parent();

        var fireLoading = $('.click-loading');
        var loading = $('.is-loading');
        var noData = $('.no-data');

        //正在加载标志,避免连续加载
        self.load = true;
        self.limit = 0;
        self.p = 0;

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
                        self.p++;
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
        init:_ajaxLoading
    };

});
