
(function () {

    function _tagClass() {}

    _tagClass.prototype = {

        addTag:function (insertData,url,title) {
            insertData = $.extend({
                cover:'',
                desc:'',
                name:''
            },insertData);

            var tpl = $('#add-tag-tpl').html(),
                _this = this,
                _is_submit = false;

            var w_id = layer.open({
                title: (title || '新增')+'品牌',
                btn:[ title || '添加'],
                scrollbar:false,
                area:['610px','480px'],
                content: newTplEngine(tpl,insertData),
                success:function (layero, index) {
                    _this.initUploadifyFn();
                    $('#tag-logo').click(function () {
                        $('#hideUploadInputFile').trigger('click');
                    });
                },
                yes:function () {
                    if(_is_submit){
                        layer.msg('正在提交中');
                        return;
                    }
                    var FormObj = $('#tag-form');
                    if(FormObj.find('#tag-name').val()==''){
                        layer.msg('请填写品牌名');
                        return;
                    }
                    if( $('#hideUploadInputFileVal').attr('data-loading') ){
                        layer.msg('正在上传logo');
                        return;
                    }
                    // if( FormObj.find('#hideUploadInputFileVal').val()==''){
                    //     layer.msg('请上传品牌logo');
                    //     return;
                    // }

                    if(FormObj.find('#tag-desc').val()==''){
                        layer.msg('请填写品牌描述');
                        return;
                    }

                    var formData =  $('#tag-form').serialize();

                    _is_submit = true;
                    $.post( url || '/admin/tag/add',formData,function (replayData) {
                        if(replayData.status==0){
                            layer.closeAll();
                            layer.msg(replayData.message,{time:1000},function () {
                                window.location = String(window.location.href).replace(/#(.*)/,'');
                            });
                        }else{
                            layer.msg(replayData.message || '系统错误');
                        }
                        _is_submit = false;
                    },'json');
                    setTimeout(function () {
                        _is_submit = false;
                    },2000);
                }
            });
        }
        ,editTag:function (id) {
            if(!/^\d+$/.test(id)){
                layer.alert('id错误!');
            }
            var _this = this;
            $.get('/admin/tag/getTag',{
                id:id
            },function (replayData) {
                _this.addTag(replayData,'/admin/tag/edit','修改');
            },'json');
        }
        ,deleteTag:function (id,selector) {
            var _this = this;
            layer.alert('<font class="Z-red">你确定删除吗,删除不可恢复!</font>',{
                btn:['删除','取消']
            },function () {
                $.get('/admin/tag/delete',{
                    id:id
                },function (replayData) {
                    if(replayData.status==0){
                        layer.closeAll();
                        layer.msg(replayData.message);
                        $(selector).fadeOut(160,function () {
                            $(this).remove();
                        });
                    }else if(replayData.status==-1 || replayData.status==-2){
                        layer.closeAll();
                        layer.msg(replayData.message || '系统错误');
                    }else if(replayData.status==-3){
                        layer.msg(replayData.message || '系统错误');
                    }
                },'json');
            });
        }

        ,initUploadifyFn: function () {
            //无刷新上传头像
            var hideUploadIframe = $('#hideUploadIframe'),
                hideUploadInputFile = $('#hideUploadInputFile'),
                blogFormCover = $('#blogFormCover'),
                imgObj = $('#tag-cover-img'),
                src = imgObj.attr('src');

            hideUploadInputFile.change(function () {
                src = imgObj.attr('src');
                imgObj.addClass('uploading').removeClass('success').attr('src',window.URL['uploadifyUploadLoadImgUrl']);
                blogFormCover.submit();
                $('#hideUploadInputFileVal').attr('data-loading','loading');
            });

            hideUploadIframe.load(function () {
                var
                    body = (this.contentDocument || this.contentWindow.document).body,
                    result = body.innerText || body.textContent || '{}',
                    json = {};
                try {
                    json = (new Function("return " + result))();
                }catch (e){
                    imgObj.removeClass('loading').attr('src',src);
                    layer.alert('上传失败,请重新试试');
                    return;
                }

                var img = new Image(),
                    key = '?time='+(+~new Date()),
                    _img_url = 'http://s1.jiguo.com/'+json.fileid+'/230x230' + key;
                img.onload = function () {
                    imgObj.removeClass('uploading').addClass('success').show().attr('src',_img_url);
                    $('#hideUploadInputFileVal').val(json.fileid).removeAttr('data-loading');
                };
                img.src = _img_url;
            });
        }
        //归入品牌
        ,mergeTag:function (id,selector,tagName) {

            var tpl = $('#merge-tag-tpl').html(),
                _this = this,
                _is_loading = false;

            _this.loading = true;

            var w_id = layer.open({
                title: '归入<span class="ft14">[<font class="Z-red">'+tagName+'</font>]品牌下</span>',
                scrollbar:false,
                area:['610px','480px'],
                content: newTplEngine(tpl,{name:tagName || ''}),
                success:function (layero, index) {
                    var scrollObj = $(layero).find('.tag-merge-box'),
                        scrollObjHeight = scrollObj.height() - 10,
                        searchKey = $(layero).find('#tag-merge-name');

                    //获取循环加载器
                    var loadingDataToll = _this.loadingData(searchKey.val());
                    //设置数据容器
                    loadingDataToll.box = $(layero).find('#tag-merge-ul');
                    //设置搜索id
                    loadingDataToll.tagId = id;

                    if(searchKey.val().replace(/^\s+|\s+$/,'')!=''){
                        //进行第一次搜索
                        loadingDataToll.run();
                    }
                    scrollObj.scroll(function () {
                        //滚动自动加载余下的数据
                        if( $(this).scrollTop()+scrollObjHeight>=loadingDataToll.box.height() && _this.loading ){
                            loadingDataToll.run();
                        }
                    });
                    //监听输入框改变搜索关键词
                    $(layero).find('#tag-merge-name').keyup(function (e) {
                        if(e.keyCode==13){
                            loadingDataToll.run(true);
                        }else{
                            loadingDataToll.name = searchKey.val();
                        }
                    });
                    //点击进行搜索
                     $('#tag-merge-search').click(function () {
                         loadingDataToll.name = searchKey.val();
                        loadingDataToll.run(true);
                    });
                }
            });
        },
        //滚动加载器
        loadingData:function (name) {
            var _this = this;

            function _load() {
                this.p = 0;
                this.size = 10;
                this.name = name;
                this.cacheFn = newTplEngine($('#merge-tag-li-tpl').html());
                this.box = '';
            }
            _load.prototype.run = function (clear) {
                _this.loading = false;
                var self = this;

                if(clear) self.p = 0;

                $('.loading').show();
                $.get('/admin/tag/searchTag',{
                    name:self.name,
                    p:self.p,
                    size:self.size
                },function (replayData) {
                    $('.loading').hide();

                    if(clear && !replayData.length){
                        $(self.box).html('');
                    }
                    if(replayData.length){
                        var html = self.cacheFn({data:replayData,id:self.tagId});

                        if(clear){
                            $(self.box).html(html);
                        }else{
                            $(self.box).append(html);
                        }
                        if(replayData.length<self.size){
                            _this.loading = false;
                            $('.no-data-more').show();
                        }else{
                            self.p++;
                            //设置加载状态
                            _this.loading = true;
                        }
                    }else{
                        //设置加载状态
                        _this.loading = false;
                        $('.no-data-more').show();
                    }
                },'json');
            }
            //返回加载器,外部使用
            return new _load;
        }
        ,mergeToTag:function (id,mid,_this) {
            if( $(_this).data('is_loading') ){
                layer.msg('正在归入中,请稍后',{time:800});
                return;
            }
            var layId = layer.msg('正在归入中',{time:999999999});
            $(_this).data('is_loading',true);

            $.get('/admin/tag/tagMerge',{
                id:id,
                mid:mid,
            },function (replayData) {
                layer.close(layId);
                $(_this).data('is_loading',false);

                if(replayData.status==0){
                    layer.closeAll();
                    layer.msg(replayData.message,function () {
                        window.location.reload();
                    });
                }else {
                    layer.msg(replayData.message || '系统错误');
                }
            },'json');
        }
    }

    window.tagClass = new _tagClass();

})();