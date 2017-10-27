/**
  * 图片列表控制器
  * 功能：
  * 动态获取图片列表数据，交给photos.js
  * 由photos.js执行在本地数据库的增删查改操作
  * 
  * 
  */
APP.photoController = (function(doc){
	'use strict';
	var loading_gif = '<img src="images/loading50.gif" class="loading50Index">';
	var index = 0;
	var model = 'timeline';

	//首次加载显示图片列表数据
	/*
	 * 执行updatePhotoList方法，从服务器获取数据并刷新本地SQL
	 */
	function showPhotoList(type, callback){
		//if (!resource) {  //没有本地数据缓存
			console.info(type)
			updatePhotoList(type, 0, 15, callback);
		//} else {  //有本地数据缓存
			//console.info('read cache')
			//selectPhotosSQL(type);
		//}
	}

	//获取客户端数据
	function selectPhotosSQL(type){
		APP.photos.selectFullPhotos(type, function(data){
			//加载图片列表信息
			renderDataController(type, data);
		}, function(tx, errMsg){ console.info(errMsg) });
	}

	//根据查看类型获取数据
	function renderDataController(type, data){
		//加载图片列表信息
		window.scrollTo(0, 0);
		//$('#timeLineWrapper')[0].innerHTML = loading_gif;
		setTimeout(function() {
			$('#timeLineWrapper')[0].innerHTML = APP.templates.timeLineList(data);
			//图片宽高盛满
			var $pic = $('.timeLineItem-picture');
			for (var i = 0; i < $('.timeLineItem-picture')[0].length; i++) {
				$('.timeLineItem-picture').eq(i)[0].style.width = window.innerWidth + 'px';
				$('.timeLineItem-picture').eq(i)[0].style.height = window.innerWidth + 'px';
			}
			console.info('重置图片控制程序')
			bindPhotoHandler();
			cmtHandler();
			lazyload();
			window.onscroll = lazyload;
			//window.addEventListener('scroll', lazyload, false);
		}, 100);
	}

	//lazyload
	function lazyload(){
		var imgEle = document.querySelectorAll('.timeLineItem-picture img');
		//图片延迟加载
		lazyloadImg(imgEle);
		//上拉刷新加载
		var pullupEle = $('.pullUpBar')[0];
		if (user.totalSize > index + 15) {
			$('.pullUpBar').show();
			if (pullupEle.offsetTop < doc.body.scrollTop + window.innerHeight) {
				//加载下一屏内容
				setTimeout(function() {
					index += 15;
					APP.photoController.updatePhotoList(model, index, 15);
					$('.pullUpBar').show();
				}, 1000);
				//return;
			}
		} else {
			$('.pullUpBar').hide();
		}
	}

	//延迟加载图片
	function lazyloadImg(imgArr){
		var imgEle = imgArr;
		for (var i = 0; i < imgEle.length; i++) {
			//获取屏幕已滚动的高度
			var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
			//获取屏幕高度
			var screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
			//元素距离屏幕顶部的距离
			var elemOffsetTop = imgEle[i].getBoundingClientRect().top;
			//如果元素到达屏幕内
						// console.info(elemOffsetTop + scrollHeight < screenHeight + scrollHeight)
			if ( (elemOffsetTop + scrollHeight < screenHeight + scrollHeight)/* && (elemOffsetTop + scrollHeight > scrollHeight)*/ ) {
				//加载图片src
				var dataSrc = imgEle[i].getAttribute('data-src');
				if (dataSrc) {
					imgEle[i].src = dataSrc;
					imgEle[i].onload = function(){
						this.style.opacity = 1;
						this.removeAttribute('data-src');
						this.onload = null;
					}
				}
			}
		}
	}

	//根据查看类型添加数据
	function appendDataController(type, data){
		//加载图片列表信息
		$('#timeLineWrapper')[0].innerHTML += APP.templates.timeLineList(data);
		bindPhotoHandler();
	}

	//获取服务器图片列表数据
	/*
	 * 从服务器读取到数据之后
	 * 先渲染页面
	 * 再缓存本地数据
	 */
	function updatePhotoList(type, index, count, sucCall){
		if (!index) index = 0;
		if (!count) count = 15;
			console.info(user)
		//获取图片列表数据
		user.senddata({
			type: 'GET',
			url: 'api/get_common.php?type=' + type + '&index=' + index + '&count=' + count + '&uid=' + user.uid + '&ran=' + Math.random(),
			success: function(data) {
				var json = JSON.parse(data);
				var dataLen = json.data.length;

				user.totalSize = json.count;
				//加载图片列表信息
				if (index == 0) {
					renderDataController(type, json.data);
				} else {
					appendDataController(type, json.data);
				}
				//执行刷新数据成功后回调操作
				if (sucCall) {
					sucCall(json.data);
				}
				//先清除之前缓存在本地的所有数据
				for (var i = 0; i < dataLen; i++) {
					(function(index){
						APP.photos.deleteBasicPhotos(type, json.data[index].pid, function (){
							//然后重新插入
							APP.photos.insertPhotos(type, json.data[index], function (){}, function(tx, errMsg){ console.info(errMsg) });
						});
					}(i))
				}
				//重新绑定页面所有处理程序
				//bindPhotoHandler();
				
			},
			error: function(){
				alert('网络错误');
			}
		});
	}

	//插入图片点赞数据信息
	function insertLikesData(picId, userId, self, countElem){
		user.senddata({
			type: 'GET',
			url: 'api/insertLikes.php?picId=' + picId + '&userId=' + userId + '&ran=' + Math.random(),
			success: function(data) {
				var count;
				if (data == 1) { //插入成功
					self.addClass('active');
					//更新页面点赞数据值
					countElem.html(Number(countElem.html()) + 1);
				} else if (data == 0) { //已存在数据行
					return;
				} else { //插入失败
					alert('推荐失败');
				}
			},
			error: function(){
				alert('网络错误');
			}
		});
	}

	//图片工具栏中元素绑定touch事件
	function bindPhotoHandler(){
		//分享处理
		$('.shareIcon').on('tap', function(){
			$(this).addClass('active');
		});
		$('.shareIcon').on('tapend', function(){
			var self = $(this);
			setTimeout(function() {
				self.removeClass('active');
				$('#maskLayer').show();
				$('#shareTo').show();
			}, 100);
		});
		//hot处理
		$('.likeIcon').on('tap', function(){
			$(this).addClass('active');
		});
		$('.likeIcon').on('tapend', function(){
			var uid, pid, countElem, index = this.index;
			//未登录
			if (!user.uid) {
				alert('请登录');
				$(this).removeClass('active');
				return;
			}
			//已点赞
			/*if ($(this).hasClass('active')) {
				return false;
			}*/
			//已登录
			//获取用户id，当前图片id
			uid = user.uid;
			pid = $('.timeLineItem').eq(index).attr('data-pid');
			countElem = $(this).parents('.timeLineItem').find('.hotCount');
			insertLikesData(pid, uid, $(this), countElem);
		});

		//点击遮罩层移除弹窗
		$('#maskLayer').on('tap', closeWin);

		//评论操作
		for (var i = 0; i < $('.commentIcon')[0].length; i++) {
			$('.commentIcon').eq(i)[0].index = i;
			$('.commentIcon').eq(i)[0].onclick = function (){
				var pid = $(this).attr('data-pid');
				var index = this.index;

				openCmtWin(pid, index);

				$(this).removeClass('active');
			}
		}
	}

	//打开评论弹窗
	function openCmtWin(pid, index){
		//显示评论弹窗
		var $inputbox = $('.cmtWrapper input');
		var $sendbox = $('.cmtWrapper .cmtSend');
		//如果不是刚才点开的评论按钮就把输入框里的值干掉
		$sendbox.attr('pid', pid);
		if (index != undefined) {
			$sendbox.attr('index', index);
		}
		$inputbox[0].value = '';
		$('.cmtWrapper').show();
		$('.maskLayer').show();
	}

	//点击发送评论
	function cmtHandler(){
		$('.cmtSend')[0].onclick = function cmtSend(){
			var val = user.check.trim($('.cmtWrapper input')[0].value);
			var pid = $(this).attr('pid');
			var index = $(this).attr('index');
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
						closeWin();
						//更新区域评论
						updateOneCmt(index, val);
					} else if (data == -1) {
						//评论失败
						//提示失败
						alert('评论失败');
						//弹窗关闭
						closeWin();
					} else {
						//评论异常
						//提示异常
						alert('评论异常');
						//弹窗关闭
						closeWin();
					}
				}
			});
		}
	}

	//关闭评论弹窗
	function closeWin(){
		$('.maskLayer').hide();
		$('.cmtWrapper').hide();
	}

	//更新本次评论
	function updateOneCmt(index, value){
		var innhtml;
		innhtml = $('.timeLineItem').eq(index).find('.timeLineItem-cmtInfo').html();
		if (!$('.timeLineItem').eq(index)[0]) {
			return;
		}
		if (!innhtml) {
			innhtml = '';
		}
		$('.timeLineItem').eq(index).find('.timeLineItem-cmtInfo').html(innhtml + '<p><span>' + user.name + '</span>' + value + '</p>');
	}

	return {
		getPhotosData: selectPhotosSQL,
		showPhotoList: showPhotoList,
		updatePhotoList: updatePhotoList,
		lazyloadImg: lazyloadImg,
		openCmtWin: openCmtWin,
		closeCmtWin: closeWin
	}
}(document))