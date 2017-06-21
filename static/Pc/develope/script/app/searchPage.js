/**
 +----------------------------------------------------------
 //搜索页面
 +----------------------------------------------------------
 */

define([
    'jquery',
    'app/tplEngine',
    'app/unitTool',
    'layer'
], function ($,tplEngine,unitTool,layer) {

    return {
        searchAll:function (__type__,__cid__) {
            //搜索器
            function _search(callBack,over) {
                var _this = this;
                var keyword = String(_this.keyword).replace(/^\s+|\s+$/i,'');

                if(/*keyword=='' || */_this.loading){
                    return;
                }
                _this.loading = true;

                var title = $('title').html(),
                    url = _urlParma( window.location.href );

                history.pushState({ title: title }, title, url );

                loading.show();
                noData.hide();

                clickLoading.hide();

                $.get('/api/search/index',{
                    keyword:keyword,
                    type:_this.type,
                    cid:_this.cid,
                    limit:_this.limit,
                    sys:_this.sys,
                    size:_this.size
                },function(replatDate){
                    _this.loading = false;
                    loading.hide();
                    _this.limit = replatDate.limit;
                    callBack.apply(_this,[replatDate,over]);
                },'json')
            }

            var searchPageHeader = $('.search-page-header'),
                keywordDom = searchPageHeader.find('#keyword'),
                showKeyword = $('#show-keyword');
            keywordDom.loading = false;
            //搜索事件绑定
            searchPageHeader.on('click','[data-search-page-submit]',function () {
                keywordDom.keyword = keywordDom.val();
                keywordDom.limit = 0;
                _search.apply(keywordDom,[_callBack,true]);
            }).on('keyup','#keyword',function () {
                keywordDom.limit = 0;
                keywordDom.keyword = keywordDom.val();
                _search.apply(keywordDom,[_callBack,true]);
                showKeyword.html( keywordDom.keyword );
            });

            //初始化数据绑定
            keywordDom.type = __type__;
            keywordDom.cid = __cid__;
            keywordDom.sys = 'pc';
            keywordDom.limit = '0';
            keywordDom.size = 8;

            //初始化搜索对象
            var listArray = ['event','product','rebate','list','article'],
                boxArray = [],
                noData = $('.no-data'),
                loading = $('.loading'),
                clickLoading = $('.click-loading');
            if(keywordDom.type){
                keywordDom.size = 20;
            }
            for(var i = 0 ; i < listArray.length ; i++ ){
                boxArray.push({
                    cacheFn: tplEngine.init( $('#'+listArray[i]+'AjaxLoad-tpl').html() ),
                    htmlBox: $('#'+listArray[i]+'AjaxLoad'),
                    warpBox: $('#'+listArray[i]+'Warp')
                });
            }

            //搜索结果回调函数
            function _callBack(replatDate,over) {
                var hasData = true,
                    len = 0,
                    _this = this;
                if( replatDate.resultCode==0){
                    for(var i = 0 ; i < listArray.length ; i++ ){
                        len = unitTool.getLength(replatDate.result[listArray[i]] );
                        if( len>0 ){
                            boxArray[i].warpBox.show();
                            if(boxArray[i].htmlBox.length){
                                hasData = false;
                                if(over){
                                    boxArray[i].htmlBox.html( boxArray[i].cacheFn({data:replatDate.result[listArray[i]] }) );
                                }else{
                                    boxArray[i].htmlBox.append( boxArray[i].cacheFn({data:replatDate.result[listArray[i]] }) );
                                }
                                if( len<_this.size ){
                                    clickLoading.hide();
                                    if(keywordDom.type){
                                        hasData = true;
                                        noData.show();
                                    }else{
                                        noData.hide();
                                    }
                                }else{
                                    if( keywordDom.type ){
                                        clickLoading.show();
                                        noData.hide();
                                    }else{
                                        noData.hide();
                                        clickLoading.hide();
                                    }
                                }
                                if( keywordDom.type ){
                                    break;
                                }
                            }
                        }else{
                            boxArray[i].warpBox.hide();
                        }
                        boxArray[i].warpBox.attr('data-number', unitTool.getLength(replatDate.result[listArray[i]] ) );
                    }
                }else {
                    layer.msg(replatDate.message || '系统错误');
                }

                if (hasData) {
                    noData.show();
                } else {
                    noData.hide();
                }
            }

            function _urlParma(url) {
                var hrefSplit = url.split('?');
                if( hrefSplit.length>=2 && hrefSplit[1]!=''){
                    hrefSplit[1] = String(hrefSplit[1]).replace(/keyword=([^&]*)/i,'').replace(/^&+|&+$/i,'');
                    url = hrefSplit[0] + '?' + hrefSplit[1]+'&keyword='+ keywordDom.val();
                    return url.replace(/^&+|&+$/i,'');
                }
                return url;
            }

            //第一次进入页面自动触发第一次搜索
            keywordDom.trigger('keyup');

            clickLoading.click(function () {
                _search.apply(keywordDom,[_callBack,false]);
            });

            //点击更多
            $('a[href][data-search-singin-url]').click(function (e) {
                $(this).attr('href', _urlParma( $(this).attr('href') ) );
            });
        }
    }

});
