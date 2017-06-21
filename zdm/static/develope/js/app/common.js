/**
 * Created by wuhongshan on 2017/4/7.
 */
define(['jquery', 'layer', 'laydate'], function ($, layer, laydate) {
    // 接口访问
    function ajax(type, url, data, dataType, callback) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: dataType || 'JSON',
            success: function (replyData) {
                if (replyData.success != 'true') {
                    layer.msg(replyData.errorMsg || '系统错误');
                } else {
                    callback(replyData);
                }
            }
        })
    };
    // 选择类型后赋值
    function _setVal(dom) {
        var valNum = dom.attr('data-value');
        var valName = dom.find('span').html();
        var parentDom = dom.parent().parent().parent();
        parentDom.find('input').val(valNum);
        parentDom.find('.Z-select-selected').find('span').html(valName);
        parentDom.trigger('blur');
        dom.attr('data-selected', '');
        dom.siblings('li').removeAttr('data-selected')
    };
    // 选择类型
    function chooseType() {
        $('body').on('focus', '[data-z-select]', function () {
            $(this).find('.Z-select-list').show();
        });
        $('body').on('blur', '[data-z-select]', function () {
            $(this).find('.Z-select-list').hide();

        });
        $('body').on('click', '[data-z-select] li', function () {
            _setVal($(this));
        })
    };
    // 时间初始化
    function layerTime(startId, endId) {
        var startObj = {
            elem: startId || '#start',
            format: 'YYYY-MM-DD hh:mm:ss',
            min: '1970-01-1 23:59:59', //设定最小日期为当前日期
            max: '2099-06-16 23:59:59', //最大日期
            istime: true,
            istoday: false,
            choose: function (datas) {
                endObj.min = datas; //开始日选好后，重置结束日的最小日期
                endObj.start = datas //将结束日的初始值设定为开始日
            }
        };
        var endObj = {
            elem: endId || '#end',
            format: 'YYYY-MM-DD hh:mm:ss',
            min: '1970-01-1 23:59:59',
            max: '2099-06-16 23:59:59',
            istime: true,
            istoday: false,
            choose: function (datas) {
                startObj.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        laydate(startObj);
        laydate(endObj);
    };
    // 上线、下线、删除
    function confirm(msg, url, data, callback) {
        var msg = msg || '您确定吗？';
        layer.confirm(msg, {
            bth: ['确定', '取消'],
        }, function () {
            if (!callback) {
                ajax('post', url, data, 'JSON', function () {
                    layer.msg('操作成功', function () {
                        window.location.reload();
                    });
                });
            } else {
                callback();
            }

        });
    };
    function showBox(title, width, height, content, callback) {
        layer.open({
            type: 1,
            title: title,
            scrollbar: true,
            area: [width, height],
            content: content,
            success: callback
        })
    };
    //图片上传
    function removeImage() {
        $('body').on('click', '[data-delete]', function () {
            $(this).parent().remove();
        });
    };
    function upload(data, ul, input_name, multiple) {
        var upUrl = 'http://zdm.jiguo.com/admin2/ajax/upload';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', upUrl);
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var replyData = JSON.parse(xhr.responseText);
                    if (replyData.success != 'true') {
                        layer.msg(replyData.errorMsg);
                    } else {
                        $('#imgLoading').remove();
                        if (multiple) {
                            var imgHtml = '<li><img src="' + replyData.result.url + '"><span data-delete>x</span><div class="Z-cover-hover">封面</div><input type="hidden" name="' + input_name + '" value="' + replyData.result.fileid + '"></li>';
                            ul.append(imgHtml);
                        } else {
                            var imgHtml = '<li><img src="' + replyData.result.url + '"><span data-delete>x</span><input type="hidden" name="' + input_name + '" value="' + replyData.result.fileid + '"></li>';
                            ul.html(imgHtml);
                        }

                        removeImage();
                    }
                }
            }
        }
    };
    function uploadMultiple(data, ul, input_name) {
        var upUrl = 'http://zdm.jiguo.com/admin2/ajax/multipleupload';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', upUrl);
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var replyData = JSON.parse(xhr.responseText);
                    if (replyData.success != 'true') {
                        layer.msg(replyData.errorMsg);
                    } else {
                        for(var i =0;i<replyData.result.length;i++){
                            $('#imgLoading').remove();
                            var imgHtml = '<li><img src="' + replyData.result[i].url + '"><span data-delete>x</span><div class="Z-cover-hover">封面</div><input type="hidden" name="' + input_name + '" value="' + replyData.result[i].fileid + '"></li>';
                            ul.append(imgHtml);

                        }
                        removeImage();
                    }
                }
            }
        }
    };
    // 单图上传
    function upImage(dom, input_name, multiple) {
        $('#' + dom + '').find('input').change(function () {
            var fileList = $(this)[0].files;
            if (fileList.length <= 0) {
                return;
            }
            var html = '<li id="imgLoading"><img src="http://cdn.jiguo.com/p1/i/loading-icon.gif" class="img-loading"></li>';
            var ul = $(this).parent().prev();
            if (multiple) {
                ul.append(html);
            } else {
                ul.html(html);
            }
            var data = new FormData();
            data.append('file', fileList[0]);
            upload(data, ul, input_name, multiple);

        })
    };
    // 多图上传
    function upImageMultiple(dom, input_name) {
        $('#' + dom + '').find('input').change(function () {
            var that = this;
            var ul = $(that).parent().prev();
            var data = new FormData();
            var fileList = $(this)[0].files;
            if (fileList.length <= 0) {
                return;
            }
            $(fileList).each(function (index) {
                var html = '<li id="imgLoading"><img src="http://cdn.jiguo.com/p1/i/loading-icon.gif" class="img-loading"></li>';
                    ul.append(html);

                data.append('file'+index, $(this)[0]);
            })
            uploadMultiple(data, ul, input_name);

        })
    };
    //设置封面
    function setCover() {
        $('body').on('click', '.Z-cover-hover', function () {
            $(this).addClass('Z-block').next().attr('name', 'product[cover]').attr('data-cover', '');
            $(this).parent().siblings().find('.Z-cover-hover').removeClass('Z-block').next().attr('name', 'product[pic][]').removeAttr('data-cover');
        })
    };
    return {
        //选择类型
        chooseType: chooseType,
        // 时间初始化
        layerTime: layerTime,
        // 删除、下线、上线文章试用流的数据
        confirm: confirm,
        // 弹窗
        showBox: showBox,
        // 接口访问
        ajax: ajax,
        //单图上传
        upImage: upImage,
        // 多图上传
        upImageMultiple: upImageMultiple,
        //图片删除
        removeImage: removeImage,
        //设置封面
        setCover: setCover,

    }
})