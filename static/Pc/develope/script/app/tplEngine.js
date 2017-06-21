/**
 +----------------------------------------------------------
 //自定义简单模板引擎函数 增强版
 //如果没有设置传递data参数则会返回一个将模板编译好的函数
 //如果传入data就直接返回生成好的模板
 +----------------------------------------------------------
 */

define(['require','jquery'],function (require,$){

    window.imgFn = function (field,w,h,q) {
        var field = field || '',
            w = w || 640,
            h = h || 237,
            q = q || 100;
        if(field=='' || typeof field != 'string'){
            console.log('field('+field+')错误!');
        }
        return 'http://s1.jiguo.com/'+field+'/640?imageView2/1/w/'+w+'/h/'+h+'/q/'+q+'';
    };

    return {
        init: function (tpl, data) {
            if(typeof tpl!=='string' || tpl==''){
                return data?'':function () {};
            }
            
            var _match = null,
                start_index = 0,
                LEFT_DELIMITER = '<%',
                RIGHT_DELIMITER = '%>',
                function_body = null;

            //HTML转义
            this._encodeHTML = function (source) {
                return String(source)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\\/g, '&#92;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };

            //转义影响正则的字符
            this._encodeReg = function (source) {
                return String(source).replace(/([\.\*\+\?\^\=\!\:\$\{\}\(\)|[\]\/\\])/g, '\\$1');
            };

            //构造函数头部
            function_body = 'var _encodeHTML='+this._encodeHTML+';\nvar r=[];\nvar fn = (function(__data__){\n',
                function_body += "var _template_varName='';\n";
            function_body += "for(var __name__ in __data__){\n";
            function_body += "_template_varName+=('var '+__name__+'=__data__[\"'+__name__+'\"];');\n";
            function_body += "};\neval(_template_varName);\n";

            //取得分隔符
            var _left_ = LEFT_DELIMITER;
            var _right_ = RIGHT_DELIMITER;

            //对分隔符进行转义，支持正则中的元字符，可以是HTML注释 <!  !>
            var _left = this._encodeReg(_left_);
            var _right = this._encodeReg(_right_);
            //创建匹配规则
            var _RegExp = new RegExp(_left + '([^(' + _left + '|' + _right + ')].*?)' + _right, 'g');
            tpl.replace(_RegExp, function (match_all, match_target, index, resource) {
                //构造函数体
                function_body += 'r.push("' + tpl.substr(start_index, index - start_index).replace(new RegExp("[\\r\\t]", "g"), "").replace(/"/g, '\\"').replace(/\n/g, '\\n') + '");\n';
                var _match_target = match_target.toString().replace(/(^\s*)|(\s*$)/g, '');
                if (match_target.substr(0, 1) == '=') {
                    //如果是变量并且不转意
                    function_body += 'r.push(typeof(' + _match_target.substr(1) + ') === "undefined"?"":' + _match_target.substr(1) + ');\n';
                } else if (match_target.substr(0, 1) == '@') {
                    //如果是函数
                    function_body += 'r.push(' + _match_target.substr(1) + ');\n';
                } else if (match_target.substr(0, 3).toLowerCase() == ':v=') {
                    //如果是变量并且转意
                    function_body += 'r.push(typeof(' + _match_target.substr(3) + ') === "undefined"?"":_encodeHTML(' + _match_target.substr(3) + '));\n';
                } else if (match_target.substr(0, 3).toLowerCase() == ':u=') {
                    //如果是变量并且进行URL编码
                    function_body += 'r.push(typeof(' + _match_target.substr(3) + ') === "undefined"?"":encodeURI(' + _match_target.substr(3) + '));\n';
                } else {
                    //直接是js代码
                    function_body += _match_target + '\n';
                }
                start_index = index + match_all.length;
                return '';
            });
            //模板最后一个标签遗留下的部分
            function_body += 'r.push("' + tpl.substr(start_index).replace(new RegExp("[\\r\\t]", "g"), "").replace(/"/g, '\\"').replace(/\n/g, '\\n') + '");\n';
            function_body += '})(__template_data__);';
            //合并函数体
            function_body += 'return r.join("");';
            //构造一个后台函数
            var fn = new Function('__template_data__', function_body);
            if (data != undefined) {
                return fn(data);
            } else {
                return fn;
            }
        }
    }
});
