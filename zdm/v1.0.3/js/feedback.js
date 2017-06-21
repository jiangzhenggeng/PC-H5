$(function () {
    $('body').on('click','[data-replay]',function () {
        var _replay_box = $(this).closest('li').find('.show-comment-box');
        if( _replay_box.css('display')=='none'){
            _replay_box.show();
            $(this).html('收起');
        }else{
            _replay_box.hide();
            $(this).html('回复');
        }
    }).on('click','[data-replay-btn]',function () {
        var _replay_content = $(this).closest('.Z-comment-view-cell').find('.comment-area').val().replace(/^\s+|\s+$/g,'');
        if( _replay_content=='' ){
            layer.msg('请填写回复内容');
            return;
        }
        var _this = $(this);

        $.post('/admin/comment/replayContent',{
            content:_replay_content,
            id:$(this).attr('data-replay-btn')
        },function (repalyDate) {
            if(repalyDate.status==0){
                _this.closest('.show-comment-box').hide();
                layer.msg('回复成功',{time:1000},function () {
                    window.location.reload();
                });
            }else{
                layer.msg(repalyDate.message || '回复失败');
            }
        },'json');
    }).on('click','[data-checked]',function () {
        var id = $(this).attr('data-checked');
        layer.alert('你确定标记为完成吗',{
            btn:['标记','关闭'],
            btn1:function () {
                $.post('/admin/comment/replayChecked',{
                    id:id
                },function (repalyDate) {
                    if(repalyDate.status==0){
                        layer.msg('标记成功',{time:1000},function () {
                            window.location.reload();
                        });
                    }else{
                        layer.msg(repalyDate.message || '回复失败');
                    }
                },'json');
            }
        });
    });
});


function openUrl(url,title) {
    parent.layer.open({
        type: 2,
        title: title || '反馈详情',
        shadeClose: true,
        area: ['800px','500px'],
        content: url
    });
}