/**
 +----------------------------------------------------------
 //工具类
 +----------------------------------------------------------
 */

define(['require','jquery','layer'],function (require,$,layer){

    return {
        isArray:function (a) {
            return Object.prototype.toString.call(a) === '[object Array]';
        },
        isString:function (a) {
            return Object.prototype.toString.call(a) === '[object String]';
        },
        isNumber:function (a) {
            return Object.prototype.toString.call(a) === '[object Number]';
        },
        isFunction:function (a) {
            return Object.prototype.toString.call(a) === '[object Function]';
        },
        isNull:function (a) {
            return Object.prototype.toString.call(a) === '[object Null]';
        },
        isRegExp:function (a) {
            return Object.prototype.toString.call(a) === '[object RegExp]';
        },
        has:function (a,b) {
            if(Object.prototype.toString.call(a)==='[object Array]'){
                for(var i in a){
                    if(i==b){
                        return true;
                    }
                }
                return false;
            }
            if(Object.prototype.toString.call(a)==='[object Object]'){
                return b in a;
            }
        },
        getLength:function (a) {
            if(this.isArray(a)){
                return a.length;
            }
            var Length = 0;
            for (var item in a) {
                Length++;
            }
            return Length;
        },
        msg:function (msg,time) {
            layer.open({
                skin: 'msg',
                time: time || 2,
                content: msg,
            });
        }
    };
});
