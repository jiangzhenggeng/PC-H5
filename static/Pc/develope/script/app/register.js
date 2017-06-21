/**
 +----------------------------------------------------------
 //注册模块
 +----------------------------------------------------------
 */

define(['jquery','app/common','app/countdown'],function ($,common,countdown){
    var imgCode;
    $(function () {
        //点击验证码切换图片
        imgCode = $('[data-register-img-code]');
        imgCode.attr('src',imgCode.attr('src'));
        imgCode.click(function () {
            $(this).attr('src',imgCode.attr('src').split('?')[0]+'?'+Math.random());
        });
    });

    function _init() {

        layer.ready();
        var code_sending = true;
        //点击获取验证码
        $('.getcode').click(function () {
            var tel = $('[data-tel]').val();
            if(!/^1[34578][0-9]{9}$/.test(tel)){
                layer.tips('请正确填写手机号码',$('[data-tel]'));
                $('[data-tel]').focus();
                return;
            }
            var img_code = $('[data-img-code]').val();
            if(img_code==''){
                layer.tips('请输入图片验证码',$('[data-img-code]'));
                $('[data-img-code]').focus();
                return;
            }

            if(code_sending==false) {
                layer.msg('手机验证码已发送');
                return;
            }
            code_sending=false;

            $.get('/api/validation/tel',{
                tel:tel,
                vcode:img_code,
                action:action
            },function (replayData) {
                if(replayData.resultCode!=0){
                    layer.msg(replayData.errorMsg);
                    if(replayData.resultCode==-2){
                        imgCode.trigger('click');
                    }
                    code_sending = true;
                    return;
                }
                var getcode = $('.getcode');
                countdown.run({
                    dom:'.getcode',
                    tplFn:function (day,hour,minute,second,intDiff) {
                        getcode.html(second+'秒重新发送');
                        if(intDiff<=0){
                            getcode.html('发送验证码');
                            code_sending = true;
                        }
                    }
                });
            },'json').fail(function () {
                console.log(arguments);
                layer.msg('请求失败');
                code_sending = true;
            });
        });

        //点击进行注册
        $('.save-warp .btn').click(function () {
            var tel = K.trim($('[data-tel]').val());
            var img_code = K.trim($('[data-img-code]').val());
            var phone_code = K.trim($('[data-phone-code]').val());

            if(!/^1[34578][0-9]{9}$/.test(tel)){
                layer.tips('请正确填写手机号码',$('[data-tel]'));
                return;
            }

            if(img_code==''){
                layer.tips('请输入图片验证码',$('[data-img-code]'));
                $('[data-img-code]').focus();
                return;
            }

            if(phone_code==''){
                layer.tips('请输入手机验证码',$('[data-phone-code]'));
                $('[data-phone-code]').focus();
                return;
            }

            $.get(postUrl,{
                tel:tel,
                vcode:img_code,
                code:phone_code
            },function (replayData) {
                if(replayData.resultCode!=0){
                    layer.msg(replayData.errorMsg);
                    return;
                }
                window.location = callUrl;
            },'json');
        });
    }

    return {
        init:_init,
        //设置密码
        setRegisterPassword:function () {
            layer.ready();

            //点击进行注册
            $('.save-warp .btn').click(function () {

                var username = K.trim($('[data-username]').val());
                var password = K.trim($('[data-password]').val());
                var repassword = K.trim($('[data-repassword]').val());

                if(username==''){
                    layer.tips('请填写用户名',$('[data-username]'));
                    return;
                }
                if(password==''){
                    layer.tips('请填写密码',$('[data-password]'));
                    return;
                }
                if(password!=repassword){
                    layer.tips('两次输入的密码不相同',$('[data-repassword]') );
                    return;
                }

                $.get('/api/user/name',{
                    username:username,
                    passwd:password
                },function (replayData) {
                    if(replayData.resultCode!=0){
                        layer.msg(replayData.errorMsg);
                        return;
                    }
                    window.location = '/';
                },'json');
            });
        },
        //设置新密码
        changePassword:function () {
            layer.ready();

            $('.save-warp .btn').click(function () {

                var password = K.trim($('[data-password]').val());
                var repassword = K.trim($('[data-repassword]').val());

                if(password==''){
                    layer.tips('请填写密码',$('[data-password]'));
                    return;
                }
                if(password!=repassword){
                    layer.tips('两次输入的密码不相同',$('[data-repassword]') );
                    return;
                }

                $.get('/api/user/mobile',{
                    passwd:password
                },function (replayData) {
                    if(replayData.resultCode!=0){
                        layer.msg(replayData.errorMsg);
                        return;
                    }
                    layer.msg('密码修改成功',function () {
                        common.login();
                    });
                },'json');
            });
        }
    }
});
