/**
 +----------------------------------------------------------
 //全局模块
 +----------------------------------------------------------
 */

define([
    'require',
    'jquery',
    //全局函数库
    'global.fun',
    //全局头部搜索
    "app/search",
    'layer',
    'app/tplEngine',
    'app/scrollStatus',
    'app/viewport'
],function (require,$,global,search,layer,tplEngine,scrollStatus,viewport){

    //快速回到顶部
    $(function () {
        if(window.speedTop) return;
        window.speedTop = true;

        //ipad适配
        viewport.init();

        var html = '<div class="quick-speed-top">' +
            '<a href="/feedback/isfeedback" target="_blank">' +
            '<span class="right-feedback-into" data-badge-warp-feedback></span></a>' +
            '<a href="javascript:;" data-quick-speed-top>' +
            '<i class="icon icon-quick-speed-top"></i></a></div>';

        $('body').append(html);
        var speedBox = $('.quick-speed-top'),
            footerBox = $('.footer'),
            WIN_H = $(window).height(),
            WIN_W = $(window).width(),
            footerH = footerBox.outerHeight();
        var WIN_scrollTop = 0 , footerOffTop = 0,fix =40 ,bottom = fix;
        var WIN_BAN = ( WIN_W - 1080 ) / 2, letPos = WIN_W - WIN_BAN + 50;

        if(WIN_W<=1080)letPos = 1080 + 50;

        var resizeFn = function (display) {
            WIN_H = $(window).height();
            WIN_W = $(window).width();
            WIN_scrollTop = 0 , footerOffTop = 0,fix =40 ,bottom = fix;
            WIN_BAN = ( WIN_W - 1080 ) / 2, letPos = WIN_W - WIN_BAN + 50;
            if(WIN_W<=1080)letPos = 1080 + 50;
            var display = {
                bottom:bottom,
                top:'auto',
                left: letPos
            }
            if(!display){
                display.display = 'none';
            }
            speedBox.css(display);
        }
        resizeFn();

        $(window).resize(function () {
            resizeFn(true);
        });

        speedBox.find('[data-quick-speed-top]').click(function () {
            $('body,html').animate({
                scrollTop:0
            },600);
        });
        $(window).scroll(function () {
            WIN_scrollTop = $(window).scrollTop();
            footerOffTop = footerBox.offset().top;
            if(WIN_scrollTop>500){
                speedBox.show(160);
            }else{
                speedBox.hide(160);
                return;
            }
            if(WIN_H + WIN_scrollTop > footerOffTop){
                bottom = WIN_H + WIN_scrollTop - footerOffTop;
                speedBox.css({
                    bottom: bottom>fix?bottom:fix
                })
            }else{
                speedBox.css({
                    bottom: fix
                })
            }
        });


        //点击跳转,需要检查是否登录的动作
        $('body').on('click','[href][data-query-cheack-login]',function (e) {
            if(!window.URL['login']){
                e.preventDefault();
                _login();
            }
        });
        //全局头部未登录绑定弹窗登录事件
        $('body').on('click','#open-login-window',_login);

    });


    function _login() {
        var id = K.randomId(),
            html = $('#login-input-tpl').html();
        layer.ready(function () {
            var lId = layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                area:['715px','325px'],
                content: '<div id="'+id+'">'+html+'</div>',
                success:function (layero, index) {

                    setTimeout(function () {
                        $(layero).find('.apply-input-close').attr('onClick','layer.close(\''+lId+'\')');
                    });

                    var layero = $('#'+id);
                    layero.parent().parent().css('background-color','transparent');
                    layero.find('input[data-login-username]').focus();

                    function __submit_fun__(e) {
                        if(e.type=='keypress'){
                            if(e.keyCode!=13) return;
                        }
                        var username = layero.find('input[data-login-username]').val().trim(),
                            password = layero.find('input[data-login-password]').val(),
                            autologin = layero.find('input[data-login-auto]').val();
                        if(username.length<=0 || username.length>32){
                            layer.tips('请正确填写手机号',layero.find('input[data-login-username]'));
                            return;
                        }
                        if(password.length<=0 || password.length>32){
                            layer.tips('请正确填写密码',layero.find('input[data-login-password]'));
                            return;
                        }
                        $.get('/api/user/login',{
                            tel:username,
                            passwd:password,
                            autologin:autologin
                        },function (repaltData) {
                            if(repaltData.resultCode==0){
                                window.__is_login_online__ = true;
                                window.location.reload();
                                clearInterval(window.ajax_status);
                                window.layer_close = false;
                                return;
                            }else if(repaltData.resultCode==-1){
                                layer.msg(repaltData.errorMsg);
                                layero.find('input[data-login-username]').focus();
                            }else if(repaltData.resultCode==-2){
                                layer.msg(repaltData.errorMsg);
                                layero.find('input[data-login-password]').focus();
                            }else{
                                layer.msg('系统错误');
                            }
                        },'json');
                    }
                    layero.find('#window-login-submit').bind('click',__submit_fun__);
                    layero.find('input').bind('keypress',__submit_fun__);
                    //监听二维码扫描结果
                    function userIsLogin_ajaxhandle() {

                        if(window.layer_close){
                            clearInterval(window.ajax_status);
                            window.layer_close = false;
                        }
                        if( window.__is_login_online__ ){
                            return;
                        }

                        $.get("/ajax/code", function(data){
                            data=data.trim().replace(/\s+/g,'');
                            if(data==1){
                                clearInterval(window.ajax_status);
                                window.layer_close = false;
                                location.reload();
                            }
                        });
                    }
                    window.ajax_status = setInterval(userIsLogin_ajaxhandle,1000);
                }
                ,end:function () {
                    window.layer_close = true;
                }
            });
        });
    }

    $(function () {
        //通用登录属性绑定
        $('body').on('click','[data-has-login]',function (e) {
            if( !window.URL['login'] ){
                e.preventDefault();
                _login();
                return false;
            }
        });
    });

    return {
        login:_login,
        //点击收藏五角星
        collect: function (selecter,usercenter) {
            var self = this;
            $( selecter || '#homeAjaxLoad').on('click','.five-pointed-star',function (e) {

                e.preventDefault();
                var _this = $(this);
                if(!window.URL['login']){
                    _login();
                    return;
                }
                $.get('/api/praise/praise', {
                    type:$(this).attr('data-type'),
                    id_value:$(this).attr('data-id_value'),
                    status:$(this).attr('data-status')
                } ,function(repalyData){
                    if(repalyData.resultCode==-100){
                        _login();
                    }else if(repalyData.result.zan==1) {
                        _this.addClass('like');
                    }else if(repalyData.result.zan==-1) {
                        _this.removeClass('like');
                        if(usercenter){
                            _this.parent().parent().parent().fadeOut(500);
                        }
                    } else{
                        layer.ready(function () {
                            layer.msg('网络错误');
                        });
                    }
                },'json');
            });
        }
    };

});

