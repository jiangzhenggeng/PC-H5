/**
 +----------------------------------------------------------
 //无刷新上传图片
 +----------------------------------------------------------
 */

define([
    'require','jquery','layer','uploadify',
    'app/tplEngine'
],function (require,$,layer,_,tplEngine){

    function initUploadBtn(selecter,optiones){
        var selecter = $(selecter);
        if(!selecter.length) return;

        var optiones = $.extend({
            uploadUrl:'/api/other/AvatarUpdate?key='+Math.random(),
            width:selecter.width(),
            height:selecter.height(),
        },optiones);

        if(selecter.css('position')!='absolute' || selecter.css('position')!='relative'){
            selecter.css('position','relative');
        }
        var uploadUrl = optiones.uploadUrl,
            imageFieldName = 'file',
            w =  optiones.width,
            h =  optiones.height,
            btnIframe = document.createElement('iframe'),
            btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';

        layer.ready();

        $(btnIframe).on('load', function(){

            var timestrap = (+new Date()).toString(36),
                wrapper,
                btnIframeDoc,
                btnIframeBody;

            btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
            btnIframeBody = btnIframeDoc.body;
            wrapper = btnIframeDoc.createElement('div');

            wrapper.innerHTML = '<form id="edui_form_' + timestrap + '" target="edui_iframe_' + timestrap + '" method="POST" enctype="multipart/form-data" action="' + uploadUrl + '" ' +
                'style="' + btnStyle + '">' +
                '<input id="edui_input_' + timestrap + '" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" name="' + imageFieldName + '" ' +
                'style="' + btnStyle + '">' +
                '</form>' +
                '<iframe id="edui_iframe_' + timestrap + '" name="edui_iframe_' + timestrap + '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>';

            wrapper.className = 'edui-';
            wrapper.id = '_iframeupload';
            btnIframeBody.style.cssText = btnStyle;
            btnIframeBody.style.width = w + 'px';
            btnIframeBody.style.height = h + 'px';
            btnIframeBody.appendChild(wrapper);

            if (btnIframeBody.parentNode) {
                btnIframeBody.parentNode.style.width = w + 'px';
                btnIframeBody.parentNode.style.height = w + 'px';
            }

            var form = btnIframeDoc.getElementById('edui_form_' + timestrap);
            var input = btnIframeDoc.getElementById('edui_input_' + timestrap);
            var iframe = btnIframeDoc.getElementById('edui_iframe_' + timestrap);

            $(input).on('change', function(){
                if(!input.value) return;

                input.focus();

                function callback(){
                    var link, json, loader,
                        body = (iframe.contentDocument || iframe.contentWindow.document).body,
                        result = body.innerText || body.textContent || '';
                    try {
                        json = (new Function("return " + result))();
                    }catch (e){
                        layer.alert('上传失败,请重新试试');
                        return;
                    }

                    if( !('url' in json.result) ){
                        layer.alert('没有url');
                        return;
                    }
                    selecter.find('input[type=hidden][data-url]').val(json.result.url);
                    selecter.find('input[type=hidden][data-fileid]').val(json.result.fileid);

                    var img = new Image();
                    var url = json.result.url+'?'+Math.random();
                    img.onload = function () {
                        selecter.find('img[data-upload-img]').show().attr('class','success').attr('src',url);
                    };
                    img.src = url;

                    selecter.find('#'+boxId).remove();

                    form.reset();
                    $(iframe).off('load', callback);
                }
                //上传显示loading图标
                var imgObj = selecter.find('img[data-upload-img]').first();
                var src = imgObj.attr('src'),
                    loadSrc = require.toUrl('../../style/ext_img/loading-icon.gif'),
                    style = 'position: absolute;width: 100%;height:100%;left:0;top:0;background: #fff;',
                    boxId = 'uploadfixbox123456';

                style = src==''?style+'background: #fff;':style;

                imgObj.after('<div style="'+style+'" id="'+boxId+'"><img class="loading icon-img" src="'+loadSrc+'" /></div>');
                $(iframe).on('load', callback);
                form.action = uploadUrl;
                form.submit();
            });
        });
        btnIframe.style.cssText = btnStyle;
        selecter.append(btnIframe);
    }

    return {
        //单图上传 ifram实现
        init : initUploadBtn,
        //多图上传
        uploadify: function (_selector,options) {

            $(_selector).each(function () {

                var _input = document.createElement('input');
                _input.setAttribute('type','file');

                var selector = $(this);
                if( 'multiple' in _input ){
                    var cacheFn = tplEngine.init( $('#uploadfile-item-safari-tpl').html() );
                }else{
                    var cacheFn = tplEngine.init( $('#'+selector.attr('data-item-tpl-id')).html() );
                }
                var btnDom = $('#'+selector.attr('data-btn-id'));

                var swfUrl = function(){
                    return 'http://'+window.location.host+'/protected/extensions/uploadify/uploadify.swf';

                    var js = document.scripts,
                        script;
                    for(var i in js){
                        if(js[i].src && js[i].src.indexOf('/script/require.js')!=-1){
                            script = js[i];
                            break;
                        }
                    }
                    var jsPath = script.src;
                    return jsPath.substring(0, jsPath.lastIndexOf("/") + 1)+'lib/uploadify/uploadify.swf';
                }();
                var senData = {
                    timestamp : '1467180227',
                    token     : '50638c1f0d92428c0c0c5b0e55abdfbb',
                    type     : 'zdm'
                };

                if( 'multiple' in _input ){

                    $('head').append('<style>.webuploader-container>div:not(.webuploader-pick){width:100%!important;height: 100%!important;} input.webuploader-element-invisible{display: block;position: absolute;left: 0;top: 0;width: 100%;height: 100%;-webkit-appearance: none;appearance: none;opacity: 0.01;}</style>');

                    require(['http://'+window.location.host+'/protected/extensions/ueditor/third-party/webuploader/webuploader.min.js'],function ( WebUploader ) {
                        var data_string = 'type=zdm&timestamp=1467180227&token=50638c1f0d92428c0c0c5b0e55abdfbb';
                        var uploader = WebUploader.create($.extend({
                            auto:true,
                            pick: '#'+selector.attr('data-btn-id'),
                            formData:senData,
                            threads:1,
                            fileVal:'file',
                            duplicate:null,
                            accept: {
                                title: 'Images',
                                extensions: 'gif,jpg,jpeg,bmp,png',
                                mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif'
                            },
                            swf: 'http://'+window.location.host+'/protected/extensions/ueditor/third-party/webuploader/Uploader.swf',
                            server: options.uploadUrl || window.URL['uploadifyUploadUrl'] + '?' + data_string,
                        },options));
                        uploader.on('fileQueued', function (file) {
                            selector.append( cacheFn({
                                fileId:file.id,
                            }) );
                        });

                        uploader.on('uploadProgress', function (file, percentage) {
                            $( '#'+file.id ).find('.uploadify-progress-bar').css( 'width', percentage * 100 + '%' );
                        });

                        uploader.on('uploadSuccess',function(file,response){
                            if( options.onUploadSuccess ){
                                options.onUploadSuccess.apply(this,[file,response,selector.attr('id') ] );
                            }
                            uploader.removeFile( file );
                        });
                        if(options.onDelPic){
                            options.onDelPic.apply(uploader,[_selector,uploader]);
                        }
                    });
                }else{
                    selector.uploadify($.extend({
                        formData: senData,
                        fileObjName:'file',
                        itemTemplate: cacheFn({}),
                        width:btnDom.width() || 150,
                        height:btnDom.height() || 150,
                        buttonText:'+',
                        queueID: selector.attr('id'),
                        id	 : selector.attr('data-btn-id'),
                        swf      : swfUrl,
                        uploader : options.uploadUrl || window.URL['uploadifyUploadUrl'],
                        onUploadSuccess: function(file,data,response){},
                        removeCompleted:false,
                        preserve_relative_urls: true,
                    },options));
                }
            });
        }
    };
});


