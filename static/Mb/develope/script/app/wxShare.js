/**
 * Created by wuhongshan on 2017/6/29.
 */
define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js','jquery'], function (wx,$) {

    function wx_share(options) {
        var options=$.extend({
            timestamp:'',
            nonceStr:'',
            signature:'',
            timelineTitle:'',
            timelineLink:'',
            timelineImg:'',
            appMessageTitle:'',
            appMessageLink:'',
            appMessageImg:'',
            appMessageDesc:''
        },options);
        this.options=options;
        // alert(this.options.timelineImg);
        // alert(this.options.appMessageDesc);


    }
    wx_share.prototype.init=function () {
        var self=this;
        if (typeof wx != 'undefined') {
            wx.config({
                debug: false,
                appId: 'wxa9c93fe1124784ec',
                timestamp: self.options.timestamp,
                nonceStr: self.options.nonceStr,
                signature: self.options.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            });
            wx.ready(function () {
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    imgUrl: self.options.timelineImg, // 分享图标
                    title: self.options.timelineTitle, // 分享标题
                    link: self.options.timelineLink, // 分享链接
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                //分享给朋友
                wx.onMenuShareAppMessage({
                    title: self.options.appMessageTitle, // 分享标题
                    desc: self.options.appMessageDesc, // 分享描述
                    link: self.options.appMessageLink, // 分享链接
                    imgUrl: self.options.appMessageImg, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

            });

            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                console.log(res);
            });
        }
    };
    return {
        wx_share: wx_share
    }
})