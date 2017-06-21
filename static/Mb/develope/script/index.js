/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'jquery',
    'app/unitTool',
    'app/tplEngine',
    'app/md5',
    'app/localDataCache',
],function ($,unitTool,tplEngine,md5,localDataCache){

    var WIN_H = $(window).height(),
        sessionKey = md5.init(window.location.href);
    //核心加载器
    function _loadData (options){
        var options = $.extend({
            size:10,
            url:'/api/article/GetArticleList',
            boxDom:'#ajax-loading-home-box',
            fireDom:'.loading-more',
            tplDom:'#ajax-loading-home-box-tpl',
            sendData:{},
            firstNoData:false,
            topic:false,
            data:false,//返回数据为result中的data
            touchBox:false,//data-touchBox的scroll事件
            callBack:function () {}
        },options);

        this.options = options;

        this.__box__ = options.boxDom;

        this.options.boxDom = $(this.options.boxDom);
        this.options.fireDom = $(this.options.fireDom);

        var lp = this.options.fireDom.parent();

        this.options.noData = lp.find('.no-data');
        this.options.firstNoDataDom = lp.find('.first-no-data');
        this.options.notTopicDom = lp.find('[data-notTopic]');
        this.options.topicDom = lp.find('[data-topic]');

        this.options.tplDom = $(this.options.tplDom);

        this.loading = true;
        var loading = $('.loading');
        this.tplFunCache = tplEngine.init(this.options.tplDom.html());

        this.options.sendData.limit = 0;
        this.options.sendData.size = options.size;
        this.options.sendData.sys = 'mb';
        this.options.first = true;
    }

    _loadData.prototype.run = function () {
        var self = this;
        if (!self.loading) {
            return true;
        }
        //改变加载状态
        self.loading = false;

        self.options.fireDom.show();
        self.options.noData.hide();
        self.options.firstNoDataDom.removeClass('flex');
        self.options.notTopicDom.show();
        self.options.topicDom.hide();

        $.get(self.options.url, self.options.sendData ,function(repalyData){
            var len;
            if(self.options.data){
                len = unitTool.getLength(repalyData.result.data);

            }else{
                len = unitTool.getLength(repalyData.result);
            }
            if(len){
                var html = self.tplFunCache({data: repalyData.result});
                
                self.options.boxDom.append(html);
                self.options.sendData.limit = unitTool.has(repalyData,'limit')?repalyData.limit:0;
                if(len<self.options.sendData.size){
                    self.loading = false;
                    self.options.noData.show();
                    self.options.fireDom.hide();
                }else{
                    self.loading = true;
                    if(self.options.fireDom.length && WIN_H>self.options.fireDom.offset().top ){
                        self.run();
                    }
                }

                //数据缓存存储
                html = localDataCache.getPageCacheData( sessionKey ) + html;
                localDataCache.setPageCacheData( sessionKey, html);
                localDataCache.setPageCacheData( sessionKey + 'limit', self.options.sendData.limit);
                localDataCache.setPageCacheData( sessionKey + 'box', self.__box__);
                localDataCache.setPageCacheData( sessionKey + 'time', +new Date() );

            }else{
                if(self.options.first && self.options.firstNoData ){

                    var height=$(window).height()-self.options.firstNoDataDom.parent().parent().offset().top;
                    self.options.firstNoDataDom.addClass('flex').removeClass('pdt15').css('height',height);

                    if(self.options.topic){
                        self.options.topicDom.show();
                        self.options.notTopicDom.hide();
                    }else{
                        self.options.topicDom.hide();
                        self.options.notTopicDom.show();
                    }
                }else{
                    self.options.noData.show();
                    self.options.firstNoDataDom.removeClass('flex');
                }
                self.load = false;
                self.options.fireDom.hide();
            }
            self.options.callBack(self,len);
            self.options.first = false;

        },'json');
    }

    function _loadingMore(options) {

        var cacheTime = localDataCache.getPageCacheData( sessionKey + 'time' );
        if( ( +new Date() - cacheTime )>180 * 1000 ){
            [
                sessionKey,
                sessionKey + 'limit',
                sessionKey + 'box',
                sessionKey + 'point'
            ].forEach(function (val,index) {
                localDataCache.delPageCacheData(val);
            });
        }

        var o = new _loadData(options);

        var
            cacheData = localDataCache.getPageCacheData( sessionKey ),
            cacheLimit = localDataCache.getPageCacheData( sessionKey + 'limit' ),
            cacheBox = localDataCache.getPageCacheData( sessionKey + 'box' ),
            scrollTopPoint = localDataCache.getPageCacheData( sessionKey + 'point' ),
            hasLoad = true;

        if( typeof window.__no_session_cache__=='undefined' && cacheBox && cacheData ){

            $(cacheBox).html(cacheData);
            o.options.sendData.limit = cacheLimit;
            if(scrollTopPoint>0){
                setTimeout(function () {
                    $('html,body').animate({'scrollTop':scrollTopPoint},160,function () {
                        hasLoad = true;
                    });
                },20);
            }
            hasLoad = false;
        }else{
            o.run();
            hasLoad = true;
        }
        if(o.options.touchBox){
            // 设置了-webkit-overflow-scroll:touch window.scroll不生效
            $('[data-touchBox]').scroll(function () {
                var scrollTop = $('[data-touchBox]').scrollTop()+$('[data-touchBox]').height() + 200 ;
                localDataCache.setPageCacheData( sessionKey + 'point', $(window).scrollTop() );
                if(o.loading && o.options.fireDom.length && scrollTop>o.options.fireDom.offset().top && hasLoad ){
                    o.run();
                }
            })
        }else{
            $(window).scroll(function(){
                var scrollTop = $(window).scrollTop()+$(window).height() + 200 ;
                localDataCache.setPageCacheData( sessionKey + 'point', $(window).scrollTop() );
                if(o.loading && o.options.fireDom.length && scrollTop>o.options.fireDom.offset().top && hasLoad ){
                    o.run();
                }
            });
        }

    }
    //清除缓存
    $(function () {
        $('.logo>h1>a[href]').click(function () {
            sessionStorage.clear();
        });
    });

    return {
        init:_loadingMore,
    };

});
