APP.templates.home = (function(){
	'use strict';

	//首页注框架
	function frame(to_uid, data){
		return '<header class="topbar">' +
			'<div class="topbar-left"><div class="topbar-back"></div></div>' +
			'<h1 class="logo"><a href="/"><span class="hide">winds</span></a></h1>' +
		'</header>' +
		'<div class="main">' +
			'<div class="homepage-tophead">' +
				'<div class="personArea">' +
					'<div class="personHead">' +
						'<img src="' + data.userInfo.user_head.slice(1,-1).split(',')[0] + '">' +
						'<div class="personStateArea">' +
							(function(){
								if (user.uid === to_uid) {
									return '';
								}else if (!Number(data.relationState.isAtten)) {
									return '<div class="personState unatten" isAtten="0"></div>';
								} else {
									return '<div class="personState atten" isAtten="1"></div>';
								}
							})() +
						'</div>' +
					'</div>' +
					'<p class="personName">' + data.userInfo.user_name + '</p>' +
				'</div>' +
				'<div class="personSelectArea">' +
					'<div class="personSelectDot">' +
						'<span></span>' +
						'<span></span>' +
						'<span></span>' +
					'</div>' +
					'<div class="personSelectList">' +
						'<p>' + data.userInfo.user_fansCount + ' 粉丝</p>' +
						'<p>' + data.userInfo.user_attenCount + ' 关注</p>' +
						'<p>更换背景</p>' +
						'<p>设置头像</p>' +
						'<p>修改简介</p>' +
					'</div>' +
				'</div>' +
				'<div class="personAlpha"></div>' +
			'</div>' +
			'<div class="homepage-content">' +
				'<div class="photosWrapper">' +
					'<ul class="photosList">' + foreachList(data.photolist) + '</ul>' +
				'</div>' +
			'</div>' +
		'</div>';
	}

	function foreachList(data){
		var str = '';
		if (!data) return '';
		for (var i = 0; i < data.length; i++) {
			str += '<li class="photosItem"><a href="#!image" data-pid="' + data[i].pid + '"><img src="" data-src="' + getPictureUrl(data[i].pic_src) + '"></a></li>';
		}

		return str;
	}

	//根据屏幕尺寸获取图片
	function getPictureUrl(piclist){
		//屏幕尺寸
		var screenSize = window.innerWidth;

		if (screenSize >= 359) {
			return piclist.slice(1,-1).split(',')[3];
		}
		if (screenSize < 359) {
			return piclist.slice(1,-1).split(',')[4];
		}
	}

	return {
		frame: frame
	}
}());