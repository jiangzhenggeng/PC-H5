<link rel="stylesheet" href="<?php echo CDN_MB_ROOT;?>/style/css/event.css">
<!--主体-->
<div class="banner">
    <section class="banner-inner" id="banner-inner">
        <div class="bd">
            <ul class="banner-topic-swipe">
                <?php for($i=0;$i<2;$i++){ ?>
                    <li>
                        <div class="banner-img-box">
                            <?php if($i==0){ ?>
                                <img src="http://pic.jiguo.com/200717/0/17b2b714-4463-40d7-9c85-cac3c125e999/640x377">
                            <?php }else{?>
                                <img src="http://pic.jiguo.com/200717/0/17b2b714-4463-40d7-9c85-cac3c125e999/640x377">
                            <?php } ?>
                        </div>
                    </li>
                <?php } ?>
            </ul>
        </div>
        <div class="hd">
            <ul></ul>
        </div>
    </section>
</div>

<script type="text/javascript">
    require(['app/banner'],function (banner) {
        banner.init();
    });
</script>

<div class="main bg-white">
    <div class="mian-event-header tc">
        <div class="event-title ft24">漫步者智能云音响MA5</div>
        <div class="event-time ft14"><span>12天8小时24分 申请截止</span></div>
        <div class="item bd-t mt20 pdt20">
            <ul class="flex-box line-warp">
                <li>
                    <a href="#" class="block">
                        <div class="red ft18 ftb">1277人</div>
                        <div class="gray ft12">申请</div>
                    </a>
                </li>
                <li>
                    <a href="#" class="block">
                        <div class="red ft18 ftb">￥996</div>
                        <div class="gray ft12">市场价</div>
                    </a>
                </li>
                <li>
                    <a href="#" class="block">
                        <div class="red ft18 ftb">5台</div>
                        <div class="gray ft12">数量</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="main bg-white mt10">
    <div class="mian-event-item tl">
        <ul>
            <li>
                <a href="#" class="block ft18">
                    免费试用<font class="ft14">（申请中）</font>
                    <span class="gray ft14 fr">抽取用户</span>
                    <i class="icon icon-right-arrow"></i>
                </a>
            </li>
            <li>
                <a href="#" class="block ft18">
                    7折快速试用<font class="ft14">（剩余3台/20台）</font>
                    <span class="gray ft14 fr">￥199</span>
                    <i class="icon icon-right-arrow"></i>
                </a>
            </li>
            <li class="disabled">
                <a href="#" class="block ft18">
                    5折快速试用<font class="ft14">（已卖完）</font>
                    <span class="gray ft14 fr">￥19</span>
                    <i class="icon icon-right-arrow"></i>
                </a>
            </li>
        </ul>
        <div class="tc">
            <a href="#" class="event-notice bd-b block">
                试用须知<i class="icon icon-right-arrow"></i>
            </a>
        </div>
    </div>
</div>

<div class="main fixed-bar bottom event-bar tc">
    <ul class="flex-box">
        <li><a href="#" class="red">直接购买（￥996）</a></li>
        <li><a href="#" class="bg-red">立即申请</a></li>
    </ul>
</div>