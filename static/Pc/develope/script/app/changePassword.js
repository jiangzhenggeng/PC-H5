/**
 +----------------------------------------------------------
 //修改密码
 +----------------------------------------------------------
 */

define(['jquery','layer'],function ($,layer){
    layer.ready();

    $(function () {
        $('[data-ch-btn]').click(function () {
            var old = $('[data-ch-old]').val();
            var new1 = $('[data-ch-1]').val();
            var new2 = $('[data-ch-2').val();
            if(old.length<6 || old.length>20 ){
                layer.tips('请输入旧密码',$('[data-ch-old]').parent());
                return;
            }

            if(new1.length<6 || new1.length>20 ){
                layer.tips('请输入新密码',$('[data-ch-1]').parent());
                return;
            }

            if(new1!=new2 ){
                layer.tips('两次新密码不一样',$('[data-ch-2]').parent());
                return;
            }

            $.get('/api/user/UpdatePassword',{
                oldpassword:old,
                newpassword:new1
            },function (replayData) {
                if(replayData.resultCode==0){
                    layer.msg('修改成功',{},function () {
                        window.location.reload();
                    });
                }else{
                    layer.msg(replayData.errorMsg || '系统错误');
                }
            },'json');
        });
    });
});
