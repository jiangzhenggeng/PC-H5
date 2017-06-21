
/**
 +----------------------------------------------------------
 //文章显示页
 +----------------------------------------------------------
 */

define([
    'jquery',
    "app/blogAjaxLoad",
    "app/videoAdapt",
    "app/lazyload",
    "app/comment",
    'app/cardAuto'
],function ($,blogAjaxLoad,videoAdapt,lazyload,comment,cardAuto) {
    //视频自适应大小
    videoAdapt.init({
        selecter:'.article-content-show',
        width:640,
    });

    //图片延迟加载模块
    lazyload.init('.article-content-show img');

    //获取关联产品
    blogAjaxLoad.getLinkProduct(blogid);

    //点赞
    blogAjaxLoad.praise({
        trigger:'[data-ajax-praise]',
        data:{
            id_value:blogid,
            status:is_praise,
            type:2,
        },
    });

    //收藏
    blogAjaxLoad.praise({
        trigger:'[data-ajax-collect]',
        tips:'您已收藏',
        data:{
            id_value:blogid,
            status:is_show,
            type:4,
        },
    },'collect');
    //获取点赞用户列表
    blogAjaxLoad.getPariseList(blogid);

    //获取相关文章
    blogAjaxLoad.getRelative({
        id:blogid,
        type:4,
        size:4,
        limit:0
    });

    /**
     * 43.【PC】正文图片截取，当前是截取的图片的上方部分，变更为截取图片的中间部分
     * @type {any}
     */

    // var articleCoverObj = $('.article-cover'),
    //     articleCoverObjImg = articleCoverObj.find('img');
    // articleCoverObjImg.css('marginTop',-(articleCoverObjImg.height()-articleCoverObj.height())/2);


    //卡片
    cardAuto.init();

    //加载评论
    comment.init();
    //初始化发布pingl
    comment.sendComment();
});