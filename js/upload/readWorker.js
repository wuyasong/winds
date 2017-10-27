var file;
self.onmessage = function(e){
	file = e.data;
}
	//定义局部Icrop组件
	var Icrop = null;
	//创建上传图片参数对象
	var realIcrop = {};
	//图片信息
	//var img = new Image();
		//读取图片URL
		reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = function(e){
			url = e.target.result;
			//img.src = url;
			postMeaage(url);
		}
		//预加载图片
	// 	img.onload = function(){
	// 		/*if (this.width < 1200 || this.height < 1200) {
	// 			APP.applicationController.prompts.tipTop('图片尺寸太小');
	// 			//清空文件域信息
	// 			$('#upfile').value = '';
	// 			return;
	// 		}*/
	// 		//picW = this.width;
	// 		realIcrop.sourcew = this.width;
	// 		realIcrop.sourceh = this.height;
	// 		//图片URL读取
	// 		readIMGURL(url, file);
	// 	}

	// //图片URL读取
	// function readIMGURL(url, file){
	// 	//var url = window.URL.createObjectURL(file);
	// 	$('#IcropShowImg').src = url;  //裁切页预览处加载图片路径
	// 	$('#crop-img').src = url;  //裁切页视口加载图片路径
	// 	$('#IcropShowImg').onload = function(){
	// 		APP.applicationController.loaded();
	// 		//图片裁切功能操作
	// 		Icrop = user.Icrop({
	// 			frame: $('#IcropFrame'),
	// 			view: $('#IcropView'),
	// 			dropGrop: $tag('.cut-dotWrap'),
	// 			cropImage: $('#crop-img'),
	// 			viewImg: $('#IcropShowImg')
	// 		});
	// 	}
	// }