/**
 +----------------------------------------------------------
 //无刷新上传图片
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){

    function initUploadBtn(selecter){
        var selecter = $(selecter);
        if(!selecter.length) return;
        if(selecter.css('position')!='absolute' || selecter.css('position')!='relative'){
            selecter.css('position','relative');
        }
        var uploadUrl = '/api/other/AvatarUpdate?key='+Math.random(),
            imageFieldName = 'file',
            w =  selecter.width(),
            h =  selecter.height(),
            btnIframe = document.createElement('iframe'),
            btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;z-index:100;';

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
                '<input id="edui_input_' + timestrap + '" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" multiple="true" name="' + imageFieldName + '" ' +
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
                        selecter.find('img').removeClass('loading').attr('src',src);
                        alert('上传失败,请重新试试');
                        return;
                    }
                    var input = selecter.find('input[type=hidden]');

                    if( !('url' in json.result) ){
                        throw '没有url';
                        return;
                    }
                    if(input.length){
                        selecter.find('input[type=hidden]').val(json.result.url);
                    }

                    selecter.find('img').attr('class','success').attr('src',json.result.url);
                    form.reset();
                    $(iframe).off('load', callback);
                }
                //上传显示loading图标
                var imgObj = selecter.find('img'),
                    src = imgObj.attr('src');
                imgObj.addClass('loading')
                    .attr('src',require.toUrl('../../style/ext_img/loading-icon.gif'));
                $(iframe).on('load', callback);
                form.action = uploadUrl;
                form.submit();
            });
        });
        btnIframe.style.cssText = btnStyle;
        selecter.append(btnIframe);
    }

    return {
        init : initUploadBtn
    };
});

