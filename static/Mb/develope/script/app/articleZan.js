/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'jquery',
    'global.fun',
    'app/login',
],function ($,global,login){

    return {
        praise:function () {
            var sending;
            $('[data-article-zan]').click(function () {
                if(sending){
                    return false;
                }
                 sending=true;
                var zanNumDom=$(this).find('o');
                var zanNum=zanNumDom.html();
                if(!window.URL['login']){
                    login.login();
                    return;
                }
                var _this = $(this);
                if(_this.find('.icon').hasClass('on')){
                    return;
                }

                $.get('/api/praise/praise',{
                    id_value:blogid,
                    status:'0',
                    type:'2'
                },function (replayData) {
                    if(replayData.resultCode==-100){
                        login.login();
                        return;
                    }
                    if(replayData.resultCode==0){
                        sending=false;
                        _this.find('.icon').addClass('on animate');
                        
                        if(zanNum==''){
                            zanNum=0;
                        }
                        zanNum=parseInt(zanNum);
                        setTimeout(function () {
                            _this.find('.icon').removeClass('animate');
                        },2000);
                        zanNumDom.html(zanNum+1);
                        $('#praise-list-box').removeClass('none');
                        var src=''+replayData.result.avatar+'/230x230';

                        var str = '<li><img src='+src+'></li>';
                        var liP = $('#praise-list');
                        if(liP.find('li').length){
                            liP.find('li').first().before(str);
                        }else {
                            liP.append(str);
                        }
                    }
                },'json');
            });
        },
        like:function () {
            var sending;
            $('[data-article-like]').click(function () {
                if(sending){
                    return false;
                }
                sending=true;
                if(!window.URL['login']){
                    login.login();
                    return;
                }

                var _this = $(this);
                $.get('/api/praise/praise',{
                    id_value:blogid,
                    status:'0',
                    type:'4'
                },function (replayData) {
                    if(replayData.resultCode==-100){
                        login.login();
                        return;
                    }

                    if(replayData.resultCode==0){
                        sending=false;
                        if(replayData.result.zan==1){
                            _this.find('.icon').addClass('on animate');
                            setTimeout(function () {
                                _this.find('.icon').removeClass('animate');
                            },2000);
                        }else{
                            _this.find('.icon').removeClass('on animate');
                        }
                    }
                },'json');
            });
        },
    };

});

