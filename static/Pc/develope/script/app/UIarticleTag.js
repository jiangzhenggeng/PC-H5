/**
 +----------------------------------------------------------
 //报告提交标签UI
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){
    function randomId() {
        return 'id-'+Math.random().toString().replace('.')+(+new Date());
    }

    return {
        init:function (selecter,tagName) {
            var selecter = $(selecter);
            if(!selecter.length) return;
            if(selecter.attr('data-initialize')=='yes') return;

            var id = randomId();

            selecter.on('click','.create-tag',function () {
                $(this).before('<label id="'+id+'" class="radio-tag checked"><input type="text"></label>');
                $(this).hide().find('.radio-tag input[type=text]').focus();
            });

            selecter.on('blur','.radio-tag input[type=text]',function () {
                if($(this).val().toString().trim()=='') return;

                $(this).parent().next('.create-tag').show();

                var html = '<i class="icon icon-article-badge"></i>' +
                    '<input type="checkbox" name="'+tagName+'" checked value="'+($(this).val())+'">'+$(this).val();
                $(this).replaceWith(html);
            });

            selecter.on('click','.radio-tag',function (event) {
                event.preventDefault();
                if($(this).hasClass('checked') && $(this).find('input[type=checkbox]').prop('checked') ){
                    $(this).removeClass('checked');
                    $(this).find('input[type=checkbox]').prop('checked',false);
                }else{
                    $(this).addClass('checked');
                    $(this).find('input[type=checkbox]').prop('checked',true);
                }
            });

            selecter.attr('data-initialize','yes');
        }
    };
});
