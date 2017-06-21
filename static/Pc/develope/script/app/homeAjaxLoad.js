/**
 +----------------------------------------------------------
 //jQuery ajax 首页精选流加载器
 +----------------------------------------------------------
 */

define([
    'require',
    'jquery',
    'app/unitTool',
    'app/tplEngine',
    'app/lazyload'
],function (require,$,unitTool,tplEngine,lazyload){

    var WIN_H = $(window).height();
    //加载数据
    function _ajaxLoading(options){//全局this
        var self = this;

        self.options = $.extend({
            url:'/api/article/GetArticleList',
            fireDom:'.loading-more-btn',
            tplDom:'#home-loading-data-tpl',
            boxDom:'#homeAjaxLoad',
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
        self.limit = window.indexAjaxLoadLimitDefault || 0;
        self.size = 30;

        var tplFunCache = tplEngine.init($(self.options.tplDom).html());
        //记录空缺出来的小卡片数量
        var prevOrderTag = getFirstLastLiPos(self.options.boxDom);
        //核心加载器
        function loadData (subCallback){
            if (self.load) {
                //改变加载状态
                self.load = false;

                fireLoading.hide();
                loading.show();

                $.get(self.options.url, {
                    limit:self.limit,
                    size:self.size
                } ,function(repalyData){

                    loading.hide();

                    var len = unitTool.getLength(repalyData.result);
                    //console.log('len='+len);
                    if(len){
                        var data = _orderCard_2(repalyData.result,prevOrderTag);

                        var html = tplFunCache({data: data.data});
                        //console.log('html='+html);
                        //console.log('self.options.boxDom='+self.options.boxDom.length);
                        self.options.boxDom.append(html);

                        prevOrderTag = getFirstLastLiPos(self.options.boxDom);

                        (subCallback || $.noop)();
                        self.limit = unitTool.has(repalyData,'limit')?repalyData.limit:0;
                        self.load = true;

                        fireLoading.show();

                        if(len<self.size){
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
                $(window).bind('scrollstop scrollstart',function () {
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
    }
});


/**
 * 第一种构建卡片方案
 * @param data
 * @param prevOrderTag
 * @returns {{data: Array, prevOrderTag: *}}
 * @private
 */
function _orderCard_1(data,prevOrderTag) {
    //return {data:data, prevOrderTag:prevOrderTag};

    function _sw(type) {
        var n = 0;
        if(type==1){
            n = 2;
        }else if(type==4){
            n = 2;
        }else if(type==0 || type==3 || type==2){
            n = 1;
        }
        return n;
    }

    var n = 0,
        temp1 = [],
        temp2 = [],
        temp3 = [],
        all = [],
        //最小组合方案
        s3 = [],
        n2 = 0;
    //进行分类
    for( var i in data ){
        n2 = _sw(data[i].type);
        if(n2==1){
            temp1.push(data[i]);
        }else if(n2==2){
            temp2.push(data[i]);
        }else if(n2==3){
            temp3.push(data[i]);
        }
    }

    var prev_header = [];

    if( prevOrderTag ==1 ){
        prev_header.push(temp1.pop());
    }else if( prevOrderTag ==2 ){
        if(temp2.length>=2){
            prev_header.push(temp2.pop());
        }else{
            prev_header.push(temp1.pop());
            prev_header.push(temp1.pop());
        }
    }
    //最大限度调整卡片顺序以适应最佳位置
    //能构成搭配
    var has_s1 = temp1.length - temp2.length;

    if(has_s1>=0){
        for(;temp2.length;){
            if(Math.random()<0.5){
                all.push(temp1.pop());
                all.push(temp2.pop());
            }else{
                all.push(temp2.pop());
                all.push(temp1.pop());
            }
        }
    }else{
        for(;temp1.length;){
            if(Math.random()<0.5){
                all.push(temp1.pop());
                all.push(temp2.pop());
            }else{
                all.push(temp2.pop());
                all.push(temp1.pop());
            }
        }
    }

    var saveIndex = [];
    for(var i = 0,j = temp3.length;i<j;i++){
        var index = Math.floor(Math.random() * all.length);
        if(index%2==0){
            index = index;
        }else{
            index = index +1;
        }
        saveIndex.push(index);
    }

    saveIndex.sort(function sortNumber(a, b) {
        return b-a;
    });

    for(var i = 0,j = temp3.length;i<j;i++){
        all.splice(saveIndex[i], 0, temp3.pop());
        if (temp1.length >= 3) {
            all.splice(saveIndex[i] + 1, 0, temp1.pop());
            all.splice(saveIndex[i] + 1, 0, temp1.pop());
            all.splice(saveIndex[i] + 1, 0, temp1.pop());
        }
    }

    if(temp1.length){
        prevOrderTag = 3-temp1.length%3;
        for(;temp1.length;){
            all.push(temp1.pop());
        }
    }else{
        prevOrderTag = temp2.length;
        for(;temp2.length;){
            all.push(temp2.pop());
        }
    }

    for(;prev_header.length;){
        all.splice(0,0,prev_header.pop());
    }

    return {
        data:all,
        prevOrderTag:prevOrderTag
    };
}


/**
 * 第二种构建卡片方案
 * @param data
 * @param prevOrderTag
 * @returns {{data: Array, prevOrderTag: *}}
 * @private
 */
function _orderCard_2(data,prevOrderTag) {
    function _sw(type) {
        var n = 0;
        if(type==1 || type==4 || type==6){
            n = 2;
        }else if(type==0 || type==3 || type==2){
            n = 1;
        }
        return n;
    }

    var n = 0,
        temp1 = [],
        temp2 = [],
        all = [],
        //最小组合方案
        s3 = [],
        n2 = 0;
    //进行分类
    for( var i in data ){
        n2 = _sw(data[i].type);
        if(n2==1){
            temp1.push(data[i]);
        }else if(n2==2){
            temp2.push(data[i]);
        }
    }

    var prev_header = [];

    if( prevOrderTag ==1 ){
        prev_header.push(temp1.pop());
    }else if( prevOrderTag ==2 ){
        if(temp2.length>0){
            prev_header.push(temp2.pop());
        }else{
            prev_header.push(temp1.pop());
            prev_header.push(temp1.pop());
        }
    }else if( prevOrderTag ==3 ){
        if(temp2.length>0){
            prev_header.push(temp2.pop());
            prev_header.push(temp1.pop());
        }else{
            prev_header.push(temp1.pop());
            prev_header.push(temp1.pop());
            prev_header.push(temp1.pop());
        }
    }
    //最大限度调整卡片顺序以适应最佳位置
    //能构成搭配
    var indexPos = [0,5,7,9,14,16,18,23,25,27,32,34,36,41,43,45,50,52,54];

    for(var i = 0;temp2.length;i++){
        if(indexPos[i]!=undefined){
            temp1.splice(indexPos[i],0,temp2.shift());
        }else{
            temp1.push(temp2.shift());
        }
   }

    for(;prev_header.length;){
        all.push(prev_header.shift());
    }

    for(;temp1.length;){
        all.push(temp1.shift());
    }

    return {
        data:all
    };
}


function getFirstLastLiPos(boxDom) {
    var  childLi = boxDom.find('>li:last-child');
    if(childLi.length<=0) return 0;

    var left = childLi.position().left + childLi.width();
    var WIN_H = $(window).height(),
        prevOrderTag = 0;
    // if(WIN_H>900){
    //     //三卡片排列方式
    //     if(left<=360){
    //         prevOrderTag = 2;
    //     }else if(left>360 && left<=720){
    //         prevOrderTag = 1;
    //     }else {
    //         prevOrderTag = 0;
    //     }
    // }else{
        //四卡片排列方式
        if(left<=265){
            prevOrderTag = 3;
        }else if(left>265 && left <=540){
            prevOrderTag = 2;
        }else if(left>540 && left <=830){
            prevOrderTag = 1;
        }else{
            prevOrderTag = 0;
        }
    // }
    return prevOrderTag;
}