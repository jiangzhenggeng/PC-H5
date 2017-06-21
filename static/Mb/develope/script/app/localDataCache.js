/**
 +----------------------------------------------------------
 //数据缓存器
 +----------------------------------------------------------
 */

define(function (){

    function base64Encode(string){
        return encodeURIComponent(string);
    }
    function base64Decode(string){
        return decodeURIComponent(string);
    }

    return {
        setPageCacheData:function (key,data) {
            data = data?base64Encode(data):'';
            return sessionStorage.setItem(key,data);
        },
        getPageCacheData:function (key) {
            var data = sessionStorage.getItem(key);
            return data?base64Decode(data):'';
        },
        delPageCacheData:function (key) {
            sessionStorage.removeItem(key);
        },
        clearPageCacheData:function () {
            sessionStorage.clear();
        }
    };

});
