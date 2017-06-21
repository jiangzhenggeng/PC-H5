({
    //requirejs.cofig文件的路径,它会自动读取main.js里面的配置信息
    mainConfigFile: '../develope/script/build_config.js',
    appDir:'../develope',
    //baseUrl: "../develope/script",
    //默认情况写r.js会把相关的依赖文件拷贝到输出目录里面去
    //设置为true之后r.js就不会进行这一操作
    removeCombined: true,
    //findNestedDependencies设置为true表示将所有相关的依赖模块也合并进来，
    // 默认为false只会对main.js进行压缩合并的操作
    findNestedDependencies: false,
    dir: "../compression_2.9",
    optimizeCss:'standard',
    fileExclusionRegExp:'\.(less|html|php|psd|PSD$|DS_Store)$',
    paths: {
        'jquery': "empty:",
        'cookie': "empty:",
        'socket.io': "empty:",
        'touchSwipe': "empty:",
        'touchSlide': "empty:",
        'layer': "empty:",
        'ZeroClipboard': "empty:",
        'swipebox': "empty:"
    }
})