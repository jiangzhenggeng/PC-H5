<!--左侧菜单-->
<aside class="side-menu" id="side-menu">
    <div class="mask"></div>
    <menu class="menu-inner">
        <ul>
            <li class="on"><i class="icon icon-home"></i><a href="#">首页</a></li>
            <li><i class="icon icon-event"></i><a href="#">试用</a></li>
            <li><i class="icon icon-xinping"></i><a href="#">新品</a></li>
            <li><i class="icon icon-discount"></i><a href="#">折扣</a></li>
            <li><i class="icon icon-list"></i><a href="#">清单</a></li>
            <li><i class="icon icon-experience"></i><a href="#">体验</a></li>
            <li><i class="icon icon-mall"></i><a href="#">商城</a></li>
            <li><i class="icon icon-contact"></i><a href="#">联系</a></li>
        </ul>
    </menu>
</aside>

<script type="text/javascript">
    require(['app/sideMenu'],function (sideMenu) {
        sideMenu.init();
    });
</script>