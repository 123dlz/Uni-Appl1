
var div = document.createElement("div");
div.innerHTML = '<button id="test" style="position:fixed;right:0;top:140px;z-index: 9999;border-radius: 5px 0 0 5px;color: rgba(255,255,255,1);background: rgba(0,0,0,1);height: 40px;padding: 5px 15px;">解析</button><br>';
div.style.textAlign="center";
document.body.insertBefore(div, document.body.firstElementChild);	
	if(window.location.host == 'm.iqiyi.com'){
			if((location.href).indexOf('.html') !== -1){
				$("#test").text('开始播放');
				$("#test").css('position','absolute');
			}
		}
	
		if(window.location.host == 'm.youku.com'){
				if((location.href).indexOf('.html') !== -1){
					$("#test").text('开始播放');
					$("#test").css('position','absolute');
				}
			}
			document.onreadystatechange = function () { 
				if(window.location.host == 'm.v.qq.com'){
			               if(document.readyState=="complete") {            
			                  	$("#test").text('开始播放');
			                  	$("#test").css('position','fixed');			                 													
			               } 
									}			 
			           } 
			$('body').click(function(){
				if(window.location.host == 'm.v.qq.com'){
					 if (window.history && window.history.pushState) {
					
					    $(window).on('popstate', function() {
					      var hashLocation = location.hash;
					      var hashSplit = hashLocation.split("#!/");
					      var hashName = hashSplit[1];
					
					      if (hashName !== '') {
					        var hash = window.location.hash;
					        if (hash === '') {
					          if((location.href).indexOf('play?') == -1 || (location.href).indexOf('cover') == -1 ){
					          	$("#test").text('开始播放');
					          	$("#test").css('position','fixed');
					          }
					        }
					      }
					    })}
							
						if((location.href).indexOf('play?') !== -1 || (location.href).indexOf('cover') !== -1 ){
							$("#test").text('开始播放');
							$("#test").css('position','absolute');
						}
					}
			})
			
$("#test").click(function(){
	if(window.location.host == 'm.iqiyi.com'){
		if((location.href).indexOf('.html') !== -1){
			is_iqiyi();
		}

	}
	if(window.location.host == 'm.pptv.com'){
		if((location.href).indexOf('.html') !== -1){
			is_pp();
		}
		
		
	}
	if(window.location.host == 'm.youku.com'){
		if((location.href).indexOf('.html') !== -1){
			is_youku();
		}
		// 
	}
	if(window.location.host == 'm.v.qq.com'){
		if((location.href).indexOf('play?') !== -1 || (location.href).indexOf('cover') !== -1 ){
			is_qq();
		}
		
	}	
	});
function is_iqiyi(){
		var title = document.title;
		var img = $(".m-video-poster #player-posterimg").attr('src');
		pageTojiexi(title,location.href,img,window.location.host);
		
	}
	
function is_youku(){
		var title = $(".x-video-title").text();
		var img = $(".x-video-poster img").attr('src');
		pageTojiexi(title,location.href,img,window.location.host);
	}
 function is_qq(){
	 var title = $(".video_title").text()+$(".current .text").text();
	 var img = $(".player_poster img").attr('src');
	 pageTojiexi(title,location.href,img,window.location.host);
	 
 }
 function is_pp(){
 	 var title = $(".vod-tit-in h1").text()+$(".episodes-list .cur").text();
 	 pageTojiexi(title);
 	 
 }
 //跳转到解析页面
 function pageTojiexi(title,url=location.href,img,ptname=window.location.host){
	 //去除title中空格
	 var title =title.replace(/\s/g,"");
	 //对URL转码防止中文乱码
	 var title =decodeURI(title); 
	 var url =encodeURIComponent(url);
	 var img =encodeURIComponent(img);
	 // 跳转到解析界面
	 //uni.navigateTo({
	  //  url: '/pages/tool/jiexi/play?url='+url+'&title='+title+'&img='+img+'&ptname='+ptname
	 //});
	 uni.navigateTo({
	    url: '/pages/tool/jiexi/jiekou?url='+url+'&title='+title+'&img='+img+'&ptname='+ptname
	 });
 }
$("#bd").bind('DOMNodeInserted', function(e) {
   alert('页面内容: ');  
});
