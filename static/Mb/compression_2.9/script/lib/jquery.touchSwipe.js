/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

/*
 *
 * Changelog
 * $Date: 2010-12-12 (Wed, 12 Dec 2010) $
 * $version: 1.0.0
 * $version: 1.0.1 - removed multibyte comments
 *
 * $Date: 2011-21-02 (Mon, 21 Feb 2011) $
 * $version: 1.1.0 	- added allowPageScroll property to allow swiping and scrolling of page
 *					- changed handler signatures so one handler can be used for multiple events
 * $Date: 2011-23-02 (Wed, 23 Feb 2011) $
 * $version: 1.2.0 	- added click handler. This is fired if the user simply clicks and does not swipe. The event object and click target are passed to handler.
 *					- If you use the http://code.google.com/p/jquery-ui-for-ipad-and-iphone/ plugin, you can also assign jQuery mouse events to children of a touchSwipe object.
 * $version: 1.2.1 	- removed console log!
 *
 * $version: 1.2.2 	- Fixed bug where scope was not preserved in callback methods.
 *
 * $Date: 2011-28-04 (Thurs, 28 April 2011) $
 * $version: 1.2.4 	- Changed licence terms to be MIT or GPL inline with jQuery. Added check for support of touch events to stop non compatible browsers erroring.
 *
 * $Date: 2011-27-09 (Tues, 27 September 2011) $
 * $version: 1.2.5 	- Added support for testing swipes with mouse on desktop browser (thanks to https://github.com/joelhy)
 *
 * $Date: 2012-14-05 (Mon, 14 May 2012) $
 * $version: 1.2.6 	- Added timeThreshold between start and end touch, so user can ignore slow swipes (thanks to Mark Chase). Default is null, all swipes are detected
 *
 * $Date: 2012-05-06 (Tues, 05 June 2012) $
 * $version: 1.2.7 	- Changed time threshold to have null default for backwards compatibility. Added duration param passed back in events, and refactored how time is handled.
 *
 * $Date: 2012-05-06 (Tues, 05 June 2012) $
 * $version: 1.2.8 	- Added the possibility to return a value like null or false in the trigger callback. In that way we can control when the touch start/move should take effect or not (simply by returning in some cases return null; or return false;) This effects the ontouchstart/ontouchmove event.
 *
 * $Date: 2012-06-06 (Wed, 06 June 2012) $
 * $version: 1.3.0 	- Refactored whole plugin to allow for methods to be executed, as well as exposed defaults for user override. Added 'enable', 'disable', and 'destroy' methods
 *
 * $Date: 2012-05-06 (Fri, 05 June 2012) $
 * $version: 1.3.1 	- Bug fixes  - bind() with false as last argument is no longer supported in jQuery 1.6, also, if you just click, the duration is now returned correctly.
 *
 * $Date: 2012-29-07 (Sun, 29 July 2012) $
 * $version: 1.3.2	- Added fallbackToMouseEvents option to NOT capture mouse events on non touch devices.
 * 			- Added "all" fingers value to the fingers property, so any combination of fingers triggers the swipe, allowing event handlers to check the finger count
 *
 * $Date: 2012-09-08 (Thurs, 9 Aug 2012) $
 * $version: 1.3.3	- Code tidy prep for minefied version
 *
 * $Date: 2012-04-10 (wed, 4 Oct 2012) $
 * $version: 1.4.0	- Added pinch support, pinchIn and pinchOut
 *
 * $Date: 2012-11-10 (Thurs, 11 Oct 2012) $
 * $version: 1.5.0	- Added excludedElements, a jquery selector that specifies child elements that do NOT trigger swipes. By default, this is .noSwipe
 *
 * $Date: 2012-22-10 (Mon, 22 Oct 2012) $
 * $version: 1.5.1	- Fixed bug with jQuery 1.8 and trailing comma in excludedElements
 *					- Fixed bug with IE and eventPreventDefault()
 * $Date: 2013-01-12 (Fri, 12 Jan 2013) $
 * $version: 1.6.0	- Fixed bugs with pinching, mainly when both pinch and swipe enabled, as well as adding time threshold for multifinger gestures, so releasing one finger beofre the other doesnt trigger as single finger gesture.
 *					- made the demo site all static local HTML pages so they can be run locally by a developer
 *					- added jsDoc comments and added documentation for the plugin
 *					- code tidy
 *					- added triggerOnTouchLeave property that will end the event when the user swipes off the element.
 * $Date: 2013-03-23 (Sat, 23 Mar 2013) $
 * $version: 1.6.1	- Added support for ie8 touch events
 * $version: 1.6.2	- Added support for events binding with on / off / bind in jQ for all callback names.
 *                   - Deprecated the 'click' handler in favour of tap.
 *                   - added cancelThreshold property
 *                   - added option method to update init options at runtime
 * $version 1.6.3    - added doubletap, longtap events and longTapThreshold, doubleTapThreshold property
 *
 * $Date: 2013-04-04 (Thurs, 04 April 2013) $
 * $version 1.6.4    - Fixed bug with cancelThreshold introduced in 1.6.3, where swipe status no longer fired start event, and stopped once swiping back.
 *
 * $Date: 2013-08-24 (Sat, 24 Aug 2013) $
 * $version 1.6.5    - Merged a few pull requests fixing various bugs, added AMD support.
 *
 * $Date: 2014-06-04 (Wed, 04 June 2014) $
 * $version 1.6.6 	- Merge of pull requests.
 *    				- IE10 touch support
 *    				- Only prevent default event handling on valid swipe
 *    				- Separate license/changelog comment
 *    				- Detect if the swipe is valid at the end of the touch event.
 *    				- Pass fingerdata to event handlers.
 *    				- Add 'hold' gesture
 *    				- Be more tolerant about the tap distance
 *    				- Typos and minor fixes
 *
 * $Date: 2015-22-01 (Thurs, 22 Jan 2015) $
 * $version 1.6.7    - Added patch from https://github.com/mattbryson/TouchSwipe-Jquery-Plugin/issues/206 to fix memory leak
 *
 * $Date: 2015-2-2 (Mon, 2 Feb 2015) $
 * $version 1.6.8    - Added preventDefaultEvents option to proxy events regardless.
 *					- Fixed issue with swipe and pinch not triggering at the same time
 *
 * $Date: 2015-9-6 (Tues, 9 June 2015) $
 * $version 1.6.9    - Added PR from jdalton/hybrid to fix pointer events
 *					- Added scrolling demo
 *					- Added version property to plugin
 *
 * $Date: 2015-1-10 (Wed, 1 October 2015) $
 * $version 1.6.10    - Added PR from beatspace to fix tap events
 * $version 1.6.11    - Added PRs from indri-indri ( Doc tidyup), kkirsche ( Bower tidy up ), UziTech (preventDefaultEvents fixes )
 *					 - Allowed setting multiple options via .swipe("options", options_hash) and more simply .swipe(options_hash) or exisitng instances
 * $version 1.6.12    - Fixed bug with multi finger releases above 2 not triggering events
 *
 * $Date: 2015-12-18 (Fri, 18 December 2015) $
 * $version 1.6.13    - Added PRs
 *                    - Fixed #267 allowPageScroll not working correctly
 * $version 1.6.14    - Fixed #220 / #248 doubletap not firing with swipes, #223 commonJS compatible
 * $version 1.6.15    - More bug fixes
 *
 * $Date: 2016-04-29 (Fri, 29 April 2016) $
 * $version 1.6.16    - Swipes with 0 distance now allow default events to trigger.  So tapping any form elements or A tags will allow default interaction, but swiping will trigger a swipe.
 Removed the a, input, select etc from the excluded Children list as the 0 distance tap solves that issue.
 * $Date: 2016-05-19  (Fri, 29 April 2016) $
 * $version 1.6.17     - Fixed context issue when calling instance methods via $("selector").swipe("method");
 * $version 1.6.18     - now honors fallbackToMouseEvents=false for MS Pointer events when a Mouse is used.

 */

(function(a){typeof define=="function"&&define.amd&&define.amd.jQuery?define(["jquery"],a):typeof module!="undefined"&&module.exports?a(require("jquery")):a(jQuery)})(function(a){function b(b){return b&&b.allowPageScroll===undefined&&(b.swipe!==undefined||b.swipeStatus!==undefined)&&(b.allowPageScroll=k),b.click!==undefined&&b.tap===undefined&&(b.tap=b.click),b||(b={}),b=a.extend({},a.fn.swipe.defaults,b),this.each(function(){var d=a(this),e=d.data(D);e||(e=new c(this,b),d.data(D,e))})}function c(b,c){function d(b){if(jb())return;if(a(b.target).closest(c.excludedElements,Tb).length>0)return;var d=b.originalEvent?b.originalEvent:b;if(d.pointerType&&d.pointerType=="mouse"&&c.fallbackToMouseEvents==0)return;var e,f=d.touches,g=f?f[0]:d;Ub=w,f?Vb=f.length:c.preventDefaultEvents!==!1&&b.preventDefault(),Jb=0,Kb=null,Lb=null,Rb=null,Mb=0,Nb=0,Ob=0,Pb=1,Qb=0,Sb=qb(),hb(),lb(0,g);if(!f||Vb===c.fingers||c.fingers===u||R()){Xb=zb(),Vb==2&&(lb(1,f[1]),Nb=Ob=tb(Wb[0].start,Wb[1].start));if(c.swipeStatus||c.pinchStatus)e=J(d,Ub)}else e=!1;return e===!1?(Ub=z,J(d,Ub),e):(c.hold&&(bc=setTimeout(a.proxy(function(){Tb.trigger("hold",[d.target]),c.hold&&(e=c.hold.call(Tb,d,d.target))},this),c.longTapThreshold)),kb(!0),null)}function r(a){var b=a.originalEvent?a.originalEvent:a;if(Ub===y||Ub===z||ib())return;var d,e=b.touches,f=e?e[0]:b,g=mb(f);Yb=zb(),e&&(Vb=e.length),c.hold&&clearTimeout(bc),Ub=x,Vb==2&&(Nb==0?(lb(1,e[1]),Nb=Ob=tb(Wb[0].start,Wb[1].start)):(mb(e[1]),Ob=tb(Wb[0].end,Wb[1].end),Rb=vb(Wb[0].end,Wb[1].end)),Pb=ub(Nb,Ob),Qb=Math.abs(Nb-Ob));if(Vb===c.fingers||c.fingers===u||!e||R()){Kb=yb(g.start,g.end),Lb=yb(g.last,g.end),P(a,Lb),Jb=wb(g.start,g.end),Mb=sb(),ob(Kb,Jb),d=J(b,Ub);if(!c.triggerOnTouchEnd||c.triggerOnTouchLeave){var h=!0;if(c.triggerOnTouchLeave){var i=Ab(this);h=Bb(g.end,i)}!c.triggerOnTouchEnd&&h?Ub=I(x):c.triggerOnTouchLeave&&!h&&(Ub=I(y)),(Ub==z||Ub==y)&&J(b,Ub)}}else Ub=z,J(b,Ub);d===!1&&(Ub=z,J(b,Ub))}function E(a){var b=a.originalEvent?a.originalEvent:a,d=b.touches;if(d){if(d.length&&!ib())return gb(b),!0;if(d.length&&ib())return!0}return ib()&&(Vb=$b),Yb=zb(),Mb=sb(),M()||!L()?(Ub=z,J(b,Ub)):c.triggerOnTouchEnd||c.triggerOnTouchEnd===!1&&Ub===x?(c.preventDefaultEvents!==!1&&a.preventDefault(),Ub=y,J(b,Ub)):!c.triggerOnTouchEnd&&Y()?(Ub=y,K(b,Ub,o)):Ub===x&&(Ub=z,J(b,Ub)),kb(!1),null}function F(){Vb=0,Yb=0,Xb=0,Nb=0,Ob=0,Pb=1,hb(),kb(!1)}function G(a){var b=a.originalEvent?a.originalEvent:a;c.triggerOnTouchLeave&&(Ub=I(y),J(b,Ub))}function H(){Tb.unbind(Eb,d),Tb.unbind(Ib,F),Tb.unbind(Fb,r),Tb.unbind(Gb,E),Hb&&Tb.unbind(Hb,G),kb(!1)}function I(a){var b=a,d=O(),e=L(),f=M();return!d||f?b=z:e&&a==x&&(!c.triggerOnTouchEnd||c.triggerOnTouchLeave)?b=y:!e&&a==y&&c.triggerOnTouchLeave&&(b=z),b}function J(a,b){var c,d=a.touches;if(V()||U())c=K(a,b,m);return(S()||R())&&c!==!1&&(c=K(a,b,n)),eb()&&c!==!1?c=K(a,b,p):fb()&&c!==!1?c=K(a,b,q):db()&&c!==!1&&(c=K(a,b,o)),b===z&&F(a),b===y&&(d?d.length||F(a):F(a)),c}function K(b,d,k){var l;if(k==m){Tb.trigger("swipeStatus",[d,Kb||null,Jb||0,Mb||0,Vb,Wb,Lb]);if(c.swipeStatus){l=c.swipeStatus.call(Tb,b,d,Kb||null,Jb||0,Mb||0,Vb,Wb,Lb);if(l===!1)return!1}if(d==y&&T()){clearTimeout(ac),clearTimeout(bc),Tb.trigger("swipe",[Kb,Jb,Mb,Vb,Wb,Lb]);if(c.swipe){l=c.swipe.call(Tb,b,Kb,Jb,Mb,Vb,Wb,Lb);if(l===!1)return!1}switch(Kb){case e:Tb.trigger("swipeLeft",[Kb,Jb,Mb,Vb,Wb,Lb]),c.swipeLeft&&(l=c.swipeLeft.call(Tb,b,Kb,Jb,Mb,Vb,Wb,Lb));break;case f:Tb.trigger("swipeRight",[Kb,Jb,Mb,Vb,Wb,Lb]),c.swipeRight&&(l=c.swipeRight.call(Tb,b,Kb,Jb,Mb,Vb,Wb,Lb));break;case g:Tb.trigger("swipeUp",[Kb,Jb,Mb,Vb,Wb,Lb]),c.swipeUp&&(l=c.swipeUp.call(Tb,b,Kb,Jb,Mb,Vb,Wb,Lb));break;case h:Tb.trigger("swipeDown",[Kb,Jb,Mb,Vb,Wb,Lb]),c.swipeDown&&(l=c.swipeDown.call(Tb,b,Kb,Jb,Mb,Vb,Wb,Lb))}}}if(k==n){Tb.trigger("pinchStatus",[d,Rb||null,Qb||0,Mb||0,Vb,Pb,Wb]);if(c.pinchStatus){l=c.pinchStatus.call(Tb,b,d,Rb||null,Qb||0,Mb||0,Vb,Pb,Wb);if(l===!1)return!1}if(d==y&&Q())switch(Rb){case i:Tb.trigger("pinchIn",[Rb||null,Qb||0,Mb||0,Vb,Pb,Wb]),c.pinchIn&&(l=c.pinchIn.call(Tb,b,Rb||null,Qb||0,Mb||0,Vb,Pb,Wb));break;case j:Tb.trigger("pinchOut",[Rb||null,Qb||0,Mb||0,Vb,Pb,Wb]),c.pinchOut&&(l=c.pinchOut.call(Tb,b,Rb||null,Qb||0,Mb||0,Vb,Pb,Wb))}}if(k==o){if(d===z||d===y)clearTimeout(ac),clearTimeout(bc),Z()&&!ab()?(_b=zb(),ac=setTimeout(a.proxy(function(){_b=null,Tb.trigger("tap",[b.target]),c.tap&&(l=c.tap.call(Tb,b,b.target))},this),c.doubleTapThreshold)):(_b=null,Tb.trigger("tap",[b.target]),c.tap&&(l=c.tap.call(Tb,b,b.target)))}else if(k==p){if(d===z||d===y)clearTimeout(ac),clearTimeout(bc),_b=null,Tb.trigger("doubletap",[b.target]),c.doubleTap&&(l=c.doubleTap.call(Tb,b,b.target))}else k==q&&(d===z||d===y)&&(clearTimeout(ac),_b=null,Tb.trigger("longtap",[b.target]),c.longTap&&(l=c.longTap.call(Tb,b,b.target)));return l}function L(){var a=!0;return c.threshold!==null&&(a=Jb>=c.threshold),a}function M(){var a=!1;return c.cancelThreshold!==null&&Kb!==null&&(a=pb(Kb)-Jb>=c.cancelThreshold),a}function N(){return c.pinchThreshold!==null?Qb>=c.pinchThreshold:!0}function O(){var a;return c.maxTimeThreshold?Mb>=c.maxTimeThreshold?a=!1:a=!0:a=!0,a}function P(a,b){if(c.preventDefaultEvents===!1)return;if(c.allowPageScroll===k)a.preventDefault();else{var d=c.allowPageScroll===l;switch(b){case e:(c.swipeLeft&&d||!d&&c.allowPageScroll!=s)&&a.preventDefault();break;case f:(c.swipeRight&&d||!d&&c.allowPageScroll!=s)&&a.preventDefault();break;case g:(c.swipeUp&&d||!d&&c.allowPageScroll!=t)&&a.preventDefault();break;case h:(c.swipeDown&&d||!d&&c.allowPageScroll!=t)&&a.preventDefault();break;case k:}}}function Q(){var a=W(),b=X(),c=N();return a&&b&&c}function R(){return!!(c.pinchStatus||c.pinchIn||c.pinchOut)}function S(){return!!Q()&&!!R()}function T(){var a=O(),b=L(),c=W(),d=X(),e=M(),f=!e&&d&&c&&b&&a;return f}function U(){return!!(c.swipe||c.swipeStatus||c.swipeLeft||c.swipeRight||c.swipeUp||c.swipeDown)}function V(){return!!T()&&!!U()}function W(){return Vb===c.fingers||c.fingers===u||!A}function X(){return Wb[0].end.x!==0}function Y(){return!!c.tap}function Z(){return!!c.doubleTap}function $(){return!!c.longTap}function _(){if(_b==null)return!1;var a=zb();return Z()&&a-_b<=c.doubleTapThreshold}function ab(){return _()}function bb(){return(Vb===1||!A)&&(isNaN(Jb)||Jb<c.threshold)}function cb(){return Mb>c.longTapThreshold&&Jb<v}function db(){return!!bb()&&!!Y()}function eb(){return!!_()&&!!Z()}function fb(){return!!cb()&&!!$()}function gb(a){Zb=zb(),$b=a.touches.length+1}function hb(){Zb=0,$b=0}function ib(){var a=!1;if(Zb){var b=zb()-Zb;b<=c.fingerReleaseThreshold&&(a=!0)}return a}function jb(){return Tb.data(D+"_intouch")===!0}function kb(a){if(!Tb)return;a===!0?(Tb.bind(Fb,r),Tb.bind(Gb,E),Hb&&Tb.bind(Hb,G)):(Tb.unbind(Fb,r,!1),Tb.unbind(Gb,E,!1),Hb&&Tb.unbind(Hb,G,!1)),Tb.data(D+"_intouch",a===!0)}function lb(a,b){var c={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return c.start.x=c.last.x=c.end.x=b.pageX||b.clientX,c.start.y=c.last.y=c.end.y=b.pageY||b.clientY,Wb[a]=c,c}function mb(a){var b=a.identifier!==undefined?a.identifier:0,c=nb(b);return c===null&&(c=lb(b,a)),c.last.x=c.end.x,c.last.y=c.end.y,c.end.x=a.pageX||a.clientX,c.end.y=a.pageY||a.clientY,c}function nb(a){return Wb[a]||null}function ob(a,b){if(a==k)return;b=Math.max(b,pb(a)),Sb[a].distance=b}function pb(a){return Sb[a]?Sb[a].distance:undefined}function qb(){var a={};return a[e]=rb(e),a[f]=rb(f),a[g]=rb(g),a[h]=rb(h),a}function rb(a){return{direction:a,distance:0}}function sb(){return Yb-Xb}function tb(a,b){var c=Math.abs(a.x-b.x),d=Math.abs(a.y-b.y);return Math.round(Math.sqrt(c*c+d*d))}function ub(a,b){var c=b/a*1;return c.toFixed(2)}function vb(){return Pb<1?j:i}function wb(a,b){return Math.round(Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)))}function xb(a,b){var c=a.x-b.x,d=b.y-a.y,e=Math.atan2(d,c),f=Math.round(e*180/Math.PI);return f<0&&(f=360-Math.abs(f)),f}function yb(a,b){if(Cb(a,b))return k;var c=xb(a,b);return c<=45&&c>=0?e:c<=360&&c>=315?e:c>=135&&c<=225?f:c>45&&c<135?h:g}function zb(){var a=new Date;return a.getTime()}function Ab(b){b=a(b);var c=b.offset(),d={left:c.left,right:c.left+b.outerWidth(),top:c.top,bottom:c.top+b.outerHeight()};return d}function Bb(a,b){return a.x>b.left&&a.x<b.right&&a.y>b.top&&a.y<b.bottom}function Cb(a,b){return a.x==b.x&&a.y==b.y}var c=a.extend({},c),Db=A||C||!c.fallbackToMouseEvents,Eb=Db?C?B?"MSPointerDown":"pointerdown":"touchstart":"mousedown",Fb=Db?C?B?"MSPointerMove":"pointermove":"touchmove":"mousemove",Gb=Db?C?B?"MSPointerUp":"pointerup":"touchend":"mouseup",Hb=Db?C?"mouseleave":null:"mouseleave",Ib=C?B?"MSPointerCancel":"pointercancel":"touchcancel",Jb=0,Kb=null,Lb=null,Mb=0,Nb=0,Ob=0,Pb=1,Qb=0,Rb=0,Sb=null,Tb=a(b),Ub="start",Vb=0,Wb={},Xb=0,Yb=0,Zb=0,$b=0,_b=0,ac=null,bc=null;try{Tb.bind(Eb,d),Tb.bind(Ib,F)}catch(cc){a.error("events not supported "+Eb+","+Ib+" on jQuery.swipe")}this.enable=function(){return this.disable(),Tb.bind(Eb,d),Tb.bind(Ib,F),Tb},this.disable=function(){return H(),Tb},this.destroy=function(){H(),Tb.data(D,null),Tb=null},this.option=function(b,d){if(typeof b=="object")c=a.extend(c,b);else if(c[b]!==undefined){if(d===undefined)return c[b];c[b]=d}else{if(!b)return c;a.error("Option "+b+" does not exist on jQuery.swipe.options")}return null}}var d="1.6.18",e="left",f="right",g="up",h="down",i="in",j="out",k="none",l="auto",m="swipe",n="pinch",o="tap",p="doubletap",q="longtap",r="hold",s="horizontal",t="vertical",u="all",v=10,w="start",x="move",y="end",z="cancel",A="ontouchstart"in window,B=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!A,C=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!A,D="TouchSwipe",E={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};a.fn.swipe=function(c){var d=a(this),e=d.data(D);if(e&&typeof c=="string"){if(e[c])return e[c].apply(e,Array.prototype.slice.call(arguments,1));a.error("Method "+c+" does not exist on jQuery.swipe")}else if(e&&typeof c=="object")e.option.apply(e,arguments);else if(!e&&(typeof c=="object"||!c))return b.apply(this,arguments);return d},a.fn.swipe.version=d,a.fn.swipe.defaults=E,a.fn.swipe.phases={PHASE_START:w,PHASE_MOVE:x,PHASE_END:y,PHASE_CANCEL:z},a.fn.swipe.directions={LEFT:e,RIGHT:f,UP:g,DOWN:h,IN:i,OUT:j},a.fn.swipe.pageScroll={NONE:k,HORIZONTAL:s,VERTICAL:t,AUTO:l},a.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:u}})