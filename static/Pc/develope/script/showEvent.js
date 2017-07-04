/**
 +----------------------------------------------------------
 //首页优化文件
 +----------------------------------------------------------
 */

define([
    'require',
    'global.fun',
    'app/common',
    'app/hotEvent',
    'layer',
    'app/unitTool',
    'app/tplEngine',
    'app/countdown',
    'cookie',
],function (require,global,common,hotEvent,layer,unitTool,tplEngine,countdown,_){

    function _init() {
        //试用,鼠标放在卡片上出现特效
        hotEvent.init();

        //ajax加载数据
        var dom = $('#eventAjaxLoad');
        var changeDom = $('#change-type');
        var a = changeDom.find('a');
        a.click('click',function () {
            changeDom.find('.on').removeClass('on');
            $(this).parent().addClass('on');
            dom.html('');
            $('.loading-more-warp').hide();
            $('.click-loading').show();

            hotEvent.ajaxLoad({
                url:'/api/event/EventList',
                boxDom:dom,
                data:{
                    type:type,
                    act:$(this).attr('data-type')
                }
            });
        }).first().trigger('click');
    }

    return {
        listAll:_init,
        show:function () {
            //试用,鼠标放在卡片上出现特效
            hotEvent.init();
            //ajax加载热门试用数据
            new hotEvent.ajaxLoad({
                url:'/api/event/HotEvent',
                boxDom:$('#eventHotAjaxLoad'),
                tplDom:$('#loading-data-list-tpl'),
                firWarp:'no',
                data:{
                    id:eventid
                },
                size:4,
            });
        },
        applyUser:function () {
            //ajax加载用户申请流数据
            new hotEvent.ajaxLoad({
                url:'/api/comment/GetEventApply',
                boxDom:$('#event-apply-user-list'),
                tplDom:$('#event-apply-user-list-tpl'),
                firWarp:$('#event-apply-user-list-fire'),
                triggerType:'click',
                size:10,
                data:{
                    id:eventid
                }
            });
            //点击展开按钮
            $('#event-apply-user-list').on('click','p.open-btn',function () {
                var p = $(this).parent().parent();
                p.find('.show-open-part').hide();
                p.find('.show-open-all').show();
            });
        },
        clickApply:function () {
            //弹出用户申请框
            layer.ready();
            $('body').on('click','[data-event-apply-input-box]',function (e) {
                e.preventDefault();

                if( (typeof popularize =='undefined') && !window.URL['login']){
                    common.login();
                    return;
                }

                if($(this).attr('data-alert')){
                    return;
                }

                var id = K.randomId(),
                    html = $('#event-apply-input-tpl').html(),
                    meta_id=$(this).closest('[data-metaid]').attr('data-metaid'),
                    remark=$(this).attr('data-remark'),
                    applydata={
                        remark: remark
                    };
                var lId = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    area:['510px'],
                    content: '<div id="'+id+'">'+tplEngine.init(html,applydata)+'</div>',
                    success:function (layero, index) {
                        setTimeout(function () {
                            $(layero).find('.apply-input-close').attr('onClick','layer.close(\''+lId+'\')');
                        });
                        var Obj = $(layero).find('#apply-event-form-data');

                        //加载型号信息
                        $.post('/api/event/GetStorageList',{meta_id:meta_id},function (replayData) {
                            var data=replayData.result,
                                o='';
                            if(data.no_spec==1){
                                o+='<input name="storage_id" value="'+data.first_storage.id+'" type="hidden">';
                                Obj.find('.apply-model-wrap').hide();
                            }else{
                                for(var i in data.storage_list){
                                    if(data.storage_list[i].all_storage>0){
                                        o+='<li class="apply-model-btn"><span data-storageid="'+data.storage_list[i].id+'">'+data.storage_list[i].spec_name+'</span></li>';
                                    }else{
                                        o+='<li class="apply-model-btn disabled-btn"><span data-storageid="'+data.storage_list[i].id+'">'+data.storage_list[i].spec_name+'</span></li>';
                                    }
                                }
                            }
                            Obj.find('.apply-model-list').html(o);
                            if($(layero).find('.apply-model-btn:not(.disabled-btn)').length<=1){
                                $(layero).find('.apply-model-btn:not(.disabled-btn)').trigger('click');
                            }
                        },'json');

                        //选择型号
                        $(layero).find('.apply-model-wrap').on('click','li:not(.disabled-btn)',function () {
                            if(!$(this).hasClass('checked')){
                                var storageid=$(this).find('span').attr('data-storageid');
                                var html='<input name="storage_id" value="'+storageid+'" type="hidden">';
                                $(this).addClass('checked').siblings().removeClass('checked');
                                $(this).append(html).siblings().find('input').remove();
                            }
                        });

                        $(layero).find('.btn').click(function () {
                            var cookie_option = {
                                path:'/',
                                expires:36000000
                            }

                            if(Obj.find('.apply-model-btn').length>0){
                                if(Obj.find('.apply-model-btn.checked').length==0){
                                    layer.msg('请选择产品型号');
                                    return;
                                }
                            }

                            if(Obj.find('input[name=tel]').val().length!=11){
                                layer.msg('手机号码不允许为空');
                                return;
                            }
                            if(Obj.find('input[name=username]').length && Obj.find('input[name=username]').val().length==''){
                                layer.msg('用户名不允许为空');
                                return;
                            }
                            if(!Obj.find('#agreement').prop('checked')){
                                layer.msg('未勾选同意用户协议');
                                return;
                            }
                            var applyUrlAPI = window.applyUrlAPI?window.applyUrlAPI:'/api/event/Apply';
                            var applyStatus=Obj.find('input[name=status]');
                            var formData = Obj.serialize();
                            if(!applyStatus.is(":checked")){
                                formData+="&status=-1";
                            }

                            $.post( applyUrlAPI ,formData,function (replayData) {
                                if(replayData.resultCode==0){
                                    layer.msg('申请成功',{type: 1},function () {
                                        layer.closeAll();
                                        window.location.reload();
                                    });
                                }else{
                                    layer.msg(replayData.errorMsg);
                                }
                            },'json');
                        });

                    }
                    ,end:function () {

                    }
                });

            });
        },
        //请求右侧卡片数据
        requestCardData:function () {
            var cachrFun = tplEngine.init($('#event-buy-right-card-tpl').html());

            $.get('/api/event/EventSide',{
                id:eventid
            },function (replayData) {
                if(unitTool.getLength(replayData.result)){
                    var html = cachrFun({data:replayData.result});
                    $('.event-buy-right-card').html(html);

                    var countdownObj = $('[data-countdown]');
                    if( countdownObj.length ){
                        countdownObj.each(function () {
                            if($(this).attr('data-unq')){
                                if($(this).attr('data-countdown')>0){
                                    var h = $('#'+$(this).attr('data-unq'));
                                    h.addClass('gray').attr('_href',h.attr('href')).attr('href','javascript:;').attr('target','_self');
                                }
                                countdown.run({
                                    intDiff:$(this).attr('data-countdown'),
                                    dom:$(this),
                                    callback:function () {
                                        var h = $('#'+$(this).attr('data-unq'));
                                        h.removeClass('gray').addClass('red').attr('href',h.attr('_href')).attr('target','_blank').html('立即试用');
                                    }
                                });
                            }else{
                                countdown.run({
                                    intDiff:$(this).attr('data-countdown'),
                                    dom:$(this),
                                    isglobal:true,
                                    callback:function () {
                                        window.location.reload();
                                    }
                                });
                            }
                        });
                    }
                }else{
                    //window.location.reload();
                }
                //微店二维码购买交互
                $('.event-buy-right-card').on('mouseenter','[data-show-intro]',function(){
                    $(this).find('.intro.alert-show').show();
                }).on('mouseleave','[data-show-intro]',function(){
                    $(this).find('.intro.alert-show').hide();
                }).find('[data-show-intro]').click(function () {
                    layer.ready(function () {
                        layer.msg('请在手机上扫码申请');
                    });
                });
            },'json');
        }
        //请求顶部焦点图数据
        ,requestBannerData:function () {
            $.get('/api/event/IndexEventBanner',{
                id:eventid
            },function (replayData) {
                if(unitTool.getLength(replayData.result)){
                    var box = $('.event-banner-get-data');
                    if(replayData.result.residueTime){
                        box.find('.event-banner-get-time').html('申请截止: '+replayData.result.residueTime);
                    }else{
                        box.find('.event-banner-get-time').html('&nbsp;');
                    }
                    box.find('.btn').attr('class','btn '+replayData.result.status)
                        .html(replayData.result.buying_status);
                    //'data-event-apply-input-box'
                    if(('isapply' in replayData.result) && replayData.result.isapply){
                        box.find('.btn').attr(replayData.result.isapply,'');
                    }
                    if(('url' in replayData.result) && replayData.result.url){
                        box.find('.btn').attr('href',replayData.result.url);
                    }
                    box.fadeIn(500);
                }else{
                    //window.location.reload();
                }
            },'json');
        }
        //获取试用名单
        ,getEventUserList:function () {
            var userListWrap=$('.autor-list-wrap');
            $.get('/api/event/Roster',{
                id:eventid
            },function (replayData) {
                if(replayData.result.num>0){
                    var html = tplEngine.init($('#use-apply-list-tpl').html(),{data:replayData.result.meta_list});
                    $('#use-apply-list').html(html);
                    setTimeout(function () {
                        if(userListWrap.height()>230){
                            $('#use-apply-list').addClass('hidden-list');
                            $('.look-all-wrap').show();
                        }
                    });
                    $('.event-user-list-warp').fadeIn(250);
                }
            },'json');
            $('.look-more').click(function () {
                $(this).hide();
                $('.pack-up').show();
                userListWrap.removeClass('hidden-list');
            });
            $('.pack-up').click(function () {
                $(this).hide();
                $('.look-more').show();
                userListWrap.addClass('hidden-list');
            });
        }
        //加载体验报告
        ,getEventBlogList:function () {
            new hotEvent.ajaxLoad({
                url:'/api/event/EventLinkBlog',
                boxDom:$('#blogAjaxLoad'),
                tplDom:'#event-load-blog-tpl',
                firWarp:'.event-blog-list',
                triggerType:'click',
                dataChange:function (data,options) {
                    if(data.result.meta.count>0){
                        $(options.boxDom).parent().parent().show();
                    }
                    $('#event-blog-list-tips').html('共有'+data.result.meta.count+'篇关于'+data.result.meta.name+'的报告');
                    data.result = data.result.blog;
                    return data;
                },
                size:3,
                data:{
                    id:eventid
                }
            });
        }
        ,getEventIntro:function () {
            $('body').on('click','[data-metaintro]',function () {
                var metaId=$(this).closest('[data-metaid]').attr('data-metaid');
                var layerId=layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    scrollbar: false,
                    shadeClose: false,
                    area:['510px','550px'],
                    content:'\
                    <div class="event-apply-input-box">\
                        <div class="apply-input-header mb10">\
                            <h3>试用细则</h3>\
                            <div class="apply-input-close icon" data-closelayer></div>\
                        </div>\
                        <div class="event-intro-wrap ft14 pdt5"></div>\
                     </div>',
                    success:function (layero,index) {
                        $.post('/api/event/GetMetaDetail',{'meta_id':metaId},function (replayData) {
                            if(replayData.success){
                                $(layero).find('.event-intro-wrap').html(replayData.result);
                            }else{
                                layer.msg(replayData.errorMsg||'操作失败');
                            }
                        },'json');
                        setTimeout(function () {
                            $(layero).find('[data-closelayer]').attr('onClick','layer.close(\''+layerId+'\')');
                        });
                    }
                })
            })
        }
        ,alertTips:function () {
            console.log(window.URL['login']);
            $('body').on('click','[data-alert]',function () {
                if(!window.URL['login']){
                    return;
                }
                layer.msg($(this).attr('data-alert'));
            });
        }
    };
});
