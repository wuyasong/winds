APP.uploadController = (function(doc){
	'use strict';
	var $ = function(selector){ return doc.querySelector(selector); };
	var $tag = function(selector){ return doc.querySelectorAll(selector); };
	function hasClass(elem, cls){
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		return elem.className.match(reg);
	};
	function addClass(elem, cls){
		if (!hasClass(elem, cls)) {
			elem.className += (' ' + cls);
		}
	};
	function removeClass(elem, cls){
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		if (hasClass(elem, cls)) {
			elem.className = elem.className.replace(reg, '');
		}
	};

	//定义局部Icrop组件
	var Icrop = null;
	//创建上传图片参数对象
	var realIcrop = {};
	//图片信息
	var img = new Image();
	//var picW = 0;

	//上传功能初始化
	function init(f){
		//判断是否符合条件
		checkImage(f);
	}

	//
	function checkImage(f){
		var url;
		var file = f.files[0];
		var reader;
		//图片加载完成之前显示等待框
		APP.applicationController.loading();
		//侧边栏隐藏
		APP.asiderHide();
		//显示当前进程框
		showProcess();
		//页面渲染
		pageload();

		//读取图片URL
		reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = function(e){
			url = e.target.result;
			img.src = url;
		}
		//预加载图片
		img.onload = function(){
			/*if (this.width < 1200 || this.height < 1200) {
				APP.applicationController.prompts.tipTop('图片尺寸太小');
				//清空文件域信息
				$('#upfile').value = '';
				return;
			}*/
			//picW = this.width;
			realIcrop.sourcew = this.width;
			realIcrop.sourceh = this.height;
			//图片URL读取
			readIMGURL(url, file);
		}
	}

	//渲染upload页面
	function pageload(){
		//渲染upload页面
		$('#child-process').innerHTML = APP.templates.loadUploadIndex();
		//裁切上一步
		$('#toback').addEventListener('touchstart', cut_backStep, false);
		//裁切下一步
		$('#tofroward').addEventListener('touchstart', cut_nextStep, false);
		//编辑图片上一步
		$('#toback_edit').addEventListener('touchstart', edit_backStep, false);
		//编辑图片下一步
		$('#tofroward_edit').addEventListener('touchstart', edit_nextStep, false);
	}

	//显示子线程
	function showProcess(){
		$('#viewport').style.display = 'none';
		$('#child-process').style.display = 'block';
	}

	//显示主线程
	function killProcess(){
		$('#viewport').style.display = 'block';
		$('#child-process').style.display = 'none';
	}

	//图片URL读取
	function readIMGURL(url, file){
		//var url = window.URL.createObjectURL(file);
		$('#IcropShowImg').src = url;  //裁切页预览处加载图片路径
		$('#crop-img').src = url;  //裁切页视口加载图片路径
		$('#IcropShowImg').onload = function(){
			APP.applicationController.loaded();
			//图片裁切功能操作
			Icrop = user.Icrop({
				frame: $('#IcropFrame'),
				view: $('#IcropView'),
				dropGrop: $tag('.cut-dotWrap'),
				cropImage: $('#crop-img'),
				viewImg: $('#IcropShowImg')
			});
		}
	}

	//裁切上一步
	function cut_backStep(){
		//清空文件域信息
		$('#upfile').value = '';
		$('#child-process').style.display = 'none';
		$('#viewport').style.display = 'block';
	}
	//裁切下一步
	function cut_nextStep(){
		$('#child-process').style.height = 'auto';
		//进入编辑页
		toggleStep(2);
		//canvas加载裁切后的图片
		canvasImg(Icrop.cropObj);
	}
	//编辑图片信息上一步
	function edit_backStep(){
		$('#child-process').style.height = '100%';
		//进入裁切页
		toggleStep(1);
		$('#IcropShowImg').style.maxHeight = $('#IcropFrame').offsetHeight + 'px';
		$('#IcropShowImg').style.maxWidth = $('#IcropFrame').offsetWidth + 'px';
	}
	//编辑图片信息下一步
	function edit_nextStep(){
		//获取图片标题和图片标签
		var up_input = $tag('#edit-frame input');
		var len = up_input.length;
		var uploadStatus = true;
		//检测描述和标签是否有值
		for (var i = 0; i < len; i++) {
			var type = up_input[i].getAttribute('data-type');
			var val = up_input[i].value;
			up_input[i].onfocus = function(){ removeClass($('#formTipInfo'), 'open'); };
			if (user.check[type](val) != true) {
				uploadStatus = false;
				$('#formTipInfo').innerHTML = user.check[type](val);
				addClass($('#formTipInfo'), 'open');
				setTimeout(function(){
					removeClass($('#formTipInfo'), 'open');
				}, 3000);
				return;
			} else {
				removeClass($('#formTipInfo'), 'open');
			}
		}

		//符合上传条件
		if (uploadStatus) {
			console.info('send');
			//执行上传操作
			uploadImage();
		}
		else {
			console.info('nosend');
		}
	}

	//上传图片
	function uploadImage(){
		var up_input = $tag('#edit-frame input');
		var formData;
		//创建FormData对象
		formData = new FormData();
		//导入进FormData参数
		formData.append('uid', user.uid);
		formData.append('label', up_input[1].value);
		formData.append('description', up_input[0].value);
		formData.append('imgObj', $('#upfile').files[0]);
		for (var key in realIcrop) {
			formData.append(key, realIcrop[key]);
		}
		//debugger
		//发送上传请求
		user.senddata({
			type: 'POST',
			header: ['X-Requested-With','XMLHttpRequest'],   //使用FormData模拟表单上传需设置这一种头部
			url: 'upload/uploadImg.php?ran=' + Math.random(),
			data: formData,
			upload: {
				progress: function(ev){
					if (ev.lengthComputable) {
						//显示主窗口
						killProcess();
						//加载进度栏
						uploading('ing');
					}
				}
			},
			success: function(data) {
				//上传成功
				uploading('success');
				//uploading('fail');
			},
			error: function(){
				//上传失败
				uploading('fail');
			}
		});
	}

	//上传状态显示
	function uploading(state){
		var wrapper, odiv;
		if (!$('#updTask')) {
			wrapper = $('#main');
			odiv = doc.createElement('div');
			odiv.id = 'updTask';
			odiv.className = 'updTask';
			odiv.innerHTML = APP.templates.uploadStatus(state);
			wrapper.insertBefore(odiv, wrapper.childNodes[0]);
		} else {
			$('#updTask').innerHTML = APP.templates.uploadStatus(state);
		}
		if (state == 'success') {
			//延迟2秒消失上传状态
			setTimeout(function(){
				$('#main').removeChild($('#updTask'));
			}, 2000);
		}
		if (state == 'fail') {
			$('#redoUpload').onclick = uploadImage;
		}
	}

	//切换步骤框
	function toggleStep(step){
		if (step == 1) {
			$('#handleUpEdit').style.display = 'none';
			$('#handleUpCut').style.display = 'block';
		} else {
			$('#handleUpCut').style.display = 'none';
			$('#handleUpEdit').style.display = 'block';
		}
	}

	//裁切图片通过canvas展示出来
	function canvasImg(obj){
		$('#editImg').height = $('#editImg').width = window.innerWidth;
		var canvas = $('#editImg').getContext('2d');
		//计算原图与网页上呈现图片大小的比例
		var ratiow = realIcrop.sourcew / obj.viewImgWidth;
		var ratioh = realIcrop.sourceh / obj.viewImgHeight;
		var realx = obj.initx * ratiow;
		var realy = obj.inity * ratioh;
		var realw = obj.width * ratiow;
		var realh = obj.height * ratioh;
		//显示裁切后的图片
		canvas.drawImage(img, realx, realy, realw, realh, 0, 0, window.innerWidth, window.innerWidth);
		realIcrop.ratiow = obj.viewImgWidth / obj.width;
		realIcrop.ratioh = obj.viewImgHeight / obj.height;
		realIcrop.ratiox = obj.initx / obj.viewImgWidth;
		realIcrop.ratioy = obj.inity / obj.viewImgHeight;

		//Icrop = null;
	}

	return {
		init: init,
		uploadImage: uploadImage
	}
})(document);