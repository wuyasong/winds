(function(){
	//侧边连滑动动画
	var winW = window.innerWidth;
	var winH = window.innerHeight;
	var $ = function(selector){ return document.querySelector(selector); };
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

	//切换侧边栏显隐效果
	function toggleAsider(eleArr, status, cls){
		return function(){
			if (cls === 'aside') {
				$('#maskLayer').style.display = status;
			}
			for (var i = 0; i < eleArr.length; i++) {
				if (status == 'block') {
					addClass(eleArr[i], 'show');
				} else {
					removeClass(eleArr[i], 'show');
				}
			}
		}
	}
	//$('#topbar-fnBtn').addEventListener('touchstart', toggleAsider([$('#asider')],'block', 'aside'), false);
	//$('#maskLayer').addEventListener('touchstart', toggleAsider([$('#asider')],'none', 'aside'), false);

	APP.asiderShow = toggleAsider([$('#asider')],'block', 'aside');
	APP.asiderHide = toggleAsider([$('#asider')],'none', 'aside');
})();