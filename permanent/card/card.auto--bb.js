$(function () {
    var iframe = $('iframe');
    for(var i = 0; i<iframe.length ; i++ ){
        if(typeof iframe.get(i).getAttribute('data-productid')!='undefined'){
            iframe.eq(i).css('height', iframe.eq(i).width()/2.993325 + 38 );
        }
    }
});