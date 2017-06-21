
//跨域 酷玩 http://www.jiguo.com/list/index/217.html
//跨域 导购 http://www.jiguo.com/list/index/217.html
if(
	window.location.href.indexOf('jiguo.com/list/index')!=-1 ||
	window.location.href.indexOf('jiguo.com/product/index')!=-1
){
	document.domain = 'jiguo.com';
}

// JavaScript Document
function likes(obj,type){
	$.post("/ajax/likes.html",{'type':type,'id':obj},function(data){
		$('#l'+obj).html(data);
	});
}

function comments(obj,type){
	$.post("/ajax/comments.html",{'type':type,'id':obj},function(data){
		$('#c'+obj).html(data);
		$('.c'+obj).html(data);
	});
}

function articleZan(obj,type){
	$.post("/ajax/likes.html",{'type':type,'id':obj},function(data){
		$('#a'+obj).html(data);
		$('.a'+obj).html(data);
	});
}

///************************************///
///product/index/1677.html页面服务函数开始
///************************************///
function setCookie(name, value, iDay){
	/* iDay 表示过期时间 cookie中 = 号表示添加，不是赋值 */
	var oDate = new Date();
	oDate.setDate(oDate.getDate()+iDay);
	document.cookie=name+'='+value+';expires='+oDate;
}

function getCookie(name){
	/* 获取浏览器所有cookie将其拆分成数组 */
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++)    {
		/* 将cookie名称和值拆分进行判断 */
		var arr2=arr[i].split('=');
		if(arr2[0]==name){
			return arr2[1];
		}
	}
	return '';
}
//自定义滚动条
function _S(jQuery){
	jQuery("#dpc-content-center-scroll").mCustomScrollbar({
		scrollButtons:{enable:true,scrollSpeed:8 },
		theme:"light",
		scrollbarPosition:"outside",
		scrollInertia:12
	});
};

//自定义简单模板引擎函数
function tplEngine(tpl, data) {
	var reg = /<%([^%>]+)?%>/g,
		regOut = /(^( )?(if|for|else|switch|case|break|var|alert|{|}))(.*)?/g,
		code = 'var r=[];\n',
		cursor = 0;

	var add = function(line, js) {
		js? (code += line.match(regOut) ? line + '\n' : '\nr.push(' + line + ');\n') :
			(code += line != '' ? '\r\nr.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = reg.exec(tpl)) {
		add(tpl.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(tpl.substr(cursor, tpl.length - cursor));
	code += 'return r.join("");';
	console.log(code);
	return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};

//弹窗初始化
function dpcDailog($,data){
	$('body').append( tplEngine( $('#dpc-dialog-tpl').html(), {data: data} ) );

	var dpc_box = $('.dpc-box'),
		dpc_control = $('.dpc-control'),
		WIN_W = $(window).width(),
		WIN_H = $(window).height(),
		dpc_W = 880,
		dpc_H = 510,
		top = WIN_H / 2 - (dpc_H / 2),
		left = WIN_W / 2 - (dpc_W / 2);

	dpc_control.css('left',left )
		.css('top',top );
	var LI = $('.dpc-content-ul').find('li'),
		CARD = $('.dpc-content-card');

	LI.click(function(){
		LI.removeClass('on');
		CARD.css('display','none');
		var data_class = $(this).attr('data-class');
		$(this).addClass('on');
		$('.'+data_class).css('display','block');
	});
	var _time = 260,tag_top = 60,opacity=0.2;
	jQuery.fx.interval = 5;
	dpc_control.add(dpc_box).css({opacity:opacity,display:'block'});
	dpc_box.animate({opacity:'1'},_time);
	dpc_control.css({top:top-tag_top}).animate({opacity:'1',top:top},_time);
	$('.dpc-close').click(function(){
		var oxc = $('.'+$(this).attr('data-class'));
		oxc.animate({opacity:opacity});
		$(dpc_control).animate({opacity:opacity,top:top-tag_top},_time,function(){
			oxc.remove();
			jQuery.fx.interval = 13;
		});
	});
};

function _showConfrm(jQuery,getPriceUrl,getProduct){
	//绑定hover模拟事件
	//预加载购买地址列表
	var buy_addr_list = null;
	var dpc_price_tpl = $('#dpc-price-tpl').html();
	var dpc_isload_price_list = false;
	$.get(getPriceUrl, function (data) {
		buy_addr_list = data;
		if(data=='-1')return false;
		dpc_isload_price_list = true;
		$('.more-buy-addr-pox .buyBtn').append( tplEngine(dpc_price_tpl, {data:data}) );
	},'json');

	$('.more-buy-addr-pox').on('mouseenter','.buyBtn',function(){
		var find_sub = $(this).find('.more-buy-addr'),_this = $(this);
		if( $(this).attr('down')=='no' ){
			return false;
		}
		if( find_sub.length<=0 && dpc_isload_price_list) {
			$.get(getPriceUrl, function (data) {
				dpc_isload_price_list = false;
				if(data=='-1')return false;
				_this.append( tplEngine(dpc_price_tpl, {data:data}) );
				_this.find('.more-buy-addr').stop(false, true).slideDown(200);
			},'json')
		}else{
			find_sub.stop(false, true).slideDown(200);
		}
	}).on('mouseleave','.buyBtn',function(){
		$(this).find('.more-buy-addr').stop(true,false).slideUp(200);
	});
	
	//点击弹窗事件
	$('.more-buy-addr-pox').on('click','.buyBtn li',function(e){
		if( getCookie('showTips')=='' && $(this).attr('data-show-dialog')=='1' ) {
			e.preventDefault();
			//初始化模板数据
			var url = $(this).find('a').attr('href');
			$.get(getProduct ,{url:url}, function (data) {
				//显示弹窗并解析模板
				dpcDailog(jQuery, data);
				//设置cookie
				$('.dpc-shopaholic').click(function(){
					if( $(this).get(0).checked ){
						setCookie('showTips','show',9999999999);
					}else{
						setCookie('showTips','',-99999);
					}
				});
				//初始化自定义滚动条
				_S(jQuery);
			},'json');
		}
	});
}
///************************************///
///product/index/1677.html页面服务函数结束
///************************************///

function _showConfrmList(jQuery,getPriceUrl,getProduct){
	//绑定hover模拟事件
	//预加载购买地址列表
	var buy_addr_list = null;
	var dpc_price_tpl = $('#dpc-price-tpl').html();
	var dpc_isload_price_list = false;
	//点击弹窗事件
	$('li.msg').on('click','a.opt',function(e){
		
		if( getCookie('showTips')=='' ) {
			e.preventDefault();
			//初始化模板数据
			var url = $(this).attr('href');
			var pid = $(this).attr('pid');
			var price = $(this).attr('price');
			var _this = this;
			
			$.get(getProduct ,{url:url,id:pid,price:price}, function (data) {
				if(data=='-1'){
					window.location = url;
					//_this.is_click = true;
					//$(_this).trigger('click');
					return;
				}
				//显示弹窗并解析模板
				dpcDailog(jQuery, data);
				//设置cookie
				$('.dpc-shopaholic').click(function(){
					if( $(this).get(0).checked ){
						setCookie('showTips','show',9999999999);
					}else{
						setCookie('showTips','',-99999);
					}
				});
				//初始化自定义滚动条
				_S(jQuery);
			},'json');
		}
	});
};


$(function(){
	if($('ul').length<=0)return false;
	
	$('ul').on('mouseover', 'a,li', function() {
		$(this).find('.zhezhaos').addClass('indexzhezhao');
		$(this).find('.zhezhaoed').addClass('indexzhezhaos');
	}).on("mouseout", 'a,li', function (event) {
		$(this).find('.zhezhaos').removeClass('indexzhezhao');
		$(this).find('.zhezhaoed').removeClass('indexzhezhaos');
	});
});


//手机号验证
function validatemobile(mobile){
	if(mobile.length==0)
	{
		alert('请输入手机号码！');
		document.form.tel.focus();
		return false;
	}
	if(mobile.length!=11)
	{
		alert('请输入正确的手机号码！');
		document.form.tel.focus();
		return false;
	}

	var myreg = /^((([1-9]{1}))+\d{10})$/;
	if(!myreg.test(mobile))
	{
		alert('请输入正确的手机号码！');
		document.form.tel.focus();
		return false;
	}
	return true;
}


//手机登陆
function LoginPost(){
	var tel = $(".loginCon input[name='tel']").val();
	var passwd = $(".loginCon input[name='passwd']").val();

	if(validatemobile(tel)&&passwd){
		$.post('/ajax/login.html',{'tel':tel,'passwd':passwd}, function(data){
			//alert(data);
			if(data==1){
				location.reload();
			}else{
				alert(data);
			}
		});
	}
}

function videoAdaption(){

	var selecterBox = $('body'),
		VideoWidth = 650,
		VideoHeight = VideoWidth*2/3,
		vidoeBox = selecterBox.find('embed,iframe:not([data-productid])'),
		src = null;

	function getKeyVal(src,key){
		var matchVidArray = src.toString().split('?')[1].toString().split('&') , vid=null;
		for(var i2=0;i2<matchVidArray.length;i2++){
			if(matchVidArray[i2].split('=')[0].toLowerCase()==key){
				vid = matchVidArray[i2].split('=')[1];
				return vid;
			}
		}
		return '';
	}

	vidoeBox.each(function () {
		src = $(this).attr('src');
		if(src==undefined) return;
		var id = 'iframe'+Math.random().toString().replace('.','');
		$(this).replaceWith('<iframe id="'+id+'" frameborder="0"></iframe>');
		var _this = $('#'+id);

		if(src.match("v.qq.com") || src.match("video.qq.com") ){
			src = 'http://v.qq.com/iframe/player.html?vid='+getKeyVal(src,'vid')+'&width='+VideoWidth+'&height='+VideoHeight+'&auto=0';
		}else if(src.match("youku.com")){
			src.match(/http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/);
			src = 'http://player.youku.com/embed/'+RegExp.$1;
		}
		_this.attr({src:src, height:VideoHeight, width:VideoWidth});
	});
}


//微博QQ图片切换
function qqWeiboChang(){
	$(".loginRight .mesd .weibo").hover(function(){
        $("#login_weibos").prop("src","http://cdn.jiguo.com/p1/i/weibo2.png")
    },function(){
        $("#login_weibos").prop("src","http://cdn.jiguo.com/p1/i/weibo1.png")
    });
    $(".loginRight .mesd .qq").hover(function(){
        $("#login_qqs").prop("src","http://cdn.jiguo.com/p1/i/qq2.png")
    },function(){
        $("#login_qqs").prop("src","http://cdn.jiguo.com/p1/i/qq1.png")
    });
}

//回车登录
function enterLogin(){
	$(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var displays = $(".login_op").css('display');
            if(displays=="block"){
                LoginPost();
            }

        }
    });
}


function pushNotification(userssid){
	 // 连接服务端
	var socket = io('http://io.jiguo.com:2126');
    // 连接后登录
    socket.on('connect', function(){
    	socket.emit('login',userssid);
    });
    // 后端推送来消息时
    socket.on('new_msg', function(msg){
		eval('msg = '+msg);
		var tempFunc = function(number,selecter,tips){
			if(parseInt(number)>99){
				html = '<font>···</font>';
			}else{
				html = number;
			}
			$(selecter).find('>a .jiguo-badge').remove();
			if(tips=='tips'){
				$(selecter).find('>a').append('<em class="jiguo-badge jiguo-badge-dian"></em>');
			}else{
				$(selecter).find('>a').append('<em class="jiguo-badge">'+html+'</em>');
			}
		};
		if(msg!=null){
			var html = 0;
			if( typeof(msg.event)!='undefined' && parseInt(msg.event)>0 ){
				tempFunc(msg.event,'.eventnews');
			}else if( typeof(msg.tip)!='undefined'){
				if(typeof(msg.tip.event)!='undefined' && parseInt(msg.tip.event)>0)tempFunc(msg.tip.event,'.eventnews','tips');
			}
			if(typeof(msg.systems)!='undefined' && parseInt(msg.systems)>0){
				tempFunc(msg.systems,'.systemsnews');
			}else if( typeof(msg.tip)!='undefined' ){
				if(typeof(msg.tip.systems)!='undefined' && parseInt(msg.tip.systems)>0)tempFunc(msg.tip.systems,'.systemsnews','tips');
			}
			if(typeof(msg.coin)!='undefined' && parseInt(msg.coin)>0){
				tempFunc(msg.coin,'.coinnews');
			}else if( typeof(msg.tip)!='undefined' ){
				if(typeof(msg.tip.coin)!='undefined' && parseInt(msg.tip.coin)>0)tempFunc(msg.tip.coin,'.coinnews','tips');
			}
			if(typeof(msg.comment)!='undefined' && parseInt(msg.comment)>0){
				tempFunc(msg.comment,'.commentnews');
			}else if( typeof(msg.tip)!='undefined' ){
				if(typeof(msg.tip.comment)!='undefined' && parseInt(msg.tip.comment)>0)tempFunc(msg.tip.comment,'.commentnews','tips');
			}
			if(typeof(msg.zan)!='undefined' && parseInt(msg.zan)>0){
				tempFunc(msg.zan,'.zannews');
			}else if( typeof(msg.tip)!='undefined' ){
				if(typeof(msg.tip.zan)!='undefined' && parseInt(msg.tip.zan)>0)tempFunc(msg.tip.zan,'.zannews','tips');
			}
			//外层角标
			if(typeof(msg.num)!='undefined' && parseInt(msg.num)>0){
				tempFunc(msg.num,'.jiguo-user-message-list');
			}else if(typeof(msg.tips)!='undefined' && parseInt(msg.tips)>0){
				tempFunc(msg.count,'.jiguo-user-message-list','tips');
			}
		}
    });
}

//快速滚动到顶部
function bodyIsScrollTop(isIndex){
	var floatImgs = $('#floatImgs');
	if(floatImgs.length<=0){
		$('body').append('<a class="floatImgs" id="floatImgs" href="javascript:scroll(0,0)"></a>');
		floatImgs = $('#floatImgs');
	}
	
	var WindowWdith = $('body').width();
	WindowWdith = (WindowWdith-850)/2+1000;
	floatImgs.css({'left':WindowWdith,'position':'fixed','bottom':'0px'});
	var footer = $("#Footer"),body = $("body");
	//绑定向下滚动显示快速向上按钮
	$(window).scroll(function () {
		var pos_ts = $(document).scrollTop();
		if( pos_ts >= 30 ) {
			floatImgs.css('display',"block");
		} else {
			floatImgs.css('display',"none");
			return;
		}
		var footerfootertop = footer.offset().top
		var footer_height=footer.height();
		var W_HEIGHT = $(window).height();
		var floatImgs_height=floatImgs.height();

		var document_height = $(document).height();
		
		if( pos_ts + W_HEIGHT > document_height - floatImgs_height - footer_height ){
			var bottom = W_HEIGHT + pos_ts - footerfootertop;
			if(bottom<0) bottom = 0;
			floatImgs.css({position:"fixed",bottom:bottom});
		}else{
			floatImgs.css({position:"fixed",bottom:0});
		}
	});	
}

window.userIsLogin_ajaxlock = false;
window.userIsLogin_ajaxhandle = null;
//调起登陆框
function loginPan(){
	$('.login_op').css('display','block');
	//触发起请求
	window.userIsLogin_ajaxlock = true;
}

$(function(){
	$('.logoBtn a').on('click', function(e) {
		e.preventDefault();
		loginPan();
	});

	// 关闭
	$('.login_win_close_wrap a').click(function(e){
		e.preventDefault();
		$('.login_op').css('display','none');
		window.userIsLogin_ajaxlock = false;
	});
});
  
function synclogin(){
	if (window.userIsLogin_ajaxlock) {
		$.get("/ajax/code.html", function(data){
			if(data==1){
				location.reload();
				clearInterval(window.userIsLogin_ajaxhandle);
			}
		});
	}
}
//判断用户是否登陆
function userIsLogin(){
	//关闭登陆框则不发起请求
	$('.login_win_close_wrap a').click(function(){
		window.userIsLogin_ajaxlock = false;
	});
	//默认不发起请求
	window.userIsLogin_ajaxlock = false;
	window.userIsLogin_ajaxhandle = setInterval("synclogin()",1000);
}

function ajaxLoadDitail(dl){
	dl.find('li.card:not(.load)').each(function(index, element) {
		var _this = $(this);
		$.post("/api/eventstatus/Pcevent.html",{'eventid':_this.attr('eventid')}, function(data){
			_this.find('.sq').html(data.num);
			_this.find('.cuttime').addClass(data.status).html(data.title);
			_this.addClass('load');
		},'json');
	});
}

//ajax加载产品列表
//@parme1 加载地址
//@parme2 列表容器
function ajaxLoadingListShowHtml(url ,box ,sendData,callback){
	this.p = 1;
	this.load =true;
	this.callback = typeof(callback)!='function'?function(){}:callback;
	var self = this;
	this.sendData = $.extend({size:16,p:self.p},sendData);
	$('.loadMore').click(function () {
		if (self.load) {
			self.load = false;
			var _this = $(this);
			_this.addClass('g-loading').html(_this.attr('loading'));
			$.get(url, self.sendData ,function(data){
				if(data){
					box.append(data);
					_this.removeClass('g-loading').html(_this.attr('default'));
					self.sendData.p++;
					self.load =true;
				}else{
					$('.loadMore').remove();
				}
				self.callback(box);
			});
		}
	});
}
	
window.cutStr = function (string,number,fix){
	if(typeof string!='string' ){
		string =string.toString();
	}
	if(typeof fix == 'undefined'){
		fix = '...<p class="open-btn" data-show-html="隐藏" data-hide-html="展开">展开</p>';
	}
	if(typeof number == 'undefined'){
		number = 106;
	}
	if(string.length>number){
		return string.substr(0,number)+fix;
	}else{
		return string;
	}
}


//菜单下滑样式
$(function(){
	var temp = $('#has-file-message-css');
	if( temp.length>0 ){
		$('.jiguo-user-canter li').hover(function(){
			$(this).find('.jiguo-user-down').show();
		},function(){
			$(this).find('.jiguo-user-down').hide();
		});
	}
});

//自定义简单模板引擎函数 增强版
//如果没有设置传递data参数则会返回一个将模板编译好的函数
//如果传入data就直接返回生成好的模板
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
		var _match_target = match_target.replace(/(^\s*)|(\s*$)/g,'');
		if(match_target.substr(0,1)=='='){
			//如果是变量并且不转意
			function_body += 'r.push(typeof('+_match_target.substr(1)+') === "undefined"?"":'+_match_target.substr(1)+');\n';
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


// /event/index/604.html
// 申请用户加载列表
function LoadingApplyList(url ,box ,sendData,loadMore,tplFun){
	this.p = 1;
	this.load =true;
	this.loadMore = loadMore || $('.loadMore');
	
	var self = this;
	this.sendData = $.extend({size:16,p:self.p},sendData);
	box.on('click','.open-btn',function(){
		var _this_parent = $(this).parent().parent();
		_this_parent.find('.show-open-all').show();
		_this_parent.find('.show-open-part').hide();
	});
	self.loadMore.click(function () {
		if (self.load) {
			self.load = false;
			var _this = $(this);
			_this.addClass('g-loading').html(_this.attr('loading'));
			$.get(url, self.sendData ,function(data){
				if(data.data){
					box.append(tplFun({data:data.data}));
					_this.removeClass('g-loading').html(_this.attr('default'));
					self.sendData.p++;
					self.sendData.limit = data.limit;
					self.load =true;
				}else{
					self.loadMore.css({color:'#a3a3a3','background-image':'none'}).html(self.loadMore.attr('no-more'));
				}
			},'json');
		}
	});
	self.loadMore.trigger('click');
}


//信息加载器
//消息中心
function loadTool(url,info_box){
	this.loadMore = $('.g-load-more-btn');
	this.is_loading = true;
	this.limit = '';
	this.size = 8;
	this.p  = 0;
	this.url = url;
	this.user_center_comment_list = typeof info_box=='undefined'? $('#user-center-comment-list') : $(info_box);
		//获取模板缓存函数
	this.tpl_box = typeof info_box=='undefined'? $('#user-center-comment-list-tpl') : $(info_box+'-tpl')
	this.func_tpl = newTplEngine( this.tpl_box.html() );
	var self = this;
	this.loadCommentFunc = function(){
		self.loadMore.addClass('g-loading').html(self.loadMore.attr('loading'));
		//设置不允许加载状态
		self.is_loading = false;
		//'/api/news/GetNew'
		$.get(this.url,{
			limit : self.limit,
			size : self.size,
			p : self.p
		},function(data){
			self.loadMore.removeClass('g-loading').html(self.loadMore.attr('default'));
			if(data.result!=null){
				self.limit = data.limit;
				self.p += 1;
				self.user_center_comment_list.append(self.func_tpl({data:data}));
				//设置允许加载状态
				self.is_loading = true;
				//是否有展开按钮
				self.user_center_comment_list.find('article:not(.each)').each(function(){
					//处理是否添加展开按钮
					if($(this).find('span.jiguo-show-open-flage').length<=0) return;
					
					if( $(this).height()>60 && $(this).find('span.jiguo-show-open-flage').position().top>$(this).height() ){
						$(this).addClass('each');
						$(this).after('<p class="jiguo-open-btn" data-show-html="隐藏" data-hide-html="展开">展开</p>');
					}
				});
				if(data.result.length<self.size){
					self.is_loading = false;
					self.loadMore.html(self.loadMore.attr('no-more')).css('background-image','none').addClass('g-no-data');
				}
			}else{
				self.is_loading = false;
				self.loadMore.html(self.loadMore.attr('no-more')).addClass('g-no-data').css('background-image','none');
				if(self.p<=0){
					self.loadMore.html(self.loadMore.attr('no-data')).addClass('g-no-data');
				}
			}
		},'json');
	};
	
	if(self.is_loading){
		//加载评论
		self.loadCommentFunc();
	}
	//绑定滚动加载
	self.loadMore.click(function(){
		if(self.is_loading ){
			//加载评论
			self.loadCommentFunc();
		}
	});
}


function new_alert(tips){
	tips = tips || '操作中···';
	var arr = [] , id = 'id-'+Math.random().toString().replace(/[^\d]/,'') + ~ new Date().toString(),
		width = 200,
		height = 60;
	arr.push('<div id="'+id+'" class="alert-box" style="position:fixed; left:50%; top:50%; margin-left:-'+(width/2)+'px; margin-top:-'+(height/2)+'px; z-index:19911224; width:'+width+'px; height:'+height+'px;">');
	arr.push('<div class="alert-inner" style="position:absolute;z-index:19911224; background:#000;border-radius:5px;width:100%; height:100%; opacity:0.7;filter:alpha(opacity=70);"></div>');
	arr.push('<div class="alert-inner" style="line-height:'+height+'px; text-align:center; font-size:16px; color:#fff; position:relative;z-index: 19911226;">'+tips+'</div>');
	arr.push('</div>');
	$('body').append(arr.join(''));
	return id;
}
new_alert.close = function(id){
	$('#'+id).remove();
};

//获取消息中心信息汇总
$(function(){
	//如果没有评论框则不加载
	if($('#has-message-list-ul').length<=0){
		return true;
	}
	
	//处理三行以上信息显示
	var showFull = function(obj,_this){
		if(obj.css('display')!='block'){
			obj.css('display','block');
			_this.css('display','none');
			if(_this.attr('data-show-html')!=undefined)
				_this.html(_this.attr('data-show-html'));
		}else{
			obj.css('display','none');
			_this.css('display','block');
			if(_this.attr('data-show-html')!=undefined)
				_this.html(_this.attr('data-hide-html'));
		}
	};
	//评论文本框的显示
	var showHide = function(obj,_this){
		if(obj.css('display')=='none'){
			$('.replay-comment').css('display','none');
			$('.replay').html('回复');
			obj.css('display','block');
			_this.html('取消');
		}else{
			obj.css('display','none');
			_this.html('回复');
		}
	};		
	//绑定点击事件
	$('#has-message-list-ul').on('click','.replay',function(){
		showHide($(this).parent().parent().next(),$(this));
	})
	//点击展开按钮
	.on('click','.open-btn',function(){
		if($(this).parent().prev().length){
			showFull($(this).parent().prev(),$(this).parent());
		}else{
			showFull($(this).parent().next(),$(this).parent());
		}
	});
	
});


//回复评论
function userSubmitComment(uid,commentid,valueid){
	var content = $(valueid).val() , new_alert_hander = null;
	if(content.length<=0){
		new_alert_hander = new_alert('回复内容不能为空');
		setTimeout(function(){
			new_alert.close(new_alert_hander);
		},3000);
		return false;
	}
	new_alert_hander = new_alert('回复内容提交中···');
	$.post("/api/comment/PostComment",{
		uid:uid,
		commentid:commentid,
		content:content
	},function(result){
		new_alert.close(new_alert_hander);
		var _new_alert_hander = new_alert('回复内容成功');
		setTimeout(function(){
			new_alert.close(_new_alert_hander);
		},2000);
		if(result.status!=0){
			var _valueid = $(valueid);
			//传入id，获取评论单条接口
			_valueid.val('');
			_valueid.parent().parent().prev().find('.replay').trigger('click');
			//_valueid.parent().parent().parent().find('article').last().after('<article class="content-show content-show-my-replay" style="display:none;">我刚刚回复啦TA</article>');
			_valueid.parent().parent().parent().find('article').last().slideDown();
		}else{
			new_alert_hander = new_alert.close('评论失败');
			setTimeout(function(){
				new_alert.close(new_alert_hander);
			},3000);
		}
	},"json");
}

//加载 试用消息
$(function(){
	//如果没有评论框则不加载
	if($('script#event-list-tpl').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetMainNewsList?type=event','#event-list');
});

//加载 系统消息
$(function(){
	//如果没有评论框则不加载
	if($('script#systems-list-tpl').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetMainNewsList?type=systems','#systems-list');
});

//加载 积分消息
$(function(){
	//如果没有评论框则不加载
	if($('script#coin-list-tpl').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetMainNewsList?type=coin','#coin-list');
});

//加载 评论消息
$(function(){
	//如果没有评论框则不加载
	if($('script#has-message-list-ul-tpl').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetMainNewsList?type=comment','#has-message-list-ul');
});

$(function(){
	//如果没有评论框则不加载
	if($('script#zan-list-tpl').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetMainNewsList?type=zan','#zan-list');
});

//非体验师申请试用活动弹窗
function applyErrorDialog(){
	var url = arguments[0] || '/';
	var erweima = arguments[1] || 'http://cdn.jiguo.com/p1/i/code.png';
	var showString = '<style>\
	.apply-event-tips,.apply-event-tips-mask{overflow: hidden;position:fixed;top:0;left:0;width:100%;height:100%;z-index:99;}\
	.apply-event-tips.hide{display:none;}\
	.apply-event-tips-mask{background-color:#000000;opacity:0.5;filter:alpha(opacity=50);}\
	.apply-event-tips-inner{z-index: 100;position: relative;display: block;width: 515px;background-color: #fff;border-radius: 6px;box-shadow: 0px 0px 1px 1px #808080;margin: auto;top: 50%;margin-top: -260px;}\
	.apply-event-tips-inner .close_mask_window {position: absolute;top: 0;right: 0;}\
	.apply-event-tips-inner .close_mask_window a {color: #999;font-size: 21px;display: block;width: 30px;height: 30px;text-align: center;line-height: 30px;}\
	.apply-event-inner-padding{padding:40px;text-align: center;}\
	.apply-event-inner-padding>div{margin:15px 0;}\
	.apply-event-text{font-size: 20px;font-weight: 600;}\
	.apply-event-shaoma{font-size: 16px;color: #a3a3a3;}\
	div.apply-event-btn{width: 170px;margin-left: auto;margin-right: auto;}</style>\
	<div class="apply-event-tips">\
		<div class="apply-event-tips-mask" onclick="$(\'.apply-event-tips\').remove()"></div>\
		<div class="apply-event-tips-inner">\
			<p class="close_mask_window" onclick="$(\'.apply-event-tips\').remove()"><a href="javascript:;">×</a></p>\
			<div class="apply-event-inner-padding">\
				<div class="apply-event-text">\
					<p>抱歉，您当前申请的活动为“体验师专享”，<br />赶快申请体验师吧！</p>\
				</div>\
				<div class="apply-event-img">\
					<p><img src="'+erweima+'" /></p>\
				</div>\
				<div class="apply-event-shaoma">\
					<p>微信扫码，回复“体验师申请”</p>\
				</div>\
				<div class="apply-event-btn">\
					<div class="buyBtn">\
						<p><a href="'+url+'">返回首页</a></p>\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>';
	$('body').after(showString);
}

//用户绑定账号弹窗
var bindAccount = {
	openDialog:function(callback1,callback2){
		var erweima = 'http://cdn.jiguo.com/p1/i/icon-gantanhao.png';
		var randomId = 'id-'+Math.random().toString().replace('0.');
		var cansalFun = 'bindAccount.closeDialog()';	
		var showString = '<style class="apply-event-tips">\
		.apply-event-tips,.apply-event-tips-mask{overflow: hidden;position:fixed;top:0;left:0;width:100%;height:100%;z-index:99;}\
		.apply-event-tips.hide{display:none;}\
		.apply-event-tips-mask{background-color:#000000;opacity:0.5;filter:alpha(opacity=50);}\
		.apply-event-tips-inner{z-index: 100;position: relative;display: block;width: 515px;background-color: #fff;border-radius: 6px;box-shadow: 0px 0px 1px 1px #808080;margin: auto;top: 50%;margin-top: -260px;}\
		.apply-event-tips-inner .close_mask_window {position: absolute;top: 0;right: 0;}\
		.apply-event-tips-inner .close_mask_window a {color: #999;font-size: 21px;display: block;width: 30px;height: 30px;text-align: center;line-height: 30px;}\
		.apply-event-inner-padding{padding:40px;text-align: center;}\
		.apply-event-inner-padding>div{margin:15px 0;}\
		.apply-event-text{font-size: 20px;font-weight: 600;}\
		.apply-event-shaoma{font-size: 16px;color: #a3a3a3;}\
		div.apply-event-btn{width: 360px;margin-left: auto;margin-right: auto;margin-top:60px;}\
		.red{color:#fe5341;}\
		.dialog-text{text-align:center;line-height: 24px;font-size: 18px;margin:15px 0;}\
		.dialog-text-centent{color:#474747;}\
		.dialog-tips{color:#a3a3a3;font-size:16px;margin-top:10px;}\
		.buyBtn p a.over{background: #a0a0a0;}\
		.buyBtn{ background-color:transparent}\
		.buyBtn p a {width: 160px;margin: 0 5px;display: inline-block;}</style>\
		<div class="apply-event-tips">\
			<div class="apply-event-tips-mask" onclick="'+cansalFun+';"></div>\
			<div class="apply-event-tips-inner">\
				<p class="close_mask_window" onclick="'+cansalFun+';"><a href="javascript:;">×</a></p>\
				<div class="apply-event-inner-padding">\
					<div class="apply-event-img">\
						<p><img src="'+erweima+'" /></p>\
					</div>\
					<!--<div class="dialog-text">\
						<p class="dialog-text-centent">确定注销极果帐号<span class="red">scs</span><br>并绑定微信 scsc 至当前登录帐号？</p>\
						<p class="dialog-tips">注意：注销后无法恢复</p>\
					</div>-->\
					<div class="dialog-text">'+this.showMessage+'</div>\
					<div class="apply-event-btn">\
						<div class="buyBtn">\
							<p><a id="'+randomId+'cansal" href="javascript:;">取消</a><a id="'+randomId+'queren" href="javascript:;" class="over">注销并绑定</a></p>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>';
		$('body').after(showString);
		callback1 = callback1 || function(){};
		callback2 = callback2 || function(){};
		
		$('#'+randomId+'cansal').click(callback1);
		$('#'+randomId+'queren').click(callback2);
	},
	closeDialog:function(){
		$('.apply-event-tips').remove();
	}
}



$(function(){
	if($('#showSearchBox').length<=0)return;
	var h = $('#header-top-search-box');
	$('#showSearchBox').click(function(){
		
		if(h.css('display')=='none'){
			h.css('display','block').animate({width:210,opacity:1});
			$('#header-top-search-box').focus();
		}else{
			if($('#header-top-search-box').val()!=''){
				$('#global-top-form').submit();
			}else{
				h.animate({width:0,opacity:0},function(){
					h.css('display','none');
				});
			}
		}
	});
	
	h.blur(function(){
		setTimeout(function(){
			$(this).animate({width:0,opacity:0},function(){
				$(this).css('display','none');
			});
		},500);
	});
});


//获取微店商品库存剩余数量
function getWeiDianProductNumber(){
	$('.buy.tiyan').each(function(index, element) {
		var self = $(this);
		var parmesObj = $(this).find('[itemid][cid]').eq(0).html(0);
		var requestParme = {id:parmesObj.attr('itemid'),cid:parmesObj.attr('cid')};
		var htmlValu = self.find('.buyBtn p a').html();
		self.find('.buyBtn p a').html('正在加载中');
		$.get('/api/event/weidian',requestParme,function(data){
			if(typeof(data.num)!='number') data.num = parseInt(data.num);
			parmesObj.html(data.num);
			self.find('.buyBtn p a').html(htmlValu);
			if(data.num<=0){
				self.find('.intro.alert-show').remove();
				self.find('.buyBtn p a').addClass('over').html('售罄');
			}
		},'json');
	});
}


// $(function () {
// 	$('iframe[name][data-productid]').each(function () {
// 		$(this).remove();
// 	});
// });
