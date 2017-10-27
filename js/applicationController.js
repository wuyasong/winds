/*
 * controller应用程序控制模块
 */
APP.applicationController = (function(doc, $){
	'use strict';

	var model = 'timeline';
	var index = 0;
	//启动应用程序
	function appstart(){
		//加载图片列表数据
		APP.photoController.showPhotoList('timeline');
		//
		pageRender();
		//配置路由
		//configRoute();
		APP.router.add('index', function(){
			//加载图片列表数据
			APP.photoController.showPhotoList('timeline', function(){
				$('#viewport').show();
				$('#home-process').hide();
				$('#final-process').hide();
			});
		});
		APP.router.add('home', function(){
			var uid = user.toUid == undefined ? localStorage.getItem('toUid') : user.toUid; 
			$('#viewport').hide();
			$('#final-process').hide();
			$('#home-process').show();
			APP.homeController.showList(uid);
		}, function (target){
			if (target.getAttribute("data-uid")) {
				user.toUid = target.getAttribute("data-uid");
				localStorage.setItem('toUid', target.getAttribute("data-uid"));
			}
		});
		APP.router.add('image', function(){
			//获取图片id和用户id
			var pid = (user.final_pid == undefined ? localStorage.getItem('final_pid') : user.final_pid);
			var uid = (user.final_uid == undefined ? localStorage.getItem('final_uid') : user.final_uid);
				console.info(pid)
				console.info(uid)
			//切换div显示末级页数据
			$('#viewport').hide();
			$('#home-process').hide();
			$('#final-process').show();
			APP.finalController.render(pid, uid);
		}, function (target){
			if (target.getAttribute("data-pid")) {
				var final_uid = (user.toUid == undefined ? localStorage.getItem('toUid') : user.toUid);
				var final_pid = target.getAttribute("data-pid");
				//缓存至页面的user对象的属性中
				user.final_pid = final_pid;
				user.final_uid = final_uid;
				//存储到本地  应对页面刷新等情况user对象中缓存的属性消失
				localStorage.setItem('final_pid', final_pid);
				localStorage.setItem('final_uid', final_uid);
			}
		});
		APP.router.start();
		//打开本地数据库
		APP.database.open();
		//self.webView.scrollView.decelerationRate = UIScrollViewDecelerationRateNormal;
	}

	//渲染页面
	function pageRender(){
		//侧边栏加载
		$('#asider')[0].innerHTML = APP.templates.loadAsideUserInfo();
		$('#topbar-fnBtn')[0].addEventListener('click', APP.asiderShow, false);
		$('#maskLayer').on('touchstart', function(){
			APP.asiderHide();
			$(this).hide();
			$('#shareTo').hide();
		});
		$('#topbar-lookBtn')[0].addEventListener('click', showTypeList, false);
		pulltorefresh(); //下拉刷新
	}

	//绑定body的点击移除下拉框事件
	function bindBodyEvent(){
		doc.body.onclick = null;
		doc.body.onclick = removeSelectList;
	}

	//移除下拉框
	function removeSelectList(){
		$('#topbar-droplist').removeClass('dropShow');
		$('#topbar-lookBtn').attr('show', 'show');
	}

	//切换列表
	function tabList(e, _this){
		e.stopPropagation();
		model = _this.getAttribute('data-type');
		APP.photoController.showPhotoList(model);
		setTimeout(removeSelectList, 100);

		bindBodyEvent();
	}

	//显示下拉框动画
	function showTypeList(e){
		e.stopPropagation();

		var dropBtn = $('#topbar-lookBtn');
		var isShow = dropBtn.attr('show');

		//初始为null 为show时显示，否则隐藏
		if (isShow == 'show' || isShow == null) {
			$('#topbar-droplist').addClass('dropShow');
			dropBtn.attr('show', 'hide');
		} else {
			$('#topbar-droplist').removeClass('dropShow');
			dropBtn.attr('show', 'show');
		}

		var droplist = $('#topbar-droplist li')[0]
		var l = droplist.length;
		for (var i = 0; i < l; i++) {
			droplist[i].onclick = function (e){ tabList(e, this) };
		}

		bindBodyEvent();
	}

	//等待框加载
	function loading(wrap){
		var wrapper = wrap || doc.body;
		var odiv = doc.createElement('div');
		odiv.id = 'loadWrap';
		odiv.innerHTML = APP.templates.loading();
		wrapper.appendChild(odiv);
	}

	//上传状态显示
	function uploadStatus(state){
		var wrapper, odiv;
		if (!$('#updTask')[0]) {
			wrapper = $('#main')[0];
			odiv = doc.createElement('div');
			odiv.id = 'updTask';
			odiv.className = 'updTask';
			odiv.innerHTML = APP.templates.uploadStatus(state);
			wrapper.insertBefore(odiv, wrapper.childNodes[0]);
		} else {
			$('#updTask')[0].innerHTML = APP.templates.uploadStatus(state);
		}
		if (state == 'fail') {
			$('#redoUpload')[0].onclick = APP.uploadController.uploadImage();
		}
	}

	//显示提示框
	function showTip(txt){
		var wrapper = doc.body;
		var odiv = doc.createElement('div');
		odiv.className = 'formTipInfo';
		//debugger;
		odiv.innerHTML = txt;
		wrapper.appendChild(odiv);
		setTimeout(function() {
			addClass(odiv, 'open');
			//移除动画
			setTimeout(function(){
				removeClass(odiv, 'open');
				//移除元素
				setTimeout(function() { odiv.parentNode.removeChild(odiv); }, 300);
			}, 2000);
		}, 10);
	}

	function loaded(){
		$('#loadWrap')[0].parentNode.removeChild($('#loadWrap')[0]);
	}

	//下拉刷新
	function pulltorefresh(){
		//执行下拉刷新动画
		var pulldown = pullrefresh($('#main')[0], {
			pullElem: $('.pullDownBar')[0],
			topOffset: 50,
			onpullstart: function(){
				$('.pulldownIcon').show();
				$('#pulldownrefresh').hide();
			},
			onRefresh: function(state){
				$('.pulldownIcon')[0].style.webkitTransition = '-webkit-transform 300ms ease-out';
				if (state == -1) {  //下拉刷新
					$('.pulldownIcon').removeClass('up');
				}
				if (state == 1) {  //松开立即刷新
					$('.pulldownIcon').addClass('up');
				}
				if (state == 2) {//满足刷新数据条件
					index = 0;
					$('.pulldownIcon').hide();
					$('#pulldownrefresh').show().addClass('loadinggif');
					// 动态获取数据
					setTimeout(function() {
						APP.photoController.updatePhotoList(model, index, 15, hidePullto);
					}, 600);
				}

				//隐藏下拉刷新状态
				function hidePullto(){
					$('.pulldownIcon').removeClass('up');
					$('#pulldownrefresh').show().addClass('loadinggif');
					$('.pulldownIcon')[0].style.webkitTransition = '';
					pulldown.refresh(); //高度回0
				}
			}
		});
	}


	return {
		start: appstart,
		loading: loading,
		loaded: loaded
	};
}(document, $));