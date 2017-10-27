/*
 * user公共模块
 * _check
 * - module模式
 */
(function(window, doc){
	//输入框验证
	user.check = (function(){
		function trim(str){
			return str.replace(/(^\s*)|(\s*$)/g, '');
		}
		//检测email
		function check_email(value){
			var emailstr = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
			if (trim(value) == '') return '请输入邮箱';
			if (!emailstr.exec(value)) return '邮箱格式不正确';
			return true;
		}
		//检测password len < 20
		function check_password(value){
			if (trim(value) == '') return '请输入密码';
			if (trim(value).length < 6 || trim(value).length > 20) return '密码长度在6到20位之间';
			return true;
		}
		//检测username len < 20
		function check_username(value){
			if (trim(value) == '') return '请输入用户名';
			if (trim(value).length > 20) return '用户名长度需在20位以内';
			return true;
		}
		//检测description
		function check_description(value){
			//if (trim(value) == '') return false;
			if (trim(value).length > 200) return '个人简介字数需在200位之内';
			return true;
		}
		//检测userhead
		function check_userhead(value){
			var limType = /jpg|gif|jpeg|png|bmp/gi;
			var fileType = value.substring(value.lastIndexOf('.') + 1);
			if (trim(value) == '') return '请上传头像';
			if (!limType.test(fileType)) return '请上传正确格式头像';
			return true;
		}
		//检测上传图片描述
		function check_up_desc(value){
			if (trim(value) == '') return '请输入图片描述';
			if (trim(value).length > 140) return '图片描述字数需在140位之内';
			return true;
		}
		//检测上传图片标签
		function check_up_label(value){
			if (trim(value) == '') return '请输入图片标签';
			if (trim(value).length > 100) return '图片标签字数需在100位之内';
			return true;
		}

		return {
			trim: trim,
			email: check_email,
			password: check_password,
			username: check_username,
			description: check_description,
			head: check_userhead,
			up_desc: check_up_desc,
			up_label: check_up_label
		};
	}());

	user.senddata = (function(){
		//
		return function (options){
			var xhr = new XMLHttpRequest();
			var async = (options.async == undefined) ? true : options.async;
			xhr.open(options.type, options.url, async);
			xhr.onload = function(){
				if (options.success) {
					options.success.call(this, this.responseText, this.status);
				}
			}
			xhr.onerror = function(){
				if (options.error) {
					options.error.call(this, this.responseText, this.status);
				}
			}
			xhr.onprogress = function(e){  //下载进度
				if (options.progress) {
					options.progress.call(this, e);
				}
			}
			if ('upload' in new XMLHttpRequest) {
				xhr.upload.onprogress = function(e){   //上传进度
					if (options.upload) {
						if (options.upload.progress) {
							options.upload.progress.call(this, e);
						}
					}
				}
			}
			if (/post/i.test(options.type)) {
				if (options.header) {
					xhr.setRequestHeader(options.header[0],options.header[1]);
				} else {
					xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				}
			}
			xhr.send(options.data||null);
		}
	}());
	//据尺寸获取用户头像
	/*user.getHead = function(size){
		if (size === '144') {
			return user.profile.slice(1,-1).split(',')[0];
		}
		if (size === '84') {
			return user.profile.slice(1,-1).split(',')[1];
		}
	}*/

})(window, document);