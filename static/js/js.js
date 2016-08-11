;(function ( $, window, document, undefined ) {
  function j_isAnimation(){
    var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx  = '',
        elm = document.createElement('div');

    if( elm.style.animationName !== undefined ) {
      return "";
    }else{
        for( var i = 0,len = domPrefixes.length; i < len; i++ ) {
          if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
            pfx = domPrefixes[ i ];
            return "-"+pfx+"-";
          }
        }
        return "";
    }
  }
  //运行一次，确认前缀，提高效率
  var j_PRE_fix = j_isAnimation();

  $.fn.j_animation = function(option){
    //默认参数
    var options = {
      name:"",
      duration:"1s",
      timingFunc:"linear",
      delay:0,
      iteration:1,
      fillMode:"both",
      direction:"normal"
    }

    $.extend(options,option);

    var cssObj = {};
    cssObj[j_PRE_fix+"animation-duration"] = options.duration;
    cssObj[j_PRE_fix+"animation-timing-function"] = options.timingFunc;
    cssObj[j_PRE_fix+"animation-delay"] = options.delay;
    cssObj[j_PRE_fix+"animation-iteration-count"] = options.iteration;
    cssObj[j_PRE_fix+"animation-fill-mode"] = options.fillMode;
    cssObj[j_PRE_fix+"animation-direction"] = options.direction;
    cssObj[j_PRE_fix+"animation-name"] = options.name;
    this.css(cssObj);
  }

  $.fn.j_transform = function(option){
    var options = {
      x:0,
      y:0,
      scale:1,
      rotate:"0deg"
    }
    $.extend(options,option);

    var cssObj = {};
    cssObj[j_PRE_fix+"transform"] = "translate("+options.x+","+options.y+") scale("+options.scale+") rotate("+options.rotate+")";

    this.css(cssObj);
  }

  $.fn.j_transition = function(option){
    //参数中关于时间的必须加上“s”
    var options = {
      property:"all",
      timingFunc:"linear",
      duration:"1s",
      delay:"0s"
    }
    $.extend(options,option);

    var str = options.property+" "+options.duration+" "+options.timingFunc+" "+options.delay;

    if(j_PRE_fix == ""){
      this[0].style["transition"] = str;
    }else{
      var temp = j_PRE_fix.replace(/\-/g,"");
      temp = temp.substring(0,1).toUpperCase()+temp.substring(1);
      this[0].style[temp+"Transition"] = str;
    }
  }

  	$.fn.removeAnimation = function(){
		var cssObj = {};
		cssObj[j_PRE_fix+"animation-duration"] = "";
		cssObj[j_PRE_fix+"animation-timing-function"] = "";
		cssObj[j_PRE_fix+"animation-delay"] = "";
		cssObj[j_PRE_fix+"animation-iteration-count"] = "";
		cssObj[j_PRE_fix+"animation-fill-mode"] = "";
		cssObj[j_PRE_fix+"animation-direction"] = "";
		cssObj[j_PRE_fix+"animation-name"] = "";
		cssObj[j_PRE_fix+"transform"] = "";
		this.css(cssObj);

		this.removeTransition()
  	}
  	$.fn.removeTransition = function(){ 
  		$(this).each(function(){
  			if(j_PRE_fix == ""){
	      			$(this)[0].style["transition"] = "";
	    		}else{
	      			var temp = j_PRE_fix.replace(/\-/g,"");
	      			temp = temp.substring(0,1).toUpperCase()+temp.substring(1);
	      			$(this)[0].style[temp+"Transition"] = "";
	    		}
  		})
  	}
})( jQuery, window, document );

//下面两行根据浏览器设定字体大小，站内使用rem控制字体大小
var html = document.documentElement;
html.style.cssText = "font-size:"+html.clientWidth+"px !important";

var sys = {};
//绑定touch事件
sys.inittouch = function(id) {
	var j = document.getElementById(id);
	j.addEventListener("touchstart", sys.ts);
	j.addEventListener("touchmove", sys.tm);
	j.addEventListener("touchend", sys.te)
};
//删除touch事件
sys.removeTouch = function(id){
	var j = document.getElementById(id);
	j.removeEventListener("touchstart", sys.ts);
	j.removeEventListener("touchmove", sys.tm);
	j.removeEventListener("touchend", sys.te)
}
//touch started
sys.ts = function(e) {
	//e.preventDefault();
	sys.endY = undefined;
	sys.endX = undefined;
	sys.yInit = undefined;
	sys.startY = e.touches[0].pageY;
	sys.startX = e.touches[0].pageX;
	sys.yInit = ahk.step * ahk.h;
	$(".section").removeTransition();
}
//touch move
sys.tm = function(e) {
	e.preventDefault();
	sys.endY = e.touches[0].pageY;
	sys.endX = e.touches[0].pageX;

	var dis = Math.abs(sys.startY - sys.endY);

	if (sys.startY > sys.endY) {
		if(ahk.step == $(".section").length -1){
			$("#section_"+ahk.step).j_transform({y:(-sys.yInit - dis)+"px"})
		}else{
			$("#section_"+(ahk.step+1)).j_transform({y:(-sys.yInit - dis)+"px"})
		}
	} else{
		$("#section_"+ahk.step).j_transform({y:(-sys.yInit + dis)+"px"})
	}
}

//touch end
sys.te = function() {
	if(sys.endY == undefined){
		sys.endY = sys.startY;
	}
	
	if(sys.endX == undefined){
		sys.endX = sys.startX;
	}

	if (sys.startY == sys.endY || Math.abs(ahk.startY - ahk.endY) <= 20){

	}else if (sys.startY > sys.endY){
		sys.moveup();
	}else{
		sys.movedown();
	}
}
//手指往下滑，切换场景
sys.movedown = function(){
	if(ahk.step > 0 && Math.abs(sys.startY - sys.endY) > 20){
		var tp = ahk.step;
		$("#section_"+tp).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
		$("#section_"+tp).j_transform({y:0})
		ahk.step--;
		ahk.scene();
	}else{
		$("#section_"+ahk.step).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
		$("#section_"+ahk.step).j_transform({y:(-ahk.h * ahk.step)+"px"})
	}
}
//手指往上滑，切换场景
sys.moveup = function(){
	if(ahk.step < ahk.size -1 && Math.abs(sys.startY - sys.endY) > 20){
		ahk.step++;
		$("#section_"+ahk.step).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
		$("#section_"+ahk.step).j_transform({y:(-ahk.h * ahk.step)+"px"})
		ahk.scene();
	}else{
		$("#section_"+ahk.step).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
		$("#section_"+ahk.step).j_transform({y:(-ahk.h * ahk.step)+"px"})
	}
}
//播放和暂停音乐
sys.playMusic = function(){
	if(!sys.music){
		$(".music span").removeAnimation();
		$(".music").css({"background-image":""});
		$("audio")[0].pause();
		sys.music = true;
	}else{
		$(".music span").j_animation({name:"spinner",duration:"1s",iteration:"infinite"})
		$(".music").css({"background-image":"url(static/images/music.gif)"});
		$("audio")[0].play();
		sys.music = false;
	}
}
//提示手指往上滑动的底部小图标
sys.tips = function(){
	$(".tips").j_animation({name:"fadeInUp",duration:"1s",timingFunc:"cubic-bezier(0.24, 0.5, 0.26, 0.8)",iteration:"infinite"})
}
//判断是不是wechat内置浏览器
sys.isWeixinBrowser = function(){
  var ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua)) ? true : false ;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ahk = {};
ahk.init_h = 1100;
ahk.init_w = 640;
ahk.w = $(window).width();
ahk.h = $(window).height();
ahk.step = 0;
ahk.size = $(".section").length;
ahk.rateX = ahk.w / ahk.init_w;
ahk.rateY = ahk.h / ahk.init_h;

ahk.init = function(){
	ahk.openid = $("#openid").val();
	$("html,body,.section,.section img.bg").css({width:ahk.w+"px",height:ahk.h+"px"});
	$(".section").each(function(index){
		var te = $(this);
		te.attr("id","section_"+index);
	});
	
	sys.inittouch("body");
	ahk.loadCheck();
}


//场景内部效果
ahk.scene = function(){
	$("img,.tips,.resizeform").removeAnimation();

	switch(ahk.step){
		case 0:
			//$("#anm1_1").j_animation({name:"fadeIn",duration:"2s",timingFunc:"linear",delay:"0.2s"});
			$("#anm1_3").j_animation({name:"fadeInDown",timingFunc:"cubic-bezier(0.17, 0.5, 0.25, 1)",delay:".5s"});
			$("#anm1_2").j_animation({name:"fadeInUp",timingFunc:"cubic-bezier(0.17, 0.5, 0.25, 1)",delay:".5s"});
			sys.tips();
			break;
		case 1:
			
			$("#anm2_1").j_animation({name:"fadeInDown",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"0.2s"});
			$("#anm2_4").j_animation({name:"fadeInUp",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"0.2s"});
			$("#anm2_2").j_animation({name:"bounceIn",timingFunc:"cubic-bezier(0.17, 0.5, 0.25, 1)",delay:"1.2s"});
			$("#anm2_3").j_animation({name:"fadeInUp",timingFunc:"cubic-bezier(0.17, 0.5, 0.25, 1)",delay:"2.2s","iteration":"infinite"});
			$("#se2").j_animation({name:"fadeIn",duration:"0.5s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"1.2s"});
			$("#anim2_6 .butt").j_animation({name:"pulse",duration:"1.6s",timingFunc:"ease",delay:"1.2s","iteration":"infinite"});
			var p = $("#anim2_6 .butt").attr("data-p");
			if(p == undefined || p == "news"){
				sys.removeTouch("body");
			}else{
				sys.tips();
			}
			
			break;
		case 2:
			$("#anm5_2").j_animation({name:"zoomIn",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"0.2s"});
			//$("#anm5_1").j_animation({name:"flipInUp",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"1.2s"});
			
			if($(".times.resizeform").text() == ""){
				$(".times.resizeform").css({display:"none"})
			}
			sys.tips();
			break;
		case 3:
			ahk.list();
			$("#map").j_animation({name:"fadeInDown",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"0.2s"});
			$("#anmx_1").j_animation({name:"fadeInLeft",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"1.2s"});
			$("#anmx_2").j_animation({name:"fadeInRight",duration:"1s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"1.2s"});
			sys.tips();
			break;
		case 4:
			$("#anm4_1").j_animation({name:"zoomIn",duration:"4s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"0.5s"});
			$("#anm6_1").j_animation({name:"fadeInLeft",duration:"2s",timingFunc:"cubic-bezier(0, 1.01, 1, 1)",delay:"1s"});
			$("#anm6_2").j_animation({name:"zoomIn",duration:"1.5s",timingFunc:"cubic-bezier(0.21, 1.18, 0.86, 0.97)",delay:"3s","iteration":"infinite"});
			//sys.tips();
			break;
	}
}



ahk.loadCheck = function(){
	/*加载百分比代码放这里，现在省略*/
	//默认音乐播放
	sys.music = true;

	$(".section").css("opacity",1);
	ahk.scene();
	$(".music").click(function(){
		sys.playMusic();
	});
		
	setTimeout(function(){
		$("audio").attr("src","static/images/mp3.mp3");
		sys.playMusic();
	},1000);
}



$(function(){
	ahk.init();
	ahk.upload();
	ahk.doupload();

	$("#anmx_1").click(function(){
		ahk.list()
	});
	$("#anmx_2").click(function(){
		ahk.inMap()
	});

	if(sys.isWeixinBrowser()){
		$.getJSON('http://weixin.ibyerzs.com/jssdk/getJsSdk.php?callback=?',
			{purl:location.href},
			function (data) {
			  $.hideLoading();
			  wx.config({
				debug: false,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","getLocation","chooseImage","uploadImage"]
			  });
			  wx.ready(function () {
				wx.onMenuShareAppMessage({//发送给好友
					title: '饭卡', // 分享标题
					desc: 'When? Where? And Your Photo :)', // 分享描述
					link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx459908e9c6033569&redirect_uri=http%3A%2F%2Fm.ibyersh.com%2Fzt%2F2016%2Fnico%2Fmap.php&response_type=code&scope=snsapi_base&state=ohmygo#wechat_redirect', // 分享链接
					imgUrl: 'http://m.ibyersh.com/zt/2016/nico/static/images/love2_03.png', // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function () { 
						
					},
					cancel: function () { 
						// 用户取消分享后执行的回调函数
					}
				});
				
				wx.onMenuShareTimeline({//分享到朋友圈
					title: '饭卡', // 分享标题
					link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx459908e9c6033569&redirect_uri=http%3A%2F%2Fm.ibyersh.com%2Fzt%2F2016%2Fnico%2Fmap.php&response_type=code&scope=snsapi_base&state=ohmygo#wechat_redirect', // 分享链接
					imgUrl: 'http://m.ibyersh.com/zt/2016/nico/static/images/love2_03.png', // 分享图标
					success: function () { 
						
					},
					cancel: function () { 
						// 用户取消分享后执行的回调函数
					}
				});
				wx.getLocation({
					type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function (res) {
						ahk.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						ahk.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						ahk.speed = res.speed; // 速度，以米/每秒计
						ahk.accuracy = res.accuracy; // 位置精度
						ahk.gps = new Array(ahk.latitude,ahk.longitude,ahk.speed,ahk.accuracy)
					}
				});
			  });
			}
		)
	}	
});


ahk.upload = function(){
	$("#anim2_6 .butt").click(function(e){
		e.preventDefault();
		$(this).unbind("click");
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				ahk.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				$("#anim2_6 img").attr("src",ahk.localIds).removeAnimation();
				$("#card1").attr("src",ahk.localIds);
				$("#anim2_6 .butt").attr("data-p","news");
				$("#anm2_5").j_animation({name:"fadeInUp",duration:"0.6s",timingFunc:"ease",delay:"0.2s"});

				document.getElementById("exif").onclick = function() {
				    EXIF.getData(this, function() {
					console.log(EXIF.getTag(this,"GPSLatitude"),EXIF.getTag(this,"GPSLongitude"));
				    });
				}
			},
			cancel: function () { 
			        ahk.upload();// 用户取消分享后执行的回调函数
			}
		});
	})
}

ahk.doupload = function(){
	$("#anm2_5").click(function(e){
		e.preventDefault();
		$(this).unbind("click");

		ahk.when = $("input[name=when]").val();
		ahk.where = $("input[name=where]").val();
		ahk.words = $("input[name=words]").val();


		var p = $("#anim2_6 .butt").attr("data-p");
		if(p == undefined || p != "news"){
			$.alert("请上传一张照片","提示");
			ahk.doupload();
			return;
		}

		$("#anm2_5").j_animation({name:"fadeOutDown",duration:"1s",timingFunc:"ease",delay:"0.2s"});

		wx.uploadImage({
			localId: ahk.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
			isShowProgressTips: 1, // 默认为1，显示进度提示
			success: function (res) {
				ahk.serverId = res.serverId; // 返回图片的服务器端ID
				$.showLoading();
				$.getJSON("http://sv2.nbibyer.com:7790/doupload/?callback=?",
					{openid:ahk.openid,when:ahk.when,where:ahk.where,words:ahk.words,gps:ahk.gps.join("-"),serverId:ahk.serverId},
					function(t){
						$.hideLoading();
						if(t.msg == "提交成功"){
							$("#anim2_6 .butt").attr("data-p","newup");
							ahk.setCard($("#card1").attr("src"),ahk.when,ahk.where,ahk.words);
							
							sys.inittouch("body");
							setTimeout(sys.moveup,50);
						}
					}
				)
			}
		});

	})
}

ahk.setCard = function(url,when,where,words){
	$("#card1").attr("src",url);
	$("#anm5_2 h1").text(words)
	$("#anm5_2 span:eq(0)").text(when)
	$("#anm5_2 span:eq(1)").text(where)
}

ahk.list = function(){
	$.showLoading();
	$("#map").html('<ul class="list"></ul>');
	$.getJSON("http://sv2.nbibyer.com:7790/list/?callback=?",
		{openid:ahk.openid},
		function(t){
			$.hideLoading();

			if(t.Msg != "error" && t.Msg != "empty"){
				ahk.maps = t.Mapa;
				for(var i= 0,len=t.Mapa.length;i<len;i++){
					$("#map ul").append('<li><span>'+t.Mapa[i].When+'</span><span>'+t.Mapa[i].Where+'</span></li>')
				}
			}
		}
	)
}

	

ahk.inMap = function(id){
	$("#map").html('<div id="bdmap"></div>');
	//地图初始化
	var first = ahk.maps[0].Gps.split("-");
	var bm = new BMap.Map("bdmap");
	var opts = {type: BMAP_NAVIGATION_CONTROL_SMALL}    
	bm.addControl(new BMap.NavigationControl(opts));
	bm.addControl(new BMap.GeolocationControl());
	
	//坐标转换完之后的回调函数
	var translate = function(ggPoint,card){
		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(ggPoint);
		convertor.translate(pointArr, 1, 5, function(data){
			if(data.status === 0) {
				/*var marker = new BMap.Marker(data.points[0]);
				marker.addEventListener("click",function(){
					ahk.setCard("http://sv2.nbibyer.com:7790/upload/"+card.Filename,card.When,card.Where,card.Words)
					var tp = ahk.step;
					$("#section_"+tp).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
					$("#section_"+tp).j_transform({y:0})
					ahk.step--;
					ahk.scene();
				});*/
				//bm.addOverlay(marker);
				bm.addOverlay(new SquareOverlay(data.points[0],card));
				bm.setCenter(data.points[0]);
			}
		})
	}

	var rawGps = new BMap.Point(first[1],first[0])
	bm.centerAndZoom(rawGps, 12);

	// 百度地图API功能
    	for(var i = 0,len=ahk.maps.length;i<len;i++){
    		var gps = ahk.maps[i].Gps.split("-");
    		var raw = new BMap.Point(gps[1],gps[0]);
    		translate(raw,ahk.maps[i])
    	}
}


// 定义自定义覆盖物的构造函数  
function SquareOverlay(loca,card){    
	this._card = card;  
	this._center = loca;
}    
// 继承API的BMap.Overlay    
SquareOverlay.prototype = new BMap.Overlay();
// 实现初始化方法  
SquareOverlay.prototype.initialize = function(map){    
	// 保存map对象实例   
	this._map = map;        
	// 创建div元素，作为自定义覆盖物的容器   
	var div = document.createElement("div");    
	div.className = "smallcard";
	$(div).html('<img src="http://sv2.nbibyer.com:7790/upload/'+this._card.Filename+'">');
	$(div).attr({"data-filename":this._card.Filename,"data-when":this._card.When,"data-where":this._card.Where,"data-words":this._card.Words});
	// 将div添加到覆盖物容器中   
	map.getPanes().markerPane.appendChild(div);

	div.addEventListener("click",function(){
		var f = $(this).attr("data-filename");
		var when = $(this).attr("data-when");
		var where = $(this).attr("data-where");
		var words = $(this).attr("data-words");

		ahk.setCard("http://sv2.nbibyer.com:7790/upload/"+f,when,where,words);
		var tp = ahk.step;
		$("#section_"+tp).j_transition({timingFunc:"cubic-bezier(0.04, 1.01, 0.18, 0.96)",duration:"0.4s"});
		$("#section_"+tp).j_transform({y:0})
		ahk.step--;
		ahk.scene();
	});
	// 保存div实例   
	this._div = div;      
	// 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
	// hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
	return div;    
}

// 实现绘制方法   
SquareOverlay.prototype.draw = function(){    
	// 根据地理坐标转换为像素坐标，并设置给容器    
	var position = this._map.pointToOverlayPixel(this._center);    
	this._div.style.left = position.x - 20 + "px";    
	this._div.style.top = position.y - 20+ "px";    
}



