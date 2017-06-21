/**
 * Created by jiguo on 17/4/19.
 */
/**
 * Created by wuhongshan on 2017/4/13.
 */
define(['jquery', 'layer', 'template', 'app/common','app/event'], function ($, layer, template, common,event) {
    //        全选
    function chooseBox() {
        $("[data-checkbox]").on('click',function () {
            var id=$(this).attr("data-checkbox");
            _this=$(this).find("input[type=checkbox]")[0];
            if(_this.checked){
                $("#"+id+" :checkbox").prop("checked", true);
            }else{
                $("#"+id+" :checkbox").prop("checked", false);
            }
        });

        $(".checkbox-wrap").on('click','input[type=checkbox]',function () {
            var _checkedList=$(this).closest('.checkbox-wrap');
            var id=_checkedList.attr('id');
            var allCheckboxNum=_checkedList.find('input[type=checkbox]').length;
            var checkedNum=_checkedList.find('input[type=checkbox]:checked').length;
            if(checkedNum == allCheckboxNum){
                $("[data-checkbox="+id+"]").find('input[type=checkbox]').prop("checked",true);
            }else{
                $("[data-checkbox="+id+"]").find('input[type=checkbox]').prop("checked",false);
            }
        });

    }

    //       报名时间、活动时间
    function changeTime() {
        $('#start').on('blur',function () {
            setTime('#start','#deadline','#applyday');
            setTime('#deadline','#end','#eventday');
        });

        $('#deadline').on('blur',function () {
            setTime('#deadline','#end','#eventday');
            setDays('#start','#deadline','#applyday');
        });

        $('#end').on('blur',function () {
            setDays('#deadline','#end','#eventday');
        });

        $('#applyday').on('blur',function () {
            setTime('#start','#deadline','#applyday');
            setTime('#deadline','#end','#eventday');
        });

        $('#eventday').on('blur',function () {
            setTime('#deadline','#end','#eventday');
        });

    }
    //      格式化时间
    function fmt(d){
        var d=d || new Date(),
            year=d.getFullYear(),
            day=d.getDate(),
            month=+d.getMonth()+1,
            hour=d.getHours(),
            minute=d.getMinutes(),
            second=d.getSeconds(),
            f=year+"-"+formate(month)+"-"+formate(day)+" "+formate(hour)+":"+formate(minute)+":"+formate(second);
        return f;
    }

    function formate(d){
        return d>9?d:'0'+d;
    }
    //      设置时间
    function setTime(starttime,endtime,day,def) {
        var et,
            st=$(starttime).val(),
            day=$(day).val(),
            etDom=$(endtime);

        if(day%1>0||isNaN(day)){
            layer.msg('请输入整天数');
            return;
        }
        if(st==''){
            return;
        }
        //兼容safari时间格式
        if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome")==-1) {
            st=st.replace(/-/g, "/");
        }
        day=day || def;
        et=new Date(st);
        et.setDate(et.getDate()+parseInt(day));
        et=fmt(et);
        etDom.val(et);
    }
    //      设置试用天数
    function setDays(starttime,endtime,daysDom) {
        var aDate1,
            aDate2,
            oDate1,
            oDate2,
            iDays,
            sDate1=$(starttime).val(),
            sDate2=$(endtime).val(),
            daysDom=$(daysDom);

            aDate1  =  sDate1.split("-");
            aDate2  =  sDate2.split("-");
            aDate1[2] = aDate1[2].substr(0,2);
            aDate2[2] = aDate2[2].substr(0,2);
            //兼容safari时间格式
            if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome")==-1) {
                oDate1  =  new  Date(aDate1[1]  +  '/'  +  aDate1[2]  +  '/'  +  aDate1[0]);    //转换为12-18-2006格式
                oDate2  =  new  Date(aDate2[1]  +  '/'  +  aDate2[2]  +  '/'  +  aDate2[0]);
            }else{
                oDate1  =  new  Date(aDate1[1]  +  '-'  +  aDate1[2]  +  '-'  +  aDate1[0]);    //转换为12-18-2006格式
                oDate2  =  new  Date(aDate2[1]  +  '-'  +  aDate2[2]  +  '-'  +  aDate2[0]);
            }
            iDays  =  parseInt(Math.abs(oDate2  -  oDate1)  /  1000  /  60  /  60  /24);   //把相差的毫秒数转换为天数
            daysDom.val(iDays);
    };

    //       批量填入原价、库存及折扣价
    function batch() {
        $("#batch").on('click',function () {
            if($(this).hasClass('Z-gray-btn')){
                return;
            }
            var discount=$("#discount").val();
            var inventory=$("#inventory").val();
            var old_price=$("#old-price").val();
            var price;
            if(!(Math.floor(inventory) == inventory)){
                layer.msg('请填入正确的库存');
                return;
            }
            if(!old_price){
                layer.msg('请填入正确的原价');
                return;
            }
            if($("#discount").length>0){
                if(discount<=0||discount>=10){
                    layer.msg('请填入正确的折扣');
                    return;
                }
                price=((old_price*100)*(discount*100)/100000).toFixed(2);
                $(".price").text(price);
                $(".price").find("[type=hidden]").val(price);
            }
            $("[data-editdiscount]").val(inventory);
            $("[data-editoldprice]").val(old_price);
            allInventory();
        });

        $("body").on('keyup',"[data-editdiscount]",function () {
            var inventory=$(this).val();
            if(!(Math.floor(inventory) == inventory)){
                layer.msg('请填入正确的库存');
                return;
            }
            allInventory();
        });

        $("body").on('keyup',"[data-editoldprice]",function () {
            var price,
            old_price=$(this).val(),
            discount=$("#discount").val();
            minPrice();

            if($("#discount").length<=0){
                return;
            }
            price=((old_price*100)*(discount*100)/100000).toFixed(2);
            $(this).parent().prev().text(price);
            $(".price").parent().prev().find("[type=hidden]").val(price);
        });

    }

    //总数量
    function allInventory() {
        var allNum=0;
        $("[data-editdiscount]").each(function () {
            allNum+=parseInt($(this).val());
        });
        $(".allNum").html(allNum);
        $("#buying_num").val(allNum);

        minPrice();
    }
    //最小价格
    function minPrice() {
        var minPrice,
            priceArr=[],
            flag=true;
        $("[data-editoldprice]").each(function () {
            if(isNaN(Number($(this).val()))&&$(this).val()!=''){
                layer.msg('请输入正确的商品原价');
                flag=false;
                return false;
            }
            if($(this).val()==''){
                flag=false;
                return false;
            }
            priceArr.push($(this).val());
        });
        if(!flag){
            return;
        }
        minPrice=Math.min.apply(null,priceArr);
        $("#showprice").val(minPrice);
    }

    function testForm() {
        var flag=false;

        if($("[name=buying_name]").val()==""){
            layer.msg("请填写正确的玩法名称");
            $("[name=buying_name]").trigger('focus');
            return false;
        }

        if(event.getLen($("[name=buying_name]").val())>6){
            layer.msg("玩法名称不超过6个字");
            $("[name=buying_name]").trigger('focus');
            return false;
        }

        if($("[name='[user_group][]']:checked").length<=0){
            layer.msg("请选择用户级别");
            $("[name=user_group]").trigger('focus');
            return false;
        }

        if($("#platform :checked").length<=0){
            layer.msg("请选择参与平台");
            $("#platform input").trigger('focus');
            return false;
        }

        if($("[name=starttime]").val()==""){
            layer.msg("请选择报名开始时间");
            $("[name=starttime]").trigger('focus');
            return false;
        }

        if($("[name=endtime]").val()==""){
            layer.msg("请选择报名截止时间");
            $("[name=endtime]").trigger('focus');
            return;
        }

        if(!($('#type').val()==1 && $('#event-model-list').attr('data-nospec')==1)){
            $("[data-editdiscount]").each(function () {
                if($(this).val()==""){
                    layer.msg("请填写库存数量");
                    $(this).trigger('focus');
                    flag=true;
                    return false;
                }
            });
            if(flag){
                return false;
            }
            $("[data-editoldprice]").each(function () {
                if($(this).val()==""){
                    layer.msg("请填写原价");
                    $(this).trigger('focus');
                    flag=true;
                    return false;
                }
            });

            if(flag){
                return false;
            }
        }
        if($("[name=buying_price]").val()==""){
            layer.msg("请填写押金");
            $("[name=buying_price]").trigger('focus');
            return false;
        }

        if($("[name=quantifier]").val()==""){
            layer.msg("请填写单位");
            $("[name=quantifier]").trigger('focus');
            return false;
        }

        if($("[name=pay_back]").val()==""){
            layer.msg("请填写描述");
            $("[name=pay_back]").trigger('focus');
            return false;
        }

        if($("[name=explain]").val()==""){
            layer.msg("请填写押金说明");
            $("[name=explain]").trigger('focus');
            return false;
        }

        if($("[name=tips]").val()==""){
            layer.msg("请填写试用贴士");
            $("[name=tips]").trigger('focus');
            return false;
        }

        if($("[name=detail]").val()==""){
            layer.msg("请填写活动介绍");
            $("[name=detail]").trigger('focus');
            return false;
        }

        return true;
    }


    return {
        initCheckBox:chooseBox,
        initInventory:allInventory,
        batch:batch,
        testForm:testForm,
        changeTime:changeTime
    }
});