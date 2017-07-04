/**
 * Created by wuhongshan on 2017/5/8.
 */
define(['jquery','app/unitTool'], function ($,tool) {
    function weixinPay(isPaying,url,data,orderid) {
        $.get(url,function (replyData) {
            isPaying = false;
            if(replyData.status==0){
                if(replyData.url){
                    window.location = replyData.url;
                }else{
                    __pay(data,orderid);
                }
            }else{
                tool.msg(replyData.message);
            }
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
                        tool.msg('支付成功');
                        window.location.href='http://m.jiguo.com/mb/pay/myorder.html?orderid='+orderid;
                    }
                },'json');
            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                tool.msg('支付取消');
            }else if(res.err_msg == "get_brand_wcpay_request:fail"){
                tool.msg('支付失败');
            }else{
                tool.msg('未知错误');
            }
        }
    );
    }
    function aliPay(isPaying,url) {
        $.get(url,function (replyData) {
            isPaying = false;
            if(replyData.status==0){
                window.location = replyData.url;
            }else{
                tool.msg(replyData.message);
            }
        },'json')


    }

    return {
        weixinPay: weixinPay,
        aliPay: aliPay
    }
})