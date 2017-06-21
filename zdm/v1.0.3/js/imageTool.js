/**
 * Created by wuhongshan on 2017/3/17.
 */

function imageToll() {}

imageToll.prototype = {
    //ctx_2d        getContext("2d") 对象
    //lineheight    段落文本行高
    //bytelength    设置单字节文字一行内的数量
    //text          写入画面的段落文本
    //startleft     开始绘制文本的 x 坐标位置（相对于画布）
    //starttop      开始绘制文本的 y 坐标位置（相对于画布）

    writeTextOnCanvas: function (ctx_2d, lineheight, bytelength, text ,startleft, starttop){
        function getTrueLength(str){//获取字符串的真实长度（字节长度）
            var len = str.length, truelen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    truelen += 2;
                }else{
                    truelen += 1;
                }
            }
            return truelen;
        }
        function cutString(str, leng){//按字节长度截取字符串，返回substr截取位置
            var len = str.length, tlen = len, nlen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    if(nlen + 2 < leng){
                        nlen += 2;
                    }else{
                        tlen = x;
                        break;
                    }
                }else{
                    if(nlen + 1 < leng){
                        nlen += 1;
                    }else{
                        tlen = x;
                        break;
                    }
                }
            }
            return tlen;
        }
        var _text = text.split(/\\n|\n/);
        if(_text.length>1){
            for(var i = 0; i<_text.length; i++){
                ctx_2d.fillText(_text[i], startleft, i * lineheight + starttop);
            }
            return _text.length;
        }else{
            for(var i = 1; getTrueLength(text) > 0; i++){
                var tl = cutString(text, bytelength);
                ctx_2d.fillText(text.substr(0, tl), startleft, (i-1) * lineheight + starttop);
                text = text.substr(tl);
            }
            return i - 1;
        }
    },
    drawCover:function () {
        var _this = this;
        try {
            _this.ctx.drawImage(this.coverImage,
                0, 0,
                this.img_width,this.img_height,
                this.left_fix,this.top_fix,
                this.cover_width,this.cover_height
            );
        }catch (e){
            return;
        }

        //边框
        var font = _this.ctx.font,
            lineWidth = 2,
            lineFix = lineWidth - 1,
            start_x = this.left_fix - lineFix,
            start_y = this.top_fix - lineFix;

        _this.ctx.lineWidth = lineWidth;
        _this.ctx.strokeStyle = "#e5e5e5";

        _this.ctx.beginPath();
        _this.ctx.moveTo( start_x ,start_y );
        _this.ctx.lineTo( start_x + this.cover_width + (2*lineFix) , start_y );
        _this.ctx.lineTo( start_x + this.cover_width + (2*lineFix) , start_y + this.cover_height + (2*lineFix) );
        _this.ctx.lineTo( start_x , start_y + this.cover_height + (2*lineFix) );
        _this.ctx.lineTo( start_x ,start_y );
        _this.ctx.stroke();
        _this.ctx.closePath();

        _this.ctx.font = font;

        return {
            s_x:this.left_fix,
            s_y:this.top_fix,
            e_x:this.left_fix + this.cover_width,
            e_y:this.top_fix + this.cover_height
        }
    },

    drawLogo:function ( callBack ) {
        var _this = this;
        var font = _this.ctx.font;

        _this.ctx.lineWidth=1;
        _this.ctx.strokeStyle="#e5e5e5";

        _this.ctx.beginPath();
        _this.ctx.moveTo( 0 ,40 * _this.bili );
        _this.ctx.lineTo( _this.canvas_width ,40 * _this.bili );
        _this.ctx.stroke();
        _this.ctx.moveTo( 0 ,50 * _this.bili );
        _this.ctx.lineTo( _this.canvas_width ,50 * _this.bili );
        _this.ctx.stroke();
        _this.ctx.closePath();

        //白色矩形背景
        _this.ctx.fillStyle = "#ffffff";
        var width = 180 * _this.bili;
        _this.ctx.fillRect(
            _this.canvas_width / 2 - width/2 , 0,
            width , 90 * _this.bili
        );

        var logo = new Image();
        logo.onload = function () {
            var logo_width = 110 * _this.bili,
                logo_height = logo_width * this.height / this.width,
                left = _this.canvas_width / 2 - logo_width/2,
                top = 90 * _this.bili / 2 - logo_height / 2;

            _this.ctx.drawImage(this, 0, 0,this.width,this.height,left,top,logo_width,logo_height );
            callBack();
        };
        logo.onerror = function () {
            _this.canvas = null;
            layer.alert('LOGO加载错误');
        };
        logo.src = 'http://zdm.jiguo.com/admin/index/ShowImgTool?url=http://s1.jiguo.com/e63532e3-ba90-4cda-ad7e-e20b55589294';
        _this.ctx.font = font;
    },

    //画二维码
    drawErweima:function (position, callBack ) {
        var _this = this;

        var erweima = new Image(),
            width = _this.erweima_width,
            left = position.s_x,
            top = position.e_y + 60,
            result = {
                s_x:left,
                s_y:top,
                e_x:left + width,
                e_y:top + width
            };

        erweima.onload = function () {
            _this.ctx.drawImage(this, 8, 8,this.width,this.height,left,top,width,width );
            callBack( result );
        };
        erweima.onerror = function () {
            layer.alert('二维码加载错误');
            _this.canvas = null;
        };
        erweima.src = 'http://zdm.jiguo.com/index/qrcode?w=250&url='+encodeURIComponent( _this.erweimaContent );
        console.log(erweima.src);

        _this.ctx.fillStyle = '#676767';
        _this.ctx.font = '300 '+(16 * _this.bili)+'px '+this.fontStyle;
        _this.writeTextOnCanvas(
            _this.ctx,16 * _this.bili ,100,'长按识别二维码购买',result.s_x ,result.e_y + 5
        );
        _this.ctx.font = _this.fontSize + "px "+this.fontStyle;

        return result;
    },

    convertImageToCanvas:function ( callBack ) {
        var _this = this;

        //logo
        _this.drawLogo(function () {
            //画封面图
            var result = _this.drawCover();

            var drawTitle = function (result) {
                _this.ctx.fillStyle = '#333333';
                result.e_x += 10 * _this.bili;
                result.s_y += 30 * _this.bili;

                var lineNum = _this.writeTextOnCanvas(
                    _this.ctx,_this.fontSize + 5 * _this.bili ,30,_this.title,result.e_x ,result.s_y,2
                );

                return {
                    s_x:result.e_x,
                    s_y:result.s_y,
                    e_x:result.e_x + 505* _this.bili,
                    e_y:result.s_y + (lineNum * _this.fontSize),
                    lineNum:lineNum
                };
            };

            var drawMall = function (result ,result2) {
                _this.ctx.fillStyle = '#818181';
                var font = _this.ctx.font;
                _this.ctx.font = "100 "+(28 * _this.bili)+"px "+_this.fontStyle;
                result.e_y += 20* _this.bili;

                var lineNum = _this.writeTextOnCanvas(
                    _this.ctx,_this.fontSize + 5* _this.bili ,100,_this.laiyuan,result.s_x ,result.e_y - (result2.lineNum==1?-10 * _this.bili :'')
                );
                _this.ctx.font = font;
                return {
                    s_x:result.s_x,
                    s_y:result.e_y,
                    e_x:result.s_x + 505* _this.bili,
                    e_y:result.e_y + (lineNum * _this.fontSize)
                };
            };

            var drawPricr = function (result,result2) {
                _this.ctx.fillStyle = '#e53935';
                result.e_y += 18 * _this.bili;

                var _top_fix_ = (result2.lineNum==1?20 * _this.bili :'');
                _this.ctx.font = (28 * _this.bili)+"px "+_this.fontStyle;
                var lineNum = _this.writeTextOnCanvas(
                    _this.ctx,_this.fontSize + 5* _this.bili ,100,_this.price,result.s_x ,result.e_y + _top_fix_
                );

                _this.ctx.font = "100 "+(20* _this.bili)+"px "+_this.fontStyle;
                _this.ctx.fillStyle = '#a1a1a1';
                var
                    left_fix = parseInt( $('#left-fix').val().replace(/[^\d]/g,'') ),
                    start_x = left_fix || (result.s_x + 230 * _this.bili),
                    delete_width = start_x + (parseInt( $('#delete-width').val().replace(/[^\d]/g,'') ) || 180 * _this.bili),
                    start_y = result.e_y;

                _this.writeTextOnCanvas(
                    _this.ctx,_this.fontSize + 5 * _this.bili ,100,_this.price2,start_x ,start_y + _top_fix_
                );


                _this.ctx.beginPath();
                _this.ctx.lineWidth=1;
                _this.ctx.strokeStyle="#a1a1a1";

                _this.ctx.moveTo( start_x - 20 * _this.bili ,start_y -5 * _this.bili + _top_fix_ );
                _this.ctx.lineTo( delete_width , start_y -5 * _this.bili + _top_fix_ );
                _this.ctx.stroke();
                _this.ctx.closePath();

                return {
                    s_x:result.s_x,
                    s_y:result.e_y,
                    e_x:result.s_x + 505 * _this.bili,
                    e_y:result.e_y + (lineNum * _this.fontSize)
                };
            };

            var drawLine = function (result,result2) {
                result.e_y += 35* _this.bili;
                result.s_x = _this.left_fix;
                _this.ctx.beginPath();
                _this.ctx.lineWidth=2;
                _this.ctx.strokeStyle="#e5e5e5";

                var top = result2.e_y + 35 * _this.bili;
                _this.ctx.moveTo( result.s_x , top );
                _this.ctx.lineTo( _this.canvas_width - _this.left_fix ,top );
                _this.ctx.stroke();
                _this.ctx.closePath();
                return {
                    s_x:result.s_x,
                    s_y:top,
                    e_x:_this.canvas_width - _this.left_fix,
                    e_y:top + _this.ctx.lineWidth
                };
            };

            var drawDescription = function (result) {
                _this.ctx.fillStyle = '#989898';
                _this.ctx.font = "300 "+(22* _this.bili)+"px "+_this.fontStyle;

                result.s_y += 50* _this.bili;

                var lineNum = _this.writeTextOnCanvas(
                    _this.ctx,36* _this.bili ,63,_this.description,result.s_x ,result.s_y
                );

                return {
                    s_x:result.e_x,
                    s_y:result.s_y,
                    e_x:result.e_x + 505* _this.bili,
                    e_y:result.s_y + (lineNum * _this.fontSize)
                };
            };

            var drawBottomRect = function () {
                //矩形
                _this.ctx.fillStyle = "#ffebee";
                var height = 128* _this.bili;
                _this.ctx.fillRect(0,_this.canvas_height - height, _this.canvas_width, _this.canvas_height );

                //中线
                var fix = 13* _this.bili;
                _this.ctx.beginPath();
                _this.ctx.lineWidth=2;
                _this.ctx.strokeStyle="#b3b3b3";
                _this.ctx.moveTo( _this.canvas_width/2 , _this.canvas_height - height + fix );
                _this.ctx.lineTo( _this.canvas_width/2 , _this.canvas_height - fix );
                _this.ctx.stroke();
                _this.ctx.closePath();

                //左边文字
                var leftStr = '欢迎将产品分享给感兴趣的小伙伴，\n邀请好友进群、下单还有红包哦～';
                var rightStr = '超级购物导师大宝，专注挖掘各大\n电商超值好货';
                var top = _this.canvas_height - 75* _this.bili;

                _this.ctx.fillStyle = '#dd4848';
                _this.ctx.font = "300 "+(18 * _this.bili)+"px "+_this.fontStyle;
                _this.writeTextOnCanvas(
                    _this.ctx,33* _this.bili ,100,leftStr,_this.left_fix , top
                );
                //右边文字
                _this.writeTextOnCanvas(
                    _this.ctx,33* _this.bili ,100,rightStr, _this.canvas_width/2 + 60* _this.bili , top
                );

            };

            //加载二维码
            _this.drawErweima(result,function (result) {
                //标题
                var tResult = drawTitle( result );
                //电商
                var mResult = drawMall( tResult ,tResult);
                //价格
                var pResult = drawPricr( mResult ,tResult);
                //横线
                var hResult = drawLine( mResult ,result );
                //描述
                var dResult = drawDescription( hResult );

                //绘制底部矩形
                drawBottomRect();
                callBack( );
            });
        });
    },

    updateParma:function () {

        this.canvas_width = $('#width').val().replace(/[^\d]/g,'');
        this.canvas_height = $('#height').val().replace(/[^\d]/g,'');
        this.bili = this.canvas_width / 800;
        this.type = 'png';
        this.erweimaContent = $('#content').data('url');
        this.erweima_width = 166 * this.bili;

        this.title = $('#title').val().replace(/^\s+|\s+$/,'');
        this.laiyuan = $('#laiyuan').val().replace(/^\s+|\s+$/,'');
        this.price = '折扣价：'+$('#price').val().replace(/^\s+|\s+$/,'');
        this.price2 = '电商价：'+$('#price2').val().replace(/^\s+|\s+$/,'');
        this.description = $('#description').val().replace(/^\s+|\s+$/,'');

        this.coverUrl = $('#cover').val();
        this.coverImage = null;

        this.left_fix = 60 * this.bili;
        this.top_fix = 105 * this.bili;

        this.fontSize = 34 * this.bili;
        this.fontStyle = 'PingFang SC';

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;
        this.ctx = this.canvas.getContext("2d");

        this.ctx.font = this.fontSize + "px "+this.fontStyle;

        //填充背景颜色
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0,0,this.canvas_width,this.canvas_height);

    },
    createImage:function () {
        var sampleImage = new Image(),
            _this = this;

        sampleImage.onload = function () {
            _this.coverImage = this;
            _this.img_height = _this.coverImage.height;
            _this.img_width = _this.coverImage.width;


            _this.cover_width = _this.canvas_width - (_this.left_fix * 2);
            // _this.cover_height = (_this.cover_width * _this.img_height) / _this.img_width;
            _this.cover_height = 688;

            _this.convertImageToCanvas( function ( ) {
                $('#canvasHolder').html(_this.canvas)

                var canvas = _this.canvas;
                $('#download').unbind('click').bind('click',function () {
                    var imageData = canvas.toDataURL("image/"+_this.type,1).replace("image/"+_this.type,'image/octet-stream'),
                        filename = new Date().getDate()+String(Math.random()).replace('0.','')+'.'+_this.type;
                    _this.savaFile(imageData,filename);
                });
                _this.canvas = null;
                window.drawComplete = true;
                layer.closeAll();
            });
        }
        sampleImage.onerror = function () {
            _this.canvas = null;
            layer.alert('图片加载错误，刷新试试');
        }
        sampleImage.src = _this.coverUrl;
    },
    savaFile:function (data,filename) {
        var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href=data;
        save_link.download=filename;
        var event=document.createEvent('MouseEvents');
        event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
        save_link.dispatchEvent(event);
    }
}


$(function () {
    $('#creatPic').css({'cursor':'pointer'});
    window.drawComplete = true;
    var imageTollObject = new imageToll(),
        source = null;
    window.imageTollObject = imageTollObject;

    window.imageTollObject.canvas = null;


    $('body').on('blur','input,textarea',function (update) {
        if( $(this).val()!=source ){
            if( window.imageTollObject.canvas ){
                return ;
            }
            if( window.drawComplete == true ){
                layer.msg('正在生成中...',{time:10000});
                window.drawComplete = false;
                imageTollObject.updateParma();
                imageTollObject.createImage();
            }
        }
    }).on('focus','input,textarea',function () {
        source = $(this).val();
    }).on('focus','#content',function () {
        $('#download').addClass('none');
    }).on('click','#creatPic',function () {
        var url=encodeURIComponent($('#content').data('url'));
        $('#content').data('url',url);
        var formDom=$('#formDom');
        var formData = formDom.serialize();
        formData+='&pic[type]=1';
        layer.msg('正在生成二维码',{time:99999});
        $.post('http://zdm.jiguo.com/admin/index/InsertPic',formData,function(replayData){
            layer.closeAll();
            if(replayData.status===0){
                layer.msg('操作成功',{time:1500},function () {
                    $('#content').data('url',replayData.url);
                    console.log($('#content').data('url'));
                    $('textarea').trigger('blur',[true]);
                    $('#download').removeClass('none');
                })
            }else{
                layer.msg(replayData.message || '系统错误');
            }
        },'json');
        // 生成按钮
        window.imageTollObject.canvas = null;
        window.drawComplete = true;
    });

    $('textarea').trigger('blur',[true]);

    //上传焦点图
    initUploadifyFn('#Z-uploadify-banner','Z-uploadify-banner','Z-uploadify-banner-btn',null,{
        'onUploadSuccess':function (obj,data,respone) {
            data = $.parseJSON(data);
            data.url = 'http://zdm.jiguo.com/admin/index/ShowImgTool?url='+encodeURI('http://s1.jiguo.com/'+data.fileid+'?imageView2/1/w/680/h/515/q/100');
            var html = '<li><img src="'+data.url+'">\
                    <input type="hidden" id="cover" name="cover" value="'+data.url+'"></li>';
            $('#'+this.settings.queueID).html(html);

            $('textarea').trigger('blur');

        },
        multi:false,
        uploadType:'zdm',
        uploadUrl:window.URL['uploadifyUploadUrlZdm']
    });

});



/*********************
 点击抓取按钮获取产品信息
 *********************/
function captureLinkInfo(slecter){
    var tips = new_alert('正在抓取中...',99999999),
        slecter = $(slecter),
        url = slecter.find('#content').val().replace(/^\s+|\s+$/g,'');
    if(url.substr(0,4).toLowerCase()!='http'){
        new_alert('请正确填写链接地址',2000);
        return;
    }

    $.ajax({
        url:"/admin/casperjs/index.html",
        data:{'url':url},
        dataType:'json',
        timeout:20000,
        success: function(replayData){
            //抓取失败
            if(replayData.status!=0){
                new_alert(replayData.message,2000);
                return;
            }
            slecter.find('#content').val(replayData.data.url);
            slecter.find('#title').val(replayData.data.name);
            slecter.find('#laiyuan').val(replayData.data.mall);
            slecter.find('#price').val(replayData.data.price);
            slecter.find('#price2').html(replayData.data.price);

            if( isArray(replayData.data.pic) ){
                var s_img = replayData.data.pic.shift();
                s_img = s_img.substr(0,2)=='//'?'http:'+s_img:s_img;

                var url = 'http://zdm.jiguo.com/admin/index/ShowImgTool?url='+encodeURIComponent(s_img);
                var image_li = '<li><img src="'+url+'">\
                    <input type="hidden" id="cover" name="cover" value="'+url+'"></li>';
                slecter.find('#Z-uploadify-banner').html(image_li);
            }else{
                new_alert('图片抓取失败',2000);
            }

            if( window.imageTollObject ){
                if( window.imageTollObject.canvas ){
                    setTimeout(function () {
                        window.imageTollObject.updateParma();
                        window.imageTollObject.createImage();
                    },500);
                }else{
                    window.imageTollObject.updateParma();
                    window.imageTollObject.createImage();
                }
            }
        },
        complete: function(XMLHttpRequest,status){
            new_close(tips);
            if(status=='timeout'){
                new_alert('抓取超时！',2000);
            }else if(status=='error'){
                new_alert('系统错误！',2000);
            }
        }
    });
}
function isArray(o){
    return Object.prototype.toString.call(o)=='[object Array]';
}







