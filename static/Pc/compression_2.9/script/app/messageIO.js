define(["require","jquery","socket.io"],function(require,$,io){function _pushNotification(userssid){var socket=io("http://io.jiguo.com:2126");socket.on("connect",function(){socket.emit("login",userssid)}),socket.on("pc-news",function(msg){eval("msg = "+msg);var tempFunc=function(a,b,c){parseInt(a)>99?html="<font>99</font>":html=a,$(b).find(">.badge").remove(),$(b).parent(".badge-number").show(),c=="tips"?$(b).append('<em class="badge dot"></em>'):$(b).append('<em class="badge number">'+html+"</em>")};if(msg!=null){_msg=msg.data;var html=0;if(msg.type=="broadcast"&&parseInt(msg.tips)>0){if($("[data-badge-warp]").find(".badge").length>0)return;tempFunc(msg.tips,".systemsnews","tips")}typeof _msg.event!="undefined"&&parseInt(_msg.event)>0&&tempFunc(_msg.event,".eventnews"),typeof _msg.systems!="undefined"&&parseInt(_msg.systems)>0&&tempFunc(_msg.systems,".systemsnews","tips"),typeof _msg.coin!="undefined"&&parseInt(_msg.coin)>0&&tempFunc(_msg.coin,".coinnews","tips"),typeof _msg.comment!="undefined"&&parseInt(_msg.comment)>0&&tempFunc(_msg.comment,".commentnews"),typeof _msg.zan!="undefined"&&parseInt(_msg.zan)>0&&tempFunc(_msg.zan,".zannews"),typeof _msg.feedback!="undefined"&&parseInt(_msg.feedback)>0&&(tempFunc(_msg.feedback,".feedbacknews"),tempFunc(_msg.feedback,"[data-badge-warp-feedback]"));if(typeof _msg.feedback!="undefined"&&parseInt(_msg.feedback)>0)var num=msg.num-_msg.feedback;else var num=msg.num;if(typeof msg.num!="undefined"&&parseInt(num)>0)tempFunc(num,"[data-badge-warp]");else if(typeof msg.tips!="undefined"&&parseInt(msg.tips)>0){if($("[data-badge-warp]").find(".badge").length>0)return;tempFunc(msg.tips,"[data-badge-warp]","tips")}}})}return{init:_pushNotification}})