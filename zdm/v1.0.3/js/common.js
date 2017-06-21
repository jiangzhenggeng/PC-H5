// JavaScript Document

/*********************
* 跨域处理
*********************/
//document.domain = 'jiguo.com';


window.global = {};


/*********************
* 字符床扩展方法
*********************/
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim=function(){
	return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim=function(){
	return this.replace(/(\s*$)/g,"");
}

function menuCommmon() {
	$(function () {
		$('.Z-menu').on('click','li > a ',function () {

			$(this).closest('ul').find('li').each(function () {
				$.cookie('ooZmenu_'+$(this).index(),null,{path:'/'});
			});

			var dl = $(this).next('dl');
			if(dl.css('display')=='none'){
				dl.slideDown(180);
				$.cookie('ooZmenu_'+$(this).parent().index(),'show',{path:'/'});
			}else{
				dl.slideUp(180);
				$.cookie('ooZmenu_'+$(this).parent().index(),null,{path:'/'});
			}

		}).find('li').each(function () {
			if( $.cookie('ooZmenu_'+$(this).index())=='show' ){
				$(this).find('dl').show();
			}else{
				$(this).find('dl').hide();
			}
		});

		$.get('/admin/ajax/GetNew',function (replayDate) {
			if(replayDate.data>0){
				$('.badrg').html(replayDate.data).removeClass('none');
			}
		},'json');

		$('a[href][data-ajax-request]').click(function (e) {
			e.preventDefault();
			var _this = $(this);
			$.get('/admin/ajax/ClearNew',function () {
				window.location = _this.attr('href');
			},'json');
		});
	});
}

//编码
function html_encode(str) {
	if(typeof str!='string') return '';
	var s = "";
	if (str.length == 0) return "";
	return str.replace(/&/g,'&amp;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/\\/g,'&#92;')
		.replace(/"/g,'&quot;')
		.replace(/'/g,'&#39;')
		.replace(/\n/g,'<br>');
}
//解码
function html_decode(str) {
	if(typeof str!='string') return '';
	var s = "";
	if(str.length == 0) return "";
	s = str.replace(/&amp;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "'");
	s = s.replace(/&quot;/g, '"');
	s = s.replace(/<br>/g, "\n");
	return s;
}

/*********************
* 产生一个不重复的随机id
*********************/
function randomID(){
	return 'random_id_'+Math.random().toString().replace('.','');
}


function createEditer(id){
	var _editor = UE.getEditor(id,{
		serverUrl:window.FILE_UPLOAD_URL,
		onready:function(){
			var tipsHtml = '<div class="tooltip" style="display: none;"><div class="tooltip_inner"></div><i class="tooltip_arrow"></i></div>';
			$('body').append(tipsHtml);
			var tooltip = jQuery('.tooltip');
			$('.edui-toolbar > .edui-box').hover(function(event){
				tooltip.show().find('.tooltip_inner').html($(this).find('[title]').eq(0).attr('title'));

				var offset = $(this).offset() ,
					left = offset.left - tooltip.width()/2 + $(this).width()/2 ,
					top = offset.top - $(this).height()/2 - 15;
				tooltip.css('left',left).css('top',top);
			},function(){
				tooltip.hide();
			});

			//添加编辑按钮
			$(this.body).find('iframe[data-productid]').each(function () {
				$(this).bind('load',function () {
					var style = '<style>.ueditor-edit-card{position: absolute;top: 0;left: 0;background: #fe6341;width: 60px;height: 30px;line-height: 30px;text-align: center;font-size: 14px;}' +
						'.ueditor-edit-card a{ cursor: pointer; display:block;color: #fff; text-decoration: none}</style>';
					$(this.contentDocument).find('body')
						.append(style+'<div class="ueditor-edit-card"><a href="javascript:parent.parent.clickIframeCardEdit('+$(this).attr('data-productid')+','+$(this).attr('data-cid')+');" target="_blank">编辑</a></div>');
				});
			});
		}
	});

	// _editor.addListener("afterSetContent afterPaste",function(){
	// 	function _matchImgCheck($string){
	// 		if($string=='')return true;
    //
	// 		var notSrc = [],
	// 			imgAddrList = ['pic.jiguo.com','s1.jiguo.com'];
	// 		var _RegExp = new RegExp(/<img[^>]*src\s*=(\'|\")(.+?)\1/,'ig');
	// 		$string.replace(_RegExp,function(match_all,match_target,src,resource){
	// 			var _src = src;
	// 			src = src.toLocaleLowerCase();
	// 			//排除自己服务器绝对地址
	// 			if(src.substr(0,1)=='/' && src.substr(0,2)!='//'){
	// 				return;
	// 			}
	// 			//排除自己服务器相对地址
	// 			if(src.substr(0,8)!='https://' && src.substr(0,7)!='http://'){
	// 				return;
	// 			}
	// 			var $is_pass = false;
	// 			for (var i=0 ; i < imgAddrList.length; i++ ){
	// 				//如果不是自己的服务器地址
	// 				if(src.indexOf(imgAddrList[i])!==-1){
	// 					$is_pass = true;
	// 				}
	// 			}
	// 			if($is_pass===false){
	// 				notSrc.push(_src);
	// 			}
	// 		});
	// 		return notSrc;
	// 	}
	// 	var notSrc = _matchImgCheck(this.getContent());
	// 	if(notSrc.length){
	// 		$(this.document).find('head').append('<style>.edui-image-not-jiguo-zdm-addr{border:5px solid red;}</style>');
	// 		$(this.body).find('img[src]').each(function () {
	// 			for(var i=0 ; i < notSrc.length ;i++){
	// 				if($(this).attr('src')==notSrc[i]){
	// 					$(this).addClass('edui-image-not-jiguo-zdm-addr');
	// 				}
	// 			}
	// 		});
	// 	}
	// });
	return _editor;
}

/*********************
* 创建简易提示框
*********************/
function new_alert(tips,time){
	tips = tips || '正在加载中···';
	var arr = [] , id = 'id-'+Math.random().toString().replace(/[^\d]/,'') + ~ new Date().toString(),
		width = 200,
		height = 60;
	arr.push('<div id="'+id+'" class="alert-box" style="position:fixed; left:50%; top:50%; margin-left:-'+(width/2)+'px; margin-top:-'+(height/2)+'px; z-index:19911224; width:'+width+'px; height:'+height+'px;">');
	arr.push('<div class="alert-inner" style="position:absolute;z-index:19911224; background:#000;border-radius:5px;width:100%; height:100%; opacity:0.7;filter:alpha(opacity=70);"></div>');
	arr.push('<div class="alert-inner" style="line-height:'+height+'px; text-align:center; font-size:16px; color:#fff; position:relative;z-index: 19911226;">'+tips+'</div>');
	arr.push('</div>');
	$('body').append(arr.join(''));
	if(time){
		setTimeout(function(){
			new_alert.close(id);
		},time);
	}
	return id;
}

/*********************
* 关闭简易提示框
*********************/
var new_close = new_alert.close = function(id){
	$('#'+id).remove();
};


/*********************
* 顶部管理员下拉显示菜单
*********************/
function showDownTopAdminMenu(){
	var menuBox = $('.Z-drop-down-menu').attr('tabindex',999);
	menuBox.focus(function(){
		var ul = $(this).find('ul');
		if(ul.find('li').length>0){
			$(this).addClass('on').find('ul').show();
		}
	}).blur(function(){
		var _this = $(this);
		setTimeout(function(){
			_this.removeClass('on').find('ul').hide();
		},100);
	});
}

/*********************
* 时间选择器
*********************/
function setTimeSelect(start,end){
	var start = {
		elem: start || '#start',
		format: 'YYYY-MM-DD hh:mm:ss',
		min: '1970-01-1 23:59:59', //设定最小日期为当前日期
		max: '2099-06-16 23:59:59', //最大日期
		istime: true,
		istoday: false,
		choose: function(datas){
			 end.min = datas; //开始日选好后，重置结束日的最小日期
			 end.start = datas //将结束日的初始值设定为开始日
		}
	};
	var end = {
		elem: end || '#end',
		format: 'YYYY-MM-DD hh:mm:ss',
		min: '1970-01-1 23:59:59',
		max: '2099-06-16 23:59:59',
		istime: true,
		istoday: false,
		choose: function(datas){
			start.max = datas; //结束日选好后，重置开始日的最大日期
		}
	};
	laydate(start);
	laydate(end);
}

/*********************
 * 时间选择器
 *********************/
function layerTimer(select) {
	var start = {
		elem: select,
		format: 'YYYY-MM-DD hh:mm:ss',
		min: '1970-01-1 23:59:59', //设定最小日期为当前日期
		max: '2099-06-16 23:59:59', //最大日期
		istime: true,
		istoday: false
	};
	laydate(start);
}

/*********************
* 调取百度编辑器多图片上传框
*********************/
function createEditorUploadFile(callback){
	var id = randomID(), callback = callback || function(){};
	$('body').append('<textarea style="display:none;" id="'+id+'"></textarea>');
	createEditorUploadFile.__HIDE_UE__ = UE.getEditor(id,{serverUrl:window.FILE_UPLOAD_URL});
	createEditorUploadFile.__HIDE_UE__.ready(function () {
		 //设置编辑器不可用
		//_editor.setDisabled();  这个地方要注意 一定要屏蔽
		//隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
		createEditorUploadFile.__HIDE_UE__.hide();
		//侦听图片上传
		createEditorUploadFile.__HIDE_UE__.addListener('beforeinsertimage', function (t, arg) {
			callback(t, arg);
		})
	 });
}

var dialog = {
	alert:function(msg){
		alert(msg);
	},
};


function dataListFZ(url){
	dataListFZ.is_loading = false;
	var keyWord = '' , set_first = true , first = true , inputObj = null,xhr='';

	$('input[list]:not([data-bind])').attr('data-bind','')
		.bind('keyup click paste',function(event){
			if(event.type=='paste'){
				// xhr.abort();
				var $this=$(this);
				var timer=setTimeout(function () {
					$this.trigger('paste');

				},15);
				clearTimeout(timer);
				return ;
			};
			var keycode = event.which || event.keyCode;
			if(keycode==37 || keycode==38 || keycode==39 || keycode==40) return;

			var value = $(this).val().trim() , list_id = '';
			if(set_first){
				list_id = $(this).attr('list')+randomID();
				$(this).attr('list',list_id);
				set_first = false;
			}

			list_id = $(this).attr('list');

			var _this = $(this);
			var data = $.parseJSON($(this).attr('data-send'));
			data = $.extend(data,{'keyword':value});

			if(keycode==13 || keycode==32|| keycode==8){
				dataListFZ.is_loading = false;
			}

			if(dataListFZ.is_loading) return;

			dataListFZ.is_loading = true;
			keyWord = data.keyword;

			xhr=$.get(url,data,function(replayData){
				if(replayData){
					var datalistDOM = '';
					for(var i in replayData){
						datalistDOM += '<li data-value="'+replayData[i].id+'" data-mingzi="'+replayData[i].name+'"><span>'+replayData[i].name+'</span></li>';
					}
					if(first){
						_this.after('<div class="data-list" id="'+list_id+'"><ul>'+datalistDOM+'</ul></div>');
						first = false;
						inputObj = $('#'+list_id);
						inputObj.css({
							'left':_this.position().left,
							'top':_this.position().top + _this.innerHeight(),
							'width':_this.innerWidth(),
						});
						var _keyCode = null,inputObjUl = inputObj.find('ul'),
							Li = null,
							//被选择的元素
							liIndex = null,
							//当前的输入值
							value = null;

						inputObjUl.on('click','li',function(event){
							event.preventDefault();
							liIndex = $(this);
							var temp_list_input = _this.nextAll('input[data-list-id][type=hidden]');
							temp_list_input.val(liIndex.attr('data-value'));
							_this.val(liIndex.attr('data-mingzi'));
							inputObj.hide();
							temp_list_input.trigger('change');
						});

						_this.bind('keydown',function(event){
							_keyCode = event.which || event.keyCode;
							Li = inputObjUl.find('li');
							inputObj.show();
							//上下键选择
							if(_keyCode==38 || _keyCode==40){
								liIndex = null;
								event.preventDefault();
								if(Li.length<=0){
									inputObj.hide();
									return ;
								}
								Li.each(function(){
									if($(this).hasClass('on')){
										liIndex = $(this);
										return;
									}
								});


								if(_keyCode==40 ){
									if(!liIndex){
										liIndex = Li.first();
										liIndex.addClass('on');
									}else{
										liIndex.removeClass('on');
										liIndex = liIndex.next().addClass('on');
									}
								}else if(_keyCode==38){
									if(!liIndex){
										liIndex = Li.last();
										liIndex.addClass('on');
									}else{
										liIndex.removeClass('on');
										liIndex = liIndex.prev().addClass('on');
									}
								}
							}
							//按下enter键
							else if(_keyCode==13){
								event.preventDefault();
								if(liIndex&&liIndex.hasClass('on')){
									var temp_list_input = $(this).nextAll('input[data-list-id][type=hidden]');
									temp_list_input.val(liIndex.attr('data-value'));
									$(this).val(liIndex.attr('data-mingzi'));
									temp_list_input.trigger('change');
								}
								inputObj.hide();
							}else{
								if(replayData.length<=0) inputObj.hide();
								liIndex = null;
								setTimeout(function(){
									var isHas = true,
										temp_list_input = _this.nextAll('input[data-list-id][type=hidden]');
									for(var i in replayData){
										if(replayData[i].name==_this.val()){
											temp_list_input.val(replayData[i].id);
											isHas = false;
											break;
										}
									}
									if(isHas) temp_list_input.val(_this.val());

									temp_list_input.trigger('change');
								},100);
							}
						})

							.blur(function(){
								setTimeout(function(){
									inputObj.hide();
								},300);
							});

					}else {
						inputObj.find('ul').html(datalistDOM);
					}
				}else{
					if(inputObj)inputObj.hide();
				}
				setTimeout(function(){
					dataListFZ.is_loading = false;
				},10);
			},'json');

		});

	//品牌
	$('[data-list-id]:not([data-bind])').change(function () {
		$(this).attr('data-bind','yes');

		var net = $(this).nextAll('.quick-add-tag');
		if( !/^[0-9]+$/.test($(this).val()) ){
			net.show();
			net.find('a').attr('href','/admin/tag/index.html?v='+encodeURIComponent($(this).val())+'#add');
		}else{
			net.hide();
		}
	});

}




/**
 +----------------------------------------------------------
 //自定义简单模板引擎函数 增强版
 //如果没有设置传递data参数则会返回一个将模板编译好的函数
 //如果传入data就直接返回生成好的模板
 +----------------------------------------------------------
 */
function newTplEngine(tpl, data) {
	var _match = null,
		start_index = 0,
		LEFT_DELIMITER = '<%',
		RIGHT_DELIMITER = '%>',
		function_body = null;

	//构造函数头部
	function_body= '\nvar r=[];\nvar fn = (function(__data__){\n',
		function_body += "var _template_varName='';\n";
	function_body += "for(name in __data__){\n";
	function_body += "_template_varName+=('var '+name+'=__data__[\"'+name+'\"];');\n";
	function_body += "};\neval(_template_varName);\n";

	//HTML转义
	newTplEngine._encodeHTML = function (source) {
		return String(source)
			.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/\\/g,'&#92;')
			.replace(/"/g,'&quot;')
			.replace(/'/g,'&#39;');
	};

	//转义影响正则的字符
	newTplEngine._encodeReg = function (source) {
		return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
	};

	//取得分隔符
	var _left_ = LEFT_DELIMITER;
	var _right_ = RIGHT_DELIMITER;

	//对分隔符进行转义，支持正则中的元字符，可以是HTML注释 <!  !>
	var _left = newTplEngine._encodeReg(_left_);
	var _right = newTplEngine._encodeReg(_right_);
	//创建匹配规则
	var _RegExp = new RegExp(_left+'([^('+_left+'|'+_right+')].*?)'+_right,'g');
	tpl.replace(_RegExp,function(match_all,match_target,index,resource){
		//构造函数体
		function_body += 'r.push("'+tpl.substr(start_index,index-start_index).replace(new RegExp("[\\r\\t]","g"), "").replace(/"/g,'\\"').replace(/\n/g,'\\n')+'");\n';
		var _match_target = match_target.toString().replace(/(^\s*)|(\s*$)/g,'');
		if(match_target.substr(0,1)=='='){
			//如果是变量并且不转意
			function_body += 'r.push(typeof('+_match_target.substr(1)+') === "undefined"?"":'+_match_target.substr(1)+');\n';
		}else if(match_target.substr(0,1)=='@'){
			//如果是变量并且不转意
			function_body += 'r.push(typeof('+_match_target.substr(1).replace(/\((.*?)\)(.*)/g,'')+') !== "function"?"":'+_match_target.substr(1).replace(/\)(.*)/g,')')+');\n';
		}else if(match_target.substr(0,3).toLowerCase()==':v='){
			//如果是变量并且转意
			function_body += 'r.push(typeof('+_match_target.substr(3)+') === "undefined"?"":newTplEngine._encodeHTML('+_match_target.substr(3)+'));\n';
		}else if(match_target.substr(0,3).toLowerCase()==':u='){
			//如果是变量并且进行URL编码
			function_body += 'r.push(typeof('+_match_target.substr(3)+') === "undefined"?"":encodeURI('+_match_target.substr(3)+'));\n';
		}else{
			//直接是js代码
			function_body += _match_target+'\n';
		}
		start_index = index + match_all.length;
		return '';
	});
	//模板最后一个标签遗留下的部分
	function_body += 'r.push("'+tpl.substr(start_index).replace(new RegExp("[\\r\\t]","g"), "").replace(/"/g,'\\"').replace(/\n/g,'\\n')+'");\n';
	function_body += '})(__template_data__);';
	//合并函数体
	function_body += 'return r.join("");';
	//构造一个后台函数
	var fn = new Function('__template_data__',function_body);
	if( data!=undefined ){
		return fn(data);
	}else{
		return fn;
	}
}

/**
 * 初始化产品分类
 */
function dataCategoryInitSub(trigger) {
	var obj = $('[data-category]:not([data-category-init])');
	obj.bind('change',function () {
		var _this = $(this);
		var parentid = _this.val();

		$.get('/admin/ajax/GetProductCategory',{
			parentid:parentid
		},function (replayData) {
			//删除所有子分类
			_this.nextAll('[data-category]').remove();

			if(replayData.length<=0){
				_this.attr('name',_this.attr('data-name'));
				return;
			}

			var html = '<option value="-1">选择分类</option>' , selected = '';

			for ( var i in replayData ){
				html += '<option value="'+replayData[i].id+'">'+replayData[i].name+'</option>';
			}
			var _name = _this.attr('name') || _this.attr('data-name');
			html = '<select class="Z-w-110" data-category name="'+_name+'">'+html+'</select>';
			_this.attr('data-name',_name).removeAttr('name');
			_this.after(html);
			dataCategoryInitSub(true);

		},'json');
	});
	obj.attr('data-category-init','init');
	if(trigger)obj.trigger('change');
}



/**
 * 初始化产品分类2
 */
function dataCategoryInit(selectid) {
	
	$.get('/admin/ajax/GetAllCategory',{
		id:selectid || 0
	},function (replayData) {
		window.global.categoryData = replayData;
		function createTreeSelect(categoryData,_this,auto){
			
			//删除所有子分类
			_this.nextAll('[data-category]').remove();
			
			if(categoryData==null)return ;

			_this.attr('data-category-init','init');
			
			var html = '<option value="-1">选择分类</option>' , selected = '', childerData = null , prevId = null;
			
			if(!auto){
				prevId = _this.prev().val();
			}
			for ( var i in categoryData ){
				selected = '';
				if(categoryData[i].disabled==1 && auto){
					selected = 'selected';
					childerData = categoryData[i].child;
				}
				html += '<option '+selected+' value="'+categoryData[i].id+'">'+categoryData[i].name+'</option>';
			}

			if(childerData==null && typeof categoryData[0].child != 'undefined' && categoryData[0].child.length){
				childerData = categoryData[0].child;
			}
			var fieldName = '';
			if(childerData==null) fieldName = ' name="'+_name+'" ';
			
			html = '<select class="Z-w-110" '+fieldName+' data-category data-name="'+_name+'">'+html+'</select>';
			
			_this.remove();
			
			parentWarp.append(html);
			
			createTreeSelect(childerData,$('[data-category]',html),auto);
			
		}
		
		var parentWarp = $('[data-top]:not([data-category-init])').parent();
		
		var _name = $('[data-top]:not([data-category-init])').attr('name');
		createTreeSelect(replayData,$('[data-top]:not([data-category-init])'),true);
		
		dataCategoryInitSub(false)
		
	},'json');
}


/**
 * 强制添加
 */
function editArticleAuthor(_this,uid){
	var scrollId = randomID();
	layer.open({
		title: '修改作者',
		scrollbar:false,
		area:['660px','500px'],
		content: '\
            <div class="layer-event-add-user-search">\
                <spa>用户昵称或UID :</spa>\
                <input placeholder="必须填入用户昵称或UID" id="key'+scrollId+'" class="Z-input Z-w-370">\
                <button id="search-btn'+scrollId+'" type="button" class="Z-btn Z-w-110 Z-right">查询</button>\
            </div>\
            <div id="'+scrollId+'" class="layer-event-add-user-list">\
				<ul></ul>\
			</div>',

		success:function (layero, index) {
			var scrollBox = layero.find('#'+scrollId),
				scrollBoxUl = scrollBox.find('ul'),
				is_loading = true,
				p = 0,
				html = '';

			$(layero).on('click','[data-edit-select]',function () {
				$(_this).find('.Z-edit-author-face img').attr('src','http://s1.jiguo.com/avatar'+$(this).attr('data-uid')+'/230x230?time='+(+new Date()));
				$(_this).find('.Z-edit-author-name').html($(this).attr('data-username'));
				$(_this).find('[data-input-author]').val($(this).attr('data-username'));
				$(_this).find('[data-input-uid]').val($(this).attr('data-uid'));
				layer.closeAll();
			});

			window._getQiangzhiData = function (fille) {
				is_loading = false;
				$.get('/admin/ajax/GetUserInfo',{
					p:p,
					size:14,
					username:$('#key'+scrollId).val(),
					uid:uid
				},function (replayData) {

					replayData = replayData.data;

					html = '';
					for(var i in replayData){
						html += '\
                                <li>\
                                    <div class="Z-user-face-box">\
                                        <img src="http://s1.jiguo.com/avatar'+replayData[i].uid+'/230x230?_='+(+new Date())+'">\
                                    </div>\
                                    <span class="layer-name">'+replayData[i].username+'</span>';
						if(replayData[i].pass==1){
							html += '<a class="layer-query already-add"></a>';
						}else {
							html += '<a class="layer-query" data-edit-select data-uid="'+replayData[i].uid+'" data-username="'+replayData[i].username+'"></a>';
						}

						html += '</li>';
					}
					if(fille){
						if(html==''){
							html = '<span class="Z-red">没有数据...</span>';
						}
						scrollBoxUl.html(html);
					}else {
						scrollBoxUl.append(html);
					}
					if(replayData.length){
						p++;
						is_loading = true;
					}else {
						is_loading = false;
					}
				},'json');
			}

			layero.find('#'+scrollId).scroll(function () {
				if(is_loading && scrollBoxUl.height()<scrollBox.scrollTop()+scrollBox.height()+40){
					window._getQiangzhiData();
				}else{
					return;
				}
			});

			$('#key'+scrollId).keypress(function () {
				p=0;
				is_loading = true;
				window._getQiangzhiData(true);
			});

			$('#search-btn'+scrollId).click(function () {
				p=0;
				is_loading = true;
				window._getQiangzhiData(true);
			});

			window._getQiangzhiData();
		}

	});
}


function addTouTiaoArticle(url,title) {
	var scrollId = randomID();
	layer.open({
		title: title || '新增头条',
		type: 2,
		scrollbar:false,
		area:['910px','550px'],
		content: url
	});
}

function deleteTouTiaoArticle(url) {
	layer.alert('确定删除吗',{
		btn:['删除','关闭']
	},function () {
		$.get(url,function (replayData) {
			if(replayData.status==0){
				window.location.reload();
			}else{
				layer.msg(replayData.message || '删除失败');
			}
		},'json');
	});
}


//新建直播
function addZhibo(url,title) {
	var scrollId = randomID();
	layer.open({
		title: title || '新增头条',
		type: 2,
		scrollbar:false,
		area:['910px','550px'],
		content: url
	});
}

















