// JavaScript Document


/*********************
* 增加参数设置
*********************/
function addParmeSetting(selecter,insertData){
	var selecter = $(selecter),
		addParmeSettingId = randomID();
		
	if(typeof(insertData)!='object'){
		insertData = {};
		insertData.name = '';
		insertData.value = '';
	}
	var html = '<div class="Z-row" id="'+addParmeSettingId+'">\
		<div class="Z-click-query-box"><span class="Z-click-query" onClick="deleteParmeSetting(\'#'+addParmeSettingId+'\')"><i></i></span></div>\
		<input class="Z-input Z-center Z-w-230 Z-m-r-18" value="'+insertData.name+'" placeholder="新建参数名称" />\
		<input class="Z-input Z-w-500" value="'+insertData.value+'" placeholder="输入参数详情" />\
	</div>';
	selecter.append(html);
}

/*********************
* 删除参数设置
*********************/
function deleteParmeSetting(selecter){
	var selecter = $(selecter);
	if(window.confirm('你确定删除吗？')){
		selecter.remove();
	}
}

/*********************
* 增加购买链接
*********************/
function addBuySetting(selecter,insertData){
	var selecter = $(selecter),
		addParmeSettingId = randomID();
	//容错处理
	if(typeof insertData!='object'){
		insertData  = {
			'url':'',
			'price':'',
			'mall':'',
			'currency':'RMB',
			'currencyname':'人名币',
			'currencysymbol':'',
			'author':'',
			'pid':0
		};
	}
	
	var buyLinkInfo = randomID();
	var urlInputId = randomID();
	var priceInputId = randomID();
	
	var html = '\
		<div class="Z-row Z-bottom-line" id="'+addParmeSettingId+'">\
			<div class="Z-click-query-box top-17"><span onClick="deleteBuySetting(\'#'+addParmeSettingId+'\')" class="Z-click-query"><i></i></span></div>\
			<div class="Z-buy-link-cell Z-right">\
				<div class="Z-sub-row">\
					<span class="Z-name">购买链接：</span>\
					<input class="Z-input Z-w-580 buyLinkInfo-url" id="'+urlInputId+'" name="product[buylink]['+buyLinkInfo+'][url]" value="'+insertData.url+'" />\
					<button type="button" class="Z-btn Z-w-110 Z-right" onClick="getIsLinkProductInfo(\'#'+addParmeSettingId+'\',\'#'+urlInputId+'\')">抓取</button>\
				</div>\
				<div class="Z-sub-row">\
					<span class="Z-name">来源：</span>\
					<input class="Z-input Z-w-130 buyLinkInfo-mall" name="product[buylink]['+buyLinkInfo+'][mall]" value="'+insertData.mall+'" />\
				</div>\
				<div class="Z-sub-row">\
					<span class="Z-name">价格：</span>\
					<input class="Z-input Z-w-130 buyLinkInfo-price" onBlur="changePrice(\'#'+priceInputId+'\',this)" name="product[buylink]['+buyLinkInfo+'][price]" value="'+insertData.price+'" />\
					<span class="Z-name">货币类型：</span>\
					<div data-Z-select class="Z-select-box Z-w-150">\
						<input data-Z-select-value value="RMB" class="buyLinkInfo-currency" name="product[buylink]['+buyLinkInfo+'][currencyname]" type="hidden"/>\
						<div class="Z-select-selected"><span class="buyLinkInfo-currencyname">￥人民币</span></div>\
						<div class="Z-select-arrow"></div>\
						<div class="Z-select-list">\
							<ul>\
								<li data-value="RMB"><span>￥人民币</span></li>\
								<li data-value="MY"><span>$美元</span></li>\
							</ul>\
						</div>\
					</div>\
					<span class="Z-name Z-w-100 Z-a-right">价格：</span>\
					<font class="Z-red" id="'+priceInputId+'">￥<span class="buyLinkInfo-price2">'+insertData.price+'</span></font>\
				</div>\
				<div class="Z-sub-row">\
					<span class="Z-name">库存状态：</span>\
					<div class="input-group" id="P-tag">\
						<div class="input-row radiobox">\
							<label><input '+(insertData.stock!=2?'checked':'')+' class="icon" name="product[buylink]['+buyLinkInfo+'][stock]" value="1" type="radio"/>有货</label>\
						</div>\
						<div class="input-row radiobox">\
							<label><input '+(insertData.stock==2?'checked':'')+' class="icon" name="product[buylink]['+buyLinkInfo+'][stock]" value="2" type="radio"/>售罄</label>\
						</div>\
					</div>\
				</div>\
			</div>\
			<input class="buyLinkInfo-pid" value="'+insertData.pid+'" name="product[buylink]['+buyLinkInfo+'][pid]" type="hidden"/>\
			<div class="Z-clear"></div>\
		</div>';
	selecter.append(html);
	//模拟select
	dataZselectBind(selecter.find('[data-Z-select]'));
}
function changePrice(selecter,_this){
	var num2 = Number($(_this).val()).toFixed(3);
	num2 = num2.toString().substr(0,num2.length-1);
	$(selecter).html('￥'+num2);
	$(_this).val(num2);
}

/*********************
* 删除购买链接
*********************/
function deleteBuySetting(selecter){
	var selecter = $(selecter);
	if(window.confirm('你确定删除吗？')){
		selecter.remove();
	}
}

/*********************
* 点击产品图片删除按钮
*********************/
function deleteProductImageNow(_this){
	var selecter = $(_this).parent();
	var selecterP = $(_this).parent().parent();
	selecter.remove();
	if(selecterP.find('li.setting-product-image-cover').length<=0){
		var src = selecterP.find('li:not([data-no-setting])').eq(0)
			.addClass('setting-product-image-cover').find('img').attr('src');
		$('#setting-product-image-cover').val(src);
	}
	if(selecterP.find('li').length<=1){
		$('#setting-product-image-cover').val('');
	}
}
/*********************
* 点击产品图片编辑按钮
*********************/
function editProductImageNow(selecter,_this){
	var selecter = $(selecter);
	selecter.addClass('Z-edit');
	$(_this).hide().prev().show();
}

/*********************
* 点击产品图片完成按钮
*********************/
function editProductImageComplete(selecter,_this){
	var selecter = $(selecter);
	selecter.removeClass('Z-edit');
	$(_this).hide().next().show();
}

/*********************
* 设置产品封面
*********************/
function settingProductImageCover(selecter,_this){
	var _this = $(_this).parent();
	$(selecter).val(_this.find('input[type=hidden]').val());
	_this.parent().find('.setting-product-image-cover').removeClass('setting-product-image-cover');
	_this.addClass('setting-product-image-cover');
}







