function viewMobilePage(){
	var randomIDView = randomID() , randomIDViewDomObj =null;
	
	function c(){
		var 
		htmlAll = '\
		<style>.viewFt{font-size: 12px !important;line-height: 12px!important;top: 8px !important;position: relative;}\
		.view-yuelan ::-webkit-scrollbar{width:0px;height:0px;margin-right:0px;}\
		</style>\
		<div class="Z-dialog view-yuelan" id="'+randomIDView+'" style="z-index:1;display:none;">\
			<div class="Z-smark"></div>\
			<div class="Z-vitrual-mobile iphone5">\
				<div class="phone-type">\
					<ul>\
						<li onClick="$(\'#'+randomIDView+'\').remove()"><span>&times;</span></li>\
						<li data-class="H5" class="on"><span class="viewFt">H5<br>预览</span></li>\
						<li data-class="App"><span class="viewFt">APP<br>预览</span></li>\
					</ul>\
				</div>\
				<div class="Z-vitrual-mobile-warp"></div>\
			</div>\
		</div>';
		if(!randomIDViewDomObj){
			$('body').append(htmlAll);
			randomIDViewDomObj = $('#'+randomIDView);
		}

		var userFace = $('.Z-edit-author-face').find('img').attr('src');
		
		randomIDViewDomObj.show();
		randomIDViewDomObj.find('.Z-vitrual-mobile-warp').html('');
		var 
		w = randomIDViewDomObj.find('.Z-vitrual-mobile-warp').width(),
		h = randomIDViewDomObj.find('.Z-vitrual-mobile-warp').height(),
		btnIframe = document.createElement('iframe'),
		btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;';
		btnIframe.src = 'about:blank';
		var htmlHeader;

		$(btnIframe).on('load', function(){
		
			var timestrap = (+new Date()).toString(36),
				wrapper,
				btnIframeDoc,
				btnIframeBody;
		
			btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
			btnIframeBody = btnIframeDoc.body;
			wrapper = btnIframeDoc.createElement('div');
			var headerImage = '';
			if(typeof $('#file-temp').find('img').attr('src')!='undefined'){
				headerImage = $('#file-temp').find('img').attr('src').toString().replace('/640','/640x400');
			}else{
				if($('#setting-product-image-cover').val().toString().substr(0,4)!='http')
					headerImage = 'http://s1.jiguo.com/'+$('#setting-product-image-cover').val()+'/640x400';
				else
					headerImage = $('#setting-product-image-cover').val();
			}
			
			var headerTitle = '';
			if(typeof $('#A-name').val()!='undefined'){
				headerTitle = $('#A-name').val();
			}else{
				headerTitle = $('#P-name').val();
			}
			
			//创建头部图片部分
			htmlHeader = '<div class="shar-header">\
				<div class="shar-cover">\
					<img src="'+headerImage+'">\
				</div>\
			</div>\
			<div class="main-box">\
				<div class="shar-title">\
					<h1>'+headerTitle+'</h1>\
				</div>\
				<div class="shar-auther">\
					<div class="shar-face-box">\
						<img src="'+userFace+'">\
					</div>\
					<div class="shar-face-desc">\
						<div class="share-name">'+$('.Z-edit-author-name').html()+'</div>\
						<div class="share-user-desc">Tina,z专注于运动户外、箱包穿戴、母婴等领域的购物达人，只挑对的不买贵的。</div>\
						<div class="share-time">刚刚</div>\
					</div>\
				</div>\
				<div class="share-border-bootom"></div>\
			</div>';
			
			var cdnPath = document.getElementsByTagName('html')[0].getAttribute('data-cdn-path');
			var css = '<link rel="stylesheet" type="text/css" href="'+cdnPath+'share/share.v1.css">';
			var meta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">';
			var script = '<script src="'+cdnPath+'js/iframe.auto.js"></script>';
			
			wrapper.innerHTML = meta+htmlHeader+'<div class="main-box">'+UE.getEditor('Z-desciption').getAllHtml().toString().replace(/(width\s*\:\s*\d{1,10}\s*(px|%))|(height\s*\:\s*\d{1,10}\s*(px|%))/ig,'width:100%')+'</div>'+script;
			btnIframeBody.appendChild(wrapper);
		});
		
		btnIframe.style.cssText = btnStyle;
		btnIframe.id = 'iframePreviewH5';
		btnIframe.className = 'iframePreviewAll';

		randomIDViewDomObj.find('.Z-vitrual-mobile-warp')
			.append('<iframe class="iframePreviewAll" name="iframePreviewApp" id="iframePreviewApp" src="/admin/article/Preview.html" style="display:none; width: 320px; height: 568px; overflow: hidden; border: 0px; margin: 0px; padding: 0px;"></iframe>')
			.focus().get(0).appendChild(btnIframe);
		return randomIDViewDomObj;
	}
	var randomIDViewDomObj = c();


	randomIDViewDomObj.find('.Z-vitrual-mobile .phone-type li[data-class]').click(function(){
		$(this).parent().find('li.on').removeClass('on');
		$(this).addClass('on');
		$('.iframePreviewAll').hide();
		$('#iframePreview'+$(this).attr('data-class')).show();
	});
}