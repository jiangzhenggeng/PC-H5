
/**
 * 滚动下拉获取产品列表
 * @param appendSelector
 * @param template
 */
function searchProductList(appendSelector,template){
    this.box = $(appendSelector);
    this.url = '/admin/search/index';
    this.p = 0;
    this.size = 6;
    this.is_loading = false;
    this.template = $(template);
    var _this = this;

    this._searchProduct = function (append,keyword) {
        if (!this.is_loading) {
            this.is_loading = true;
            $.get(_this.url, {
                p: _this.p,
                name: keyword || $('#keyword').val(),
                keyword: keyword || $('#keyword').val(),
                pid: String($('#productrandom_pid').val()).replace(/[^\d]/g,''),
                type: 'product',
                size: _this.size
            }, function (htmlData) {
                if (htmlData == '') {
                    _this.is_loading = true;
                    return;
                }
                htmlData = newTplEngine(_this.template.html(),{data:htmlData});

                if (!append)
                    _this.box.append(htmlData);
                else
                    _this.box.html(htmlData);
                _this.p++;
                _this.is_loading = false;
            },'json');
        }
    }
}


//点击链接按钮
function addLinkCard(self) {
    $(self).parent().find('.on').removeClass('on');
    $(self).addClass('on');

    $('#Z-content-inner-warp').html(newTplEngine($('#tpl_input_link').html(),{data:[]}));
    $('.Z-next-btn').hide();
    window.tpl_input_link_new = undefined;

    $(document).unbind('keypress').keypress(function (e) {
        if( e.keyCode==13 ){
            $('[dat-enter-click]').trigger('click');
        }
    });

}

function addProductKuCard(self) {
    $(self).parent().find('.on').removeClass('on');
    $(self).addClass('on');

    $('#Z-content-inner-warp').html(newTplEngine($('#search-product-list-tpl').html(),{data:[]}));
    
    window.tpl_input_link_new = undefined;


    var searchProductListObject = new searchProductList('#search-product-list-ul','#search-product-list-li-tpl');
    searchProductListObject._searchProduct(false);

    /**
     * 切换产品库触发搜索结果
     */
    $('#Z-content-inner-warp').scroll(function () {
        if( $(this).scrollTop()+$(this).height() > $(this).find('#search-product-list-ul').height()-50 ){
            searchProductListObject._searchProduct();
        }
    });

    /**
     * 输入关键词或者点击搜索按钮进行搜索产品
     */
    $('#searching,#keyword,#productrandom_pid').bind('click keyup',function (event) {
        searchProductListObject.is_loading = false;
        searchProductListObject.p = 0;
        searchProductListObject._searchProduct(true);
    });

    //隐藏下一步按钮
    $('.Z-next-btn').hide();
}

/**
 * 点击完成按钮并生成产品卡片插入到百度编辑器
 * @param seletor
 * @param url
 */
function inserCardComplete(seletor) {

    var time = 3000;
    var categoryed = true;
    $(seletor).find('select[data-category]').each(function () {
        if(parseInt($(this).val())<=0){
            categoryed = false;
        }
    });
    if(!categoryed){
        new_alert('请选择分类',time);
        return false;
    }

    var tips = new_alert('数据提交中...');

    $.ajax({
        url:'/admin/ajax/insertcard',
        data:$(seletor).serialize(),
        dataType:'json',
        type:'post',
        timeout:50000,
        success:function(replayData){
            if(replayData.status!=0){
                new_alert(replayData.message,time);
                return;
            }
            $('.Z-dialog').hide();
            new_close(tips);
            new_alert('数据提交成功！',time);
            //生成产品卡片并植入到编辑器
            productImage = '' +
                '<iframe ' +
                'name="iframe'+replayData.cid+'" ' +
                'data-cid="'+replayData.cid+'" ' +
                'data-default-link-id="'+replayData.linkid+'" ' +
                'class="iframe'+replayData.pid+'" ' +
                'src="http://zdm.jiguo.com/index/getcard?linkid='+replayData.linkid+'&pid='+replayData.pid+'&cid='+replayData.cid+'" ' +
                'data-productid="'+replayData.pid+'" ' +
                'style="width:100%" ' +
                'frameborder="0" ' +
                'scrolling="no"></iframe>';
            var _editor = UE.getEditor('Z-desciption');

            $(_editor.body).find('iframe[data-productid]').each(function () {

                //如果是编辑删除卡片
                if( $(this).attr('data-cid')==window.cid ){
                    var _this2 = $(this),_this3 = _this2;
                    while ( !_this2.parent().parent('body').length ){
                        _this2 = _this2.parent();
                        _this3.remove();
                        _this3 = _this2;
                    }
                    _this2.remove();
                }
            });
			
			//插入卡片
            UE.getEditor('Z-desciption').execCommand('insertHtml', productImage);
            window.tpl_input_link_new = undefined;

            //添加编辑按钮
            $(_editor.body).find('iframe[data-productid]').each(function () {
                $(this).bind('load',function () {
                    var style = '<style>.ueditor-edit-card{position: absolute;top: 0;left: 0;background: #fe6341;width: 60px;height: 30px;line-height: 30px;text-align: center;font-size: 14px;}' +
                        '.ueditor-edit-card a{ cursor: pointer; display:block;color: #fff; text-decoration: none}</style>';
                    $(this.contentDocument).find('body')
                        .append(style+'<div class="ueditor-edit-card"><a href="javascript:parent.parent.clickIframeCardEdit('+$(this).attr('data-productid')+','+$(this).attr('data-cid')+');" target="_blank">编辑</a></div>');
                });
            });


        },
        complete: function(xhr,status){
            new_close(tips);
            if(status=='error'){
                new_alert('系统错误',time);
                return;
            }
            xhr.responseText = $.parseJSON(xhr.responseText);
            if(status=='timeout'){
                new_alert('数据提交超时！',time);
            }else if(xhr.responseText.status!=0){
                new_alert(xhr.responseText.message,time);
            }
        }
    });
}

/**
 * 点击抓取链接
 * @param selector
 */

function getLinkInfoData1(selector) {
    var url = $('#inputLink').val();
    //型号
    window.model  = $('#inputModel').val();
    if(url==''){
        layer.msg('请填写抓取地址',{
            time:1000,
        });
        return;
    }

    var tips = layer.alert('正在抓取中...',{
        time:99999999,
        btn:['关闭','手动填写'],
        btn1:function () {
            layer.close(tips);
        },
        btn2:function () {
            hasRequest && hasRequest.abort();
            layer.close(tips);
            success( );
            $('.first-search-model-list-ul-warp').remove();
        }
    });

    $.get('/admin/index/setcps',{url:url},function(replyData2){
        if(url == replyData2 || !replyData2 ){
            layer.alert('没有CPS链接',{
                btn:['关闭'],
            });
        }
    },'text');

    var success = function ( _replayData ) {

        var replayData =  _replayData || {
            "status": 0,
            "data": {
                "name": "",
                "url": url,
                "pic": [],
                "price": 0,
                "mall": "",
                "currency": "RMB",
                "currencyname": "￥人民币",
                "currencysymbol": "￥",
                "author": 0,
                "pid": "",
                "detail": null,
            },
            "message": "抓取成功"
        };

        layer.close(tips);

        if(typeof replayData.status!='undefined' && replayData.status!=0){
            layer.msg(replayData.message,{
                time:3000,
            });
        }
        if(!replayData.data.url){
            replayData.data.url = url;
        }
        if(typeof replayData.count!='undefined' && replayData.count>0){
            //获取模板链接
            var linkTpl = newTplEngine($('#search-product-list-li-tpl').html(),{data:replayData.data});
            $('#Z-content-inner-warp').html('<ul class="Z-list-ul Z-m-l-50" id="search-product-list-ul">'+linkTpl+'</ul>');
            return;
        }else{
            //链接
            replayData.data.tpl_input_link_new = newTplEngine($('#tpl_input_link_new').html(),{data:replayData.data});

            window.tpl_input_link_new = replayData.data.tpl_input_link_new;
            var TPL = newTplEngine($('#tpl_input_link_searh_model').html(),{data:replayData.data});
            $('#Z-content-inner-warp').html(TPL);

            var searchObj = new searchAddModelList('#search-model-list-ul','#search-model-list-li-tpl');
            searchObj._searchProduct(false,$('#model').val());

            searchObj.size = 100;

            //绑定型号搜索
            $('#model').bind('click dbclick keyup',function () {
                searchObj.is_loading = false;
                searchObj.p = 0;
                searchObj._searchProduct(true,$(this).val());
            });
            setTimeout(function () {
                if( replayData.data.detail ){
                    window.windowEditer.setContent( replayData.data.detail );
                }else{
                    if(window.windowEditerPic && window.windowEditer){
                        var content = '',ids = [],id='';
                        $.each(window.windowEditerPic,function(key, value){
                            id = 'id_'+String(Math.random()).replace('.','');
                            ids.push(id);
                            content += '<p>' +
                                '<img id="'+id+'" src="'+value+'" _src="'+value+'" data-original="'+value+'" />' +
                                '<p>';
                        });
                        window.windowEditer.setContent(content);
                    }
                }
                var _ed_body = $(window.windowEditer.body);
                _ed_body.find('img').load(function () {
                    $(this).attr({
                        'data-img-type':3,
                        'data-height':this.height,
                        'data-width':this.width,
                        'data-ratio':this.width/this.height
                    }).removeAttr('id');
                });

            },800);

        }
    };

    var hasRequest = $.ajax({
        url:"/admin/casperjs/GetCardUrl",
        data:{'url':url},
        dataType:'json',
        timeout:30000,
        success: function(replayData){
            success( replayData );
        },
        complete: function(XMLHttpRequest,status){
            layer.close(tips);
            //超时,status还有success,error等值的情况
            if(status=='timeout'){
                var u = layer.alert('抓取超时',{
                    time:99999999,
                    btn:['关闭','手动填写'],
                    btn1:function () {
                        layer.close(u);
                    },
                    btn2:function () {
                        layer.close(tips);
                        success( );
                        $('.first-search-model-list-ul-warp').remove();
                    }
                });

            }else if(status=='error'){

                var u = layer.alert('系统错误',{
                    time:99999999,
                    btn:['关闭','手动填写'],
                    btn1:function () {
                        layer.close(u);
                    },
                    btn2:function () {
                        layer.close(tips);
                        success( );
                        $('.first-search-model-list-ul-warp').remove();
                    }
                });
            }
        }
    });


}


$(function () {
    //点击搜索出来的产品列表里的插入按钮
    $('#Z-content-inner-warp').on('click', 'li a[data-pid]', function () {
        var data_pid = $(this).attr('data-pid');

        var tips = new_alert('加载中...');

        $.post("/admin/ajax/GetAllProduct", {
            id: data_pid
        }, function (replayData) {
            new_close(tips);
            //显示详细信息
            $('#Z-content-inner-warp').html( newTplEngine($('#tpl_product_charu_look').html(),{data:replayData}));
        }, 'json');
    });
});


/**
 * 滚动下拉获取产品列表
 * @param appendSelector
 * @param template
 */
function searchAddModelList(appendSelector,template){
    this.box = $(appendSelector);
    this.url = '/admin/search/index';
    this.p = 0;
    this.size = 100;
    this.is_loading = false;
    this.template = $(template);
    var _this = this;

    this._searchProduct = function (append,keyword) {
        if (!this.is_loading) {
            this.is_loading = true;
            $.get(_this.url, {
                p: _this.p,
                keyword: keyword || $('#keyword').val(),
                size: _this.size
            }, function (htmlData) {

                $('.search-card span font').html(htmlData.count);
                $('#first-find-number').html('<font color="#fc6b6b">'+htmlData.count+'</font>');

                if(_this.p<=0 && !htmlData.count || ( Object.prototype.toString.call(htmlData)=='[object Array]' && htmlData.length<=0) ){
                    $('.first-search-model-list-ul-warp').remove();
                    $('.first-search-model-list-ul').removeClass('first-search-model-list-ul');
                }

                if (htmlData == '') {
                    _this.is_loading = true;
                    return;
                }

                htmlData = newTplEngine(_this.template.html(),{data:htmlData.data});

                if ( !append  ){
                    _this.box.append(htmlData);
                }
                else
                    _this.box.html(htmlData);

                _this.p++;
                _this.is_loading = false;

            },'json');
        }
    }
}



function showListXiangSi(show,hide,self) {
    $(show).show();
    $(hide).hide();
    $(self).parent().find('.on').removeClass('on');
    $(self).addClass('on');
}

function showDetial(show,hide,self) {
    $(show).show();
    $(hide).hide();
    $(self).parent().find('.on').removeClass('on');
    $(self).addClass('on');
}


/**
 * 点击编辑器里的产品卡片编辑按钮
 * @param pid
 * @param cid
 */
function clickIframeCardEdit(pid,cid) {
    window.cid = cid;
    $('.Z-dialog').show();
    var tips = new_alert('加载中...');

    var iframeCard = $(_editor.body).find('iframe[data-productid]').filter(function () {
        if($(this).attr('data-cid')==window.cid){
            return this;
        }
        return false;
    }).eq(0);

    _editor.focus();
    if(!window.UErange){
        window.UErange = new UE.dom.Range(_editor.document);
    }
    if(window.UErange && iframeCard.parent().length){

        var _this2 = iframeCard;
        while ( !_this2.parent('body').length ){
            _this2 = _this2.parent();
        }

        window.UErange.setStart( _this2.get(0),0 );
        window.UErange.setEnd( _this2.get(0),0);
        window.UErange.setCursor( true );
    }

    window.tpl_input_link_new = undefined;
    
    $.post("/admin/ajax/GetAllProduct", {
        id: pid,
        cid: cid,
    }, function (replayData) {
        new_close(tips);
        //显示详细信息
        $('#Z-content-inner-warp').html( newTplEngine($('#tpl_product_charu_look').html(),{data:replayData}));
    }, 'json');
}

/**
 * 删除卡片
 * @param selector
 */
function deleteCardLink(selector) {
    if( window.confirm('你确定删除吗') ){
        $(selector).remove();
    }
}


/**
 * 删除卡片
 * @param selector
 */
function addCardLink(selector) {
    var cardLink = '';
    cardLink = newTplEngine($('#tpl_product_add_card_link').html(),{data:[]});
    var cell = $(selector).find('.Z-buy-link-cell');
    $(selector).find('[data-default]').prop('checked',false);

    if(cell.length){
        $(selector).find('.Z-buy-link-cell').last().after(cardLink);
    }else{
        $(selector).find('.Z-add-parme').before(cardLink);
    }
}

$(function () {
    $('body').on('click','[data-default]',function () {
        $('body').find('[data-default]').prop('checked',false);
        $(this).prop('checked',true);
    });
});


function productImageMoveListorder(){
	var moveBox = $('.Z-product-image'),
		startX = 0,startY = 0,
		eventX = 0,eventY = 0,
		positX = 0,positY = 0,
		id = randomID() , html = '';
	
	html = '<div class="Z-product-image-move" id="'+id+'"></div>';
	
	$('body').append(html);
	
	var idDom = $('#'+id),
		idDomW = 0,
		idDomH = 0,
		allDrage = null,
		_selfDrLi = null;
	
	moveBox.on('mousedown','li:not(:last)',function(e){
		_selfDrLi = $(this);
		e.preventDefault();
		startX = e.pageX;
		startY = e.pageY;
		
		scrollX = $(document).scrollLeft();
		scrollY = $(document).scrollTop();
		
		idDom.show().css({
			'left':startX + scrollX,
			'top':startY + scrollY,
			'width':$(this).width(),
			'height':$(this).height(),
		});
		
		idDomW = idDom.width(),
		idDomH = idDom.height();
		
		positX = startX - (idDomW / 2);
		positY = startY - (idDomH / 2);
		
		allDrage = $(this).parent().find('li:not(:last)');
		//初始化位置
		allDrage.each(function(index, element) {
			$(this).attr({
				'data-posit-x':$(this).offset().left,
				'data-posit-y':$(this).offset().top
			});
		});
		
		$(document).on('mousemove',function(e){
			e.preventDefault();
			
			eventX = e.pageX;
			eventY = e.pageY;
			positX = eventX - (idDomW / 2);
			positY = eventY - (idDomH / 2);
			
			idDom.css({
				'left':positX,
				'top':positY
			});
			//.html('left:'+(positX + (idDomW / 2) )+'<br>top:'+(positY + (idDomH / 2) )+'<br>'+(idDomW / 2)+'<br>'+(idDomH / 2));
			
			
		}).on('mouseup',function(){
			$(document).off('mousemove');
			$(document).off('mouseup');
			if(allDrage){
				//拖动对象中心点
				var drObjCenterX = positX + (idDomW / 2),
					drObjCenterY = positY + (idDomH / 2),
					//固定图片的坐标点
					eachCenterX = eachCenterY = 0,
					eachCenterW = eachCenterH = 0;
				
				//分析位置调整图片的顺序及索引值完成排序
				allDrage.each(function(index, element) {
					eachCenterW = $(this).width();
					eachCenterH = $(this).height();
					
					eachCenterX = parseFloat($(this).attr('data-posit-x'));
					eachCenterY = parseFloat($(this).attr('data-posit-y'));
					var Diff = 10;//误差偏差
					if(
						positX+eachCenterW/2>eachCenterX && positX+eachCenterW/2<eachCenterX+eachCenterW &&
						positY+eachCenterH/2>eachCenterY && positY+eachCenterH/2<eachCenterY+eachCenterH
					){
						if( _selfDrLi.index() == index ) return;
						//放在元素之前
						if( positX+eachCenterW/2<eachCenterX+eachCenterW/2 ) {
							$(this).before(_selfDrLi.prop('outerHTML'));
						}
						//放在元素之后
						else{
							$(this).after(_selfDrLi.prop('outerHTML'));
						}
						_selfDrLi.remove();
						
						var P = $(this).parent().find('li:not(:last)');
						P.each(function(indexSub, elementSub) {
							$(this).find('input[type=hidden]').attr('name','product[pic]['+indexSub+']');
						});
						return;
					}
				});
			}
			idDom.hide();
		});
		
	});
}
















