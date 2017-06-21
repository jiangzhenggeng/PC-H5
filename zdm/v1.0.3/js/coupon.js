

function editAdd() {
    layerTimer('#start_use_time');
    setTimeSelect('#start_time','#end_time');

    //上传封面图图
    initUploadifyFn('#Z-coupon-image-box','Z-coupon-image-box','Z-coupon-file-btn',null,{
        'onUploadSuccess':function (obj,data,respone) {
            data = $.parseJSON(data);
            var html = '<li>' +
                '<div class="Z-delete" onclick="$(this).parent().remove()"></div>' +
                '<img src="'+data.url+'">' +
                '<input type="hidden" name="coupon_page[cover]" value="'+data.fileid+'">' +
                '</li>';
            $('#'+this.settings.queueID).html(html);
        },
        multi:false,
        uploadUrl:window.URL['uploadifyUploadUrlZdm']
    });
    $(function () {

        $('[name=\'coupon_page[type]\']').click(function () {
            if( $(this).val()==1 ){
                $('#num_wrap').show();
            }else{
                $('#num_wrap').hide();
            }
        });

        var formDataDom = $('#formData'),
            submiting = false;
        $('#submitFormData').click(function () {
            var formData = formDataDom.serialize();
            if(!_v(formDataDom) || submiting ){
                return;
            }
            submiting = true;
            var timer = setTimeout(function () {
                submiting = false;
            },10000);
            $.get(formDataDom.attr('action'),formData,function (replayData) {
                if(timer)clearTimeout(timer);
                submiting = false;
                if(replayData.status==0){
                    layer.msg('保存成功',function () {
                        window.location = window.backUrl;
                    });
                }else{
                    layer.msg(replayData.message || '保存失败');
                }
            },'json');
        });
        function _v(formDataDom) {
            if(formDataDom.find('#name').val()==''){
                formDataDom.find('#name').focus();
                layer.msg('请填写名称');
                return;
            }

            if(formDataDom.find('[name="coupon_page[type]"]:checked').val()==1){
                if( formDataDom.find('[name="coupon_page[num]"]').val()<=0){
                    formDataDom.find('#num').focus();
                    layer.msg('请填写数量限制');
                    return;
                }
            }

            if(formDataDom.find('#depict').val()=='' && formDataDom.find('#desc').val()==''){
                formDataDom.find('#depict').focus();
                layer.msg('折扣描述和规则至少填写一项');
                return;
            }

            if(formDataDom.find('#link').val()==''){
                formDataDom.find('#link').focus();
                layer.msg('请填写链接');
                return;
            }

            if(formDataDom.find('#start_time').val()==''){
                formDataDom.find('#start_time').focus();
                layer.msg('请填生效时间');
                return;
            }

            if(formDataDom.find('#end_time').val()==''){
                formDataDom.find('#end_time').focus();
                layer.msg('请填失效时间');
                return;
            }
            if(formDataDom.find('#start_use_time').val()==''){
                formDataDom.find('#start_use_time').focus();
                layer.msg('请填发放时间');
                return;
            }
            if(formDataDom.find('#mall').val()==''){
                formDataDom.find('#mall').focus();
                layer.msg('请填写电商名称');
                return;
            }
            // if(formDataDom.find('#Z-coupon-image-box li').length<=0){
            //     layer.msg('请上传电商LOGO');
            //     return;
            // }
            return true;
        }
    });
}

function windowQueryTip(url,message) {
    windowQueryTip.isRun = false;

    var id = layer.confirm( message || '确定删除该条信息吗？', {
        btn: ['确定','关闭'] //按钮
    }, function(){
        layer.close(id);

        var win_id = new_alert('处理中',200000),
            time = 1000;
        if(windowQueryTip.isRun){
            new_alert('正在处理中...',2000);
            return;
        }
        windowQueryTip.isRun = true;

        var timer = setTimeout(function () {
            windowQueryTip.isRun = false;
        },20000);

        $.get(url,function (replayData) {
            windowQueryTip.isRun = false;
            if(timer) clearTimeout(timer);

            new_alert.close(win_id);
            if(replayData.status==0){
                new_alert(replayData.message,time);
                if(window.location){
                    window.location.reload();
                }
            }else if(typeof replayData.message!='undefined'){
                new_alert(replayData.message || '系统错误',time);
            }else {
                new_alert('系统错误',time);
            }
        },'json');
    });
}
/**
 * 编辑评论
 */
function addCoupon(url) {
    var id = parent.layer.open({
        type: 2,
        title: '添加代金券',
        shadeClose: true,
        shade: 0.8,
        area: ['500px', '500px'],
        content: url
    });
    parent.layer.editWindowId = id;
}

function addCouponVeli(cid) {
    var formDataDom = $('#formData'),
        submiting = false;

    var textArea = formDataDom.find('#jid');
    textArea.keyup(function () {
        if( $(this).val().indexOf('，')>-1){
            $(this).val( $(this).val().replace('，',',') );
        }
    });

    $('#submitFormData').click(function () {
        // if( cid && textArea.val()!='' ){
        //     if(textArea.val().indexOf(',')>-1){
        //         layer.msg('只能添加一个券号');
        //         return;
        //     }
        // }
        if(formDataDom.find('#jid').val()==''){
            layer.msg('至少填写一个券号');
            return;
        }
        if(submiting){
            return;
        }
        submiting = true;

        $.get('/admin/coupon/CheckCoupon',{
            'jid':formDataDom.find('#jid').val()
        },function (replayData) {
            if(replayData.status==1){
                _postData();
            }else{
                var id = parent.layer.alert(replayData.message || '重复券号',{
                    btn:['去重券号','继续','取消'],
                    btn1:function () {
                        $.get('/admin/coupon/Distinct',{
                            'jid':formDataDom.find('#jid').val()
                        },function (replayData) {
                            if(replayData.status==0){
                                formDataDom.find('#jid').val(replayData.data);
                                parent.layer.close(id);
                            }else{
                                parent.layer.msg(replayData.message || '系统错误');
                            }
                        },'json');
                    },
                    btn2:function () {
                        _postData();
                        parent.layer.close(id);
                    }
                });
                submiting = false;
            }
        },'json');

        function _postData() {
            $.get(formDataDom.attr('action'),formDataDom.serialize(),function (replayData) {
                submiting = false;
                if(replayData.status==0){
                    if(parent.layer.editWindowId){
                        parent.layer.msg('操作成功',function () {
                            parent.window.location.reload();
                            parent.layer.close(parent.layer.editWindowId);
                        });
                    }
                }else{
                    parent.layer.msg(replayData.message || '系统错误');
                }
            },'json');
        }
    });
}






