/**
 +----------------------------------------------------------
 //个人中心,信息维护
 +----------------------------------------------------------
 */
define([
    'jquery',
    "app/upload",
    'laydate',
    'layer',
    'app/provinceArea',
],function ($,upload,laydate,layer,provinceArea){

    layer.ready();
    $(function () {

        //无刷新上传头像
        //upload.init('#user-face');

        var hideUploadIframe = $('#hideUploadIframe'),
            hideUploadInputFile = $('#hideUploadInputFile'),
            blogFormCover = $('#blogFormCover'),
            imgObj = blogFormCover.find('#icon-img'),
            src = imgObj.attr('src');

        hideUploadInputFile.change(function () {
            src = imgObj.attr('src');
            imgObj.attr('class','loading icon-img').attr('src',require.toUrl('../style/ext_img/loading-icon.gif'));
            blogFormCover.submit();
        });

        hideUploadIframe.load(function () {
            var
                body = (this.contentDocument || this.contentWindow.document).body,
                result = body.innerText || body.textContent || '{}',
                json = {};
            try {
                json = (new Function("return " + result))();
            }catch (e){
                imgObj.removeClass('loading').attr('src',src);
                layer.alert('上传失败,请重新试试');
                return;
            }

            if( !('url' in json.result) ){
                layer.alert('没有url');
                return;
            }

            var img = new Image(),
                key = '/230x230?time='+(+~new Date());
            img.onload = function () {
                imgObj.attr('class','success').attr('src',json.result.url + key);
            };
            img.src = json.result.url  + key;
        });


        //生日选择
        laydate({
            elem: '#birthday',
            event: 'focus'
        });

        //地域选择
        provinceArea.init({
            province:'#province',
            city:'#city'
        });

        //性别选择
        $('.label-radio-cell').on('click','.label-radio',function () {
            $(this).parent().find('[checked],.checked,.icon-checked')
                .removeClass('checked').removeClass('icon-checked')
                .find('input[type=radio]').prop('checked',false);
            $(this).addClass('checked').find('input[type=radio]').prop('checked',true);
            $(this).find('.icon-radio').addClass('icon-checked');
        });

        //提交表单
        $('#submit-data').click(function () {
            layer.msg('数据提交中',{time:99999999});
            $.post('/api/user/EditUserInfo',$('#formData').serialize(),function (replayData) {
                layer.closeAll();
                if(replayData.resultCode!=0){
                    layer.msg(replayData.errorMsg);
                    return;
                }else{
                    layer.msg('修改成功',{},function () {
                        window.location.reload();
                    });
                }
            },'json');
        });
    });
});

