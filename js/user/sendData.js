/*
 * user.senddata模块
 */
(function(window, doc){
	user.senddata = (function(){
		//
		return function (options){
			var xhr = new XMLHttpRequest();
			var async = (options.async == undefined) ? true : options.async;
			xhr.open(options.type, options.url, async);
			xhr.onload = function(){
				options.success.call(this, this.responseText);
			}
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			xhr.send(options.data||null);
		}
	}());
})(window, document);