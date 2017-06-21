/**
 +----------------------------------------------------------
 //搜索
 +----------------------------------------------------------
 */

define([
    'jquery',
    'app/unitTool',
    'app/tplEngine',
],function ($,unitTool,tplEngine){

    var WIN_H = $(window).height();
    //核心加载器
    function _loadData (options){
        var options = $.extend({
            size:4,
            key:'event',
            url:'/api/article/GetArticleList',
            boxDom:'#ajax-loading-home-box',
            fireDom:'.loading-more',
            tplDom:'#ajax-loading-home-box-tpl',
            sendData:{},
        },options);

        this.options = options;

        this.options.boxDom = $(this.options.boxDom);
        this.options.fireDom = $(this.options.fireDom);
        this.options.tplDom = $(this.options.tplDom);
        this.options.noData = $('.no-data');

        this.loading = true;
        var loading = $('.loading');
        this.tplFunCache = tplEngine.init(this.options.tplDom.html());

        this.options.sendData.limit = 0;
        this.options.sendData.size = options.size;
        this.options.sendData.sys = 'mb';
    }

    _loadData.prototype.run = function () {
        var self = this;
        if (!self.loading) {
            return true;
        }
        //改变加载状态
        self.loading = false;

        self.options.fireDom.show();

        $.get(self.options.url, self.options.sendData ,function(replayData){
            var len = unitTool.getLength(replayData.result[self.options.key]);
            if(len){
                var html = self.tplFunCache({data: replayData.result[self.options.key]});
                self.options.boxDom.append(html);
                self.options.sendData.limit = unitTool.has(replayData,'limit')?replayData.limit:0;

                if(len<self.options.sendData.size){
                    self.loading = false;
                    self.options.noData.show();
                    self.options.fireDom.hide();
                }else{
                    self.loading = true;
                    if(WIN_H>self.options.fireDom.offset().top ){
                        self.run();
                    }
                }
            }else{
                self.options.noData.show();
                self.options.fireDom.hide();
                self.load = false;
            }
        },'json');
    }

    function _loadingMore(options) {
        var o = new _loadData(options);
        o.run();
        $(window).scroll(function(){
            var scrollTop = $(document).scrollTop()+$(window).height() + 200 ;
            if(o.loading && scrollTop>o.options.fireDom.offset().top ){
                o.run();
            }
        });
        return o;
    }

    return {
        init:_loadingMore,
        index:function (options) {
            options.sendData = $.extend({},options.sendData);

            $.get('/api/search/index',options.sendData ,function(replayData){

                var type = ['blog','event','product'],
                    find = false;

                for(var i = 0 ,j = type.length;i<j;i++){

                    if(unitTool.getLength(replayData.result[type[i]])){
                        find = true;
                        var html = tplEngine.init($('#search-'+type[i]+'-tpl').html(),{
                            data: replayData.result[type[i]]
                        });
                        $('#search-'+type[i]).html(html);
                        $('#seaech-'+type[i]+'-num').html(replayData.result[type[i]+'_num']);
                        $('#search-'+type[i]+'-warp').show();
                    }else{
                        $('#search-'+type[i]+'-warp').hide();
                    }
                }

                if(!find){
                    $('.no-search-data').show();
                }else{
                    $('.no-search-data').hide();
                }
                $('#search-result-body').fadeIn(120);

            },'json');
        },
    };

});
