<!DOCTYPE html>
<html>
<head>
    <meta name="referrer" content="always" />
    <meta charset='utf-8' />
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
    <link rel="apple-touch-icon-precomposed" href=""/>
    <meta name="format-detection" content="telephone=no"/>
    <title><?php if(Yii::app()->controller->id=='index'){ echo '极果-全球酷玩试用导购平台';}else{ echo CHtml::encode($this->pageTitle).'-极果';}?></title>
    <meta name="description" content="<?php echo $this->description;?>"  />
    <meta name="keywords" content="<?php echo $this->keywords;?>"  />
    <link rel="stylesheet" href="<?php echo CDN_MB_ROOT;?>/style/css/base.css">
    <script src="<?php echo CDN_MB_ROOT;?>/script/require.js"></script>
    <script src="<?php echo CDN_MB_ROOT;?>/script/config.js"></script>
    <?php include dirname(__FILE__)."/_url.php"; ?>
</head>
<body>
<?php include dirname(__FILE__).'/_header.php';?>
<div class="main-body"><?php echo $content;?></div>
<?php include dirname(__FILE__).'/_footer.php';?>
<?php include dirname(__FILE__).'/_menu.php';?>
</body>
</html>