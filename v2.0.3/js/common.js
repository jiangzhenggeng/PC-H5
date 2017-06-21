function likes(obj,type){
	$.post('/api/counts/likes',{'type':type,'id':obj},function(data){
		$('#l'+obj).html(data);
	});
}

function comments(obj,type){
	$.post('/api/counts/comments',{'type':type,'id':obj},function(data){
		$('#c'+obj).html(data);
		$('.c'+obj).html(data);
	});
}

function articleZan(obj,type){
	$.post('/api/counts/likes',{'type':type,'id':obj},function(data){
		$('#a'+obj).html(data);
		$('.a'+obj).html(data);
	});
}
	
function setCookie(name, value, iDay){
	/* iDay 表示过期时间 cookie中 = 号表示添加，不是赋值 */
	var oDate = new Date();
	oDate.setDate(oDate.getDate()+iDay);
	document.cookie=name+'='+value+';expires='+oDate+';path=/';
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
							
//全局常量定义
//所有常量绑定在window对象下
(function(w,$){
	//window窗口相关常量
	w.WINDOW_HRIGHT = $(window).height();
	w.WINDOW_WIDTH = $(window).width();
	
})(this,jQuery);
/*!
 * 依赖于 jQuery v2.0.3
 * http://jquery.com/
 * 
 * 全局基础类
 * Date: 2015-09-08
 */
(function(w,$){

var 
//局部命名空间
window = w,
jQuery = w.jQuery = $,
INI_BASE = w.INI_BASE = function() {
	return  new INI_BASE.fn.init();
};

INI_BASE.fn = INI_BASE.prototype = {
	
	//初始化函数返回自己
    init: function() {
        return this;
    },
	//阻止事件默认行为函数
    preventDefault:function(event){
		event.preventDefault();
		event.stopPropagation();
	},
	
	//基础对话框对象
	dialog : {
		//保存对象的数组
		hander:{},
		//全局默认配置参数
		option : {
			//消息对话框对象
			duraction : 150,
			easing : '',
			message:false,
			cancel:'取消',
			ok:'确定',
			type:'alert',
			close:false,
			style:{},
			auto_close:false,//是否自动消失
			auto_time:3000,//如果设置了自动消失
			auto_time_show:false,//是否显示 自动消失时间
			callback:function(){},//回调函数
			successCallback:function(){},//确定回调函数
			cancelCallback:function(){},//取消回调函数
			afterCallback:function(){},//显示对话框之前执行函数
			closeCallback:function(){}//直接关闭对话框执行函数
		},
		
		//初始化系统消息框
		getGessage : function(_id){
			if(this.hander[_id].type=='toast'){
				return ''+
				'<div class="dg-toast" id="'+_id+'">'+
				'	<div class="dg-toast-mask" id="dg-toast-mask"></div>'+
				'	<div class="dg-toast-show dg-btn-close-'+_id+'">'+this.hander[_id].message+'</div>'+
				'</div>';
			}
			var string =''+
			'<div class="dg-box" id="'+_id+'">'+
			'<div class="dg-mask" id="dg-mask"></div>'+
			'<div class="dg-content-box" id="dg-content-box">'+
			'<div class="dg-content" id="dg-content">'+
			'<div class="dg-content-show">';
			
			if(this.hander[_id].close){
				string +='<div class="dg-close" id="dg-close" onclick="BASE.dialog.close(\''+_id+'\',-1)">X</div>';
			}
			string +=''+this.hander[_id].message+'</div>';
			if(this.hander[_id].type=='confirm'){
				string +='<div class="dg-button-box dg-confirm">'+
						 '<div class="dg-ctl dg-ctl-confirm" onclick="BASE.dialog.close(\''+_id+'\',0)"><button class="dg-btn dg-btn-close-'+_id+'">'+this.hander[_id].cancel+'</button></div>'+
						 '<div class="dg-ctl dg-ctl-confirm" onclick="BASE.dialog.close(\''+_id+'\',1)"><button class="dg-btn ">'+this.hander[_id].ok+'</button></div>';
			}else if(this.hander[_id].type=='alert'){
				string +='<div class="dg-button-box">'+
						 '<div class="dg-ctl dg-ctl-alert" onclick="BASE.dialog.close(\''+_id+'\',1)"><button class="dg-btn dg-btn-close-'+_id+'">'+this.hander[_id].ok+'</button></div>';
			}
			string +=''+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>';
			return string;
		},
		//打开窗口
		open : function(options){
			//生成对话框唯一标识符
			var _id = ('dg-box-'+Math.random()).replace('.','');
			
			this.hander[_id] = $.extend(this.hander[_id],this.option,options);
			if(this.hander[_id].message===false){return;}
			$('body').append(this.getGessage(_id));
			var hander = $('#'+_id),_this = this;
			
			//打开窗口之前回调函数
			this.hander[_id].afterCallback();
			
			var auto_set_html = function(){
				var btn_obj = hander.find('.dg-btn-close-'+_id);
				var html = btn_obj.html();
				var time = _this.hander[_id].auto_time;
				btn_obj.html(html+'('+(Math.floor(time/1000))+')');
				if(_this.hander[_id].auto_time_show){
					var _timer = setInterval(function(){
						time = time - 1000;
						btn_obj.html(html+'('+(Math.ceil(time/1000))+')');
						if(_timer<=0)clearInterval(_timer);
					},1000);
				}
			};
			if(this.hander[_id].type=='toast'){
				var toast_W = hander.width();
				hander.css('left',$(window).width()/2 - toast_W / 2 );
				setTimeout(function(){
					hander.animate({opacity:0},
					_this.hander[_id].duraction,
					_this.hander[_id].easing,
					function(){
						hander.remove();
						_this.hander[_id].callback();
						//_this.hander = {};
					});
				},_this.hander[_id].auto_time);
				
				if(_this.hander[_id].auto_time_show){
					auto_set_html();
				}
			}else{
				document.addEventListener("touchmove",BASE.preventDefault,false);
				hander.animate({opacity:1},_this.hander[_id].duraction,_this.hander[_id].easing,function(){
					if(_this.hander[_id].auto_close){
						setTimeout(function(){
							_this.close(_id);
						},_this.hander[_id].auto_time);
						if(_this.hander[_id].auto_time_show){
							auto_set_html();
						}
					}
				});
			}		
			return _id;
		},
		//关闭窗口 第二个参数是 关闭窗口的类型，1点击确定关闭0点击关闭按钮关闭，-1直接点击关闭按钮，默认状态是点击关闭按钮
		close : function(_id){
			//设置对话框状态并执行相应的回调函数
			var close_type = -1;
			if (arguments.length>=2){
				close_type = arguments[1];
			}
			var hander = $('#'+_id),_this = this;
			//关闭对话框
			hander.animate({opacity:0},_this.hander[_id].duraction,_this.hander[_id].easing
				,function(){
					hander.remove();
					_this.hander[_id].callback();
					//_this.hander = {};
					hander = null;
			});
			
			if(close_type==1){
				//执行点击确定按钮回调函数
				this.hander[_id].successCallback();
			}else if(close_type==0){
				//执行点击取消按钮回调函数
				this.hander[_id].cancelCallback();
			}else if(close_type==-1){
				//执行点击直接关闭按钮回调函数
				this.hander[_id].closeCallback();
			}
			document.removeEventListener("touchmove",BASE.preventDefault,false);
			return true;
		},
		alert : function(options){
			//打开对话框
			return this.open($.extend(options||{},{type:'alert'}));
		},
		confirm : function(options){
			//打开对话框
			return this.open($.extend(options||{},{type:'confirm'}));
		},
		toast : function(options){
			//打开对话框
			return this.open($.extend(options||{},{type:'toast'}));
		},
	},
}

INI_BASE.fn.init.prototype = INI_BASE.fn;
var BASE = w.BASE = INI_BASE(),
	_BASE = w._BASE = BASE;
	
})(this,jQuery);




/*!
 * 
 * 全局应用类
 * Date: 2015-09-08
 */
(function(w,$,BASE){
var 
//局部命名空间
window = w,
jQuery = w.jQuery = $;

BASE = $.extend(BASE,{
	menuAnimate : function(){
		var setTransform = function(obj,style,val){
			obj.css('-webkit-'+style,val)
			   .css('-moz-'+style,val)
			   .css('-ms-'+style,val)
			   .css(style,val);
		};
		//菜单动画
		//参数定义
		
		var menu_side = $('.menu-side'),
			menu_width = menu_side.width(),
			main_container = $('.main-container'),
			html = $('html'),
			cover = $('.cover'),
			close_flage = true,
			easeing = 'cubic-bezier(0.76, 0.24, 0.23, 0.65)',
			detrue_time = 200;
		//初始化菜单
		setTransform(menu_side,'transform','translateX(-'+menu_width+'px)');
		setTransform(menu_side,'transition-duration',detrue_time.toString()+'ms');
		setTransform(menu_side,'transition-property','transform');
		setTransform(menu_side,'transition-timing-function',easeing);
		
		setTransform(cover,'transition-duration',detrue_time.toString()+'ms');
		setTransform(cover,'transition-property','opacity');
		setTransform(cover,'transition-timing-function',easeing);
		cover.css({'display': 'block','opacity': '0','zIndex':-1});
		//打开菜单
		var openMenu = function(e){
			if(!close_flage)return;
			setTransform(menu_side,'transform','translateX(0px)');
			cover.css('zIndex','50').css({opacity:.7});
			menu_side.css('opacity',1).css('visibility','visible');
			document.addEventListener("touchmove",BASE.preventDefault,false);
		};
		$('.list-menu a').click(function (e) {openMenu(e)});
		
		//关闭菜单
		var closeMenu = function(e){
			if(!close_flage){
				close_flage = false;
				return;
			}
			setTransform(menu_side,'transform','translateX(-'+menu_width+'px)');
			cover.css({opacity:0});
			//menu_side.css('opacity',0);
			setTimeout(function(){
				cover.css({zIndex:-1});
			},detrue_time);
			document.removeEventListener("touchmove",BASE.preventDefault,false);
		};
		
		$('.cover,.footer').on({'click':closeMenu,'touchmove':closeMenu},this);
		
		var touchBind = function(o){
			var startX,
				endX,
				moveX,
				flage,
				max_move;//用户行为目标开始值
				
			o.addEventListener("touchstart", touchStart, false);
			o.addEventListener("touchmove", touchMove, false);
			o.addEventListener("touchend", touchEnd, false);
			
			function touchStart(e){
				setTransform(menu_side,'transition-duration','0ms');
				max_move = startX = e.touches[0].pageX;
				flage = +1;
			}
			function touchMove(e){
				moveX = e.touches[0].pageX;
				endX = moveX-startX;
				if(endX>=0)endX=0;
				
				//模拟用户行为
				if(moveX>max_move){
					flage = -1;
				}else{
					flage = +1;
				}
				setTransform(menu_side,'transform','translateX('+endX+'px)');
				//menu_side.css('opacity',1-(Math.abs(endX)/menu_width));
				max_move = moveX;
			}
			function touchEnd(e){
				setTransform(menu_side,'transition-duration',detrue_time+'ms');
				if(endX<-5 && flage==+1){
					closeMenu(e);
				}else{
					setTransform(menu_side,'transform','translateX(0)');
					//menu_side.css('opacity',1);
				}
			}
		};
		touchBind(menu_side.get(0));
	},

	//焦点图轮播函数
	bannerScroll : function(o){
		var _o = $.extend(true,{
			slideCell:"#focus",
			titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
			mainCell:".bd ul",
			effect:"leftLoop",
			interTime:"4000",
			autoPlay:true,//自动播放
			autoPage:true //自动分页
		},o);
		TouchSlide(_o);
	},

	ajaxLoadList : function(o){
		var p=o.page,
			loadMore = $('.loadMore'),
			clickMore = $('.clickMore'),
			nomore = $('.nomore'),
			list_box = $('.list dl'),
			state = {},
			_load_statue=false;//加载状态
			
		/*
			数据请求
		*/
		var _ajaxLoadList = function (parme){
			$.post(parme.url,{size:parme.size,p:p},function(data){
				if(data){
					list_box.append(data);
					state = {
						title: document.title,
						url:o.state_url+p++
					};
					//第三个参数url的值将会出现在地址栏
					history.pushState(state,state.title,state.url);
					if(p>=6 || parme.type=='click'){
						clickMore.css('display','');
						loadMore.css('display','none');
					}
				}else{
					loadMore.css('display','none');
					nomore.css('display','');
					if(parme.type=='click')clickMore.css('display','none');
				}
				_load_statue = false;					
			});
		};
		
		/*
			滚动窗口加载数据，默认加载四次
		*/
		$(window).bind('scroll', function() {
			if ( window.pageYOffset + window.innerHeight + 720 > document.body.scrollHeight && p<6 && _load_statue==false) {
				_load_statue = true;
				_ajaxLoadList({type:'auto',size:8,url:o.url});
			}else if(p>=6){
				$(window).unbind('scroll');
			}
		});
		/*
			点击加载更多加载数据
		*/
		clickMore.click(function () {
			clickMore.css('display','none');
			loadMore.css('display','');
			_ajaxLoadList({type:'click',size:8,url:o.url});
		});
	},


	//倒计时功能
	countDown : function(o){
		var o = $.extend(true,{
			obj:'#get-code',//触发倒计时对象
			sobj:'#get-code',//显示倒计时信息框
			event:'click',//什么事件触发
			auto:true,//载入页面是否检测倒计时
			start:0,//启事倒计时
			end:0,//到多少秒结束
			time:60,//倒计时长
			step:1,//倒计时步长
			type:'val',//信息填补类型
			message:'{num}重新获取',
			run_message:'正在获取中',
			end_message:'点击重新获取',
			befor:function(){},
			run:function(){},
			callback:function(){},
			style:'cutdown',//设置样式
			dateFn:null,
		},o);
		
		var obj = $(o.obj),
			sobj = $(o.sobj),
			message = '',
			time = 0,
			timer = null;//倒计时句柄
			
		o.time = time = o.time - o.start;
		
		var checkRun = function(){
			timer = setTimeout(function(){
				//console.log(time);
				o.run();
				if(time<=0){
					clearTimeout(timer);
					timer = null;
					//执行回调函数
					o.callback();
					time = o.time;
					sobj.html(o.end_message);
					if(obj.hasClass(o.style)){
						obj.removeClass(o.style);
					}
					return;
				}
				_run();
				checkRun();
			},o.step*1000);
		};
		
		var _run = function(){
			if(typeof(o.style)=='Object'){
				obj.css(o.style);
			}else{
				obj.addClass(o.style);
			}
			if(typeof(o.dateFn)=='function'){
				message = o.message.replace('{num}',o.dateFn(time--));
			}else{
				message = o.message.replace('{num}',time--);
			}			
			if(o.type=='html'){
				sobj.html(message);
				//sobj.val(message);
			}else if(o.type=='val'){
				sobj.html(message);
				//sobj.val(message);
			}
		};
		_run();
		//执行回调之前函数
		o.befor();
		//执行倒计时
		checkRun();
		sobj.html(o.run_message);
	},
	
	//百度统计代码函数
	baiduTongji : function (){
		var _hmt = _hmt || [];
		(function() {
			var hm = document.createElement("script");
			hm.src = "//hm.baidu.com/hm.js?397b33bed8a7b5b0948915ec45003396";
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		})();
	}
});


})(this,jQuery,BASE);

/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 * 
 * 页面DOMdocument加载完成时执行
 * Date: 2015-09-08
 */
;(function($,w){
	var window = w;
	//分享处理
	$(function(){
		var share = $('.share'),mask = $('#mask');
		var li = $('#mask .list li');
		if(share.length>0 && mask.length>0 ){
			share.click(function(){
				mask.css('display','block');
				li.css('width',(100/li.length - .00000001)+'%');
			});
			mask.click(function(){
				mask.css('display','none');
				$('#masks').css('display','none');
			});
		}
	});
	
	//货源sheng
	window.dialogTips = function(o){
		var active = $('.active-apply-tips-box');
		active.css('display','block').css('opacity',0).animate({opacity:1},function(){
			setTimeout(function(){
				active.animate({opacity:0},function(){
					$(this).css('display','none');
				});
			},3000);
		});
		document.addEventListener("scroll",BASE.preventDefault,false);
		$(this).blur(function(){
			document.removeEventListener("scroll",BASE.preventDefault,false)
		})
	};
	
})(jQuery,this);


//自定义简单模板引擎函数
function tplEngine(tpl, data) {
	var reg = /<%([^%>]+)?%>/g,
		regOut = /(^( )?(if|for|else|switch|case|break|var|alert|{|}))(.*)?/g,
		code = 'var r=[];\n',
		cursor = 0;

	var add = function(line, js) {
		js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = reg.exec(tpl) ) {
		add(tpl.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(tpl.substr(cursor, tpl.length - cursor));
	code += 'return r.join("");';
	console.log(code);
	return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};

//自定义简单模板引擎函数 增强版
//如果没有设置传递data参数则会返回一个将模板编译好的函数
//如果传入data就直接返回生成好的模板
function newTplEngine(tpl, data) {
	if(typeof tpl!='string' || tpl==''){
		throw '模板错误:'+tpl;
		return '';
	}
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


//延迟加载通用函数
function delayScrollViewLoading( target ){
	if(typeof target === "undefined" ){
		throw new Error(0,'必须传递target目标对象！');
	}
	//绑定滚动对象
	var bindDOM = document,
		_arguments = arguments;
		
	_arguments[1].bindFn = function(){
		if( $(target).offset().top - $(this).scrollTop() < window.WINDOW_HRIGHT ){
			if( _arguments.length==2 ){
				//执行延迟回调
				return _arguments[1]();
			}else if( _arguments.length==3 ){
				if( _arguments[2] ){
					return _arguments[1]();
				}
			}{
				throw new Error(0,'必须传递回调对象！');
			}
		}
	};
	$(bindDOM).bind('scroll',_arguments[1].bindFn);
}


//视频自适应解决
function videoAdaptive(target,quyu){
	var target = $(target);
    var VideoWidth = target.width();
    var VideoHeight = VideoWidth*2/3;
	quyu = typeof quyu === 'undefined' ? 'embed' : quyu;
    $(quyu).each(function(i){
        var src = this.src;
        if(src.match("youku.com")){
            var regex = /http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/;
            var match = src.match(regex);
            var iframe = '<iframe height="'+VideoHeight+'" width="'+VideoWidth+'" src="http://player.youku.com/embed/'+RegExp.$1+'" frameborder="0"></iframe>';
            $(this).parent().replaceWith(iframe);
            target.append(iframe);
        }
        if(src.match("video.qq.com")){
            var regex = /http:\/\/static.video.qq.com\/TPout.swf\?vid=(.+)/;
            var match = src.match(regex);
            var iframe = '<iframe height="'+VideoHeight+'" width="'+VideoWidth+'" src="http://v.qq.com/iframe/player.html?vid='+RegExp.$1+'&width='+VideoWidth+'&height='+VideoHeight+'&auto=0" frameborder="0"></iframe>';
            $(this).parent().replaceWith(iframe);
            target.append(iframe);
        }
    });
}


 //加载立即参与的状态
 //页面 /mb/event/index/483.html
 function loadingStatue(url,parme){
	//普通活动申请
	 var parent_box = $('#apply-type-status'), html = null , tyszx = false;
	 //体验师专享
	 if(typeof arguments[2]!='undefined' && arguments[2]=='tyszx'){
		 parent_box = $('#apply-type-status-tyszx');
		 tyszx = true;
	 }
	$.post(url,parme,function(data){
		var _data = {data:data,tyszx:false};
		if(tyszx){
			_data = {data:data,tyszx:true};
		}
		if(data.status == 1 ){
			html = newTplEngine( $('#tpl-apply-ljsq').html() , _data);
		}else if( data.status == 2 ){
			html = newTplEngine( $('#tpl-apply-ljlp').html() ,_data );
		}else if( data.status == 3 ){
			html = newTplEngine( $('#tpl-apply-mdshz').html() ,_data );
		}else if( data.status == 4 ){
			html = newTplEngine( $('#tpl-apply-gbmd').html() ,_data );
		}
		parent_box.html( html );
	},'json');
 }



// 点击用户申请或者参与
 //页面 /mb/event/index/483.html
 function applyVoteShow(fn1,fn2){
	var common_header_box = $('.common-header-box'),
		common_header_box_li = common_header_box.find('li'),
		common_body_box_ul = $('.common-body-box').find('.commentList ul'),
		red_line = common_header_box_li.find('.red-line'),
		W_W = $(window).width(),
		_time = 500;

	common_header_box.find('>ul').on('click','li',function(){
		//首先隐藏所有头部特效
		common_header_box_li.addClass('hidden');
		common_body_box_ul.css('display','none');

		//显示目标特效
		$(this).removeClass('hidden');
		//显示列表内容
		$('#'+ $(this).attr('targrt-dom-id') ).show();

		//点击的是第一个 li
		if( $(this).next().length>0 ){
			red_line.eq(0).css('display','block').animate({'width':W_W/2},_time,function(){
				$(this).css('width','100%');
			});
			red_line.eq(1).animate({'width':0},_time);
			//隐藏所有列表
			common_body_box_ul.eq(1).css('display','none');
			//执行点击回调，绑定文档滚动加载
			fn1(red_line.eq(0));
		}else{
			red_line.eq(0).animate({'width':0},_time);
			red_line.eq(1).css('display','block').animate({'width':W_W/2},_time,function(){
				$(this).css('width','100%');
			});
			common_body_box_ul.eq(0).css('display','none');
			fn2(red_line.eq(1));
		}
	});
 }


//回复评论
function userSubmitComment(articleid,commentid,type,valueid){
	var content = $(valueid).val();
	if(content.length<=0){
		 var alarm_obj = {
			'message':'评论内容不能为空',
			'ok'     :'我知道了',
			'auto_close':false,
			'auto_time_show':true
		};
		diagol = _BASE.dialog.alert(alarm_obj);
		return false;
	}
	var alarm_obj = {
		'message':'提交中...',
		'auto_close':false,
		'auto_time_show':false,
	};
	diagol = _BASE.dialog.toast(alarm_obj);
	
	$.post("/api/comment/PostComment.html",{
		id:articleid,
		type:type,
		commentid:commentid,
		content:content
	},function(result){
		if(result.status!=0){
			//传入id，获取评论单条接口
			$(valueid).val('');
			_BASE.dialog.close(diagol);
			var alarm_obj = {
				'message':'评论成功',
				'auto_close':true,
				'auto_time_show':true,
			};
			diagol = _BASE.dialog.toast(alarm_obj);
			$(valueid).parent().parent().prev().find('.jiguo-replay').trigger('click');
		}else{
			var alarm_obj = {
				'message':'评论失败',
				'auto_close':true,
				'auto_time_show':true
			};
			_BASE.dialog.toast(alarm_obj);
		}
	});
}
//信息加载器
function loadTool(url,info_box){
	this.loadMore = $('.loadMore');
	this.nomore = $('.nomore');
	this.is_loading = true;
	this.limit = '';
	this.size = 4;
	this.p  = 0;
	this.url = url;
	this.user_center_comment_list = typeof info_box=='undefined'? $('#user-center-comment-list') : $(info_box);
		//获取模板缓存函数
	this.tpl_box = typeof info_box=='undefined'? $('#user-center-comment-list-tpl') : $(info_box+'-tpl')
	this.func_tpl = newTplEngine( this.tpl_box.html() );
	var self = this;
	
	this.loadCommentFunc = function(){
		//设置不允许加载状态
		self.is_loading = false;
		//'/api/news/GetNew'
		$.get(this.url,{
			limit : self.limit,
			size : self.size,
			p : self.p
		},function(data){
			if(data.data!=null){
				self.limit = data.limit;
				self.p += 1;
				self.user_center_comment_list.append(self.func_tpl({data:data}));
				//设置允许加载状态
				self.is_loading = true;
				//是否有展开按钮
				self.user_center_comment_list.find('article:not(.each)').each(function(){
					//处理是否添加展开按钮
					if( $(this).height()>60 && $(this).find('span.jiguo-show-open-flage').position().top>$(this).height() ){
						$(this).addClass('each');
						$(this).after('<p class="jiguo-open-btn" data-show-html="隐藏" data-hide-html="展开">展开</p>');
					}
				});
				if(data.data.length<self.size){
					self.is_loading = false;
					self.loadMore.css('display','none');
					self.nomore.css('display','block');
				}
			}else{
				self.is_loading = false;
				self.loadMore.css('display','none');
				self.nomore.css('display','block');
			}
			if(self.is_loading && ( $(document).scrollTop()+$(window).height()>self.loadMore.offset().top ) ){
				//加载评论
				self.loadCommentFunc();
			}
		},'json');
	};
	
	if(self.is_loading){
		//加载评论
		self.loadCommentFunc();
	}
	//绑定滚动加载
	$(window).scroll(function(){
		if(self.is_loading && ( $(document).scrollTop()+$(window).height()>self.loadMore.offset().top ) ){
			//加载评论
			self.loadCommentFunc();
		}
	});
}

//获取消息中心信息汇总
$(function(){
	//如果没有评论框则不加载
	if($('#user-center-comment-list').length<=0){
		return true;
	}
	
	//处理三行以上信息显示
	var showFull = function(obj,_this){
		if(obj.css('display')!='block'){
			obj.css('display','block');
			if(_this.attr('data-show-html')!=undefined)
				_this.html(_this.attr('data-show-html'));
		}else{
			obj.css('display','-webkit-box');
			if(_this.attr('data-show-html')!=undefined)
				_this.html(_this.attr('data-hide-html'));
		}
	};
	//评论文本框的显示
	var showHide = function(obj,_this){
		if(obj.css('display')=='none'){
			$('.jiguo-replay-view').css('display','none');
			$('.jiguo-replay').html('回复');
			obj.css('display','block');
			_this.html('取消');
		}else{
			obj.css('display','none');
			_this.html('回复');
		}
	};		
	//绑定点击事件
	$('.jiguo-table-view').on('click','.jiguo-replay',function(){
		showHide($(this).parent().parent().parent().next(),$(this));
	})
	//点击展开按钮
	.on('click','.jiguo-open-btn',function(){
		showFull($(this).prev(),$(this));
	})
	//加载信息
	new loadTool('/api/news/GetNews','#user-center-comment-list');
	
});

//加载 试用消息
$(function(){
	//如果没有评论框则不加载
	if($('#is-loading-event').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetNews?type=event','#is-loading-event');
});

//加载 系统消息
$(function(){
	//如果没有评论框则不加载
	if($('#is-loading-system').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetNews?type=systems','#is-loading-system');
});

//加载 收到的赞
$(function(){
	//如果没有评论框则不加载
	if($('#is-loading-zan').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetNews?type=zan','#is-loading-zan');
});

//加载 积分消息
$(function(){
	//如果没有评论框则不加载
	if($('#is-loading-coin').length<=0){
		return true;
	}
	//加载信息
	new loadTool('/api/news/GetNews?type=coin','#is-loading-coin');
});


//百度统计代码
$(function(){
	var _hmt = _hmt || [];
	(function() {
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?397b33bed8a7b5b0948915ec45003396";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})();
});



function pushNotification(userssid){
	// 连接服务端
    var socket = io('http://msg.jiguo.com:2120');
    // 连接后登录
    socket.on('connect', function(){
    	socket.emit('login',userssid);
    });
    // 后端推送来消息时
    socket.on('new_msg', function(msg){
		eval('msg = '+msg);
		if(msg!=null){
			var html = 0;
			if( parseInt(msg.num)>0 ){
				if(parseInt(msg.num)>99){
					html = '<font>···</font>';
				}else{
					html = msg.num;
				}
				$('.h-Btn.userCenter a.user-face-has-message').html('<i class="jiguo-badge">'+html+'</i>');
				var badge = $('.h-Btn.userCenter a.user-face-has-message .jiguo-badge');
				badge.css('right',-(badge.width()/2));
				$('.message #msg-badge').css('padding','3px 6px').css('display','block').html(html);
			}else if(parseInt(msg.tips)>0){
				$('.h-Btn.userCenter a.user-face-has-message').html('<i class="jiguo-badge" style="padding: 6px;margin-right:10px;margin-top: 5px;"></i>');
				$('.message #msg-badge').css('padding','6px').css('display','block').html('');
			}else{
				$('.h-Btn.userCenter a.user-face-has-message').html('');
				$('.message #msg-badge').css('display','none');
			}
		}
    });
}


//体验师申请失败是倒计时提示
function againApplyTiYanShi(passtime){
	//时间格式化
	function formatDate(now){
		now = typeof now=='number'?now:parseInt(now);
		var str = '';
		var year=Math.floor(now/(365*24*60*60));
		var moth=Math.floor((now-year*365*24*60*60)/(30*24*60*60));
		var day=Math.floor((now-year*365*60*60*24-moth*30*60*60*24)/(60*60*24)); 
		var hour=Math.floor((now-year*365*60*60*24-moth*30*60*60*24-day*24*60*60)/3600); 
		var minute=Math.floor((now-year*365*60*60*24-moth*30*60*60*24-day*24*60*60-hour*3600)/60); 
		var second=Math.floor(now-year*365*60*60*24-moth*30*60*60*24-day*24*60*60-hour*3600-minute*60); 

		if(year>0) str += year+'年';
		if(moth>0) str += moth+'月';
		if(day>0) str += day+'天';
		if(year<=0){
			if(hour>0) str += hour+'小时';
			if(minute>0) str += minute+'分';
			if(second>0) str += second+'秒';
		}
		return str;     
	}
	$('.submitBtn').on('click','a.apply.over',function(e){
		_BASE.dialog.alert({ 'message':$('.over').html() });
	});
	
	_BASE.countDown({
		'obj':$('body'),
		'event':'load',
		'sobj':$('.over'),
		'time':passtime,
		'message':'{num}候可提交申请',
		'end_message':'再次申请体验师',
		'run_message':'信息加载中···',
		'dateFn':formatDate,
		'callback':function(){
			var overHasUrl = $('.apply.over');
			overHasUrl.attr('href',overHasUrl.attr('url')).removeClass('over');
			$('.submitBtn').off('click');
		}
	});
}


//点击搜索按钮记录当前页面url地址，以便取消搜索返回
$(function(){
	$('.search').click(function(e){
		setCookie('search_before_url',window.location.href);
	});
});
	
function searchFunction () {
	var selValue = $('#jiguo-search-type-list-select-value').val();
	
	$('#jiguo-search-type-list-select').bind('click',function(){
		var ulList = $('#jiguo-search-type-list-select').find('.jiguo-search-type-list');
		var list = $(this).find('.jiguo-search-type-list').css('z-index','100000');
		var slideUp = function(){
			ulList.slideUp(120,function(){
				
				if( selValue!=$('#jiguo-search-type-list-select-value').val() ){
					$('#submit-action').submit();
				}
				
				if( $('#jiguo-search-type-list-select-value').val()=='' && $('#jiguo-search-key-value').val()=='' ){
					$('#search-no-data').hide();
					$('#search-has-data').hide();
					$('.jiguo-search-quick').show();
				}
			});
			$('.jiguo-mask-op-0').remove();
		};
		
		if(list.css('display')=='none'){
			$(this).find('.jiguo-search-type-list').slideDown(120,function(){
				$('body').append('<div class="jiguo-mask jiguo-mask-op-0"></div>');
				$('.jiguo-mask-op-0').bind('click',slideUp);
			});
		}else{
			slideUp();	
		}
	});
	
	$('.jiguo-search-type-list li').bind('click',function(e){
		$(this).parent().find('li').removeClass('on');
		$(this).addClass('on');
		$('#jiguo-search-type-list-select-value').val($(this).find('a').attr('data-type'));
		$('#submit-action').attr('action',$(this).find('a').attr('url'));
		$('#jiguo-search-type-list-select-text').html($(this).find('a').html());
		$('input[name=typename]').val($(this).find('a').html());
		var v = $(this).find('a').html();
		$('#jiguo-search-key-value').attr('placeholder',v=='全部'?'搜索':v);
		//e.preventDefault();
	});
	
	$('.jiguo-search-text').on('keyup focus','.jiguo-search-key-value',function(){
		if($(this).val().toString().replace(/\s/g,'')!=''){
			$(this).next().show();
		}else{
			$(this).next().hide();
		}
	}).on('click','.jiguo-search-clear',function(){
		$(this).hide().prev().val('').focus();
	});
	
	$('.jiguo-search-btn').click(function(){
		var url = getCookie('search_before_url');
		if(!url){
			url = '/mb';
		}
		window.location = url;
	});
	
	//$('.jiguo-search-key-value').focus();
	
	$('.jiguo-search-no-data').css('height',$(window).height()-70);
}



// 用户绑定账号弹窗
var bindAccount = {
	queryDialog:function(url,callback,type){
		if(type=='open')$('.dialog-box').addClass('show');
		if(type=='close')$('.dialog-box').removeClass('show');
		var callback = callback || function(){};
		callback();
		if(url) window.location = url;
	},
	openDialog:function(url,callback){
		this.queryDialog(url,callback,'open');
	},
	closeDialog:function(url,callback){
		this.queryDialog(url,callback,'close');
	}
}

$(function(){
	var box = $('div.dialog-box').css({'z-index':13,'top':0,'left':0});
	if(box.length>0){
		box.insertAfter($("body>div").eq(0)); 
	}
});

//获取微店商品库存剩余数量
function getWeiDianProductNumber(){
	$('.get-weidian-product-number').each(function(index, element) {
		var self = $(this);
		var parmesObj = $(this).find('[itemid][cid]').eq(0).html(0);
		var requestParme = {id:parmesObj.attr('itemid'),cid:parmesObj.attr('cid')};
		var htmlValu = self.find('.inner-btn').html();
		self.find('.inner-btn').html('正在加载中');
		$.get('/api/event/weidian',requestParme,function(data){
			if(typeof(data.num)!='number') data.num = parseInt(data.num);
			parmesObj.html(data.num);
			self.find('.inner-btn').html(htmlValu);
			if(data.num<=0){
				self.find('>a').attr('href','javascript:void(0);');
				self.find('.inner-btn').addClass('over').html('售罄');
			}
		},'json');
	});
}


//删除移动端文章里的图片的高宽属性
$(function(){
	$('.finCnt').find('img').each(function(){
		$(this).removeAttr('width').removeAttr('height').removeAttr('style');
	});
});













