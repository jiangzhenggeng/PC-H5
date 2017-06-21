
window.unitTool = {

    isArray:function (a) {
        return Object.prototype.toString.call(a) === '[object Array]';
    },
    isString:function (a) {
        return Object.prototype.toString.call(a) === '[object String]';
    },
    isNumber:function (a) {
        return Object.prototype.toString.call(a) === '[object Number]';
    },
    isFunction:function (a) {
        return Object.prototype.toString.call(a) === '[object Function]';
    },
    isNull:function (a) {
        return Object.prototype.toString.call(a) === '[object Null]';
    },
    isRegExp:function (a) {
        return Object.prototype.toString.call(a) === '[object RegExp]';
    },
    has:function (a,b) {
        if(Object.prototype.toString.call(a)==='[object Array]'){
            for(var i in a){
                if(i==b){
                    return true;
                }
            }
            return false;
        }
        if(Object.prototype.toString.call(a)==='[object Object]'){
            return b in a;
        }
    },
    getLength:function (a) {
        if(this.isArray(a)){
            return a.length;
        }
        var Length = 0;
        for (var item in a) {
            Length++;
        }
        return Length;
    }
};

function _initUploadifyFn(rid,input_name,multiple){
    var i=0;
    var uploadUrl = 'http://zdm.jiguo.com/admin/ajax/RepairUpload';
    $('#'+rid+'-btn').find('input').change(function () {
        var imgNum=$('[data-img-all-number]').html();
        if(multiple&&imgNum>=3){
            layer.msg('最多上传3张图片',{time:1500});
            return;
        }
        var fileLists=$(this)[0].files;
        var html ='<div class="replay-img-item"><div class="close" data-link-img-delete="">×</div><img src="http://cdn.jiguo.com/p1/i/loading-icon.gif" id="img-'+i+'"><input type="hidden" name="'+input_name+'"></div>';
        if(multiple){
            $(this).parent().prev().append(html);
        }else{
            $(this).parent().prev().html(html);
        }

        var data=new FormData;
        data.append('file',fileLists[0]);
        var xhr=new XMLHttpRequest();
        xhr.open('POST',uploadUrl);
        xhr.send(data);
        xhr.onreadystatechange=function(){
            if(4==xhr.readyState){
                if(200==xhr.status){
                    var replyData=JSON.parse(xhr.responseText);
                    if(replyData.resultCode!=0){
                        layer.msg(replyData.errorMsg,{time:1500});
                    }else{
                        var img=$('#img-'+i+'');
                        img.attr('src',replyData.result.url).next().val(replyData.result.fileid);
                        imgNum++;
                        i++;
                        $('[data-img-all-number]').html(imgNum);
                    }
                }
            }
        }
    })
}
$(function () {

    $('body').on('click','[data-replay]',function () {
        var rId = randomID();
        var html = newTplEngine($('#replay-tpl').html(),{data:{
            rId:rId
        }});
        var cid = $(this).attr('data-cid'),
            submit = false,
            replayUrl = $(this).attr('data-url') || '/admin/live/Reply';

        var oId = layer.open({
            title: false,
            btn:['取消','发送'],
            area:['800px','390px'],
            content: html,
            yes:function () {
                layer.closeAll();
            },
            btn2:function () {
                var formDataObj = $('#'+rId+'-form-data');
                if(formDataObj.find('#live-uid').val=='' || formDataObj.find('#live-username').val==''){
                    layer.msg('请选择用户',{time:1000});
                    return false;
                }
                if(formDataObj.find('#live-role').val==''){
                    layer.msg('请填写称谓',{time:1000});
                    return false;
                }
                if(formDataObj.find('#live-add_time').val==''){
                    layer.msg('请设置发布时间',{time:1000});
                    return false;
                }

                if(formDataObj.find('#live-content').val()==''){
                    if(formDataObj.find('[data-img-all-item-warp]>*').length<=0) {
                        if(formDataObj.find('[data-replay-card-warp] .card').length<=0) {
                            layer.msg('请填写回复信息', {time: 1000});
                            return false;
                        }
                    }
                }

                var formData = formDataObj.serialize();
                if(cid){
                    formData += '&cid='+cid;
                }

                if(window.liveId){
                    formData += '&id='+window.liveId;
                }

                if(submit){
                    return false;
                }
                submit = true;

                var _layerId =  layer.msg('数据提交中',{time:999999});
                $.post( replayUrl ,formData,function (replayData) {
                    submit = false;
                    if(replayData.status==0){
                        layer.msg('提交成功',{time:1000},function () {
                            layer.closeAll();
                            window.location.reload();
                        });
                    }else{
                        layer.msg(replayData.message || '系统错误',{time:1000});
                    }
                },'json');
                return false;
            },
            success:function (l,h) {
                $(l).find('.layui-layer-content').css('padding','0');
                _initUploadifyFn(rId,'live[img][]',true);
            }
        });
    });


    $('body').on('click','[data-replay-card-update]',function () {


        var _this = $(this);

        var defaultVal = _this.parent().next().find('input[name=live_link]').val(),
            linkData = {};
        if(defaultVal){
            $.ajax({
                type: "get",
                url: "/admin/live/ChangeJson",
                cache:false,
                async:false,
                dataType: "json",
                data:defaultVal,
                success: function(replayData1){
                    linkData = replayData1.link;
                }
            });
        }
        var rId = randomID();
        var html = newTplEngine($('#replay-card-tpl').html());
        html = html({data:{
            rId:rId,
            link:linkData
        }});

        var oId = layer.open({
            title: '插入卡片',
            btn:['取消','确定'],
            area:['800px','550px'],
            content: html,
            yes:function () {
                layer.close(oId);
            },
            btn2:function (index) {

                var warpAll = $('#'+rId+'-warp-all');

                var _card_type0 = warpAll.find('#_card-type0'),
                    _card_type1 = warpAll.find('#_card-type1'),
                    ismiaosha = warpAll.find('#_card-ismiaosha');

                if(warpAll.find('#_card-url').val()==''){
                    layer.msg('请填写链接地址');
                    warpAll.find('#_card-url').focus();
                    return false;
                }
                if(warpAll.find('#_card-mall').val()==''){
                    layer.msg('请填写来源');
                    warpAll.find('#_card-mall').focus();
                    return false;
                }
                if(_card_type0.prop('checked')) {
                    if (warpAll.find('#_card-price').val() == '') {
                        layer.msg('请填写价格');
                        warpAll.find('#_card-price').focus();
                        return false;
                    }
                }
                if(warpAll.find('#_card-title').val()==''){
                    layer.msg('请填写名称');
                    warpAll.find('#_card-title').focus();
                    return false;
                }

                if( warpAll.find('#_card-tag').find('select').val()=='0'){
                    layer.msg('请选择分类');
                    warpAll.find('#_card-tag').find('select').focus();
                    return false;
                }
                if(ismiaosha.prop('checked')){
                    if(warpAll.find('#_card-starttime').val()==''){
                        layer.msg('请设置开始时间');
                        warpAll.find('#_card-starttime').focus();
                        return false;
                    }
                    // if(warpAll.find('#_card-endtime').val()==''){
                    //     layer.msg('请设置结束时间');
                    //     warpAll.find('#_card-endtime').focus();
                    //     return false;
                    // }
                }
                var img = warpAll.find('#_card-cover .ft0 .replay-img-item input[type=hidden]');
                if(img.length<=0 || img.val()==''){
                    layer.msg('请上传封面');
                    return false;
                }

                var price = parseFloat(warpAll.find('#_card-price').val());
                var start_price = parseFloat(warpAll.find('#_card-start_price').val());
                var docut = start_price?( price / start_price) * 10 :0;

                var tpHtml = newTplEngine($('#add-link-card-tpl').html(),{
                    data:{
                        cover:warpAll.find('#_card-cover').find('input[type=hidden]').val(),
                        title:warpAll.find('#_card-title').val(),
                        price:warpAll.find('#_card-price').val(),
                        docut:docut?docut.toFixed(1):0,
                        mall:warpAll.find('#_card-mall').val(),
                        link_data:$('#'+rId+'-form-data').serialize(),
                    }
                });
                if(_this.attr('y')==1){
                    _this.parent().prev().find('[data-replay-card-update]').show();
                    _this.parent().html(tpHtml);
                }else{
                    _this.parent().next().html(tpHtml);
                }
            },
            success:function (l, k) {
                dataZselectBind($('.Z-select-box'));
                if($(l).find('[data-price-all-query]:checked').length){
                    $(l).find('[data-price-all-query]:checked').trigger('click');
                }

                $(l).find('.layui-layer-content').attr('style','height: '+(550-140)+'px !important;');
                //初始化分类
                $.get('/admin/live/gettag',{
                    id:window.liveId
                },function (replayData) {
                    var htmlOption = '',
                        tagSelect = '';

                    // for (var i in  replayData){
                    //     tagSelect = '';
                    //     if( replayData[i].id == linkData.tag ){
                    //         tagSelect = 'checked';
                    //     }
                    //     htmlOption += '<option '+tagSelect+' value="'+replayData[i].id+'">'+replayData[i].name+'</option>';
                    // }

                    for (var i in  replayData){
                        tagSelect = '';
                        if('tag' in linkData){
                            for(var k = 0; k<linkData.tag.length ; k++ ){
                                if( replayData[i].id == linkData.tag[k] ){
                                    tagSelect = 'checked';
                                }
                            }
                        }
                        htmlOption += '<div class="input-row checkbox" style="min-width:80px;">' +
                            '<label><input '+tagSelect+' class="icon" name="link[tag][]" value="'+replayData[i].id+'" type="checkbox"/>'+replayData[i].name+'</label>' +
                            '</div>';
                    }
                    $('#'+rId+'-cat').append(htmlOption);
                },'json');

                _initUploadifyFn(rId,'link[cover]');
            }
        });
    });

    //弹框点击秒杀
    $('body').on('click','[data-seconds-kill-query]',function () {
        if($(this).prop('checked')){
            $('[data-seconds-kill]').show();
        }else{
            $('[data-seconds-kill]').hide();
        }
    });
    //点击链接类型
    $('body').on('click','[data-price-all-query]',function () {
        if($(this).val()==1){
            $('[data-price-all]').hide();
        }else{
            $('[data-price-all]').show();
        }
    });

    //点击删除卡片按钮
    $('body').on('click','[data-link-card-delete]',function () {
        $(this).parent().parent().html('<div y="1" class="replay-img-item-btn" data-replay-card-update=""></div>')
            .prev().find('[data-replay-card-update]').hide();
    });

    //点击删除图片按钮
    $('body').on('click','[data-link-img-delete]',function () {
        var parents = $(this).parent().parent().parent();
        var length = parents.find('.replay-img-item').length - 1;
        parents.prev().find('[data-img-all-number]').html(length);
        $(this).parent().remove();
    });

    //点击抓取按钮
    $('body').on('click','[data-casperjs-query]',function () {
        var url = $(this).prev().val();
        if(url==''){
            layer.msg('请先填写商品地址',{time:1000});
            return false;
        }
        var formData = $(this).parents('form').eq(0);
        var layerId = layer.msg('正在抓取在',{time:10000000});
        $.get('/admin/casperjs/index',{
            url:url
        },function (replayData) {
            formData.find('#_card-url').val(replayData.data.url);
            formData.find('#_card-mall').val(replayData.data.mall);
            formData.find('#_card-title').val(replayData.data.name);
            formData.find('#_card-price').val(replayData.data.price).trigger('blur');
            formData.find('#_card-start_price').trigger('blur');
            if(replayData.data.pic.length){
                $.get('/admin/ajax/UploadImg',{
                    pic:replayData.data.pic[0]
                },function (replayData) {
                    formData.find('#_card-cover').find('.ft0').html('' +
                        '<div class="replay-img-item">' +
                        '<div class="close" data-link-img-delete>×</div>' +
                        '<img src="http://s1.jiguo.com/' + replayData.data + '/230x230">' +
                        '<input type="hidden" name="link[cover]" value="' + replayData.data + '">' +
                        '</div>');
                },'json');
            }
            layer.close(layerId);
        },'json');
    });


    function allQuery(btn,message,url) {
        var cid = $(this).attr('data-cid');
        var layerId = layer.confirm(message, {
            btn: btn, //按钮
            btn1:function () {
                layer.close(layerId);
            },
            btn2:function(){
                $.get(url,{
                    cid:cid
                },function (replayData) {
                    if(replayData.status==0){
                        layer.msg(replayData.message,function () {
                            window.location.reload();
                        });
                    }else if(typeof replayData.message!='undefined'){
                        layer.msg(replayData.message || '系统错误');
                    }else {
                        layer.msg('系统错误');
                    }
                },'json');
            }
        });
    }

    //评论列表操作
    $('body').on('click','[data-delete]',function () {
        allQuery.apply(this,[['关闭','删除'],'你确定删除吗','/admin/live/Delete']);
    });
    //评论列表操作 --- 上榜
    $('body').on('click','[data-up]',function () {
        allQuery.apply(this,[['关闭','上榜'],'你确定该条评论上榜吗','/admin/live/live']);
    });
    //评论列表操作 --- 置顶
    $('body').on('click','[data-top]',function () {
        allQuery.apply(this,[['关闭','置顶'],'你确定该条评论置顶吗','/admin/live/Top']);
    });

    //评论列表操作 --- 置顶
    $('body').on('click','[data-top-delete]',function () {
        allQuery.apply(this,[['关闭','取消置顶'],'你确定取消置顶吗','/admin/live/CancelTop']);
    });
    //评论列表操作 --- 上榜
    $('body').on('click','[data-up-delete]',function () {
        allQuery.apply(this,[['关闭','取消上榜'],'你确定取消上榜吗','/admin/live/CancelLive']);
    });

    //直播修改
    $('body').on('click','[data-edit]',function () {

        var cid = $(this).attr('data-cid'),
            submit = false,
            replayUrl = $(this).attr('data-url') || '/admin/live/EditPublish';

        $.get('/admin/live/GetPublish',{
            id:cid
        },function (replayData) {
            _edit(replayData);
        },'json');

        function _edit(replayData) {

            var rId = randomID();
            var html = newTplEngine($('#replay-edit-tpl').html(),{data:{
                rId:rId,
                replayData:replayData.data
            }});

            var oId = layer.open({
                title: false,
                btn:['取消','发送'],
                area:['800px','390px'],
                content: html,
                yes:function () {
                    layer.closeAll();
                },
                btn2:function () {
                    var formDataObj = $('#'+rId+'-form-data');
                    if(formDataObj.find('#live-uid').val=='' || formDataObj.find('#live-username').val==''){
                        layer.msg('请选择用户',{time:1000});
                        return false;
                    }
                    if(formDataObj.find('#live-role').val==''){
                        layer.msg('请填写称谓',{time:1000});
                        return false;
                    }
                    if(formDataObj.find('#live-add_time').val==''){
                        layer.msg('请设置发布时间',{time:1000});
                        return false;
                    }

                    if(formDataObj.find('#live-content').val()==''){
                        if(formDataObj.find('[data-img-all-item-warp]>*').length<=0) {
                            if(formDataObj.find('[data-replay-card-warp] .card').length<=0) {
                                layer.msg('请填写回复信息', {time: 1000});
                                return false;
                            }
                        }
                    }

                    var _link_obj_ = formDataObj.find('[name=live_link]'),
                        _live_link_val_ = _link_obj_.val();

                    _link_obj_.val( encodeURIComponent(_live_link_val_));

                    var formData = formDataObj.serialize();

                    _link_obj_.val( _live_link_val_ );

                    if(cid){
                        formData += '&cid='+cid;
                    }

                    if(window.liveId){
                        formData += '&id='+window.liveId;
                    }

                    if(submit){
                        submit = true;
                        return false;
                    }

                    var _layerId =  layer.msg('数据提交中',{time:999999});
                    $.post( replayUrl ,formData,function (replayData) {
                        if(replayData.status==0){
                            layer.msg('提交成功',{time:1000},function () {
                                layer.closeAll();
                                window.location.reload();
                            });
                        }else{
                            layer.msg(replayData.message || '系统错误',{time:1000});
                        }
                        submit = false;
                    },'json');
                    return false;
                },
                success:function (l,h) {
                    if($(l).find('[data-price-all-query]:checked').length){
                        $(l).find('[data-price-all-query]:checked').trigger('click');
                    }
                    $(l).find('.layui-layer-content').css('padding','0');
                    _initUploadifyFn(rId,'live[img][]',true);
                }
            });
        }
    });
});

function changePrice(selecter,_this){
    var num2 = Number($(_this).val()).toFixed(3);
    num2 = num2.toString().substr(0,num2.length-1);
    $(selecter).html('￥'+num2);
    $(_this).val(num2);
}


function changeAuthor(_this,uid){
    var scrollId = randomID();
    var lId = layer.open({
        title: '修改作者',
        scrollbar:false,
        area:['660px','500px'],
        content: '\
            <div class="layer-event-add-user-search">\
                <spa>用户昵称或UID :</spa>\
                <input placeholder="必须填入用户昵称或UID" id="key'+scrollId+'" class="Z-input Z-w-370">\
                <button id="search-btn'+scrollId+'" type="button" class="Z-btn Z-w-110 Z-right">查询</button>\
            </div>\
            <div id="'+scrollId+'" class="layer-event-add-user-list">\
				<ul></ul>\
			</div>',

        success:function (layero, index) {
            var scrollBox = layero.find('#'+scrollId),
                scrollBoxUl = scrollBox.find('ul'),
                is_loading = true,
                p = 0,
                html = '';

            $(layero).on('click','[data-edit-select]',function () {
                $(_this).find('.Z-edit-author-face img').attr('src','http://s1.jiguo.com/avatar'+$(this).attr('data-uid')+'/230x230?time='+(+new Date()));
                $(_this).find('.Z-edit-author-name').html($(this).attr('data-username'));
                $(_this).find('[data-input-author]').val($(this).attr('data-username'));
                $(_this).find('[data-input-uid]').val($(this).attr('data-uid'));
                layer.close(lId);
            });

            window._getQiangzhiData = function (fille) {
                is_loading = false;
                $.get('/admin/ajax/GetUserInfo',{
                    p:p,
                    size:14,
                    username:$('#key'+scrollId).val(),
                    uid:uid
                },function (replayData) {

                    replayData = replayData.data;

                    html = '';
                    for(var i in replayData){
                        html += '\
                                <li>\
                                    <div class="Z-user-face-box">\
                                        <img src="http://s1.jiguo.com/avatar'+replayData[i].uid+'/230x230?_='+(+new Date())+'">\
                                    </div>\
                                    <span class="layer-name">'+replayData[i].username+'</span>';
                        if(replayData[i].pass==1){
                            html += '<a class="layer-query already-add"></a>';
                        }else {
                            html += '<a class="layer-query" data-edit-select data-uid="'+replayData[i].uid+'" data-username="'+replayData[i].username+'"></a>';
                        }

                        html += '</li>';
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

            layero.find('#'+scrollId).scroll(function () {
                if(is_loading && scrollBoxUl.height()<scrollBox.scrollTop()+scrollBox.height()+40){
                    window._getQiangzhiData();
                }else{
                    return;
                }
            });

            $('#key'+scrollId).keypress(function () {
                p=0;
                is_loading = true;
                window._getQiangzhiData(true);
            });

            $('#search-btn'+scrollId).click(function () {
                p=0;
                is_loading = true;
                window._getQiangzhiData(true);
            });

            window._getQiangzhiData();
        }

    });
}

$(function () {
    var countdownDomBox = $('.card-kill:not([data-countdown-runing])');
    countdownDomBox.attr('data-countdown-runing','runing');

    var countdownArray = [];

    var elem,a;

    countdownDomBox.each(function () {
        elem = $(this).find('[data-card-kill-timer]');
        countdownArray.push({
            startTime:elem.attr('data-starttime'),
            endTime:elem.attr('data-endtime'),
            elem:elem,
            elemBox:$(this),
            elemWarp:elem.parent(),
            btn:$(this).find('.card-buy')
        });
        // a = $(this).find('a');
        // a.attr('_href',a.attr('href'));
        // a.attr('href','javascript:;');
        // a = null;
    });


    var timestamp,elemBox,elem,currElem,startTime,endTime,intDiff,
        floor = Math.floor ,hour,minute,second,html,delectIndex=[],
        startMs = 9,millisecond = startMs,btn,a,timer=null,
        timerTag = Math.floor(1000/(startMs+1)),offset,
        windHeight = $(window).height(),scrollTop;

    var tempFunc = function (intDiff) {
        hour = floor(intDiff / (60 * 60) );
        minute = floor(intDiff / 60) - (hour * 60);
        second = intDiff - (hour * 60 * 60) - (minute * 60);

        if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
        if (minute <= 9) minute = '0' + (minute>=0?minute:0);
        if (second <= 9) second = '0' + (second>=0?second:0);

        html  = '<span class="kill-timer-number">'+hour+'</span>时<!--';
        html += '--><span class="kill-timer-number">'+minute+'</span>分<!--';
        html += '--><span class="kill-timer-number">'+second+'</span>秒<!--';
        html += '--><span class="kill-timer-number millisecond">'+millisecond+'</span>';
        return html;
    };

    var globalNow = new Date(),
        globalDate = globalNow.getDate(),
        dateHtml,
        chushiHUa = false;

    var runTimerFunc = function() {

        if(countdownArray.length<=0 && timer){
            clearTimeout(timer);
            return;
        }

        scrollTop = $(window).scrollTop();

        for(var i=0;i<countdownArray.length;i++){

            currElem = countdownArray[i];
            offset = currElem.elemWarp.offset().top;

            if( chushiHUa&&(offset > windHeight + scrollTop || offset<scrollTop) ){
                continue;
            }
            elemBox = currElem.elemBox;
            elem = currElem.elem;
            startTime = currElem.startTime;
            endTime = currElem.endTime;
            btn = currElem.btn;
            timestamp = Math.ceil( Date.parse(new Date()) / 1000 );

            if (startTime <= timestamp && endTime >= timestamp) {
                //秒杀已经开始
                html = tempFunc( (endTime - timestamp) >= 0 ? endTime - timestamp : 0 );
                elem.html( html+'秒杀结束');
                btn.addClass('on');

                // a = elemBox.find('a');
                // a.attr('href',a.attr('_href'));
                // a = null;
            }
            else if (currElem.startTime > timestamp) {
                //秒杀未开始
                var startTimp = new Date( parseInt(startTime) * 1000 );
                var month=startTimp.getMonth() + 1;
                var date=startTimp.getDate();
                hour=startTimp.getHours();
                minute=startTimp.getMinutes();
                second=startTimp.getSeconds();

                if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                if (second <= 9) second = '0' + (second>=0?second:0);


                var now12 = Math.floor( new Date(globalNow.getFullYear()+'/'+(globalNow.getMonth()+1)+'/'+globalNow.getDate()+' '+'23:59:59') / 1000 );

                if( startTime - now12 <=0 ){
                    dateHtml = '今天';
                }else if(startTime - now12 <= 24 * 60 *60 ){
                    dateHtml = '明天';
                }else {
                    dateHtml =  '<span class="kill-timer-number">'+month+'</span>月'+
                        '<span class="kill-timer-number">'+date+'</span>日';
                }
                html = dateHtml+'<span class="kill-timer-number">'+hour+'</span>:' +
                    '<span class="kill-timer-number">'+minute+'</span>';

                elem.html( html+'开始' );
                btn.removeClass('on');
                //delectIndex.push(i);
            }
            else if (currElem.endTime <=0 || !currElem.endTime ) {
                //秒杀已经开始，但没有结束时间
                var startTimp = new Date( parseInt(startTime) * 1000 );
                var month=startTimp.getMonth() + 1;
                var date=startTimp.getDate();
                hour=startTimp.getHours();
                minute=startTimp.getMinutes();
                second=startTimp.getSeconds();

                if (date <= 9)   date = '0' + (date>=0?date:0);
                if (hour <= 9)   hour = '0' + (hour>=0?hour:0);
                if (minute <= 9) minute = '0' + (minute>=0?minute:0);
                if (second <= 9) second = '0' + (second>=0?second:0);

                html =
                    '<span class="kill-timer-number">'+month+'</span>月' +
                    '<span class="kill-timer-number">'+date+'</span>日' +
                    '<span class="kill-timer-number">'+hour+'</span>:' +
                    '<span class="kill-timer-number">'+minute+'</span>';

                elem.html( '秒杀已于'+html+'开始' );
                btn.removeClass('on');
                delectIndex.push(i);
            }
            else if (currElem.endTime < timestamp) {
                //秒杀已经结束
                btn.removeClass('on').html('已结束');
                elem.html('秒杀已结束');
                delectIndex.push(i);
            }
        }
        for(var i=0;i<delectIndex.length;i++){
            countdownArray.splice(delectIndex[i],1);
        }
        chushiHUa = true;
        delectIndex=[];
        millisecond--;
        millisecond = millisecond<0?startMs:millisecond;
        timer = setTimeout(runTimerFunc,timerTag);
    };

    timer = setTimeout(runTimerFunc,timerTag);

});
