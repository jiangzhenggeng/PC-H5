/**
 * Created by wuhongshan on 2017/4/6.
 */
define(['jquery', 'layer', 'app/common','template','laydate'], function ($, layer, common,template,laydate) {
//    随机id
    function randomID(){
        return 'random_id_'+Math.random().toString().replace('.','');
    }
//   编码
    function html_encode(str) {
        if(typeof str!='string') return '';
        var s = "";
        if (str.length == 0) return "";
        return str.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/\\/g,'&#92;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;')
            .replace(/\n/g,'<br>');
    }
//  解码
    function html_decode(str) {
        if(typeof str!='string') return '';
        var s = "";
        if(str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "'");
        s = s.replace(/&quot;/g, '"');
        s = s.replace(/<br>/g, "\n");
        return s;
    }
//    时间初始化
    function initTime(Id) {
        laydate({
            elem: Id ,
            format: 'YYYY-MM-DD hh:mm:ss',
            min: '1970-01-1 23:59:59', //设定最小日期为当前日期
            max: '2099-06-16 23:59:59', //最大日期
            istime: true,
            istoday: true,
        });
    };
//   检测重复
    function testRepeat(obj) {
        var ary=[];
        for (var j in obj){
            ary.push(obj[j]);
        }
        var nary=ary.sort();
        for(var i=0;i<ary.length;i++){
            if (nary[i]==nary[i+1]){
                return false;
            }
        }
        return true;
    }
//    字数控制
    function  countText(textareaDom) {
        var applyCenterDom=$('.'+textareaDom);
        applyCenterDom.on('keyup','[data-text-number]',function () {
            var number = parseInt( $(this).attr('data-text-number') ),
                dataRelDom = applyCenterDom.find('.data-rel'),
                val = $(this).val(),
                re=/[^\x00-\xff]/g;

            if(getLen(val) > number){
                var l=re.test(val) ? val.match(re).length : 0,
                    n=getLen(val)-l,
                    m=number+n;
                $(this).val(val.substr(0,m));
            }

            dataRelDom.html((number - getLen(val) <0.5 )?0:number - getLen(val));

        }).find('[data-text-number]').trigger('keyup');
    }

    $('body').on('keyup','[data-countText]',function () {
        var n=$(this).attr('data-countText'),
            val=$(this).val(),
            tip=$(this).next();
        if(n<getLen(val)){
            tip.show();
        }else{
            tip.hide();
        }
    });
//    删除卡片
    function delCard(delBtn) {
        var id = layer.confirm('你确定删除吗？', {
            btn: ['删除','取消'] //按钮
        }, function(){
            delBtn.closest(".Z-card-list-box").remove();
            layer.close(id);
        });
    }
//    添加头条
    function addHeadline(url) {
        layer.open({
            title: '新增头条',
            type: 2,
            move:false,
            scrollbar:false,
            area:['910px','550px'],
            content: url
        });
    }
//    暂停活动
    function pauseEvent(url,id) {
        layer.open({
            title: '暂停公告',
            type:1,
            move:false,
            btn:['确定'],
            area:['500px'],
            content: '\
            <div class="note-warp event-page-notice ">\
            <div class="notice-title-wrap">活动详情页公告</div>\
            <textarea class="pauseText" placeholder="公告内容" name="eventPauseText">抱歉！本产品由于厂家暂时缺货，发货时间待定。我们将在产品到货后继续此试用活动的开奖，给您带来的不便敬请谅解！</textarea>\
            </div>\
            <div class="note-warp order-page-notice mt10">\
            <div class="notice-title-wrap">订单详情页公告</div>\
            <textarea class="pauseText" placeholder="公告内容" name="orderPauseText">由于厂家暂时缺货，无法马上发货，我们会催促商家快马加鞭为您发货。</textarea>\
            </div>',
            yes:function (index,layero) {
                var pause_event_notice=layero.find('[name=eventPauseText]').val();
                var pause_order_notice=layero.find('[name=orderPauseText]').val();
                if(pause_event_notice==''||pause_order_notice==''){
                    layer.msg('请填写公告内容');
                    return false;
                }
                var data={
                    id:id,
                    pause_event_notice:pause_event_notice,
                    pause_order_notice:pause_order_notice
                };
                var layerid = layer.msg('处理中',{time:3000});
                common.ajax('post',url,data,'json',function (replyData) {
                    layer.close(layerid);
                    layer.msg(replyData.errorMsg||'操作成功');
                    layer.closeAll();
                    window.location.reload();
                });
            }
        });
    }

    /**
     * 活动关联产品,获取产品列表
     */
    function getProductListLink(url,_editor_desciption){
        var scrollId = randomID();
        var w_id = layer.open({
            title: '产品列表',
            type:1,
            scrollbar:false,
            area:['610px','480px'],
            content: '\
            <div class="layer-event-link-product-search">\
                <spa>关键词:</spa>\
                <input id="key'+scrollId+'" class="Z-input" style="width:200px;">\
                <spa>产品id:</spa>\
                <input id="product'+scrollId+'" class="Z-input Z-w-100">\
                <button id="search-btn'+scrollId+'" type="button" class="Z-btn Z-w-110 Z-right">搜索</button>\
            </div>\
            <div id="'+scrollId+'" class="layer-event-link-product-list">\
				<ul></ul>\
			</div>',
            success:function (layero, index) {
                var scrollBox = layero.find('#'+scrollId),
                    scrollBoxUl = scrollBox.find('ul'),
                    is_loading = true,
                    p = 0,
                    html = '';

                window._getData = function (fille) {
                    is_loading = false;
                    $.get(url||'/admin2/search/index',{
                        p:p,
                        size:10,
                        name:$('#key'+scrollId).val(),
                        keyword:$('#key'+scrollId).val(),
                        pid:$('#product'+scrollId).val(),
                        type:'product'
                    },function (replayData) {
                        var replayData=replayData.result;
                        html = '';
                        for(var i in replayData){
                            html += '<li>\
                                <div class="product-pic Z-left">\
                                    <img style="width:100%;" src="http://s1.jiguo.com/'+replayData[i].cover+'/230x230">\
                                </div>\
                                <div class="product-desc">\
                                    <div style="height:23px;overflow:hidden;">'+replayData[i].name+'</div>\
                                    <div>\
                                        <a class="blue" href="http://zdm.jiguo.com/admin/product/edit/id/'+replayData[i].id+'.html" target="_blank">查看</a>\
                                        <a class="blue" href="javascript:;" data-addLinkProduct data-name="'+html_encode(replayData[i].name)+'" data-id="'+replayData[i].id+'" data-wid="'+w_id+'">关联</a>\
                                        <span style="float: right;color:grey;">'+replayData[i].addtime+'</span>\
                                    </div>\
                                </div>\
                            </li>';
                        }
                        if(fille){
                            if(html==''){
                                html = '<span class="Z-red">没有数据...</span>';
                            }
                            scrollBoxUl.html(html);
                        }else {
                            scrollBoxUl.append(html);
                        }
                        if(replayData.length){
                            p++;
                            is_loading = true;
                        }else {
                            is_loading = false;
                        }
                    },'json');
                }

                $(".layer-event-link-product-list").on('click','[data-addLinkProduct]',function () {
                    var ProName=$(this).attr("data-name");
                    var ProId=$(this).attr("data-id");
                    var wid=$(this).attr("data-wid");
                    __addLinkProduct__(ProName,ProId,_editor_desciption,wid);
                });

                layero.find('#'+scrollId).scroll(function () {
                    if(is_loading && scrollBoxUl.height()<scrollBox.scrollTop()+scrollBox.height()+40){
                        window._getData();
                    }else{
                        return;
                    }
                });

                $('#key'+scrollId).keypress(function () {
                    p=0;
                    is_loading = true;
                    window._getData(true);
                });

                $('#search-btn'+scrollId).click(function () {
                    p=0;
                    is_loading = true;
                    window._getData(true);
                });

                window._getData();
            }
        });
    }
    //获取购买链接及产品介绍
    function __addLinkProduct__(productname,pid,_editor_desciption,w_id) {
        $('#__addLinkProduct__').html(productname+'<input data-goods_id name="goods_id" value="'+pid+'" type="hidden">');
        //      获取购买链接
        common.ajax('get','/admin2/event/getproducturl',{id:pid},'json',function (replayData) {
            var replayData=replayData.result;

            $("[data-addProductLink]").siblings().remove();
            for(var i in replayData){
                var id=randomID();
                replayData[i].id=id;
                $('[data-addproductlink]').before( template('add-event-link-block-tpl',replayData[i]) );
            }
        });
        //获取产品介绍
        common.ajax('get','/admin2/event/GetProductDetail',{id:pid},'json',function (replayData) {
            _editor_desciption.setContent(replayData.result);
        });
        if(w_id){
            layer.close(w_id);
        }

    }


    //添加购买链接
    function addLinkEvent(originData,editBox) {
        var formId = randomID();
        originData = originData || {};
        originData = {
            url:originData.url || '',
            mall:originData.mall || '',
            price:originData.price || '',
            desc:html_decode(originData.desc) || '',
            id:originData.id || randomID()
        };
        var layerId = layer.open({
            title: '添加购买链接',
            type:1,
            btn:['保存'],
            area:['465px'],
            content: '\
            <form id="'+formId+'">\
                <div class="layer-event-add-block-warp">\
                    <div class="Z-row">\
                        <span class="Z-name">购买链接：</span><input  value="'+originData.url+'" name="url" class="Z-input Z-w-327">\
                    </div>\
                    <div class="Z-row">\
                        <span class="Z-name">来源：</span><input  value="'+originData.mall+'" name="mall" class="Z-input Z-w-327">\
                    </div>\
                    <div class="Z-row">\
                        <span class="Z-name">价格：</span><input value="'+originData.price+'" name="price" class="Z-input Z-w-327">\
                    </div>\
                    <div class="Z-row">\
                        <span class="Z-name">描述：</span><textarea name="desc" class="Z-input Z-w-327">'+originData.desc+'</textarea>\
                    </div>\
                </div>\
            </form>',
            yes:function () {
                var FormObj = $('#'+formId) ,
                    data = {
                        price:FormObj.find('[name=price]').val().toString().replace(/[^\d\.]/g,''),
                        mall:FormObj.find('[name=mall]').val().toString(),
                        url:FormObj.find('[name=url]').val(),
                        desc:html_encode(FormObj.find('[name=desc]').val()),
                        id:originData.id
                    };
                if(!/^(\d+)|(\d+\.\d+)$/.test(data.price.toString())){
                    layer.msg('请填写购买价格');
                    return;
                }

                if(data.mall==''){
                    layer.msg('请填写来源');
                    return;
                }
                if(data.url==''){
                    layer.msg('请填写购买链接');
                    return;
                }
                if(editBox){
                    editBox.prop( "outerHTML",template('add-event-link-block-tpl',data) );
                }else{
                    $('[data-addproductlink]').before( template('add-event-link-block-tpl',data) );
                }

                layer.close(layerId);
            }
        });
    }

    //添加产品类型
    function addModel(modelList) {
        layer.open({
            title: "产品规格设置<font style='font-size:14px;font-weight: 500;color: #999'>（规格命名统一标准：规格1+空格+规格2+空格+规格3，（8个字以内）例如：男 白色 M;女 红色 S）</font>",
            type: 1,
            move:false,
            scrollbar:false,
            area:['910px','400px'],
            content: '\
                   <div class="model-list-wrap">\
                        <ul class="clearfix">\
                            <li data-addmodelitem class="add-model-item">+</li>\
                        </ul>\
                        <div class="Z-sub-main Z-center" style="padding-top:30px;border: none">\
                            <button data-sub type="button" class="Z-btn Z-w-100">确定</button>\
                        </div>\
                   </div>',
            success:function (layero,index) {
                if(modelList){
                    var modelItemHtml='';
                    for(var i in modelList){
                        modelItemHtml+='<li class="modelitem"><input type="text" value="'+modelList[i]+'" name="'+i+'" placeholder="请填写规格名称"><span data-delmodelitem>x</span></li>';
                    }
                    $(layero).find('[data-addmodelitem]').before(modelItemHtml);
                }
                $(layero).on('click','[data-delmodelitem]',function () {
                    $(this).closest('li').remove();
                })
                    .on('click','[data-addmodelitem]',function () {
                           var name="model["+randomID()+"]";
                        var html='<li class="modelitem"><input type="text" name="'+name+'" placeholder="请填写规格名称"><span data-delmodelitem>x</span></li>';
                        $(this).before(html);
                        $(this).prev().find('input').trigger('focus');
                    })
                    .on('click','[data-sub]',function () {
                        var modelDataList={};
                        var o='';
                        var flag=false;
                        //判断型号是否添加正确
                        if($(layero).find(".modelitem input").length<=0){
                            flag=true;
                        }
                        $(layero).find(".modelitem input").each(function () {
                            var modelItem=$(this).val();
                            var modelName=$(this).prop('name');
                            if(!modelItem||getLen(modelItem)>8){
                                flag=true;
                                return false;
                            }
                            modelDataList[modelName]=modelItem;
                        });
                        console.log(modelDataList);
                        if(!testRepeat(modelDataList)){
                            layer.msg('产品规格不能重复');
                            return;
                        }
                        if(flag){
                            layer.msg('请填写正确的产品规格');
                            return;
                        }
                        for(var k in modelDataList){
                            o+='<li class="Z-gray-btn Z-w-150">'+modelDataList[k]+'<input type="hidden" name="'+k+'" value="'+modelDataList[k]+'"></li>';
                        }
                        $("[data-editmodel]").siblings().remove();
                        $("[data-editmodel]").before(o);
                        $("[data-addmodel]").hide();
                        $(".Z-edit-model").show();
                        layer.closeAll();

                        // 有玩法时且规格变更时提示修改玩法
                        if($("#formDataAjaxSend").find('#add-event-free-block > .Z-card-list-box:not(.Z-card-list-add)').length>0||
                            $("#formDataAjaxSend").find('#add-event-free-block > .Z-card-list-box:not(.Z-card-list-add)').length>0){
                            layer.msg('规格改变后需要修改所有玩法的规格库存、押金及价格!');
                        }
                    })
            }

        })
    }
//  替换logo
    function changeLogo(_editor_desciption) {
        $('[data-changelogo]').on('click',function () {
            var url='/admin2/event/changelogo',
                briefText=$('[name=brief]').val(),
                changelogo=$(this).attr('data-changelogo'),
                data={type:changelogo,content:briefText};
            if(changelogo==3){
                $('#logo-box').show();
            }else{
                common.ajax('post', url, data, 'json', function (replayData) {
                    _editor_desciption.setContent(replayData.result);
                });
            }
        });
        $('.logo-list-wrap li').on('click',function () {
            var url='/admin2/event/changelogo',
                logoid=$(this).attr('data-id'),
                briefText=$('[name=brief]').val(),
                data={type:3,logo_id:logoid,content:briefText};
            common.ajax('post', url, data, 'json', function (replayData) {
                $('#logo-box').hide();
                _editor_desciption.setContent(replayData.result);
            });

        });
    }


//  验证玩法中规格参数
    function isEditPlayModel() {
        var modelListDom,
            flag=true,
            playList=[],
            modelList=[],
            disabled=$('#formDataAjaxSend').attr('data-disabled');

        if($("[name=no_spec]:checked").val()==0){
            modelListDom=$('#model-list li');
            $('#formDataAjaxSend').find('#add-event-pay-block > .Z-card-list-box:not(.Z-card-list-add)').each(function () {
                playList.push($(this));
            });
            $('#formDataAjaxSend').find('#add-event-free-block > .Z-card-list-box:not(.Z-card-list-add)').each(function () {
                playList.push($(this));
            });
        }else{
            modelListDom=$('#model-list li.no_spec');
            $('#formDataAjaxSend').find('#add-event-pay-block > .Z-card-list-box:not(.Z-card-list-add)').each(function () {
                playList.push($(this));
            });
        }
        modelListDom.find('[type=hidden]').each(function () {
            var modelName=$(this).prop('name');
            modelName=modelName.replace(/model/g,'[model]');
            modelList.push(modelName);
        });
        $(playList).each(function (j,el) {
            var l=$(el).find('[type=hidden]')[0];
            var name=$(l).prop('name');
            var n=name.indexOf(']');
            var meta=name.substr(0,n+1);
            $(modelList).each(function (k,e) {
                if($("[name='"+meta+e+"[buying_num]']").val()==""||$("[name='"+meta+e+"[buying_num]']").length<=0){
                    flag=false;
                    return false;
                }
            })
        });
        return flag;
    }
//   获取字符真实长度
     function getLen(str) {
        if (str == null) return 0;
        if (typeof str != "string"){
            str += "";
        }
        return (str.replace(/[^\x00-\xff]/g,"01").length)/2;
    }

    //表单提交
    function submitEventData(formSelecter) {
        if(!formDataValidata(formSelecter)){
            return;
        }

        var url=$(formSelecter).attr('action');
        var data=$(formSelecter).serialize();
        var tips = layer.msg('数据提交中...');
        common.ajax('post',url,data,'json',function (replayData) {
            var callurl=$(formSelecter).attr('callurl');
            layer.msg(replayData.message||'提交成功');

            //跳转定时发布列表
            if($(formSelecter).find('#online_time').val()!=''){
                var t1=$(formSelecter).find('#online_time').val(),
                    t1=Date.parse(new Date(t1)),
                    t2=Date.parse(new Date());
                if(t1>t2){
                    callurl='/admin2/event/PublishTask';
                }else{
                    callurl='/admin2/event/EventListOnline';
                }
            }
            setTimeout(function () {
                window.location = callurl;
            },3000);
        });
    }

    /**
     * 表单验证
     */
    function formDataValidata(formSelecter) {
        formSelecter = $(formSelecter);

        if(formSelecter.find('#title').val()==''||getLen(formSelecter.find('#title').val())>20){
            console.log(formSelecter.find('#title').val());
            layer.msg('请填写正确的试用名称');
            return false;
        }
        if(formSelecter.find('#Z-image-up-fengmian li').find('[type=hidden]').length<=0){
            layer.msg('请上传封面图片');
            return false;
        }
        if(formSelecter.find('#Z-image-up-box li').find('[type=hidden]').length<=0){
            layer.msg('请上传试用图片');
            return false;
        }
        // if(formSelecter.find('#Z-image-up-banner li').find('[type=hidden]').length!=1){
        //     layer.msg('请正确上传Banner图,且只能为一张图片');
        //     return false;
        // }

        if(formSelecter.find('#intro').val()==''){
            layer.msg('请填写产品简介');
            return false;
        }

        if($("[name=no_spec]:checked").val()==0) {
            if (formSelecter.find('#model-list li').find('[type=hidden]').length <= 0) {
                layer.msg('请填写产品规格');
                return false;
            }
        }

        if(formSelecter.find('#add-event-free-block .Z-card-list-box:not(.Z-card-list-add)').length<=0&&
            formSelecter.find('#add-event-pay-block .Z-card-list-box:not(.Z-card-list-add)').length<=0){
            layer.msg('请添加试用玩法');
            return false;
        }
        if(formSelecter.find('#__addLinkProduct__').find('input[data-goods_id]').val()==''){
            layer.msg('请关联产品');
            return false;
        }
        if(formSelecter.find('#brief').html()==''){
            layer.msg('请填写产品介绍');
            return false;
        }
        if(!isEditPlayModel()){
            layer.msg('玩法中有待修改的规格参数');
            return false;
        }
        return true;
    }

    return{
        randomID:randomID,
        initTime:initTime,
        countText:countText,
        delCard:delCard,
        addHeadline:addHeadline,
        pauseEvent:pauseEvent,
        addLinkEvent:addLinkEvent,
        getProductListLink:getProductListLink,
        addLinkProduct:__addLinkProduct__,
        addModel:addModel,
        submitEventData:submitEventData,
        html_encode:html_encode,
        html_decode:html_decode,
        getLen:getLen,
        changeLogo:changeLogo
    }
});