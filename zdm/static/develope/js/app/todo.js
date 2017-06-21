/**
 * Created by wuhongshan on 2017/4/13.
 */
define(['jquery', 'layer', 'template', 'app/common'], function ($, layer, template, common) {
    function lookHistory(data) {
        var historyList = template('history-list-tpl', data.result);
        var num = data.result.win_num;
        var amount = data.result.win_amount || 0;
        var str = '共中签' + num + '次，中签总金额' + amount + '元';
        common.showBox(str, '800px', '500px', historyList, function () {

        });
    };
    function publish(mid) {
        common.confirm('请确认有充足货源再发布？', '/admin2/work/PublishApply', {mid: mid});
    };
    function publishno(mid) {
        common.confirm('确定发布未中签消息吗？', '/admin2/work/PublishFailedMessage', {mid: mid});
    };
    function addUser(mid) {
        common.ajax('post', '/admin2/work/GetMetaSpec', {meta_id: mid}, 'json', function (replyData) {
            common.showBox('强制添加', '660px', '600px', template('user-list-tpl', replyData.result), function () {

//                    选型号
                $('body').on('click', '#spec .meta-type', function () {
                    $(this).addClass('on').siblings().removeClass('on');
                });
                if (replyData.result.no_spec == 1) {
                    $('#spec').find('span').trigger('click');
                }
//                    查用户
                $('#authorBtn').on('click', function () {
                    var username = $(this).prev().val().trim();
                    common.ajax('post', '/admin2/ajax/GetUserInfo', {
                        username: username
                    }, 'json', function (data) {
                        $('#userBox').html(template('user-tpl', data));
                    })
                });
                //选用户
                chooseUser();

            });
        });
    }
    function chooseUser() {
        $('body').on('click', '[data-choose-author]', function () {
            if (!$('#spec div').hasClass('on')) {
                layer.msg('请选择型号');
                return false;
            } else {
                var storage_id = $('#spec .on input').val();
            }
            var uid = $(this).next().val().trim();
            var data = {
                storage_id: storage_id,
                uid: uid
            };
            common.ajax('post', '/admin2/work/EventAddApply', data, 'json', function () {

                layer.closeAll();
                layer.msg('操作成功', function () {
                    window.location.reload();
                })
            })
        })
    }
    function deleteUser(id, dom) {
        layer.confirm('您确定取消吗？', {
            bth: ['确定', '取消'],
        }, function () {
            common.ajax('post', '/admin2/work/RemoveApplyUser', {id: id}, 'json', function () {
                layer.msg('操作成功', function () {
                    window.location.reload();
                })
            })
        });
    };

    function changeDeposit(val, id) {
        layer.prompt({
            title: '请填写押金',
            value: val
        }, function (text, index) {
            var data = {
                deposit: text,
                id: id
            };
            common.ajax('post', '/admin2/work/ChangeDeposit', data, 'json', function () {
                layer.close(index);
                layer.msg('操作成功', function () {
                    window.location.reload();
                })
            });
        })
    };
    //全选反选
    function pass(options) {
        var options = $.extend({
            chooseBtn: '#chooseAll',
            checkboxes: '#todo-list .icon',
            operaBtn: '#operaAll',
            operaAttr: 'data-opera',
            warningAttr: 'data-warning',
        }, options)
        var len = $(options.checkboxes).length;
        var i = 0;
        $(options.chooseBtn).on('change', function () {
            $(options.checkboxes).prop('checked', $(this).is(':checked'));
            if ($(options.chooseBtn).is(':checked')) {
                i = len;
                $(options.operaBtn).removeAttr(options.warningAttr).attr(options.operaAttr, '');
            } else {
                i = 0;
                $(options.operaBtn).removeAttr(options.operaAttr).attr(options.warningAttr, '');
            }
        });
        $('body').on('change', options.checkboxes,function () {
            var that = this;
            if (!$(that).prop('checked')) {
                i--;
                $(options.chooseBtn).prop('checked', false);
            } else {
                i++;
            }
            if (i == len) {
                $(options.chooseBtn).prop('checked', true);
                $(options.operaBtn).removeAttr(options.warningAttr).attr(options.operaAttr, '');
            }
            if (i >= 1) {
                $(options.operaBtn).removeAttr(options.warningAttr).attr(options.operaAttr, '');
            } else {
                $(options.operaBtn).removeAttr(options.operaAttr).attr(options.warningAttr, '');
            }

        })
    }

    return {
        lookHistory: lookHistory,
        publish: publish,
        publishno: publishno,
        addUser: addUser,
        deleteUser: deleteUser,
        changeDeposit: changeDeposit,
        pass: pass
    }
});