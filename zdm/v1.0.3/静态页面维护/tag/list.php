<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" lang="zh-CN" data-cdn-path="http://cdn.jiguo.com/zdm/v1.0.3/">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0"/>
    <title>文章库-极果</title>
    <link rel="stylesheet" type="text/css" href="http://cdn.jiguo.com/zdm/v1.0.3/css/common.css"/>
    <link rel="stylesheet" type="text/css" href="common2.css"/>
    <script type="text/javascript" src="http://cdn.jiguo.com/zdm/v1.0.3/js/jquery-1.12.3.min.js"></script>
    <script type="text/javascript" src="http://cdn.jiguo.com/zdm/v1.0.3/js/jquery.cookie.js"></script>
    <!--所url存放地址模板-->
    <script>
        if (typeof window.URL == 'undefined') {
            window.URL = {};
        }

        //百度编辑器图片上传地址
        window.URL['editorUploadUrl'] = "/protected/extensions/editor/php/controller.php?uid=11&code=c20ad4d76fe97759aa27a0c99bff6710&type=";
        window.FILE_UPLOAD_URL = window.URL['editorUploadUrl'];

        window.URL['cdnRootPath'] = 'http://cdn.jiguo.com/zdm/v1.0.3/';

        window.URL['editorUploadUrlJiGuo'] = '/protected/extensions/editor/php/controller.php?uid=11&code=c20ad4d76fe97759aa27a0c99bff6710&type=jiguo';

        //uploadify相关地址
        window.URL['uploadifyUploadUrl'] = '/protected/extensions/uploadify/uploadify.php?type=jiguo';
        window.URL['uploadifyUploadSwfUrl'] = '/protected/extensions/uploadify/uploadify.swf';
        window.URL['uploadifyUploadLoadImgUrl'] = 'http://cdn.jiguo.com/p1/i/loading-icon.gif';

        //名单审核先关
        //审核通过接口
        window.URL['eventPassPublish'] = '/admin/event/PassPublish';
        //取消接口
        window.URL['eventCancelEvent'] = '/admin/event/CancelEvent';

        //上线或者下线接口
        window.URL['eventUpstart'] = '/admin/event/Upstart';
        //设置头条接口
        window.URL['eventHead'] = '/admin/event/Head';
        window.URL['eventHeadCancel'] = '/admin/event/CancelHead';

        //删除活动接口
        window.URL['eventDelete'] = '/admin/event/Delete';

        //jiguo根据关键词获取产品列表接口
        window.URL['eventGetproduct'] = '/admin/event/getproduct';
        //根据产品id获取详细介绍
        window.URL['eventGetProductDetail'] = '/admin/event/GetProductDetail';
        //载入活动介绍模板
        window.URL['eventGetTpl'] = '/admin/event/GetTpl';
        window.URL['eventetTpl'] = '/admin/event/SetTpl';
        window.URL['eventGetDeposit'] = '/admin/event/GetDeposit';//获取默认押金

        //获取活动相关状态信息
        window.URL['eventEventInfo'] = '/admin/event/EventInfo';

        //订单先关
        window.URL['eventOrderSetRemarks'] = '/admin/event/Remarks';//备注订单
        window.URL['eventOrderGetRemarks'] = '/admin/event/GetRemarks';//获取订单备注
        window.URL['eventOrderCancel'] = '/admin/event/CancelOrder';//取消订单
        window.URL['eventOrderSend'] = '/admin/event/send';//发货接口
        window.URL['eventGetOrderSend'] = '/admin/event/GetSend';//获取发信息接口
        window.URL['eventOrderRetreatDeposit'] = '/admin/event/BackPay';//退换押金

        window.URL['eventOrderGetPerBlogStatus'] = '/admin/event/GetPerBlogStatus';//
        //window.URL['eventOrderGetBlogid'] = '/admin/event/GetBlogid';//

        //报告评级
        window.URL['eventOrderBlogGrad'] = '/admin/event/BlogLevel';//
        window.URL['eventOrderBlogGetGrad'] = '/admin/event/GetBlogLevelStatus';//


    </script>
    <script type="text/javascript" src="http://cdn.jiguo.com/zdm/v1.0.3/js/common.js"></script>
</head>


<body>

<div class="Z-body">
    <!-- 头部 -->
    <div class="Z-header">
        <div class="Z-main">
            <div class="Z-logo-box Z-left">
                <a href="/admin/product/index.html"><img src="http://cdn.jiguo.com/zdm/v1.0.3/images/logo.png"
                                                         width="218" height="36" alt=""/></a>
            </div>
            <div class="Z-drop-down-menu Z-right">

                <a href="/admin/index/logout.html">注销</a>
                <!--
<ul>
    <li class="on"><a href="#">极果管理员</a></li>
    <li><a href="#">极果管理员</a></li>
    <li><a href="#">极果管理员</a></li>
</ul>
-->
            </div>
        </div>
    </div>

    <div class="Z-clear Z-h-20"></div>
    <link rel="stylesheet" type="text/css" href="http://cdn.jiguo.com/zdm/v1.0.3/css/list.css?scscsc"/>
    <!-- 主题部分 -->
    <div class="Z-body-main">
        <div class="Z-main">

            <!-- 左侧菜单 -->
            <!-- 左侧菜单 -->
            <div class="Z-menu Z-left">
                <ul>
                    <li class="product">
                        <a href="javascript:;">产品</a>
                        <dl>
                            <dd><a href="/admin/product/add.html" target="_blank" style="color: #0099ff;">添加产品</a></dd>
                            <dd><a href="/admin/product/index.html">上线产品</a></dd>
                            <dd><a href="/admin/product/complete.html">完善产品</a></dd>
                            <dd><a href="/admin/product/types/type/0.html">折扣文章产品</a></dd>
                            <dd><a href="/admin/product/types/type/1.html">清单文章产品</a></dd>
                            <dd><a href="/admin/product/types/type/2.html">新品文章产品</a></dd>
                            <dd><a href="/admin/product/types/type/3.html">其他文章产品</a></dd>
                            <dd><a href="/admin/product/dao.html">审核导入产品</a></dd>
                            <dd><a href="/admin/product/down.html">未上线产品</a></dd>
                            <dd><a href="/admin/product/waitcheck.html">待审核</a></dd>
                            <dd><a href="/admin/product/waitproduct.html">文章产品待编辑</a></dd>
                            <dd><a href="/admin/product/waitedit.html">待编辑</a></dd>
                        </dl>
                    </li>
                    <li class="artical">
                        <a href="javascript:;">文章管理</a>
                        <dl>
                            <dd><a href="/admin/article/add.html" target="_blank" style="color: #0099ff;">添加文章</a></dd>
                            <dd><a href="/admin/article/toutiao.html">头条列表</a></dd>
                            <dd><a href="/admin/article/index.html">文章列表</a></dd>
                            <dd><a href="/admin/article/inttime.html">定时发布列表</a></dd>
                            <dd><a href="/admin/article/waitcheck.html">文章待审核</a></dd>

                        </dl>
                    </li>
                    <li class="special">
                        <a href="javascript:;">试用管理</a>
                        <dl>
                            <dd><a href="/admin/event/add.html" style="color: #0099ff;">新增活动</a></dd>
                            <dd><a href="/admin/event/index.html">上线活动</a></dd>
                            <dd><a href="/admin/event/down.html">未上线活动</a></dd>
                            <dd><a href="/admin/event/pass.html">通过试用</a></dd>
                            <dd><a href="/admin/event/order.html">全部订单</a></dd>
                        </dl>
                    </li>
                    <li class="qita">
                        <a href="javascript:;">其它</a>
                        <dl>
                            <dd><a href="/admin/comment/list.html">评论管理</a></dd>
                            <dd><a href="/admin/comment/user.html">用户建议</a></dd>
                            <dd><a href="#">客服审核设置</a></dd>
                            <dd><a href="#">用户设置</a></dd>
                            <dd class="on"><a href="?dd">标签管理</a></dd>
                            <dd><a href="/admin/apns/list.html">群发消息</a></dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <script>
                //菜单伸缩处理
                $('.Z-menu').on('click', 'li > a ', function () {
                    var dl = $(this).next('dl');

                    if (dl.css('display') == 'none') {
                        dl.slideDown(180);
                        $.cookie('Zmenu_' + $(this).parent().index(), 'show');
                    } else {
                        dl.slideUp(180);
                        $.cookie('Zmenu_' + $(this).parent().index(), 'hide');
                    }
                }).find('li').each(function () {
                    if ($.cookie('Zmenu_' + $(this).index()) == 'show') {
                        $(this).find('dl').show();
                    }
                }).find('dd.on').each(function () {
                    $.cookie('Zmenu_' + $(this).parent().parent().index(), 'show');
                    $(this).parent().show();
                });
            </script>
            <!-- 有侧内容 -->
            <div class="Z-content Z-right">

                <form id="selectData" action="/admin/article/index.html" method="get">
                    <div class="Z-sub-main">
                        <div class="Z-info">
                            <div class="Z-title">检索</div>
                            <div class="Z-list-info">
                                <div class="Z-row">
                                    <span class="Z-name">标签名称：</span>
                                    <input class="Z-input" value="" name="article[name]"/>
                                </div>
                                <div class="Z-button-group Z-a-right">
                                    <button type="button" id="button" class="Z-btn Z-red Z-setting">查询</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div class="Z-sub-main">
                    <div class="Z-info">
                        <div class="Z-title">
                            <span>标签</span>
                            <button type="button" id="button" class="Z-btn Z-red Z-setting r top10 rel"><i>+</i>新增标签</button>
                        </div>
                        <div class="Z-list-info">
                            <div class="Z-list-info-box">
                                <ul class="Z-list-ul">

                                    <li>
                                        <div class="Z-list-image Z-left">
                                            <img src="http://s1.jiguo.com/a6f22cb5-9b85-463d-a66e-c1d18af681fa/230x230"/>
                                        </div>
                                        <div class="Z-list-desc">
                                            <div class="Z-list-title">
                                                <strong><a target="_blank" href="#">Apple 苹果</a></strong>
                                                <span class="Z-time Z-right">08-02</span>
                                            </div>
                                            <div class="Z-list-brief">
                                                <div class="Z-list-brief-inner">Apple  致力于设计、开发和销售消费电子产品、计算机软件、在线服务和个人计算机，总部位于美国加利福尼亚库比蒂诺。凭借
                                                    iPhone、iPad、Mac、Apple Watch、iOS、OS X、watchOS 等产品推动了全球创新，Apple 凭借 iPhone、iPad、Mac ...</div>
                                            </div>

                                            <div class="Z-list-subscribe">
                                                <p>
                                                    <span>关联产品：<a href="#"><em style="color:#fe5341">暂无产品</em></a></span>
                                                </p>
                                            </div>

                                            <div class="Z-list-subscribe">
                                                <p>
                                                    <a href="/admin/article/edit/id/5947.html" class="blue"
                                                       target="_blank">编辑</a>
                                                    <a href="javascript:void(0)" onclick="deleteProduct('5947')"
                                                       class="blue"><i></i>删除</a>
                                                    <a href="javascript:void(0)" onclick="deleteProduct('5947')"
                                                       class="blue"><i></i>归入</a>

                                                </p>
                                            </div>

                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="Z-page">
                                <ul id="yw0" class="yiiPager">
                                    <li class="first hidden"><a href="/admin/article/index.html">首页</a></li>
                                    <li class="previous hidden"><a href="/admin/article/index.html"><</a></li>
                                    <li class="page selected"><a href="/admin/article/index.html">1</a></li>
                                    <li class="page"><a href="/admin/article/index/page/2.html">2</a></li>
                                    <li class="page"><a href="/admin/article/index/page/3.html">3</a></li>
                                    <li class="page"><a href="/admin/article/index/page/4.html">4</a></li>
                                    <li class="page"><a href="/admin/article/index/page/5.html">5</a></li>
                                    <li class="page"><a href="/admin/article/index/page/6.html">6</a></li>
                                    <li class="page"><a href="/admin/article/index/page/7.html">7</a></li>
                                    <li class="page"><a href="/admin/article/index/page/8.html">8</a></li>
                                    <li class="page"><a href="/admin/article/index/page/9.html">9</a></li>
                                    <li class="page"><a href="/admin/article/index/page/10.html">10</a></li>
                                    <li class="next"><a href="/admin/article/index/page/2.html">></a></li>
                                    <li class="last"><a href="/admin/article/index/page/254.html">末页</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="Z-clear"></div>

        </div>
    </div>

    <script type="text/javascript" src="http://cdn.jiguo.com/zdm/v1.0.3/js/laydate/laydate.js"></script>
    <script src="http://cdn.jiguo.com/zdm/v1.0.3/js/select.js"></script>
    <script>
        /*********************
         日历时间选择器
         *********************/
        setTimeSelect();

        /*********************
         模拟select
         *********************/
        dataZselectBind($('[data-Z-select]'));

        $("#button").click(function () {
            $("#selectData").submit();
        })

        function deleteProduct(id) {
            if (!window.confirm('你确定删除吗？')) return;
            $.post("/admin/article/delete.html", {'id': id}, function (data) {
                new_alert(data.message, 500);
                setTimeout(function () {
                    location.reload()
                }, 500);
            }, "json");
        }

        function cancelProduct(id) {
            if (!window.confirm('你确定取消定时发布吗？')) return;
            $.post("/admin/article/cancel.html", {'id': id}, function (data) {
                new_alert(data.message, 500);
                setTimeout(function () {
                    location.reload()
                }, 500);
            }, "json");
        }

        function upProduct(id, type) {
            if (!window.confirm('你确定上线或下线吗？')) return;
            $.post("/admin/article/up.html", {'id': id, 'type': type}, function (data) {
                new_alert(data.message, 500);
                setTimeout(function () {
                    location.reload()
                }, 500);
            }, "json");
        }

        function upToutiao(id, type) {
            if (!window.confirm('你确定要设置头条或取消头条吗？')) return;
            $.post("/admin/article/Settoutiao.html", {'id': id, 'type': type}, function (data) {
                new_alert(data.message, 500);
                setTimeout(function () {
                    location.reload()
                }, 500);
            }, "json");
        }

    </script>


</div>

</body>
</html>



