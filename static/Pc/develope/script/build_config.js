
requirejs.config({
    baseUrl: "http://cdn.jiguo.com/static/Pc/compression_3.0/script/",
    waitSeconds: 0,
    paths: {
        'ueditor': 'http://www.jiguo.com/protected/extensions/ueditor/ueditor.all.min',

        //试用模块百度编辑器依赖配置
        'jquery': 'lib/jquery-1.12.3.min',
        'cookie': 'lib/cookie',
        'superSlide': 'lib/superSlide',
        'laydate': 'lib/laydate/laydate',
        'layer': 'lib/layer/layer',
        'socket.io': 'lib/socket.io',
        //剪贴板插件
        'ZeroClipboard': 'lib/zeroclipboard/ZeroClipboard',
        //多文件上传插件
        'uploadify': 'http://www.jiguo.com/protected/extensions/uploadify/jquery.uploadify.min',
    },
    shim: {
        'socket.io': {
            exports: 'io'
        },
        'uploadify': {
            deps: ['jquery'],
            exports: 'jQuery.fn.uploadify',
        },

        'cookie': {
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'superSlide': {
            deps: ['jquery'],
            exports: 'jQuery.fn.slide'
        },
        'laydate': {
            deps: ['jquery']
        },
        'layer': {
            deps: ['jquery']
        },
        'ueditor': {
            deps: [
                'http://www.jiguo.com/protected/extensions/ueditor/third-party/zeroclipboard/ZeroClipboard.min.js',
                'http://www.jiguo.com/protected/extensions/ueditor/ueditor.config.js'
            ],
            exports: 'UE',
            init: function (ZeroClipboard) {
                //导出到全局变量，供ueditor使用
                window.ZeroClipboard = ZeroClipboard;
            }
        }
    }
})