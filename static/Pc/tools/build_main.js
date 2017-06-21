({
    //appDir:'../develope',
    baseUrl: '../develope/script',
    out:'../compression_2.9/script/main.js',
    name:'main',
    // optimize: "none",
    optimizeCss:'standard',
    fileExclusionRegExp:'\.(less|html|php|psd|PSD|DS_Store)$',
    paths: {
        'ueditor': 'empty:',
        //试用模块百度编辑器依赖配置
        'jquery': 'lib/jquery-1.12.3.min',
        'cookie': 'lib/cookie',
        'superSlide': 'lib/superSlide',
        'laydate': 'lib/laydate/laydate',
        'layer': 'lib/layer/layer',
        'socket.io': 'empty:',
        'uploadify': 'empty:'
    },
    shim: {
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