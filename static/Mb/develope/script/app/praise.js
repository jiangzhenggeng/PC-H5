/**
 +----------------------------------------------------------
 //点赞
 +----------------------------------------------------------
 */

define(['jquery','app/login','layer'],function ($,login,layer){
    return {
        init:function () {
            $('body').on('click','[data-zan]',function(){
                var sending;
                if(sending){
                    return false;
                }
                sending=true;
                if(!window.URL['login']){
                    login.login();
                    return false;
                }
                var $this=$(this);
                var id_value=$this.attr('data-id');
                var addToList=$this.attr('data-add-praiselist');
                if(!$this.hasClass('zan-on')){
                    $.post('/api/praise/praise',{
                        id_value:id_value,
                        type:3,
                    },function (replayData) {
                        if(replayData.resultCode==0){
                            sending=false;
                            if(replayData.result.zan==1){
                                $this.addClass('zan-on').find('i').addClass('on animate');
                                var num=parseInt($this.find('[data-praise-num]').text()||0)+1;
                                var numEvery=parseInt($this.find('[data-praise-every]').text()||0)+1;
                                var changeNum=$('body').find('[data-praise-num]');

                                changeNum.each(function (i) {
                                    $(changeNum[i]).text(num);
                                });
                                $this.find('[data-praise-every]').text(numEvery);
                                setTimeout(function(){
                                    $this.addClass('zan-on').find('i').removeClass('animate');
                                },700);
                                if(addToList){
                                    var src=''+replayData.result.avatar+'/230x230';
                                    var str='<li><img src='+src+'></li>';
                                    var wrapper=$('#praise-list');
                                    if(wrapper.find('li').length){
                                        wrapper.find('li').first().before(str);
                                    }else{
                                        $('#praise-list-box').removeClass('none');
                                        wrapper.append(str);
                                    }
                                }
                            }else{
                                $this.removeClass('zan-on').find('i').removeClass('on');
                            }
                        }else if(replayData.resultCode==-100){
                                login.login();
                        }else{
                            layer.msg('操作失败~请稍后再试')
                        }
                    },'json');
                }

            })
        }
    };

});