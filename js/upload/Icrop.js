//var user = user || {};
(function(){
	var Icrop = function(options){
		this.frame = options.frame;   //图片裁切外框
		this.view = options.view;     //视口
		this.dropGrop = options.dropGrop;  //拖拽点集合
		this.cropImage = options.cropImage;//视口内截取图片
		this.viewImg = options.viewImg;    //外框中预览图片
		//裁切参数的对象,用于返回给外部
		/*
		 * viewWidth: 裁切宽度
		 * viewHeight: 裁切高度
		 * initx: 初始x
		 * inity: 初始y
		 * width: 裁切宽度
		 * height: 裁切高度
		 */
		this.cropObj = {
			viewImgWidth: 0,
			viewImgHeight: 0,
			initx: 0,
			inity: 0,
			width: 0,
			height: 0
		};
		this.handle();
	}
	Icrop.prototype.handle = function(){
		if (typeof this.dropGrop != 'object') return;
		if (typeof this.cropImage != 'object') return;

		var self = this;
		var dropEles = this.dropGrop;
		var view = this.view;
		var len = this.dropGrop.length;
		var handleParamObj = {};
		var winWidth = window.innerWidth;
		var viewImgWidth = self.viewImg.offsetWidth;
		var viewImgHeight = self.viewImg.offsetHeight;
		//裁切预览框比例
		var scaleFrame = self.frame.offsetWidth / self.frame.offsetHeight;
		//预览图比例
		var scaleImg = viewImgWidth / viewImgHeight;

		var borderWidth = 3;
		//初始化视口
		view.style.height = view.style.width = Math.min(viewImgWidth, viewImgHeight) + 'px';
		view.style.marginLeft = view.style.marginTop = -(Math.min(viewImgWidth, viewImgHeight) / 2) + 'px';
		//视口内图片位置
		var initViewMT = -(view.offsetTop - self.viewImg.offsetTop) - borderWidth;
		var initViewML = -(view.offsetLeft - self.viewImg.offsetLeft) - borderWidth;

		//初始化视口内截取图片的尺寸位置
		self.cropImage.style.width = self.viewImg.offsetWidth + 'px';
		self.cropImage.style.marginTop = initViewMT + 'px';
		self.cropImage.style.marginLeft = initViewML + 'px';

		//初始化self.cropObj参数对象数据
		self.cropObj.viewImgWidth = viewImgWidth;
		self.cropObj.viewImgHeight = viewImgHeight;
		self.cropObj.initx = view.offsetLeft - self.viewImg.offsetLeft;
		self.cropObj.inity = view.offsetTop - self.viewImg.offsetTop;
		self.cropObj.width = view.offsetWidth;
		self.cropObj.height = view.offsetHeight;


		//缩放点绑定触摸事件
		for (var i = 0; i < len; i++) {
			dropEles[i].addEventListener('touchstart', function(e){ startHandle(e, this); }, false);
			dropEles[i].addEventListener('touchmove', moveHandle, false);
			dropEles[i].addEventListener('touchend', endHandle, false);
		}

		//视口绑定触摸事件
		view.addEventListener('touchstart', viewstartHandle, false);
		view.addEventListener('touchmove', viewmoveHandle, false);
		view.addEventListener('touchend', viewendHandle, false);

		//解绑视口移动touchmove事件接口
		function disptch(){
			view.removeEventListener('touchmove', viewmoveHandle, false);
		}
		//绑定视口移动touchmove事件接口
		function attach(){
			view.addEventListener('touchmove', viewmoveHandle, false);
		}


		function viewstartHandle(e){
			self.viewstarttop = parseInt(self.getStyle(view, 'top'));
			self.viewstartleft = parseInt(self.getStyle(view, 'left'));
			self.viewWidth = view.offsetWidth;
			self.viewHeight = view.offsetHeight;
			self.viewstartX = e.touches[0].pageX;
			self.viewstartY = e.touches[0].pageY;
		}
		function viewmoveHandle(e){
			self.viewoffsetX = e.touches[0].pageX - self.viewstartX;
			self.viewoffsetY = e.touches[0].pageY - self.viewstartY;
			e.preventDefault();

			var ymaxSize = self.viewImg.offsetTop + viewImgHeight - (view.offsetHeight / 2);
			var xmaxSize = self.viewImg.offsetLeft + viewImgWidth - (view.offsetWidth / 2);
			var yminSize = self.viewImg.offsetTop + (view.offsetHeight / 2);
			var xminSize = self.viewImg.offsetLeft + (view.offsetWidth / 2);

			var ymoveSize = self.updateViewSize(yminSize, ymaxSize, self.viewstarttop + self.viewoffsetY);
			var xmoveSize = self.updateViewSize(xminSize, xmaxSize, self.viewstartleft + self.viewoffsetX);

			view.style.top = ymoveSize + 'px';
			view.style.left = xmoveSize + 'px';
			
			handleParamObj.initx = -view.offsetLeft + self.viewImg.offsetLeft;
			handleParamObj.inity = -view.offsetTop + self.viewImg.offsetTop;

			self.cropImage.style.marginLeft = handleParamObj.initx - borderWidth + 'px';

			self.cropImage.style.marginTop = handleParamObj.inity - borderWidth + 'px';
		}
		function viewendHandle(e){
			//移动视口结束时 self.cropObj参数对象数据
			self.cropObj.initx = Math.abs(handleParamObj.initx);
			self.cropObj.inity = Math.abs(handleParamObj.inity);
			self.cropObj.width = view.offsetWidth;
			self.cropObj.height = view.offsetHeight;
		}

		function startHandle(e, elem){
			disptch();
			self.startX = e.touches[0].pageX;
			self.startY = e.touches[0].pageY;
			//视口宽度
			self.startWidth = self.view.offsetWidth;
			self.startHeight = self.view.offsetHeight;
			self.viewzoomtop = view.offsetTop;
			self.viewzoomleft = view.offsetLeft;
			//视口截取图片margin-top的值
			self.cropImgMarginT = parseInt(self.getStyle(self.cropImage, 'marginTop'));
			self.cropImgMarginL = parseInt(self.getStyle(self.cropImage, 'marginLeft'));
			//按下的是哪个方位的点
			self.dragPos = elem.getAttribute('data-pos');

			//每次按下清除偏移值
			self.offsetX = 0;
			self.offsetY = 0;
		}
		//touchmove
		function moveHandle(e){
			//滑动过程中的偏移值
			self.offsetX = e.touches[0].pageX - self.startX;
			self.offsetY = e.touches[0].pageY - self.startY;

			e.preventDefault();
			//手指滑动的距离 取x,y中最大的值 但不变符号
			var offsetPos = (Math.abs(self.offsetX) > Math.abs(self.offsetY)) ? self.offsetX : self.offsetY;
			
			//获取限制最大尺寸
			var maxSize_bottom = (self.viewImg.offsetTop + viewImgHeight) - (self.viewzoomtop + self.startHeight); //视口下方可缩放的最大距离
			var maxSize_right = (self.viewImg.offsetLeft + viewImgWidth) - (self.viewzoomleft + self.startWidth); //视口右侧可缩放的最大距离
			var maxSize_top = self.viewzoomtop - self.viewImg.offsetTop;   //视口上方可缩放的最大距离
			var maxSize_left = self.viewzoomleft - self.viewImg.offsetLeft; //视口左侧可缩放的最大距离
			var maxSize = Math.min(maxSize_top, maxSize_left, maxSize_bottom, maxSize_right);   //取可移动的最小值
			//象限判断
			switch (self.dragPos) {
				case '1':  //缩(+,+) 扩(-,-)
					offsetPos = -offsetPos;
					if (self.offsetY <= 0) { //扩
						var maxSize = Math.min(maxSize_top, maxSize_left, maxSize_bottom, maxSize_right);
						//计算限制后的移动尺寸
						offsetPos = self.updateViewSize(0, maxSize, offsetPos);
					}
					break;
				case '2': //当y>0 缩(-,+)      当y<0 扩(+,-) 
					offsetPos = (self.offsetY <= 0) ? Math.abs(offsetPos) : -Math.abs(offsetPos);
					if (self.offsetY <= 0) {
						var maxSize = Math.min(maxSize_top, maxSize_left, maxSize_bottom, maxSize_right);
						//计算限制后的移动尺寸
						offsetPos = self.updateViewSize(0, maxSize, offsetPos);
					}
					break;
				case '3': //当y<0 缩(+,-)      当y>0 扩(-,+)
					offsetPos = (self.offsetY <= 0) ? -Math.abs(offsetPos) : Math.abs(offsetPos);
					if (self.offsetY >= 0) {
						var maxSize = Math.min(maxSize_top, maxSize_left, maxSize_bottom, maxSize_right);
						//计算限制后的移动尺寸
						offsetPos = self.updateViewSize(0, maxSize, offsetPos);
					}
					break;
				case '4': //缩(-,-) 扩(+,+)
					offsetPos = offsetPos;
					if (self.offsetY >= 0) { //扩
						var maxSize = Math.min(maxSize_top, maxSize_left, maxSize_bottom, maxSize_right);
						//计算限制后的移动尺寸
						offsetPos = self.updateViewSize(0, maxSize, offsetPos);
					}
					break;
			}

			//获取限制后的实际尺寸
			var viewSize = self.startWidth + offsetPos * 2;
			viewSize = (viewSize < 60) ? 60 : viewSize;
			
			handleParamObj.initx = -view.offsetLeft + self.viewImg.offsetLeft;
			handleParamObj.inity = -view.offsetTop + self.viewImg.offsetTop;
			
			view.style.height = view.style.width = viewSize + 'px';
			
			view.style.marginTop = view.style.marginLeft = -(viewSize) / 2 + 'px';

			//不可用handleParamObj.initx  会出现卡顿
			self.cropImage.style.marginLeft = -view.offsetLeft + self.viewImg.offsetLeft - borderWidth + 'px';

			self.cropImage.style.marginTop = -view.offsetTop + self.viewImg.offsetTop - borderWidth + 'px';

		}
		//结束时记录点数据
		function endHandle(e){
			attach();
			//移动视口结束时 self.cropObj参数对象数据
			self.cropObj.initx = Math.abs(handleParamObj.initx);
			self.cropObj.inity = Math.abs(handleParamObj.inity);
			self.cropObj.width = view.offsetWidth;
			self.cropObj.height = view.offsetHeight;
		}
	},
	Icrop.prototype.getStyle = function(obj, style){
		return window.getComputedStyle ? window.getComputedStyle(obj,null)[style] : obj.currentStyle[style];
	},
	//最大尺寸
	Icrop.prototype.maxSize = function(scaleFrame, scaleImg){
		var self = this;
		var maxSize;
		//当预览图比例>=预览框比例时 maxSize = height
		if (scaleImg >= scaleFrame) {
			maxSize = viewImgHeight;
		}
		//当预览图比例<预览框比例时 maxSize = width
		else {
			maxSize = viewImgWidth;
		}
		return maxSize;
	},
	//限制后的实际尺寸
	Icrop.prototype.updateViewSize = function(minSize, maxSize, size){
		var viewSize;
		if (size >= maxSize) {
			viewSize = maxSize;
		}else if (size <= minSize) {
			viewSize = minSize;
		} else {
			viewSize = size;
		}
		return viewSize;
	}
	user.Icrop = function(options){
		return new Icrop(options);
	}
})();