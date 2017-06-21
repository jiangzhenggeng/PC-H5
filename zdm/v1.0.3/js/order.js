/**
 * 取消订单
 * @param orderid
 */
function cancelOrder(orderid){
    var oId = layer.open({
        title: '取消',
        btn:['取消订单'],
        content: '<font class="red">是否取消该订单？</font>',
        yes:function () {
            var time = 1000;
            var win_id = layer.msg('处理中',{time:200000});
            $.get(window.URL['eventOrderCancel'],{
                orderid:orderid
            },function (replayData) {
                layer.closeAll();
                if(replayData.status==0){
                    window.location.reload();
                }else if(typeof replayData.message!='undefined'){
                    layer.msg(replayData.message);
                }else {
                    layer.msg('系统错误');
                }
            },'json');
        }
    });
}

/**
 * 备注订单
 * @param orderid
 */
function noteOrder(orderid){

    $.get(window.URL['eventOrderGetRemarks'],{
        orderid:orderid
    },function (replayData) {
        _setRemarks(replayData.data);
    },'json');

    function _setRemarks(remarks) {
        var oId = layer.open({
            title: '备注',
            btn:['确定'],
            content: '<div class="event-order-note-warp"><textarea placeholder="说点什么">'+remarks+'</textarea></div>',
            yes:function (index, layero) {
                var time = 1000;
                var note = layero.find('.event-order-note-warp textarea').val();
                if(note==''){
                    layer.msg('请填写备注',{time:time});
                    return;
                }
                var win_id = layer.msg('处理中',{time:200000});

                $.get(window.URL['eventOrderSetRemarks'],{
                    orderid:orderid,
                    remarks:note
                },function (replayData) {
                    layer.close(win_id);
                    if(replayData.status==0){
                        layer.closeAll();
                        window.location.reload();
                    }else if(typeof replayData.message!='undefined'){
                        layer.msg(replayData.message);
                    }else {
                        layer.msg('系统错误');
                    }
                },'json');
            }
        });
    }
}

function sendOrder(orderid) {
    $.get(window.URL['eventGetOrderSend'],{
        orderid:orderid
    },function (replayData) {
        _sendOrder(orderid,replayData.data);
    },'json');
}
/**
 * 发货
 * @param orderid
 */
function _sendOrder(orderid,hasData) {
    if(!hasData.length) hasData = {
        isjiguo:1,
        ecompany:'',
        eorderid:''
    };

    layer.open({
        title: '发货',
        area:['465px'],
        btn:['确定'],
        content: '\
            <div class="event-order-send-warp">\
				<div class="event-order-send-type radiobox">\
                    <label><input '+(hasData.isjiguo==0?'checked':'')+' value="0" type="radio" class="icon" name="send_type">厂商发货</label>\
                    <label><input '+(hasData.isjiguo==1?'checked':'')+' value="1" type="radio" class="icon" name="send_type">我们发货</label>\
				</div>\
				<div class="event-order-send-company">\
                    <div class="Z-row">\
                        <span class="Z-name">快递公司：</span>\
                        <input value="'+hasData.ecompany+'" name="send_company" class="Z-input Z-w-327">\
                    </div>\
                    <div class="Z-row">\
                        <span class="Z-name">单号：</span>\
                        <input value="'+hasData.eorderid+'" name="send_eorderid" class="Z-input Z-w-327">\
                    </div>\
				</div>\
			</div>',
        yes:function (index, layero) {
            var time = 1000;
            var sendWarp = layero.find('.event-order-send-warp');
            var
                send_type = sendWarp.find('[name=send_type]:checked').val(),
                send_company = sendWarp.find('[name=send_company]').val(),
                send_eorderid = sendWarp.find('[name=send_eorderid]').val();

            if(send_type==''){
                layer.msg('请选择发货机构');
                return;
            }
            if(send_company==''){
                layer.msg('请填写快递公司');
                return;
            }
            if(send_eorderid==''){
                layer.msg('请填写单号');
                return;
            }
            var win_id = layer.msg('处理中',{time:200000});

            $.get(window.URL['eventOrderSend'],{
                orderid:orderid,
                isjiguo:send_type,
                ecompany:send_company,
                eorderid:send_eorderid,
            },function (replayData) {
                layer.close(win_id);
                if(replayData.status==0){
                    layer.msg(replayData.message);
                    window.location.reload();
                }else if(typeof replayData.message!='undefined'){
                    layer.msg(replayData.message);
                }else {
                    layer.msg('系统错误');
                }
            },'json');
        }
    });
}

/**
 * 报告评级
 * @param orderid
 */
function applyGard(orderid){
    var win_id = layer.msg('数据获取中',{time:999999});
    $.get(window.URL['eventOrderBlogGetGrad'],{
        orderid:orderid
    },function (replayData) {
        layer.close(win_id);
        __applyGard(orderid,replayData.data);
    },'json');
}
function __applyGard(orderid,gardData){
    var id = 'id'+randomID();
    gardData = {
        describe:gardData.describe || '',
        displayorder:gardData.displayorder || '0',
        isgift:gardData.isgift || '1',
        status:gardData.status || '0',
        toutiao:gardData.toutiao || '0'
    };
    layer.open({
        title: '报告评级',
        btn:['确定'],

        content: '\
            <form id="form'+id+'">\
                <input type="hidden" name="order[orderid]" value="'+orderid+'">\
                <div class="gard radiobox" id="'+id+'">\
                    <label><input type="radio" name="order[displayorder]" class="icon" value="1" '+(gardData.displayorder==1?'checked':'')+' data-isgift data-sahngxian>普通</label>\
                    <label><input type="radio" name="order[displayorder]" class="icon" value="5" '+(gardData.displayorder==5?'checked':'')+' data-isgift data-sahngxian data-toutu>优秀</label>\
                    <label><input type="radio" name="order[displayorder]" class="icon" value="-3" '+(gardData.displayorder==-3?'checked':'')+'>需修改</label>\
                    <!--<label><input type="radio" name="order[displayorder]" class="icon" value="0" '+(gardData.displayorder==0?'checked':'')+'>未评级</label>-->\
                </div>\
                <div class="gift radiobox" id="isgift'+id+'" style="display: none">\
                    <label><input type="radio" name="order[isgift]" class="icon" value="0" '+(gardData.isgift==0?'checked':'')+'>没有回报</label>\
                    <label><input type="radio" name="order[isgift]" class="icon" value="1" '+(gardData.isgift==1?'checked':'')+'>赠予产品</label>\
                    <label><input type="radio" name="order[isgift]" class="icon" value="2" '+(gardData.isgift==2?'checked':'')+'>其他奖励</label>\
                </div>\
                <div class="proposal">\
                    <textarea placeholder="需要修改的建议是..." name="order[describe]">'+gardData.describe+'</textarea>\
                </div>\
                <div class="radiobox" id="shangxian'+id+'" style="display: block;margin:15px 0;">\
                    上线： <label><input type="radio" name="order[status]" class="icon" value="1" '+(gardData.status==1?'checked':'')+'>是</label>\
                    <label><input type="radio" name="order[status]" class="icon" value="0" '+(gardData.status==0?'checked':'')+'>否</label>\
                </div>\
                <div class="radiobox" id="toutu'+id+'">\
                    头图： <label><input type="radio" name="order[toutiao]" class="icon" value="1" '+(gardData.toutiao==1?'checked':'')+'>是</label>\
                    <label><input type="radio" name="order[toutiao]" class="icon" value="0" '+(gardData.toutiao==0?'checked':'')+'>否</label>\
                </div>\
			</form>',
        success:function (layero, index) {
            $(layero).find('#'+id).find('input[type=radio][data-isgift]').click(function () {
                $('#isgift'+id).show();
            }).end().find('input[type=radio]:not([data-isgift])').click(function () {
                $('#isgift'+id).hide();
            }).end().find('input[type=radio][data-sahngxian]').click(function () {
                $('#shangxian'+id).show();
            }).end().find('input[type=radio]:not([data-sahngxian])').click(function () {
                $('#shangxian'+id).hide();
            }).end().find('input[type=radio][data-toutu]').click(function () {
                $('#toutu'+id).show();
            }).end().find('input[type=radio]:not([data-toutu])').click(function () {
                $('#toutu'+id).hide();
            });

            $(layero).find('#'+id).find('input[type=radio]:checked').trigger('click');
        }
        ,yes:function (index, layero) {
            var flag=$('[name="order[displayorder]"]').is(':checked');
            if(!flag){
                layer.msg('请选择报告等级',{time:2000});
                return;
            }
            var data = $(layero).find('form').serialize();
            var id = layer.msg('处理中',{time:999999});
            $.ajax({
                url:window.URL['eventOrderBlogGrad'],
                data:data,
                type:'GET',
                dataType:'json',
                success:function (replayData,status) {
                    if (replayData.status == 0){
                        layer.msg('评级成功', function () {
                            layer.closeAll();
                            window.location.reload();
                        });
                    }else{
                        layer.msg(replayData.message);
                    }
                },
                complete:function (xhr,status) {
                    layer.close(id);
                    if(status=='timeout'){
                        layer.msg('网络超时');
                    }
                }
            });
        }
    });
}


/**
 * 获取报告的状态
 * @param selecter
 */
function getEventOrderStatus(selecter,tplBox) {

    function __getData(elem) {
        $.get(window.URL['eventOrderGetPerBlogStatus'],{
            orderid:elem.attr('data-orderid'),
            eventid:elem.attr('data-eventid'),
            uid:elem.attr('data-uid')
        },function (replayData) {
            elem.find('[data-order-list-warp]').html(tplFnCache({data:replayData.data}));
        },'json');
    }
    var tplFnCache = newTplEngine($(tplBox).html());
    $(selecter).find('[data-order-list]').each(function (elem,index) {
        __getData($(this));
    });
}

/**
 * 根据订单id获取报告地址
 * @param orderid
 */
// function viewBlog(orderid) {
//     //layer.msg('页面打开中',{time:9999999});
//     $.get(window.URL['eventOrderGetBlogid'],{
//         orderid:orderid
//     },function (replayData) {
//         layer.closeAll();
//         if(replayData.data==0){
//             layer.msg('没有报告',{time:1000});
//             return;
//         }
//         var id = randomID();
//         $('body').append('<a target="_blank" id="'+id+'" href="http://www.jiguo.com/article/index/'+replayData.data+'.html?jguo=zhidx"></a>');
//         $('#'+id).get(0).click();
//     },'json');
// }


/**
 * 退还押金
 * @param orderid
 */
function retreatDeposit(orderid){
    var oId = layer.open({
        title: '退还押金',
        btn:['是','否'],
        content: '<font class="red">是否退还押金状态？</font>',
        yes:function () {
            var time = 1000;
            var win_id = layer.msg('处理中',{time:200000});
            $.get(window.URL['eventOrderRetreatDeposit'],{
                orderid:orderid
            },function (replayData) {
                layer.closeAll();
                if(replayData.status==0){
                    layer.msg(replayData.message,{
                        end:function () {
                            window.location.reload();
                        }
                    });
                }else if(typeof replayData.message!='undefined'){
                    layer.msg(replayData.message);
                }else {
                    layer.msg('系统错误');
                }
            },'json');
        }
    });
}