// function getWebViewHeight(){
// 	return getHeight (document.getElementsByTagName('body').item(0));
// }
// function getWidth (o){
// 	return o.style.width || o.clientWidth || o.offsetWidth || o.scrollWidth || 0;
// }
//
// function getHeight (o){
// 	return o.style.height || o.clientHeight || o.offsetHeight || o.scrollHeight || 0;
// }
//
// function insertAfter(newElement,targetElement)  {
// 	var parent = targetElement.parentNode;
// 	parent.insertBefore(newElement,targetElement.nextSibling);
// }
//
// /******************************************
// ��Ѷ�ſ���Ƶ����Ӧ�߿��
// ******************************************/
// function vidoeAutoJustWidth(selecterBoxId){
// 	var selecterBox = selecterBoxId,
// 		VideoWidth = getWidth(document.documentElement || document.body ) - 30;
// 		VideoHeight = VideoWidth*2/3,
// 		vidoeBox = selecterBox.getElementsByTagName('embed'),
// 		vidoeIframeBox = selecterBox.getElementsByTagName('iframe'),
// 		src = null;
//
// 	function getKeyVal(src,key){
// 		var matchVidArray = src.toString().split('?')[1].toString().split('&') , vid=null;
// 		for(var i2=0;i2<matchVidArray.length;i2++){
// 			if(matchVidArray[i2].split('=')[0].toLowerCase()==key){
// 				vid = matchVidArray[i2].split('=')[1];
// 				return vid;
// 			}
// 		}
// 		return '';
// 	}
//
// 	for(var i=0 , l= vidoeIframeBox.length; i <l ; i++ ){
// 		src = vidoeIframeBox[i].src;
// 		if(src.match("v.qq.com")){
// 			vidoeIframeBox[i].setAttribute('height',VideoHeight);
// 			vidoeIframeBox[i].setAttribute('width',VideoWidth);
// 			vidoeIframeBox[i].setAttribute('width',VideoWidth);
// 			vid = getKeyVal(src,'vid');
//
// 			vidoeIframeBox[i].setAttribute('src','http://v.qq.com/iframe/player.html?vid='+vid+'&width='+VideoWidth+'&height='+VideoHeight+'&auto=0');
// 			vidoeIframeBox[i].setAttribute('frameborder',0);
// 		}
// 	}
//
// 	for(var i=0 , l= vidoeBox.length; i <l ; i++ ){
// 		src = vidoeBox[i].src;
//
// 		if(src.match("youku.com")){
// 			var regex = /http:\/\/player.youku.com\/player.php\/sid\/(.+)\/v.swf/;
// 			var match = src.match(regex);
// 			var iframe = document.createElement('iframe');
// 			iframe.setAttribute('height',VideoHeight);
// 			iframe.setAttribute('width',VideoWidth);
// 			iframe.setAttribute('src','http://player.youku.com/embed/'+RegExp.$1);
// 			iframe.setAttribute('frameborder',0);
// 			insertAfter(iframe,vidoeBox[i]);
// 			vidoeBox[i].remove();
// 		}else if(src.match("video.qq.com")){
// 			vid = getKeyVal(src,'vid');
// 			var iframe = document.createElement('iframe');
// 			iframe.setAttribute('height',VideoHeight);
// 			iframe.setAttribute('width',VideoWidth);
// 			iframe.setAttribute('src','http://v.qq.com/iframe/player.html?vid='+vid+'&width='+VideoWidth+'&height='+VideoHeight+'&auto=0');
// 			iframe.setAttribute('frameborder',0);
// 			insertAfter(iframe,vidoeBox[i]);
// 			vidoeBox[i].remove();
// 		}
// 	}
// }
//
// /******************************************
// ͼƬԤ��������
// ******************************************/
// function loadingImg(){
// 	var img = document.getElementsByTagName('img');
// 	var src = '' , H = getHeight(document.documentElement || document.body );
// 	var images = [];
// 	//��ֹͼƬ����
// 	for(var i = 0 ; i < img.length ; i++ ){
// 		src = img[i].getAttribute('src');
// 		img[i].setAttribute('src',document.getElementsByTagName('html')[0].getAttribute('data-cdn-path')+'app/images/index_banner.png');
// 		img[i].setAttribute('_src',src);
// 		images[i] = new Image();
// 		images[i].src = src;
// 		images[i].setAttribute('index',i);
// 		images[i].onload = function(){
// 			img[this.getAttribute('index')].setAttribute('src',this.getAttribute('src'));
// 		};
// 	}
// }
//
// /******************************************
// iframe����Ӧ���ݸ߶�
// ******************************************/
// function setIframeHeight(iframe) {
// 	if (iframe) {
// 		var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
// 		if (iframeWin.document.body) {
// 			iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
// 		}
// 	}
// };
//
// window.onload = function () {
// 	var iframe = document.getElementsByTagName('iframe');
// 	for(var i = 0; i<iframe.length ; i++ )
// 		if(typeof iframe[i].getAttribute('data-productid')!='undefined')
// 			setIframeHeight(iframe[i]);
// };
//
// document.addEventListener('DOMContentLoaded',function(){
// 	//��Ƶ����Ӧ
// 	vidoeAutoJustWidth(document.getElementsByTagName('body').item(0));
// 	//ͼƬ���صȴ�ͼ��
// 	loadingImg();
// },false);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
