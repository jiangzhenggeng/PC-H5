<link rel="stylesheet" href="<?php echo CDN_MB_ROOT;?>/style/css/index.css">
<!--主体-->
<div class="banner">
    <section class="banner-inner" id="banner-inner">
        <div class="bd">
            <ul class="banner-topic-swipe">
                <?php for($i=0;$i<2;$i++){ ?>
                    <li>
                        <a href="#">
                            <div class="banner-img-box">
                                <span class="event-tag shoufa">首发</span>
                                <?php if($i==0){ ?>
                                    <img src="http://pic.jiguo.com/200717/0/17b2b714-4463-40d7-9c85-cac3c125e999/640x377">
                                <?php }else{?>
                                    <img src="http://pic.jiguo.com/200717/0/17b2b714-4463-40d7-9c85-cac3c125e999/640x377">
                                <?php } ?>

                            </div>
                            <div class="banner-desc">
                                <div class="banner-title">iWatch II 智能表 (体验师专享)</div>
                                <div class="banner-tips">
                                    <span class="ft14 colfff">1333 <font class="ft12 gray">人申请</font></span>
                                    <span class="ft12 gray">免费试用 + 付费试用</span>
                                    <span class="ft12 colfff fr">14天15小时25分 <font class="gray">截止</font></span>
                                </div>
                            </div>
                        </a>
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

<div class="main">
    <div class="mian-content">
        <ul class="mian-stream">

            <li class="large">
                <div class="stream-box">
                    <span class="event-tag xinping">新品</span>
                    <div class="stream-img">
                        <img src="http://s1.jiguo.com/8630e27e-8f65-4fd1-bcc3-fc90ffbf7806/640x400">
                    </div>
                    <div class="stream-bottom">
                        <div class="stream-title ft16 mb5">1万元也要买的Burberry风衣，凭什么吃土...</div>
                        <div class="stream-text gray">
                            <span class="ft12">4分钟前</span>
                            <div class="ft12 praise-replay fr">
                                <span class="ml35 pos-rel"><i class="icon icon-praise"></i>33</span>
                                <span class="ml35 pos-rel"><i class="icon icon-replay"></i>36</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <?php for($i=0;$i<3;$i++){ ?>
            <li>
                <div class="stream-box">
                    <div class="stream-img">
                        <img src="http://s1.jiguo.com/8630e27e-8f65-4fd1-bcc3-fc90ffbf7806/230x230">
                    </div>
                    <div class="stream-right">
                        <div class="stream-title ft16">98％的人都不知道  世界上诞生了 如此漂亮绝无仅有的产品</div>
                        <div class="stream-discount red">
                            <span class="ftb">￥1780</span>
                            <span class="ml10">9.2折</span>
                        </div>
                        <div class="stream-mall gray ft14">
                            <span class="mall">淘宝</span>
                            <span class="time fr">3分钟前</span>
                        </div>
                    </div>
                </div>
            </li>
            <?php } ?>
        </ul>
    </div>
</div>