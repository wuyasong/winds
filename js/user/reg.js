/*
 * user.reg模块
 * input的class需有login-input
 * input name属性值为检测的类型
 * 目前支持的类型有email,password,username,description,file
 * form的name和id需定义为regForm
 * - module模式
 */
(function(doc){
	var $ = function(selector){ return doc.querySelector(selector); };
	var $tag = function(selector){ return doc.querySelectorAll(selector); };
	var hasClass = function(elem, cls){
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		return elem.className.match(reg);
	};
	var addClass = function(elem, cls){
		if (!hasClass(elem, cls)) {
			elem.className += (' ' + cls);
		}
	};
	var removeClass = function(elem, cls){
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		if (hasClass(elem, cls)) {
			elem.className = elem.className.replace(reg, '');
		}
	};

	user.reg = (function(){
		//处理检测结果
		function submitHandle(){
			var regStatus = true;
			var inputEle = $tag('.login-input');
			var loginTip = $('#loginTipInfo');
			var form1 = $('#regForm');

			for (var i = 0, len = inputEle.length; i < len; i++) {
				var type = inputEle[i].getAttribute('name');
				var val = inputEle[i].value;
				var parentEle = inputEle[i].parentNode;
				if (user.check[type](val) != true) {
					addClass(loginTip, 'open');
					loginTip.innerHTML = user.check[type](val);
					regStatus = false;
					return;
				} else {
					removeClass(loginTip, 'open');
				}
			}

			if (regStatus) {
				form1.submit();
			}
		}

		return {
			submit: submitHandle
		};
	}());

	//监听注册点击事件
	$('#regBtn').addEventListener('click', user.reg.submit, false);
})(document);