APP.homeController = (function(){
	'use strict';

	//显示个人页的数据
	function showList(uid){
		window.scrollTo(0,0);
		$('#home-process').html('');
		user.senddata({
			type: 'GET',
			url: 'api/get_userPhotolist.php?toUid=' + uid + '&myuid=' + user.uid + '&ran=' + Math.random(),
			success: function (data){
				var json = JSON.parse(data);
				var count = json.count;
				$('#home-process').html( APP.templates.home.frame(uid, json) );
				APP.photoController.lazyloadImg( document.querySelectorAll('.photosItem img') );
				window.onscroll = null;
				//window.onscroll = APP.photoController.lazyloadImg( document.querySelectorAll('.photosItem img') );
				bindPageHandler(uid);
			}
		});
	}

	//个人页事件处理程序
	function bindPageHandler(toUid){
		//返回上一级
		$('.topbar-left').on('tapend', function(){
			history.go(-1);
		});
		//点击关注事件
		if ($('.personState')) {
			$('.personState').on('tapend', function(){
				var isAtten = Number($('.personState').attr('isAtten'));
				if (!user.uid) {
					alert('请登录');
					return;
				}
				//已关注就结束本事件
				if ( isAtten ) {
					return;
				} else {
					//发送关注请求
					sendAttenRequest(toUid, user.uid);
				}
			});
		}
		//点击显示个人页功能栏
		$('.personSelectDot').on('click', function(){
			if ($('.personSelectList')[0].style.display == 'block') {
				$('.personSelectList').hide();
			} else {
				$('.personSelectList').show();
			}
		})
	}
	//发送关注请求
	function sendAttenRequest(toUid){
		user.senddata({
			type: 'GET',
			url: 'api/toAttenUser.php?toUid=' + toUid + '&myUid=' + user.uid + '&ran=' + Math.random(),
			success: function (data){
				var json = JSON.parse(data);
				if (json.isAtten == 'yes') {
					alert('已关注');
					return false;
				} else if (json.isAtten == 'no' && json.attenState == 1) {
					alert('关注成功');
					$('.personState').removeClass('unatten').addClass('atten');
					return true;
				} else {
					alert('处理错误');
				}
			}
		});
	}

	return {
		showList: showList
	}
}());