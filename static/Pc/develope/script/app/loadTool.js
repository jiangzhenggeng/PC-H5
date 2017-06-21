/**
 +----------------------------------------------------------
 //信息加载器
 //消息中心
 +----------------------------------------------------------
 */

define(['require','jquery','app/tplEngine'],function (require,$,tplEngine){

    function loadTool(url,info_box){
        this.loadMore = $('.g-load-more-btn');
        this.is_loading = true;
        this.limit = '';
        this.size = 8;
        this.p  = 0;
        this.url = url;
        this.user_center_comment_list = typeof info_box=='undefined'? $('#user-center-comment-list') : $(info_box);
        //获取模板缓存函数
        this.tpl_box = typeof info_box=='undefined'? $('#user-center-comment-list-tpl') : $(info_box+'-tpl')
        this.func_tpl = tplEngine.init( this.tpl_box.html() );
        var self = this;

        this.loadCommentFunc = function(){
            self.loadMore.addClass('g-loading').html(self.loadMore.attr('loading'));
            //设置不允许加载状态
            self.is_loading = false;
            //'/api/news/GetNew'
            $.get(this.url,{
                limit : self.limit,
                size : self.size,
                p : self.p
            },function(data){
                self.loadMore.removeClass('g-loading').html(self.loadMore.attr('default'));
                if(data.data!=null){
                    self.limit = data.limit;
                    self.p += 1;
                    self.user_center_comment_list.append(self.func_tpl({data:data}));
                    //设置允许加载状态
                    self.is_loading = true;
                    //是否有展开按钮
                    self.user_center_comment_list.find('article:not(.each)').each(function(){
                        //处理是否添加展开按钮
                        if($(this).find('span.jiguo-show-open-flage').length<=0) return;

                        if( $(this).height()>60 && $(this).find('span.jiguo-show-open-flage').position().top>$(this).height() ){
                            $(this).addClass('each');
                            $(this).after('<p class="jiguo-open-btn" data-show-html="隐藏" data-hide-html="展开">展开</p>');
                        }
                    });
                    if(data.data.length<self.size){
                        self.is_loading = false;
                        self.loadMore.html(self.loadMore.attr('no-more')).css('background-image','none').addClass('g-no-data');
                    }
                }else{
                    self.is_loading = false;
                    self.loadMore.html(self.loadMore.attr('no-more')).addClass('g-no-data').css('background-image','none');
                    if(self.p<=0){
                        self.loadMore.html(self.loadMore.attr('no-data')).addClass('g-no-data');
                    }
                }
            },'json');
        };

        if(self.is_loading){
            //加载评论
            self.loadCommentFunc();
        }
        //绑定滚动加载
        self.loadMore.click(function(){
            if(self.is_loading ){
                //加载评论
                self.loadCommentFunc();
            }
        });
    }


    return{
        loadTool:loadTool
    }

});
