/*
 * user.login模块
 * - module模式
 */
(function(window, doc){
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

	user.login = (function(){
		var loginTip = $('#loginTipInfo');
		//处理检测结果
		function submitHandle(){
			var logStatus = true;  //可否登录状态
			var inputEle = $tag('.login-input');

			for (var i = 0, len = inputEle.length; i < len; i++) {
				var type = inputEle[i].getAttribute('name');
				var val = inputEle[i].value;
				var parentEle = inputEle[i].parentNode;
				//不符合条件
				if (user.check[type](val) != true) {
					addClass(loginTip, 'open');
					loginTip.innerHTML = user.check[type](val);
					logStatus = false;
					return;
				} else {
					removeClass(loginTip, 'open');
				}
			}

			if (logStatus) {
				user.senddata({
					type: 'POST',
					url: 'logSubmit.php',
					data: 'email=' + $('#email').value + '&password=' + $('#password').value,
					success: function(data){
						var json;
						console.info(data)
						console.info(JSON.parse(data))
						if (data == null) return;
						json = JSON.parse(data);
						//错误提示信息
						if (json.tipinfo) {
							addClass(loginTip, 'open');
							loginTip.innerHTML = json.tipinfo;
						} else {   //登录成功
							location.href = '../index.php#!index';
						}
					}
				});
			}
		}

		return {
			submit: submitHandle
		};
	}());

	//监听登录点击事件
	$('#logBtn').addEventListener('click', user.login.submit, false);
})(window, document);