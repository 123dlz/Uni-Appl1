function changeFrameHeight(){
        var ifm= document.getElementById("myiframe");
        ifm.height=document.documentElement.clientHeight;
        ifm.width = document.documentElement.clientWidth-15;
        console.log( document.documentElement.clientWidth)
    }
function m(){
	alert(123);
}
function crrentUrl(){
	var url = document.getElementById("myiframe").contentWindow.location.href;
	return url;
}
var $_GET = (function(){
    var url = window.document.location.href.toString(); //获取的完整url
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
function changeSrc(id,src){    
　　　　document.getElementById(id).src=src;
　　}