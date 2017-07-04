/**
 +----------------------------------------------------------
 //文章页跳转app
 +----------------------------------------------------------
 */

define(['jquery'],function ($){
    function isWeixinBrowser() {
        return (navigator.userAgent.match(/MicroMessenger/i) == 'MicroMessenger') ? true : false;
    }

    function isQQBrowser() {
        return (navigator.userAgent.match(/QQ/i) == "QQ") ? true : false;
    }

    function isAndroid() {
        return (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) ? true : false;
    }

    function gt_ios9() {
        var agent = navigator.userAgent.toLowerCase();
        var version;
        if (agent.indexOf("like mac os x") > 0) {
            //ios
            var regStr_saf = /os [\d._]*/gi;
            var verinfo = agent.match(regStr_saf);
            version = (verinfo + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, ".");
        }

        var version_str = version + "";
        if (version_str != "undefined" && version_str.length > 0) {
            version = version.substring(0, 2);
            if (version >= 9)
                return true;
        }
        return false;
    }

    function _init() {
        $('body').on('click', '[data-goApp]', function (e) {
            var link = $(this).attr('href');
            var info = /applink\/(\w+\?id\=\d+)/.exec(link)[1];
            var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiguo.net';

            if (!gt_ios9()) {
                e.preventDefault();
                if (isWeixinBrowser()) {
                    //生成遮罩
                    $('#goBrowser').removeClass('none');
                    $('.cancle img').on('click', function () {
                        $('#goBrowser').addClass('none');
                    });
                }else if(isQQBrowser()){
                    if(isAndroid){
                        // alert(info);
                        info=encodeURIComponent('jiguo://'+info);
                        var ifr = document.createElement('iframe');
                        ifr.src = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiguo.net&android_scheme="'+info+'"';
                        ifr.style.display = 'none';
                        document.body.appendChild(ifr);
                        window.setTimeout(function () {
                            document.body.removeChild(ifr);
                            window.location = downloadUrl;
                        }, 1200);
                    }else{
                        //生成遮罩
                        $('#goBrowser').removeClass('none');
                        $('.cancle img').on('click', function () {
                            $('#goBrowser').addClass('none');
                        });
                    }
                } else {
                    var ifr = document.createElement('iframe');
                    ifr.src = 'jiguo://' + info + '';
                    ifr.style.display = 'none';
                    document.body.appendChild(ifr);
                    window.setTimeout(function () {
                        document.body.removeChild(ifr);
                        window.location = downloadUrl;
                    }, 1200);
                }

            }else{
            }
        });
    }

    return {
        init:_init
    };

});
