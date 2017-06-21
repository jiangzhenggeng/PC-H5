/**
 +----------------------------------------------------------
 //体验师中心
 +----------------------------------------------------------
 */

define([
    "http://cdn.jiguo.com/static/Pc/compression_2.9/script/app/upload.js?v=2","app/provinceArea",
    "laydate",'app/tplEngine','layer',
    'app/unitTool'
],function (
    upload,provinceArea,laydate,tplEngine,
    layer,unitTool
) {

    window.NextSetp = function (selector,lastStep) {

        switch (selector){
            case '.apply-step-1':{
                if( !checkoutStep1(selector,false) ) return;
                break;
            }
            case '.apply-step-2':{
                if( !checkoutStep2(selector,false) ) return;
                break;
            }
            case '.apply-step-3':{
                if( !checkoutStep3(selector,false) ) return;
                break;
            }
            case '.apply-step-4':{
                if( !checkoutStep4(selector,false) ) return;
                break;
            }
        }

        if( $(this).hasClass('gray')) return;
        //保存数据
        var formDom = $(selector).find('form');
        $.post(formDom.attr('action'),formDom.serialize(),function (replayData) {
            if(replayData.resultCode==0){
                if(lastStep){
                    //最后一步
                    layer.msg('信息提交成功，耐心等待审核');
                }

                $(selector).hide().next('.apply-step').show();
                var index = formDom.find('input[type=hidden][name="step"]').val();

                //window.location = window.location.href.split('#')[0]+'#'+index;
            }else{
                layer.msg(replayData.errorMsg || '系统错误');
            }
        },'json');
    }

    window.PrevSetp = function (selector) {
        $(selector).hide().prev('.apply-step').show();
    }

    window.SubmitData = function (selector) {
        $(selector).hide().prev('.apply-step').show();
    }

    window.checkoutStep1 = function (selector,tips) {
        console.log( tips );

        selector = $(selector||'.apply-step-1');
        var _fix = -150,
            root = $('html,body');

        var obj = selector.find('#user-face');
        if(obj.find('input[data-url]').val()==''){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请上传头像');
            return false;
        }

        var obj = selector.find('#name');
        if(obj.val()==''){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填写姓名');
            return false;
        }

        var obj = selector.find('input[name="apply[sex]"]:checked');

        if(obj.length<=0){
            if(tips){ return false; }
            root.animate({'scrollTop': 530 + _fix });
            layer.msg('请选择性别');
            return false;
        }

        var obj = selector.find('#birthday');
        if( !/^\d{4}\-\d{2}\-\d{2}$/.test(obj.val())){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请正确选择生日');
            return false;
        }

        var obj = selector.find('#job');
        if( obj.val()=='' ){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填写职业');
            return false;
        }

        var obj = selector.find('#province');
        var obj2 = selector.find('#city');
        if( obj.val()=='' || obj2.val()=='' ){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填选择地域');
            return false;
        }

        var obj = selector.find('#introduce');
        if( obj.val()=='' ){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填写个人介绍');
            return false;
        }

        return true;
    }

    window.checkoutStep2 = function (selector,tips) {
        selector = $(selector);
        var _fix = -150,
            root = $('html,body');

        var obj = selector.find('input[name="apply[type]"]:checked');
        if(obj.length<=0){
            if(tips){ return false; }
            root.animate({'scrollTop': 120 });
            layer.msg('请选择申请类别');
            return false;
        }

        var obj = selector.find('.good-at-area li input:checked');
        if(obj.length<=0){
            if(tips){ return false; }
            root.animate({'scrollTop': 420 });
            layer.msg('请选择擅长领域');
            return false;
        }

        var obj = selector.find('#tel');
        if(!/^1\d{10}$/.test(obj.val())){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填写电话');
            return false;
        }
        var obj = selector.find('#weixin');
        if( obj.val()=='' ){
            if(tips){ return false; }
            root.animate({'scrollTop': obj.offset().top + _fix });
            layer.msg('请填微信号');
            return false;
        }

        window.getAreaQuestion(selector);

        return true;
    }

    window.checkoutStep3 = function (selector,tips) {
        selector = $(selector);
        var _fix = -150,
            root = $('html,body');

        var has_link = [];

        selector.find('[data-apply-answer-text]').each(function () {
            if($(this).val()==''){
                has_link.push($(this));
                return;
            }
        });

        if(has_link.length>0){
            if(tips){ return false; }
            root.animate({'scrollTop': has_link[0].offset().top + _fix });
            layer.msg('请填写问题');
            return false;
        }

        var has_link = [];

        selector.find('[data-apply-answer-image]').each(function () {
            if($(this).find('li').length<=0 ){
                has_link.push($(this));
                return;
            }
        });

        if(has_link.length>0){
            if(tips){ return false; }
            root.animate({'scrollTop': has_link[0].offset().top + _fix });
            layer.msg('请填上传图片');
            return false;
        }

        return true;
    }
    window.checkoutStep4 = function (selector,tips) {

        selector = $(selector);
        var _fix = -150,
            root = $('html,body');

        var has_link = [];

        selector.find('[data-apply-link]').each(function () {
            if($(this).val()==''){
                has_link.push($(this));
                return;
            }
        });
        if(has_link.length>0){
            if(tips){ return false; }
            root.animate({'scrollTop': has_link[0].offset().top + _fix });
            layer.msg('请填作品链接');
            return false;
        }
        return true;
    }

    window.getAreaQuestion = function ( selector ) {
        selector = $(selector);

        //数据验证通过之后进行获取领域子项
        var obj = selector.find('.good-at-area li input:checked'),
            areaid = '';
        obj.each(function () {
            areaid += ','+$(this).val();
        });
        areaid = areaid.substr(1);

        $.get('/api/vip/GetArea',{
            area:areaid
        },function (replayData) {
            var html = tplEngine.init( $('#apply-question-item-tpl').html(),{
                data:replayData.result?replayData.result.data:[]
            });
            $('#apply-question-item-wrap').html(html);

            // 领域图片上传
            window.uploadify();

        },'json');
    }

    window.uploadify = function () {
        var ua = window.navigator.userAgent;
        var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;
        if( isSafari ){
            upload.uploadify('.apply-step3-item-image ul',{
                uploadUrl:'/api/other/RepairUpload',
                //上传成功
                'onUploadSuccess':function ( file,data,queueDomId ) {
                    data = data.result;
                    var queueDom = $('#'+queueDomId);
                    data.data_name = queueDom.attr('data-name');
                    var html = tplEngine.init($('#uploadfile-item-show-tpl').html(),data);
                    queueDom.find('#'+file.id).replaceWith(html);
                }
            });
        }else{
            upload.uploadify('.apply-step3-item-image ul',{
                uploadUrl:'/api/other/RepairUpload',
                //上传成功
                'onUploadSuccess':function ( file,data,response ) {
                    data = $.parseJSON(data).result;
                    var queueDom = $('#'+this.settings.queueID);
                    data.data_name = queueDom.attr('data-name');
                    var html = tplEngine.init($('#uploadfile-item-show-tpl').html(),data);
                    queueDom.find('#'+file.id).replaceWith(html);

                }
            });
        }
    }


    return {
        init:function () {
            var $ = require('jquery');

            //默认页面
            // var hrefArr = window.location.href.split('#');
            // if(
            //     ( hrefArr.length>1 && !isNaN(parseInt(hrefArr[1])) ) ||
            //     hrefArr.length<=1
            // ){
            //     $('.apply-step').hide();
            //     if( $('.apply-step-'+hrefArr[1]).length){
            //         $('.apply-step-'+hrefArr[1]).show();
            //     }else{
            //         $('.apply-step-1').show();
            //     }
            // }

            //初始化 领域问题
            window.getAreaQuestion('.apply-step-2');

            //上传头像
            upload.init('#user-face',{
                width:185
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
            $('#apply-sex-select').on('click','.select-group',function () {
                $(this).prevAll().removeClass('on');
                $(this).nextAll().removeClass('on');
                $(this).addClass('on');
            });

            //控制字数
            var applyCenterDom = $('.apply-step-1');
            applyCenterDom.on('keyup','[data-text-number]',function () {
                var number = parseInt( $(this).attr('data-text-number') ),
                    dataRelDom = applyCenterDom.find('['+$(this).attr('data-rel')+']'),
                    val = $(this).val();

                if(val.length >= number){
                    $(this).val(val.substr(0,number));
                }

                dataRelDom.html( (number - val.length <1 )?0:number - val.length );

            }).find('[data-text-number]').trigger('keyup');



            //申请类别
            var applyCenterDom2 = $('.apply-step-2');
            applyCenterDom2.on('click','.apply-type-wrap',function () {
                applyCenterDom2.find('input[name="apply[type]"]').prop('checked',false);
                applyCenterDom2.find('.apply-type-wrap').removeClass('on');
                $(this).addClass('on').find('input[name="apply[type]"]').prop('checked',true);
            });

            //擅长领域
            $('#apply-form-step2').on('click','li',function () {

                if($(this).hasClass('on')){

                    if( $(this).parent().find('li.on').length<=1 ){
                        layer.msg('至少选择一个领域');
                        return;
                    }

                    $(this).removeClass('on').find('input[name="apply[area][]"]').prop('checked',false);
                }else{
                    if( $(this).parent().find('li.on').length>=3 ){
                        layer.msg('最多选择三项领域');
                        return;
                    }
                    $(this).addClass('on').find('input[name="apply[area][]"]').prop('checked',true);
                }
            });
            $('.apply-step-3').on('click','.delete',function () {
                $(this).parent('li').remove();
            });

            // 领域图片上传
            window.uploadify();


            //作品链接
            $('.apply-step-4').on('click','.apply-add-production',function () {
                var o = $(this).closest('.apply-table-view').find('[data-production-box]');
                o.append( tplEngine.init($('#add-production-item-tpl').html(),{
                    number:o.find('>tr').length + 1
                }) );
            }).on('click','.apply-sub-production',function () {

                var i = 1,
                    o = $(this).closest('[data-production-box]');
                if( o.find('[data-apply-link]').length<=1 ){
                    layer.msg('至少有一个作品链接');
                    return;
                }

                $(this).closest('tr').remove();
                o.find('[data-apply-link]').each(function () {
                    $(this).parent().parent().prev().find('[data-production-item-index]').html( i );
                    i++;
                });
            });

            ///++++++++++++++数据动态校验+++++++++++++++//

            // function _checkout(stepWrap,stepBtn) {
            //     stepWrap.on('blur keyup','[data-bulr-checkout]',function () {
            //         if( window.checkoutStep1(stepWrap,true) ){
            //             stepBtn.removeClass('gray');
            //         }else{
            //             layer.closeAll();
            //             stepBtn.addClass('gray');
            //         }
            //     }).find('[data-bulr-checkout]').first().trigger('blur');
            // }
            //
            // for(var i = 1 ; i <=4; i++ ){
            //     _checkout( $('.apply-step-'+i),$('[data-next-step-'+i+']') );
            // }
        }
    };

});
