/**
 * Created by jiguo on 17/5/11.
 */

define(['jquery','layer','app/common','template','app/event','app/createUE'],function ($,layer,common,template,event,createUE) {

//      是否添加规格
    $("[name=no_spec]").on('click',function () {
        if($("[name=no_spec]:checked").val()==0){
            $("#model-wrap").show();
            $("#model-list .no_spec").remove();
        }else{
            $("#model-wrap").hide();
            $("[data-editmodel]").before('<li class="Z-gray-btn Z-w-150 no_spec">无规格<input type="hidden" name="model[0]" value="无规格"></li>');
        }
    });

//      修改产品型号
    function editModel() {
        var modelItemList={};
        $(".Z-edit-model li:not(.Z-btn)").each(function () {
            var modelName=$(this).find('input').prop("name");
            var modelItem = $(this).text();
            modelItemList[modelName]=modelItem;
        });
        event.addModel(modelItemList);
    }

//      玩法模板选择
    function chooseTpl(edit) {
        $('[data-addEventPlay]').on('click',function () {
            if(edit=='edit'){
                if(!isDisabled()){
                    return;
                }
            }

            if(!isModel()){
                return;
            }
            var url=$(this).attr("data-url");
            var playType=$(this).attr("data-addEventPlay");

            $("#event-tpl-box").show();
            $("#tpl-list").html('');
            if(playType==1){
                $(".title-wrap .Z-name").html("载入免费试用玩法模板：");
            }else{
                $(".title-wrap .Z-name").html("载入折扣试用玩法模板：");
            }

            $("#event-tpl-box .list-wrap").attr({"data-palytype":playType}).attr({"data-url":url});
            common.ajax('post','/admin2/event/SearchTemplate',{type:playType},'json',function (replayData) {
                var tplData=replayData.result;
                var tplHtml='';
                for(var i in tplData){
                    tplHtml+='<li data-tplid="'+tplData[i].id+'">'+tplData[i].name+'</li>';
                }
                $("#tpl-list").html(tplHtml);
            });

        });
    }

//     关闭选择模板
    $(".close-event-tpl-page").on('click',function () {
        $(this).closest(".event-tpl-mask").hide();
    });

//     选择模板
    $(".list-wrap").on('click','li',function () {
        if($(this).attr("data-checked")!=undefined){
            $(this).removeAttr("data-checked");
        }else{
            $(this).attr({"data-checked":""}).siblings().removeAttr("data-checked");
        }
    });

//     新建玩法
    function addTplPlay(edit) {
        $("[data-newplay]").on('click', function () {
            var playType = $(this).closest(".list-wrap").attr("data-palytype");
            var url = $(this).closest(".list-wrap").attr("data-url");
            var title = '';
            url += "?type=" + playType;
            playPage(playType, url);

        });
    }

//     载入模板
    function loadTplPlay(edit) {
        $("[data-tplplay]").on('click',function () {
            var _list=$(this).closest(".list-wrap");
            var playType=_list.attr("data-palytype");
            var url=$(this).closest(".list-wrap").attr("data-url");
            if(_list.find("li[data-checked]").length<=0){
                layer.msg("请选择一个你需要载入的模板");
                return;
            }
            var tplid=_list.find("li[data-checked]").attr("data-tplid");
            url+="?type="+playType+"&id="+tplid;
            if(edit=='edit'){
                playPage(playType,url,edit);
            }else{
                playPage(playType,url,edit);
            }
        });
    }

//      修改玩法
    function editPlayer(edit) {
        $("body").on('click','[data-editcard]',function () {

//          判断是否有型号信息
            if(!isModel()){
                return;
            }

            var title='';
            var playFormData=[];
            var playType=$(this).closest("[data-playtype]").attr("data-playtype");
            var url='/admin2/event/editEventType'+'?type='+playType;
            var playForm=$(this).closest('.Z-card-list-box').find('[type=hidden]');
            var playId=$(this).closest('.Z-card-list-box').attr('data-playitemid');
            var modelItemList=getModelList();
            $(playForm).each(function (i,el) {
                playFormData[i]={};
                var str=$(el).prop('name');
                str = str.match(/meta\[[\w]+\]\[(\S*)\]$/)[1];
                if(str.indexOf('[')>=0){
                    str="["+str+"]";
                }

                playFormData[i].name=str;
                playFormData[i].value=$(el).val();
            });


            if(playType==1){
                title="免费试用玩法设置";
            }else{
                title="折扣试用玩法设置";
            }

            layer.open({
                title: title,
                type: 2,
                move: false,
                scrollbar: false,
                area: ['910px', '600px'],
                content: url,
                success: function (layero, index) {
                    var o = '';
                    var user_group=[];

                    for (var i in modelItemList) {
                        o += "<tr><td>" + modelItemList[i] + "</td><td><input type='text' data-editdiscount name='"+i+"[buying_num]'></td><td class='price'><input type='hidden' name='" + i + "[price]'></td><td><input type='text' data-editoldprice name='" + i + "[old_price]'><input type='hidden'  name='" + i + "[storage_id]'></td></tr>";
                    }
                    var playBody = layer.getChildFrame('body', index);
                    var user_group_dom=playBody.find("[name='[user_group][]']");
                    playBody.find("#event-model-list tbody").html(o);
                    playBody.find("#formDataAjaxSend").attr('data-playid',playId);

//                  把卡片数据遍历到玩法编辑页
                    for(var j in playFormData){
                        var name=playFormData[j].name;
                        var value=playFormData[j].value;

                        if(name=='[user_group][]'){
                            user_group.push(value);
                        }

                        if(name.indexOf('user_group')>=0){
                            continue;
                        }

                        if(edit=='edit'){
                            if(name=="all_user"&&value==0){
                                continue;
                            }
                        }

                        playBody.find("[name='"+name+"']:not('[type=checkbox]')").val(value);
                        playBody.find("[name='"+name+"'][type=checkbox]").prop("checked",true);
                    }
                    user_group_dom.each(function () {
                        for(var k in user_group){
                            if($(this).val()==user_group[k]){
                                $(this).prop("checked",true);
                            }
                        }
                    });

                    if(edit=='edit'){
                        if(playBody.find('#platform [type=checkbox]:checked').length>=4){
                            playBody.find('[name=all_platform]').prop("checked",true);
                        }

                        // 有订单时限制修改型号信息
                        if(!isDisabled()){
                            if($("[name=no_spec]:checked").val()!=1) {
                                playBody.find('.Z-model-box input').attr('readonly', 'readonly').addClass('Z-gray');
                                playBody.find('#batch').addClass('Z-gray-btn');
                            }
                        }
                    }

//                    初始化总库存
                    var allNum=0;
                    playBody.find("[data-editdiscount]").each(function () {
                        allNum+=parseInt($(this).val());
                    });
                    playBody.find(".allNum").html(allNum);
                    playBody.find("#buying_num").val(allNum);
//                    初始化折扣价
                    if(playType==2){
                        playBody.find("[data-editoldprice]").each(function (v,el) {
                            var price;
                            var discount=playBody.find("#discount").val();
                            var old_price=$(el).val();
                            price=((old_price*100)*(discount*100)/100000).toFixed(2);
                            $(this).parent().prev().text(price);
                            $(".price").parent().prev().find("[type=hidden]").val(price);
                        });
                    }
//                  添加无规格标识
                    if($("[name=no_spec]:checked").val()==1){
                        playBody.find("#event-model-list").attr('data-nospec','1');
                    }
                    hidePrice(playBody);

                }
            });
        });
    }

//       判断是否可修改
    function isDisabled() {
        if($('#formDataAjaxSend').attr('data-disabled')=='false'){
            return false;
        }
        return true;
    }

//        判断是否有型号信息
    function isModel() {
        if($("[name=no_spec]:checked").val()==0){
            if($('#model-list li').find('[type=hidden]').length<=0){
                layer.msg("请先添加型号信息");
                return false;
            }
        }
        return true;
    }

    //        获取规格列表
    function getModelList() {
        var modelItemList={};
        var modelListDom;
        if($("[name=no_spec]:checked").val()==0){
            modelListDom=$(".Z-edit-model .Z-gray-btn:not(.Z-btn)");
        }else{
            modelListDom=$(".Z-edit-model .no_spec");
        }
        $(modelListDom).each(function () {
            var modelName=$(this).find('input').prop("name");
            var modelItem = $(this).text();
            modelName=modelName.replace(/model/g,'[model]');
            modelItemList[modelName]=modelItem;
        });
        return modelItemList;
    }

//        添加玩法
    function playPage(playType,url,edit) {
        var title='';
        var modelItemList=getModelList();
        if(playType==1){
            title="免费试用玩法设置";
        }else{
            title="折扣试用玩法设置";
        }
        $(".event-tpl-mask").hide();

        layer.open({
            title: title,
            type: 2,
            move:false,
            scrollbar:false,
            area:['910px','600px'],
            content: url,
            success:function (layero,index) {
                var o='';
                for(var i in modelItemList){
                    o+="<tr><td>"+modelItemList[i]+"</td><td><input type='text' data-editdiscount name='"+i+"[buying_num]'></td><td class='price'><input type='hidden' name='"+i+"[price]'></td><td><input type='text' data-editoldprice name='"+i+"[old_price]'><input type='hidden'  name='" + i + "[storage_id]'></td></td></tr>";
                }

                var playBody=layer.getChildFrame('body', index);
                playBody.find("#event-model-list tbody").html(o);
                if(edit=='edit'){
                    playBody.find("#formDataAjaxSend").attr("data-editplay",'edit');
                }

                if($("[name=no_spec]:checked").val()==1){
                    playBody.find("#event-model-list").attr('data-nospec','1');
                }
                hidePrice(playBody);
            }
        });
    }
//         免费试用隐藏折扣价
    function hidePrice(playBody) {
        var type=playBody.find('#type').val();
        if(type==1){
            playBody.find('.price').text('-');
        }
    }

    return{
        editModel:editModel,
        chooseTpl:chooseTpl,
        addTplPlay:addTplPlay,
        loadTplPlay:loadTplPlay,
        editPlayer:editPlayer,
        isDisabled:isDisabled,
        getModelList:getModelList
    }
});
