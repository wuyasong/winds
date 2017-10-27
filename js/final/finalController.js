APP.finalController = (function(){
	'use strict';

	var winW = window.innerWidth;

	//渲染图片末级页
	function RenderPage(pid, uid){
		window.scrollTo(0,0);
		user.senddata({
			type: 'GET',
			url: 'api/get_finalPhotoData.php?pid=' + pid + '&uid=' + uid + '&ran=' + Math.random(),
			success: function (data){
				var json = JSON.parse(data);
				$('#final-process').html( APP.templates.photoInfo(json) );
				bindPageHandler(pid);
			}
		});
	}

	//页面事件处理程序
	function bindPageHandler(pid){
		//返回上一级
		$('.topbar-left').on('tapend', function(){
			history.go(-1);
		});
		$('.imgArea img')[0].style.width = winW + 'px';
		$('.imgArea img')[0].style.height = winW + 'px';
		//评论处理
		$('.personInfo-btn').on('tap', function(){
			$(this).addClass('active');
		});
		$('.personInfo-btn').on('tapend', function(){
			$(this).removeClass('active');
			//显示评论弹窗
			APP.photoController.openCmtWin(pid);
		});
		//点击遮罩层移除弹窗
		$('#maskLayer').on('tap', APP.photoController.closeCmtWin);
		//点击发送评论处理
		cmtSendHandler(pid);
		//点赞处理
		// $('.final_likeBtn').on('tap', function(){});
		// $('.final_likeBtn').on('tapend', function(){});
	}

	//点击发送评论处理
	function cmtSendHandler(pid){

		$('.cmtSend')[0].onclick = function cmtSend(){
			var val = user.check.trim($('.cmtWrapper input')[0].value);
			//var pid = $(this).attr('pid');
			//值为空不可评论
			if (!val) {
				alert('评论内容不能为空');
				return false;
			}
			//用户未登录不可评论
			if (!user.uid) {
				alert('请登录');
				return false;
			}
			//发送评论请求带用户id、评论内容、图片id
			user.senddata({
				type: 'POST',
				url: 'api/insertComment.php?ran=' + Math.random(),
				data: 'cmt=' + val + '&pid=' + pid + '&uid=' + user.uid,
				success: function(data){
					//
					if (data == 1) {
						//评论成功
						//弹窗关闭
						APP.photoController.closeCmtWin();
						//更新区域评论
						updateOneCmt(val);
					} else if (data == -1) {
						//评论失败
						//提示失败
						alert('评论失败');
						//弹窗关闭
						APP.photoController.closeCmtWin();
					} else {
						//评论异常
						//提示异常
						alert('评论异常');
						//弹窗关闭
						APP.photoController.closeCmtWin();
					}
				}
			});
		}

	}

	//更新评论
	function updateOneCmt(val){
		var data = [{
			user_head: user.profile,
			user_name: user.name,
			cmtContent: val,
			cmtTime: new Date()
		}];
		$('.messageList').html( APP.templates.finalCmtModule(data) + $('.messageList').html() );
	}

	return {
		render: RenderPage
	};
}());