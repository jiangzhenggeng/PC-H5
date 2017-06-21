/**
 * Created by wuhongshan on 2017/5/8.
 */
define(['jquery','layer'], function ($,layer) {
    function msg(content,time) {
        return layer.open( {
            skin: 'msg',
            time: time || 2,
            content:content,
        });
    }
    function weixinPay(isPaying,url,data,orderid) {
        if(isPaying) return;
        isPaying=true;
        $.get(url,function (replyData) {
            if(replyData.status==0){
                if(replyData.url){
                    window.location = replyData.url;
                }else{
                    __pay(data,orderid);
                }
            }else{
                msg(replyData.message);
            }
            isPaying = false;
        },'json')
    }
    function __pay(data,orderid) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            data,
        function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                $.get('/api/order/IsSuccess',{
                    orderid:orderid
                },function (replyData) {
                    if(replyData.status==0){
                        msg('支付成功');
                        window.location.href='http://m.jiguo.com/mb/pay/myorder.html?orderid='+orderid;
                    }
                },'json');
            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                msg('支付取消');
            }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                msg('支付失败');
            }else{
                msg('未知错误');
            }
        }
    );
    }
    function aliPay(isPaying,url) {
        if(isPaying) return;
        isPaying=true;
        $.get(url,function (replyData) {
            if(replyData.status==0){
                window.location = replyData.url;
            }else{
                msg(replyData.message);
            }
            isPaying = false;
        },'json')


    }

    return {
        weixinPay: weixinPay,
        aliPay: aliPay
    }
})