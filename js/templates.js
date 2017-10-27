APP.templates = (function(){
	'use strict';
	//侧边栏用户信息
	function loadAsideUserInfo(){
		if (user.uid == '' || user.uid == null) {
			return '<div class="unloginState">' +
				'<div class="asideLogo"></div>' +
				'<a class="asideLoginBtn" href="user/login.php">登录</a>' +
				'<a class="asideLoginBtn" href="user/reg.php">注册</a>' +
			'</div>';
		}
		else {
			return '<div class="loginState">' +
				'<div class="asidebar-content">' +
					'<div class="asidebar-header">' +
						'<div class="asidebar-userHead">' +
							'<div class="userhead" style="background-image:url(' + user.profile.slice(1,-1).split(',')[1] + ');"></div>' +
							'<span class="username">' + user.name + '</span>' +
						'</div>' +
						'<p class="asidebar-userDescri">' + user.description + '</p>' +
					'</div>' +
				'</div>' +
				'<div class="asidebar-fnbox">' +
					'<div class="fnbox-wrap">' +
						'<a class="asidebar-item fnbox-iconbox exiticon" href="#!exit" data-action="exit">' +
							'<div class="radiusbox radius1"></div>' +
							'<div class="boxline"></div>' +
							'<i></i>' +
						'</a>' +
						'<div class="asidebar-item fnbox-iconbox upicon">' +
							'<div class="radiusbox radius2"></div>' +
							'<div class="boxline"></div>' +
							'<i></i>' +
							'<input type="file" id="upfile" name="upfile" class="upfile" accept="image/*" onchange="APP.uploadController.init(this)">' +
						'</div>' +
						'<a class="asidebar-item fnbox-iconbox tipicon" href="#!notifition" data-action="msg">' +
							'<div class="radiusbox radius3"></div>' +
							'<div class="boxline"></div>' +
							'<i></i>' +
						'</a>' +
						'<a class="asidebar-item fnbox-iconbox editicon" href="#!edit" data-action="edit">' +
							'<div class="radiusbox radius4"></div>' +
							'<div class="boxline"></div>' +
							'<i></i>' +
						'</a>' +
					'</div>' +
					'<em class="notice">3</em>' +
					'<div class="asidebar-item fnbox-round-small" data-action="exit">' +
						'<div class="fnbox-back"></div>' +
					'</div>' +
				'</div>' +
			'</div>';
		}
	}

	//up_cut_header
	function up_cut_header(){
		return '<header class="topbar">' +
				'<div class="topbar-left" id="toback"><div class="topbar-back"></div></div>' +
				'<div class="topbar-right frowardBtn" id="tofroward"><div class="topbar-forward"></div></div>' +
				'<h1 class="logo"><a href=""><span class="hide">winds</span></a></h1>' +
			'</header>';
	}
	//up_edit_header
	function up_edit_header(){
		return '<header class="topbar">' +
			'<div class="topbar-left" id="toback_edit"><div class="topbar-back"></div></div>' +
			'<div class="topbar-right frowardBtn" id="tofroward_edit"><div class="topbar-forward"></div></div>' +
			'<h1 class="logo"><a href=""><span class="hide">winds</span></a></h1>' +
		'</header>';
	}

	//上传裁切信息
	function uploadIndex(file){
		return '<div class="container containerfullScreen wb-box">' +
			'<div class="up-box" id="handleUpCut">' +
				up_cut_header() +
				'<div class="main fullScreen">' +
					'<div class="cut-frame" id="IcropFrame">' +
						'<img src="" class="cut-img" id="IcropShowImg">' +
						'<div class="cut-masklayer cut-lay"></div>' +
						'<div class="cut-selectWrap cut-lay" id="IcropView">' +
							'<div class="cut-select">' +
								'<img src="" class="cut-select-img" id="crop-img">' +
							'</div>' +
							'<div class="cut-fr-dotWrap cut-dotWrap" data-pos="1"><i></i></div>' +
							'<div class="cut-sec-dotWrap cut-dotWrap" data-pos="2"><i></i></div>' +
							'<div class="cut-thr-dotWrap cut-dotWrap" data-pos="3"><i></i></div>' +
							'<div class="cut-fou-dotWrap cut-dotWrap" data-pos="4"><i></i></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="up-box" id="handleUpEdit" style="display:none">' + uploadEdit() + '</div>' +
		'</div>';
	}

	//上传编辑信息
	function uploadEdit(){
		return up_edit_header() +
		'<div class="main">' +
			'<div class="edit-frame" id="edit-frame">' +
				'<div class="edit-preImg" id="edit-preImg">' +
					'<canvas id="editImg"></canvas>' +
				'</div>' +
				'<div class="edit-fill">' +
					'<div class="edit-fillLine"><input type="text" class="edit-fillTxt" placeholder="添加描述" data-type="up_desc"></div>' +
					'<div class="edit-fillLine edit-fillLine-last"><input type="text" class="edit-fillTxt" placeholder="添加标签，以空格分隔开" data-type="up_label"></div>' +
				'</div>' +
			'</div>' +
			'<form id="upload_form" method="POST" enctype="multipart/form-data" action="upload/uploadImg.php"></form>' +
		'</div>';
	}

	//loading layer
	function loadingLayer(){
		return '<div id="loading-layer" class="maskLayer">' +
			'<div class="refreshIcon"></div>' +
		'</div>';
	}

	//upload status
	function uploadStatus(state){
		if (state == 'fail') {
			return '<div class="updTask-state">上传失败</div><div class="updTask-btn" id="redoUpload"><i></i></div>';
		} else if (state == 'success') {
			return '<div class="updTask-state">上传成功</div>';
		} else if (state == 'ing') {
			return '<div class="updTask-progressBar"><div class="updTask-percent" id="updTask-percent"></div></div>';
		}
	}

	//相册试分布信息
	function albumList(photos){
		var i = 0, len = photos.length, output = '<ul class="photosList">';

		//没有取到图片数据
		if (!photos.length) {
			return '没有发现精彩瞬间！';
		}
		//遍历图片数据
		for (i = 0; i < len; i++) {
			output += '<li class="photosItem"><img src="" data-src="' + getPictureUrl(photos[i]['pic_src'], 'list') + '"></li>';
		}
		output += '</ul>';

		return output;
	}

	//时间轴分布信息
	function timeLineList(photos){
		var i = 0, len = photos.length, output = '';

		//没有取到图片数据
		if (!photos.length) {
			//return '没有发现精彩瞬间！';
			return '';
		}
		//遍历图片数据
		for (i = 0; i < len; i++) {
			output += '<section class="timeLineItem" data-pid="' + photos[i]['pid'] + '">' +
						'<header class="timeLineItem-header">' +
							'<div class="timeLineItem-username">' + photos[i]['user_name'] + '</div>' +
							'<div class="timeLineItem-time">' + timeDifference(photos[i]['uptime']) + '</div>' +
							'<a href="#!home" data-uid="' + photos[i]['uid'] + '" class="timeLineItem-userHead" style="background-image: url(' + photos[i]['user_head'].slice(1,-1).split(',')[1] + ');"></a>' +
						'</header>' +
						'<div class="timeLineItem-content">' +
							'<div class="timeLineItem-picture"><img data-src="' + getPictureUrl(photos[i]['pic_src'], 'timeline') + '" src=""></div>' +
							'<div class="timeLineItem-leftInfo timeLineItemInfo">' +
								'<p class="timeLineItemInfo-content">' + photos[i]['user_name'] + '</p>' +
								'<p class="timeLineItemInfo-content">上传时间：' + photos[i]['uptime'] + '</p>' +
								'<p class="timeLineItemInfo-content">个人简介：' + photos[i]['pic_desc'] + '</p>' +
							'</div>' +
							'<div class="timeLineItem-rightInfo timeLineItemInfo">' +
								'<p class="timeLineItemInfo-content">描述：' + photos[i]['pic_desc'] + '</p>' +
								'<p class="timeLineItemInfo-content">评论：' + photos[i]['cmtNum'] + '</p>' +
								'<p class="timeLineItemInfo-content">推荐：' + photos[i]['likeNum'] + '</p>' +
								'<p class="timeLineItemInfo-content">分享：0</p>' +
							'</div>' +
						'</div>' +
						'<div class="timeLineItem-about">' +
							'<p class="timeLineItem-hotArea"><span class="hotIcon"></span><span class="hotCount">' + photos[i]['likeNum'] + '</span></p>' +
							(function (index){
								var cmtList = photos[index].cmtList, 
									len = cmtList.length,
									txt = '';
								if (len) {
									txt += '<div class="timeLineItem-cmtInfo">';
									for (var i = 0; i < len; i++) {
										txt += '<p><span>' + cmtList[i].cmt_user + '</span>' + cmtList[i].cmtContent + '</p>';
									}
									txt += '</div>';
								}
								return txt;
							})(i) +
						'</div>' +
						'<aside class="timeLineItem-toolbar">' +
							'<div class="timeLineItem-iconbox shareIcon"><i></i></div>' +
							'<div class="timeLineItem-iconbox likeIcon' + (function(index){
								if (photos[index]['like_user'] == null) {
									return '';
								} else {
									return ' active';
								}
							})(i) + '"><i></i></div>' +
							'<div class="timeLineItem-iconbox commentIcon" data-pid="' + photos[i]['pid'] + '"><i></i></div>' +
						'</aside>' +
					'</section>';
		}

		return output;
	}

	//末级页信息
	function photoInfo(data){
		return '' +
		'<header class="topbar">' +
			'<div class="topbar-left"><div class="topbar-back"></div></div>' +
			'<h1 class="logo"><a href="/"><span class="hide">winds</span></a></h1>' +
		'</header>' +
		'<div class="main">' +
			'<div class="imgModal">' +
				'<div class="imgArea">' +
					'<img src="' + getPictureUrl(data.photoInfo.pic_src, 'timeline') + '">' +
				'</div>' +
				'<div class="imgModal-fnbar">' +
					'<div class="fnbar-left"><i></i></div>' +
					'<div class="fnbarItem final_likeBtn">' +
						'<div class="fnbar-iconbox likeIcon_final"><i></i></div>' +
						'<span class="iconbox-num">' + data.photoInfo.likeNum + '</span>' +
					'</div>' +
					'<div class="fnbarItem final_cmtBtn">' +
						'<div class="fnbar-iconbox commentIcon_final"><i></i></div>' +
						'<span class="iconbox-num">' + data.photoInfo.cmtNum + '</span>' +
					'</div>' +
				'</div>' +
				'<div class="imgModal-personInfo">' +
					'<div class="personInfo-head">' +
						'<img src="' + data.photoInfo.user_head.slice(1,-1).split(',')[1] + '">' +
					'</div>' +
					'<div class="personInfo-content">' +
						'<div class="personInfo-name">' + data.photoInfo.user_name + '</div>' +
						'<div class="personInfo-desc">' + data.photoInfo.pic_desc + '</div>' +
						'<div class="personInfo-time">' + timeDifference(data.photoInfo.uptime) + '</div>' +
					'</div>' +
					'<div class="personInfo-btn">' +
						'<i class="commentIconBtn"></i>' +
					'</div>' +
				'</div>' +
				'<section class="msgModal">' +
					'<h2 class="msgModal-title">留言</h2>' +
					'<section class="msgModal-box">' +
						'<div class="messageList">' +
							finalCmtModule(data.cmtList) +
							/*(function(){
								var dataList = data.cmtList;
								var str = '';
								for (var i = 0; i < dataList.length; i++) {
									str += '<section class="messageItem">' +
										'<div class="personInfo-head">' +
											'<img src="' + dataList[i].user_head.slice(1,-1).split(',')[1] + '">' +
										'</div>' +
										'<div class="personInfo-content">' +
											'<div class="personInfo-name">' + dataList[i].user_name + '</div>' +
											'<div class="personInfo-desc">' + dataList[i].cmtContent + '</div>' +
											'<div class="personInfo-time">' + timeDifference(dataList[i].cmtTime) + '</div>' +
										'</div>' +
									'</section>';
								}

								return str;
							})() +*/
						'</div>' +
					'</section>' +
				'</section>' +
			'</div>' +
		'</div>';
	}

	//图片末级页评论模块
	function finalCmtModule(dataList){
		var str = '';
		console.info(dataList)
		if (!dataList.length) {
			return '<p class="nullCmt">还没有留言</p>';
		}
		for (var i = 0; i < dataList.length; i++) {
			str += '<section class="messageItem">' +
				'<div class="personInfo-head">' +
					'<img src="' + dataList[i].user_head.slice(1,-1).split(',')[1] + '">' +
				'</div>' +
				'<div class="personInfo-content">' +
					'<div class="personInfo-name">' + dataList[i].user_name + '</div>' +
					'<div class="personInfo-desc">' + dataList[i].cmtContent + '</div>' +
					'<div class="personInfo-time">' + timeDifference(dataList[i].cmtTime) + '</div>' +
				'</div>' +
			'</section>';
		}

		return str;
	}

	//计算距今时间
	function timeDifference(datetime){
		var diffTime,
			minute = 1000 * 60,
			hour = minute * 60,
			day = hour * 24,
			month = day * 30,
			time = +new Date(user.time),  //现在时间戳
			timestamp = +new Date(datetime);   //上传时间戳

		diffTime = time - timestamp;
		
		if (diffTime < 0 ) return "刚刚上传";
		
		var diffMonth = diffTime / month,
			diffWeek = diffTime / (day * 7),
			diffDay = diffTime / day,
			diffHour = diffTime / hour,
			diffMinute = diffTime / minute;

		if (diffMonth >= 1) {
			return parseInt(diffMonth) + "个月前";
		}
		if (diffWeek >= 1) {
			return parseInt(diffWeek) + "周前";
		}
		if (diffDay >= 1) {
			return parseInt(diffDay) + "天前";
		}
		if (diffHour >= 1) {
			return parseInt(diffHour) + "小时前";
		}
		if (diffMinute >= 1) {
			return parseInt(diffMinute) + "分钟前";
		}
		if (parseInt(diffMinute) == 0) {
			return "刚刚上传";
		}

		return datetime;
	}

	//根据屏幕尺寸获取图片
	function getPictureUrl(piclist, looktype){
		//屏幕尺寸
		var screenSize = window.innerWidth;
		//查看方式为时间轴
		if (looktype === 'timeline') {
			if (screenSize > 760) {
				return piclist.slice(1,-1).split(',')[0];
			}
			if (screenSize <= 760 && screenSize > 479) {
				return piclist.slice(1,-1).split(',')[1];
			}
			if (screenSize <= 479) {
				return piclist.slice(1,-1).split(',')[2];
			}
		}
		//查看方式为列表
		if (looktype === 'list') {
			if (screenSize >= 359) {
				return piclist.slice(1,-1).split(',')[3];
			}
			if (screenSize < 359) {
				return piclist.slice(1,-1).split(',')[4];
			}
		}
	}

	return {
		loadAsideUserInfo: loadAsideUserInfo,
		loadUploadIndex: uploadIndex,
		uploadEdit: uploadEdit,
		loading: loadingLayer,
		uploadStatus: uploadStatus,
		timeLineList: timeLineList,
		albumList: albumList,
		finalCmtModule: finalCmtModule,
		timeFormat: timeDifference,
		photoInfo: photoInfo
	}
}());