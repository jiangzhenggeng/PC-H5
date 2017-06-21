function _initUploadifyFn(rId,number,_name,multi,over) {
    number = number || 3;
    initUploadifyFn('#'+rId,rId,rId+'-btn',null,{
        'onUploadSuccess': function (obj,data,respone) {
            data = $.parseJSON(data);
            var html = '\
                            <div class="replay-img-item">\
                                <div class="close" data-link-img-delete>&times;</div>';
            if(number>1){
                html +='<img  onclick="if(parent.photosView)parent.photosView.call(this)" src="'+data.url.replace('/640','/230x230')+'">';
            }else{
                html +='<img src="'+data.url.replace('/640','/230x230')+'">';
            }
            html +='<input type="hidden" name="'+(_name || 'live[img][]')+'" value="'+data.url+'"></div>';

            $('#'+obj.id).remove();
            var queueID = $('#'+this.settings.queueID);
            if(queueID.find('>*').length<number || over){
                if(over){
                    queueID.html(html);
                }else{
                    queueID.append(html);
                }
                $('#'+rId+'-number').html( queueID.find('>*').length );
            }else{
                layer.msg('最多上传'+number+'张图片',{time:1500});
            }
        },
        itemTemplate:'\
                            <div id="${fileID}" class="replay-img-item">\
                                <img src="'+window.URL['uploadifyUploadLoadImgUrl']+'">\
                            </div>',
        multi:multi || true,
        uploadType:'zdm',
        uploadUrl:window.URL['uploadifyUploadUrlZdm'],
        height:64,
        width:64
    });
}


function commentManage(url) {
    var layerCommentBoxId = layer.open({
        type: 2,
        title: '评论管理',
        shadeClose: true,
        shade: 0.8,
        area: ['1200px', '95%'],
        content: url,
        end:function () {
            $.cookie('layerCommentBoxId',null);
        }
    });
    $.cookie('layerCommentBoxId',layerCommentBoxId,{
        path:'/'
    });
}

/**
 * 编辑评论
 */
function commentManageEdit(url) {
    var id = parent.layer.open({
        type: 2,
        title: '编辑评论',
        shadeClose: true,
        shade: 0.8,
        area: ['500px', '500px'],
        content: url
    });
    parent.layer.editWindowId = id;
}

/**
 * 五角心评分
 */
function wujiaoxing() {
    var wwScroce = $('#ww-scroce'),
        ww = $('.ww');

    ww.on('click',function (e) {
        var jc = e.pageX - $(this).offset().left;
        var kc = jc % 20;
        var gc = Math.ceil( jc / 20 );
        if( kc <=10 ){
            gc = gc<=0?0:--gc;
        }
        $(this).find('.w3').width( gc * 20 );
        $('#'+$(this).attr('data-show')).html( gc );
        $('#'+$(this).attr('data-input')).val(gc)
    });
}


/**
 * 删除评论
 * @param url
 * @param selector
 */
function commentManageDelete(url,selector,message) {
    commentManageDelete.isRun = false;

    var id = parent.layer.confirm( message || '确定删除该条评论吗？', {
        btn: ['确定','关闭'] //按钮
    }, function(){
        parent.layer.close(id);

        var win_id = new_alert('处理中',200000),
            time = 1000;
        if(commentManageDelete.isRun){
            new_alert('正在处理中...',2000);
            return;
        }
        commentManageDelete.isRun = true;

        var timer = setTimeout(function () {
            commentManageDelete.isRun = false;
        },20000);

        $.get(url,function (replayData) {
            commentManageDelete.isRun = false;
            if(timer) clearTimeout(timer);

            new_alert.close(win_id);
            if(replayData.status==0){
                new_alert(replayData.message,time);
                if(window.location){
                    window.location.reload();
                }
            }else if(typeof replayData.message!='undefined'){
                new_alert(replayData.message || '系统错误',time);
            }else {
                new_alert('系统错误',time);
            }
        },'json');
    });
}



/**
 * 抓取评论
 * @param url
 */
function captureComment(url) {
    var id = parent.layer.msg('正在抓取中......请稍后', {
        time: 20*1000
    });
    var timer = setTimeout(function () {
        parent.layer.close(id);
        parent.layer.msg('请再试一次', {
            time: 1600
        },function () {
            window.location.reload();
        });
    },10000);

    $.get(url,function (replayData) {
        parent.layer.close(id);
        if(timer){
            clearTimeout(timer);
        }
        if(replayData.status==0){
            parent.layer.msg( replayData.message  || '抓取成功', {
                time: 1200
            },function () {
                window.location.reload();
            });
        }else{
            parent.layer.msg(replayData.message  || '抓取失败', {time: 1200});
        }
    },'json');
}



/**
 * 精选
 * @param url
 * @param selector
 */
function commentManageHandpick(url,selector) {
    commentManageDelete(url,selector,'<font color="red">上精选后不可下线</font>，你确定上精选吗?');
}

/**
 * 上线
 * @param url
 * @param selector
 */
function commentManageUp(url,selector) {
    commentManageDelete(url,selector,'<font color="red">上线后不可下线</font>，你确定上线吗?');
}


/**
 +----------------------------------------------------------
 * 全选事件
 +----------------------------------------------------------
 */
function selectcheckbox(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.name != 'chkall' && e.disabled != true) e.checked = form.chkall.checked;
    }
}


function commentBatch(form) {

    if(commentManageDelete.isRun){
        new_alert('正在处理中...',2000);
        return;
    }
    var checkNum = 0;
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.name != 'chkall' && e.disabled != true){
            if( e.name != 'chkall' && e.checked ){
                checkNum++;
            }
        }
    }
    if(checkNum<=0){
        parent.layer.msg( '请先选择数据条目');
        return false;
    }
    return {data:$(form).serialize(),num:checkNum}
}

/**
 * 批量上线
 * @param url
 * @param selector
 */
function commentBatchUp(url,form) {
    form = $(listViewForm).get(0);
    var data = commentBatch(form);
    if(data.num>0){
        url += '?'+data.data;
        commentManageDelete(url,form,'<font color="red">批量上线后不可下线('+data.num+')条数据</font>，你确定操作吗?');
    }
}

/**
 * 批量精选
 * @param url
 * @param selector
 */
function commentBatchFeatured(url,form) {
    form = $(listViewForm).get(0);
    var data = commentBatch(form);
    if(data.num>0){
        url += '?'+data.data;
        commentManageDelete(url,form,'<font color="red">批量上精选后不可下线('+data.num+')条数据</font>，你确定操作吗?');
    }
}


/**
 * 批量删除
 * @param url
 * @param selector
 */
function commentBatchDelete(url,form) {
    form = $(listViewForm).get(0);
    var data = commentBatch(form);
    if(data.num>0){
        url += '?'+data.data;
        commentManageDelete(url,form,'<font color="red">批量删除后不可恢复('+data.num+')条数据</font>，你确定操作吗?');
    }
}




$(function () {
    $('body').on('click','[data-link-img-delete]',function () {
        $(this).closest('.replay-img-item').remove();
    });
    var selectedNumber = $('#selected-number');
    if(selectedNumber.length){
        var listViewForm = $('#listViewForm');
        listViewForm.on('click','input[type=checkbox]',function () {
            var checkNum = 0,
                listViewFormEle = listViewForm.get(0);
            for (var i = 0; i < listViewFormEle.elements.length; i++) {
                var e = listViewFormEle.elements[i];
                if (e.name != 'chkall' && e.disabled != true){
                    if( e.name != 'chkall' && e.checked ){
                        checkNum++;
                    }
                }
            }
            selectedNumber.html( checkNum );
        });
    }
});

/**
 * 编辑评论
 */
function editCommentPage() {
    //评分
    wujiaoxing();
    //头像
    _initUploadifyFn('product-comment',20,'comment[pic][]');
    //评论图片
    _initUploadifyFn('user-comment',1,'comment[avatar]',false,true);

    var formData = $('#formData'),
        isSubmit = false;

    $('#submitFormData').click(function () {
        if(!_v(formData)){
            return;
        }
        if(isSubmit){
            return;
        }
        isSubmit = true;

        var _tips_id_ = parent.layer.msg('数据提交中......请稍后',{
            time:99999999
        });

        var timer = setTimeout(function () {
            isSubmit = false;
            parent.layer.close(_tips_id_);
        },10000);

        var data = formData.serialize();
        $.get(formData.attr('action'),data,function (replayData) {
            isSubmit = false;
            if(timer)clearTimeout(timer);

            parent.layer.close(_tips_id_);

            if(replayData.status==0){
                parent.layer.msg(replayData.message || '保存成功',{
                    time:1200
                },function () {
                    var pId = $.cookie('layerCommentBoxId') ;
                    if( pId ){
                        var layerIframe = $('#layui-layer-iframe'+pId,parent.document ).get(0),
                            layerIframeDom = layerIframe.contentDocument || layerIframe.contentWindow.document;
                        layerIframeDom.location.reload();
                    }
                    if( parent.layer.editWindowId ){
                        parent.layer.close(parent.layer.editWindowId);
                    }
                });
            }else{
                parent.layer.msg(replayData.message || '系统错误',function () {
                    if( parent.layer.editWindowId ){
                        parent.layer.close(parent.layer.editWindowId);
                    }
                });
            }

        },'json');
    });

    function _v(form) {
        if( form.find('#username').val()=='' ){
            parent.layer.msg('请填写用户名');
            return false;
        }
        if( form.find('#user-comment > *').length<=0 ){
            parent.layer.msg('请填上传头像');
            return false;
        }
        if( form.find('#content').val()=='' ){
            parent.layer.msg('请填评论');
            return false;
        }
        return true;
    }
}

function photosView() {
    var src = $(this).attr('src');
    layer.photos({
        photos:{
            'title':$(this).attr('title'),
            'data': [{
                'alt':$(this).attr('alt'),
                'src':src
            }]
        },
        shift:0
    });
}
