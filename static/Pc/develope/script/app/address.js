/**
 +----------------------------------------------------------
 +----------------------------------------------------------
 */

define(['jquery','layer','app/tplEngine','app/provinceArea'], function ($,layer,tplEngine,provinceArea) {

    layer.ready();

    $(function () {
        //修改地址
        $('[data-edit-addr]').click(function () {
            var _this = $(this);
            $.get('/api/user/GetAddress',{
                id:_this.attr('data-id')
            },function (replayData) {
                if(replayData.resultCode!=0){
                    layer.msg('系统错误');
                }else{
                    _query({
                        data:replayData.result,
                        title:'修改地址',
                        url:'/api/user/EditAddress',
                        tpl:'#add-addr-edit-tpl',
                        province:replayData.result.province,
                        city:replayData.result.city,
                        country:replayData.result.country,
                    });
                }
            },'json');
        });


        //默认地址
        $('[data-default-addr]').click(function () {
            var _this = $(this);
            if($(this).prop('checked')){
                $.get('/api/user/SetAddress',{
                    id:$(this).attr('data-id')
                },function (replayData) {
                    if(replayData.resultCode!=0){
                        layer.msg('系统错误');
                        _this.prop('checked',false);
                    }
                },'json');
            }
        });

        //删除地址
        $('[data-delete-addr]').click(function () {
            var _this = $(this);
            layer.alert('您确定删除吗?',function () {
                $.get('/api/user/DelAddress',{
                    id:_this.attr('data-id')
                },function (replayData) {
                    if(replayData.resultCode!=0){
                        layer.msg('系统错误');
                    }else{
                        _this.parent().parent().fadeOut(250,function () {
                            $(this).remove();
                        });
                        layer.closeAll();
                    }
                },'json');
            })
        });

        function _query(option) {
            var option = $.extend({
                title:'添加地址',
                data:{},
                url:'/api/user/AddRess',
                tpl:'#add-addr-tpl',
                province:'北京',
                city:'北京市',
                country:'海淀区',
            },option);
            var html = tplEngine.init($(option.tpl).html(),{data:option.data});
            layer.open({
                type: 1,
                title: option.title,
                closeBtn: 1,
                shadeClose: true,
                area:['500px','420px'],
                content: html,
                success:function (layero, index) {
                    var addrFormData = $('#addrFormData');
                    $(layero).find('.btn').click(function () {
                        if( $(layero).find('#username').val()=='' || $(layero).find('#username').val().length<2){
                            layer.msg('请填写姓名');
                            return ;
                        }
                        if( $(layero).find('#tel').val()=='' ){
                            layer.msg('请填写电话');
                            return ;
                        }
                        if( $(layero).find('#city').val()=='' ){
                            layer.msg('请填写省市');
                            return ;
                        }
                        if( $(layero).find('#address').val()=='' ){
                            layer.msg('请填写详细地址');
                            return ;
                        }
                        if( $(layero).find('#posts').val()=='' ){
                            layer.msg('请填写邮编');
                            return ;
                        }
                        var sendFormData = addrFormData.serialize();
                        $.post(option.url,sendFormData,function (replayData) {
                            if(replayData.resultCode==0){
                                window.location.reload();
                            }else{
                                layer.msg(replayData.errorMsg || '系统错误');
                            }
                        },'json')
                    });
                    //初始化地域选择框
                    // provinceArea.init();
                    var __country = $('#country');
                    AreaSelector({
                        selProvinceId: 'province', //省市县DOM id
                        selCityId: "city",
                        selAreaId: 'country',
                        onProvinceChange: function () {
                        },
                        onCityChange: function () {
                            if( __country.find('option').length<=1){
                                __country.parent().hide().end().hide();
                            }else{
                                __country.parent().show().end().show();
                            }
                        }
                    }).initProvince(option.province,option.city,option.country);
                }
            });
        }

        $('#add-addr').click(function () {
            _query();
        });
    });
});
