/**
 +----------------------------------------------------------
 //基于表单的原生UI
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){

    /**
     * select原生UI模拟
     * @param selecter
     * @private
     */
    function _selectUI (selecter){
        var selecter = $(selecter || 'select');

        selecter.each(function(index, element) {

            /**
             * 已经初始化了的select不需要再次初始化
             * 或者不是select标签也不需要初始化
             */
            if( $(this).get(0).tagName!='select' || $(this).attr('data-initialize')=='yes'){
                return;
            }

            var _this = $(this);
            //设置初始化标记
            _this.attr({
                'data-initialize':'yes'
            }).css({
                //影藏原生标签
                'display':'none'
            });

            var _option = _this.find('option')
                _option_html = '';

            _option.each(function () {
                _option_html += '<li '+($(this).prop('selected')?'data-selected':'')+' data-value="'+$(this).val()+'"><span>'+$(this).html()+'</span></li>';
            });

            //创建模拟选择下拉菜单
            var html = '' +
                '<div class="Z-select-box" tabindex="9999">' +
                '<div class="Z-select-selected"><span>全部</span></div>' +
                '<div class="Z-select-arrow"></div>' +
                '<div class="Z-select-list" style="display: none;">' +
                '<ul>' + _option_html + '</ul>' +
                '</div>' +
                '</div>';
            var _temp_select = $(html);
            _this.after(_temp_select);

            //获得焦点时下拉菜单
            _temp_select.on('click focus',function(){
                _this.trigger('focus');
                _this.trigger('click');
                $(this).show();
            })
            //失去焦点时收起下拉菜单
            .blur(function(){
                _this.trigger('blur');
                $(this).hide();
            })
            //设置选择的值
            .on('click','li',function(){
                _setVal($(this));
            });

            function _setVal(_this) {
                var currVal = _this.attr('data-value'),
                    currHtml = _this.find('span').html(),
                    self = _this.parent().parent().parent();

                self.find('.Z-select-selected').find('span').html(currHtml);
                self.find('input[data-Z-select-value]').val(currVal);
                self.find('.Z-select-list').css('display','none');
                _this.parent().find('li[data-selected]').removeAttr('data-selected');
                _this.attr('data-selected','');
            }

            var selected = $(this).find('.Z-select-list ul li[data-selected]');
            if(selected.length){
                __setVal(selected);
            }else{
                var defaultVal = $(this).find('input[data-Z-select-value]').val();
                var optionLi = $(this).find('.Z-select-list ul li');
                var isSelect =false;
                optionLi.each(function () {
                    if(!isSelect && defaultVal==$(this).attr('data-value')){
                        __setVal($(this));
                        isSelect = true;
                    }
                });
                if(!isSelect){
                    __setVal($(this).find('.Z-select-list ul li').first());
                }
            }
        });
    }

    return {
        select:_selectUI,
        input:_inputUI,
        radio:_radioUI,
        checkbox:_checkboxUI,
    };

});
