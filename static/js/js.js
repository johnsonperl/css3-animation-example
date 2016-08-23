;
(function($, window, document, undefined) {
	function j_isAnimation() {
		var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			pfx = '',
			elm = document.createElement('div');

		if (elm.style.animationName !== undefined) {
			return "";
		} else {
			for (var i = 0, len = domPrefixes.length; i < len; i++) {
				if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
					pfx = domPrefixes[i];
					return "-" + pfx + "-";
				}
			}
			return "";
		}
	}
	//运行一次，确认前缀，提高效率
	var j_PRE_fix = j_isAnimation();

	$.fn.j_animation = function(option) {
		//默认参数
		var options = {
			name: "",
			duration: "1s",
			timingFunc: "linear",
			delay: 0,
			iteration: 1,
			fillMode: "both",
			direction: "normal"
		}

		$.extend(options, option);

		var cssObj = {};
		cssObj[j_PRE_fix + "animation-duration"] = options.duration;
		cssObj[j_PRE_fix + "animation-timing-function"] = options.timingFunc;
		cssObj[j_PRE_fix + "animation-delay"] = options.delay;
		cssObj[j_PRE_fix + "animation-iteration-count"] = options.iteration;
		cssObj[j_PRE_fix + "animation-fill-mode"] = options.fillMode;
		cssObj[j_PRE_fix + "animation-direction"] = options.direction;
		cssObj[j_PRE_fix + "animation-name"] = options.name;
		this.css(cssObj);
	}

	$.fn.j_transform = function(option) {
		var options = {
			x: 0,
			y: 0,
			scale: 1,
			rotate: "0deg"
		}
		$.extend(options, option);

		var cssObj = {};
		cssObj[j_PRE_fix + "transform"] = "translate(" + options.x + "," + options.y + ") scale(" + options.scale + ") rotate(" + options.rotate + ")";

		this.css(cssObj);
	}

	$.fn.j_transition = function(option) {
		//参数中关于时间的必须加上“s”
		var options = {
			property: "all",
			timingFunc: "linear",
			duration: "1s",
			delay: "0s"
		}
		$.extend(options, option);

		var str = options.property + " " + options.duration + " " + options.timingFunc + " " + options.delay;

		this.each(function() {
			if (j_PRE_fix == "") {
				this.style["transition"] = str;
			} else {
				var temp = j_PRE_fix.replace(/\-/g, "");
				temp = temp.substring(0, 1).toUpperCase() + temp.substring(1);
				this.style[temp + "Transition"] = str;
			}
		})
	}

	$.fn.removeAnimation = function() {
		var cssObj = {};
		cssObj[j_PRE_fix + "animation-duration"] = "";
		cssObj[j_PRE_fix + "animation-timing-function"] = "";
		cssObj[j_PRE_fix + "animation-delay"] = "";
		cssObj[j_PRE_fix + "animation-iteration-count"] = "";
		cssObj[j_PRE_fix + "animation-fill-mode"] = "";
		cssObj[j_PRE_fix + "animation-direction"] = "";
		cssObj[j_PRE_fix + "animation-name"] = "";
		cssObj[j_PRE_fix + "transform"] = "";
		this.css(cssObj);

		this.removeTransition()
	}
	$.fn.removeTransition = function() {
		this.each(function() {
			if (j_PRE_fix == "") {
				this.style["transition"] = "";
			} else {
				var temp = j_PRE_fix.replace(/\-/g, "");
				temp = temp.substring(0, 1).toUpperCase() + temp.substring(1);
				this.style[temp + "Transition"] = "";
			}
		})
	}
})(jQuery, window, document);

//下面两行根据浏览器设定字体大小，站内使用rem控制字体大小
var html = document.documentElement;
html.style.fontSize = html.clientWidth + "px";

var sys = {};
//绑定touch事件
sys.inittouch = function(id) {
	var j = document.getElementById(id);
	j.addEventListener("touchstart", sys.ts);
	j.addEventListener("touchmove", sys.tm);
	j.addEventListener("touchend", sys.te)
};
//删除touch事件
sys.removeTouch = function(id) {
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
		$(".section").removeTransition()
	}
	//touch move
sys.tm = function(e) {
	e.preventDefault();
	sys.endY = e.touches[0].pageY;
	sys.endX = e.touches[0].pageX;

	var dis = Math.abs(sys.startY - sys.endY);

	if (sys.startY > sys.endY) {
		if (ahk.step == $(".section").length - 1) {
			/*$("#section_" + ahk.step).j_transform({
				y: (-sys.yInit - dis) + "px"
			})*/
		} else {
			$("#section_" + (ahk.step + 1)).j_transform({
				y: (-sys.yInit - dis) + "px"
			})
		}
	} else {
		$("#section_" + ahk.step).j_transform({
			y: (-sys.yInit + dis) + "px"
		})
	}
}

//touch end
sys.te = function() {
		if (sys.endY == undefined) {
			sys.endY = sys.startY;
		}

		if (sys.endX == undefined) {
			sys.endX = sys.startX;
		}

		if (sys.startY == sys.endY || Math.abs(ahk.startY - ahk.endY) <= 20) {

		} else if (sys.startY > sys.endY) {
			sys.moveup();
		} else {
			sys.movedown();
		}
	}
	//手指往下滑，切换场景
sys.movedown = function() {
		if (ahk.step > 0 && Math.abs(sys.startY - sys.endY) > 20) {
			var tp = ahk.step;
			$("#section_" + tp).j_transition({
				timingFunc: "cubic-bezier(0.04, 1.01, 0.18, 0.96)",
				duration: "0.4s"
			});
			$("#section_" + tp).j_transform({
				y: 0
			})
			ahk.step--;
			ahk.scene();
		} else {
			$("#section_" + ahk.step).j_transition({
				timingFunc: "cubic-bezier(0.04, 1.01, 0.18, 0.96)",
				duration: "0.4s"
			});
			$("#section_" + ahk.step).j_transform({
				y: (-ahk.h * ahk.step) + "px"
			})
		}
	}
	//手指往上滑，切换场景
sys.moveup = function() {
		if (ahk.step < ahk.size - 1 && Math.abs(sys.startY - sys.endY) > 20) {
			ahk.step++;
			$("#section_" + ahk.step).j_transition({
				timingFunc: "cubic-bezier(0.04, 1.01, 0.18, 0.96)",
				duration: "0.4s"
			});
			$("#section_" + ahk.step).j_transform({
				y: (-ahk.h * ahk.step) + "px"
			})
			ahk.scene();
		} else {
			$("#section_" + ahk.step).j_transition({
				timingFunc: "cubic-bezier(0.04, 1.01, 0.18, 0.96)",
				duration: "0.4s"
			});
			$("#section_" + ahk.step).j_transform({
				y: (-ahk.h * ahk.step) + "px"
			})
		}
	}
	//播放和暂停音乐
sys.playMusic = function() {
		if (!sys.music) {
			$(".music span").removeAnimation();
			$(".music").css({
				"background-image": ""
			});
			$("audio")[0].pause();
			sys.music = true;
		} else {
			$(".music span").j_animation({
				name: "spinner",
				duration: "1s",
				iteration: "infinite"
			})
			$(".music").css({
				"background-image": "url(static/images/music.gif)"
			});
			$("audio")[0].play();
			sys.music = false;
		}
	}
	//提示手指往上滑动的底部小图标
sys.tips = function() {
		$(".tips").j_animation({
			name: "fadeInUp",
			duration: "1s",
			timingFunc: "cubic-bezier(0.24, 0.5, 0.26, 0.8)",
			iteration: "infinite"
		})
	}
	//判断是不是wechat内置浏览器
sys.isWeixinBrowser = function() {
		var ua = navigator.userAgent.toLowerCase();
		return (/micromessenger/.test(ua)) ? true : false;
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var ahk = {};
ahk.init_h = 1000;
ahk.init_w = 640;
ahk.w = $(window).width();
ahk.h = $(window).height();
ahk.step = 0;
ahk.size = $(".section").length;
ahk.rateX = ahk.w / ahk.init_w;
ahk.rateY = ahk.h / ahk.init_h;

ahk.init = function() {
	ahk.openid = $("#openid").val();
	$("html,body,.section,.section img.bg,.maskbox").css({
		width: ahk.w + "px",
		height: ahk.h + "px"
	});
	$(".section").each(function(index) {
		var te = $(this);
		te.attr("id", "section_" + index);
	});

	sys.inittouch("body");
	ahk.loadCheck();

	$(".rfsera").click(function(e) {
		e.stopPropagation();
		$(".fsera").j_transform({
			y: "100%"
		});
		var id = $(this).attr("data-sc");
		setTimeout(function() {
			$("#anmf_" + id).j_transform({
				y: 0
			})
		}, 100)
	});
	$(".maskbox").click(function() {
		$(".fsera").j_transform({
			y: "100%"
		});
	});

}

ahk.fsera = function() {
	$(".fsera").j_transform({
		y: "100%"
	});
	setTimeout(function() {
		$(".fsera").j_transition({
			timingFunc: "ease",
			duration: "0.6s"
		});
	}, 200)
}


//场景内部效果
ahk.scene = function() {
	$("img,.tips,.resizeform,fsera,.music.fixed.center").removeAnimation();

	switch (ahk.step) {
		case 0:
			//$("#anm1_1").j_animation({name:"fadeIn",duration:"2s",timingFunc:"linear",delay:"0.2s"});
			$("#anm1_1").j_animation({
				name: "fadeInDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".2s"
			});
			$("#anm1_2").j_animation({
				name: "fadeInLeft",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".5s"
			});
			$("#anm1_3").j_animation({
				name: "fadeInRight",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".8s"
			});
			$("#anm1_4").j_animation({
				name: "bounceIn",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: "1.5s"
			});
			sys.tips();
			break;
		case 1:
			$("#anm2_13").j_animation({
				name: "fadeInDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".1s"
			});
			$("#anm2_1").j_animation({
				name: "zoomDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "0.2s"
			});
			$("#anm2_2").j_animation({
				name: "fadeInRight",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "1.4s"
			});

			$("#anm2_3").j_animation({
				name: "zoomDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "0.5s"
			});
			$("#anm2_4").j_animation({
				name: "fadeInRight",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "1.7s"
			});

			$("#anm2_5").j_animation({
				name: "zoomDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "0.8s"
			});
			$("#anm2_6").j_animation({
				name: "fadeInRight",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "2s"
			});

			$("#anm2_7").j_animation({
				name: "zoomDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "1.1s"
			});
			$("#anm2_8").j_animation({
				name: "fadeInRight",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "2.3s"
			});

			$("#anm2_12").j_animation({
				name: "fadeInLeft",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "1.4s"
			});
			$("#anm2_11").j_animation({
				name: "fadeInLeft",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "1.7s"
			});
			$("#anm2_10").j_animation({
				name: "fadeInLeft",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "2s"
			});
			$("#anm2_9").j_animation({
				name: "fadeInLeft",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.15, 1.04, 0.84, 0.99)",
				delay: "2.3s"
			});
			sys.tips();
			break;
		case 2:
			ahk.fsera();
			$("#anm3_0").j_animation({
				name: "fadeInDown",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".1s"
			});
			$("#anm3_1").j_animation({
				name: "fadeInLeft",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".3s"
			});
			$("#anm3_2").j_animation({
				name: "fadeInRight",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".3s"
			});
			$("#anm3_3").j_animation({
				name: "fadeInUp",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: ".9s"
			});
			$("#anm3_14").j_animation({
				name: "fadeInUp",
				duration: "0.6s",
				timingFunc: "cubic-bezier(0.17, 0.5, 0.25, 1)",
				delay: "5s"
			});

			$(".rfsera").each(function(i) {
				$("#anm3_" + (4 + i)).j_animation({
					name: "bounceIn",
					duration: "1.2s",
					timingFunc: "cubic-bezier(0.63, 0.07, 0.41, 0.98)",
					delay: (1 + 0.3 * (i + 1)) + "s"
				});
			});
			sys.tips();
			break;
		case 3:
			$("#anm4_5").css({
				top: (ahk.h - $("#anm4_5").height()) / 2 + "px"
			})
			$(".music.fixed.center").j_animation({
				name: "zoomOut"
			});
			$("#anm4_1").j_animation({
				name: "fadeInDown",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.2s"
			});
			$("#anm4_2").j_animation({
				name: "fadeInDown",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.35s"
			});
			$("#anm4_3").j_animation({
				name: "fadeInDown",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.5s"
			});
			$("#anm4_4").j_animation({
				name: "fadeInDown",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.65s"
			});
			$("#anm4_9").j_animation({
				name: "fadeInUp",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.2s"
			});
			$("#anm4_8").j_animation({
				name: "fadeInUp",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.35s"
			});
			$("#anm4_7").j_animation({
				name: "fadeInUp",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.5s"
			});
			$("#anm4_6").j_animation({
				name: "fadeInUp",
				duration: "0.5s",
				timingFunc: "cubic-bezier(0.39, 0.07, 0.25, 1)",
				delay: "0.65s"
			});
			$("#anm4_5").j_animation({
				name: "bounceIn",
				delay: "1s"
			})
	}
}



ahk.loadCheck = function() {
	/*加载百分比代码放这里，现在省略*/
	//默认音乐播放
	sys.music = true;

	$(".section").css("opacity", 1);
	ahk.scene();
	$(".music").click(function() {
		sys.playMusic();
	});

	setTimeout(function() {
		$("audio").attr("src", "static/images/mp3.mp3");
		sys.playMusic();
	}, 1000);
}



$(function() {
	ahk.init();

	if (sys.isWeixinBrowser()) {
		$.getJSON('http://weixin.ibyersh.com/jssdk/getJsSdk.php?callback=?', {
				purl: location.href
			},
			function(data) {
				wx.config({
					debug: false,
					appId: data.appId,
					timestamp: data.timestamp,
					nonceStr: data.nonceStr,
					signature: data.signature,
					jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
				});
				wx.ready(function() {
					wx.onMenuShareAppMessage({ //发送给好友
						title: '沈刚在拜博，你更有信心！', // 分享标题
						desc: '上海拜博口腔招聘啦！', // 分享描述
						link: 'http://m.ibyersh.com/zt/2016/zhaop/', // 分享链接
						imgUrl: 'http://m.ibyersh.com/zt/2016/zhaop/static/images/face.jpg', // 分享图标
						type: 'link', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {

						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});

					wx.onMenuShareTimeline({ //分享到朋友圈
						title: '沈刚在拜博，你更有信心！', // 分享标题
						link: 'http://m.ibyersh.com/zt/2016/zhaop/', // 分享链接
						imgUrl: 'http://m.ibyersh.com/zt/2016/zhaop/static/images/face.jpg', // 分享图标
						success: function() {

						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
				});
			}
		)
	}
});