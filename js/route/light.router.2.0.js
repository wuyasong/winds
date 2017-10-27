/*
 * 路由配置light.router.js
 * 版本1.0
 * 功能：通过url的hash来执行动作
 * 支持移动开发和非IE低版本版本浏览器
 * #注意：如果使用history API必须基于服务器上运行，否则出现跨域提示
 * hashchange 使用#!做变化
 * popstate   使用?做变化
 * 路由文档：
 * 
 * M -> 
 * 设置路由，将配置状态对象数组存入执行作用域中
 * 
 * C ->
 * 路由函数执行start
 * 判断使用< hash API >或是< history API >
 * 
 * 如果使用hash
 * 获取hash路径
 * 
 * 如果使用history
 * 获取整个路径
 * 
 * hashchange事件执行时，不替换location
 * 初始化时，替换location
 * 
 * 替换location(window.location.replace()会导致前进后退按钮失效)
 * 
 * 截获页面所有点击事件
 * 阻止默认事件（阻止a链接的跳转事件）
 * 如果hash发生变化   ->   执行guide方法   ->   不替换location    传参{replace:false}
 * 如果hash未发生变化 ->   执行guide方法   ->   替换location  传参{replace:true}
 * 
 * guide方法 ->
 * 1. updateLocation方法
 * 2. route方法
 * 
 * 
 * updateLocation方法 ->
 * 初始化时 hash没有改变  改变浏览器的url（replace Location）， 不push历史
 * 点击事件 和 前进后退事件都不replace Location, 只改变浏览器url的hash
 * 
 * 
 * route方法 ->
 * 判断路由对象中是否匹配path   如果匹配执行该路由回调函数
 * 
 * 
 * pushState和replaceState参数说明
 * @状态对象：记录历史记录点的额外对象，可以为空
 * @页面标题：目前所有浏览器都不支持
 * @可选的url：浏览器不会检查url是否存在，只改变url，url必须同域，不能跨域
 * 
 * 
 * 
 * V ->
 * router.add('aaa', function(){});
 * router.add('bbb', function(){});
 * router.add('ccc', function(){});
 * router.start();
 */
(function (){
	var supportPushState = window.history.pushState;
	var prefix = '#!';
	var Hash = window.location.hash;
	//
			console.info(window.location.hash)
	function Route(){
		//设置状态对象
		this.routeState = [];
	}

	Route.prototype = {
		errorCallback: function(){
			throw '路由错误';
		},
		//返回url中的参数数组
		parseParam: function(url){
			var param = url.slice(url.indexOf('?') + 1);
			//var arr_param = param.split('&');
			var out_arr = [];

			for (var i = 0; i < arr_param.length; i++) {
				out_arr.push({
					'key': arr_param[i].split('=')[0],
					'value': arr_param[i].split('=')[1]
				});
			}

			return out_arr;
		},
		_hashToRegExp: function(url){
			//
			var regexp = new RegExp('^(' + url +  ')?$', 'i');
			return regexp;
		},
		_pathToRegExp: function(path){
			var Path = path.replace(/#!/, '');
			var out_arr = [];


			var reg_str = '([^A-Za-z0-9]|\s)*' + Path + '?([^A-Za-z0-9]|\s)*';
			out_arr.push(reg_str);

			return out_arr;
		},
		/*
		 *  获取http路径片段
		 *  事件为popstate 则获取location.pathname
		 *  事件为hashchange 则获取location.hash
		 *  
		 */
		getFragment: function(){
			var fragment;
			//
			if (this.monitorMode === 'popstate') {
				fragment = this.getPath();
			} else {
				fragment = this.getHash().replace(/^#!|\s+/g, '');
			}

			return fragment;
		},
		getPath: function(){
			var path = window.location.pathname + window.location.search + Hash;
			return decodeURIComponent(path);
		},
		getHash: function(){
			var hash = Hash;
			return decodeURIComponent(hash);
		},
		_getHash: function(hash){
			return hash.replace(/^#!/, '');
		},
        /*
         *  @interface  添加一条router规则
         *  @param path      hash-bang表达式
         *  @param callback  对应的本个hash-bang的回调
         *  
         *  将每一条路由方法添加到作用域对象数组中
         *  
         */
		add: function(path, callback){
			path = path.replace(prefix, '');//console.info(this.monitorMode)

			//添加路由path，callback到routeState数组对象
			this.routeState.push({
				path: path,
				reg_path: this._hashToRegExp(path),
				reg_history_path: this._pathToRegExp(path),
				callback: callback
			});
		},
		start: function(options){
			var that = this;
			//默认使用hashchange
			this.options = options || {
				usehistory: false
			};
			this.usehistory = this.options.usehistory ? true : false;
			//判断浏览器是否兼容history pushState
			if (!supportPushState) {
				this.monitorMode = 'hashchange';
			} else {
				this.monitorMode = 'popstate';
			}
			//设置监听
			this.monitorMode = this.usehistory ? 'popstate' : 'hashchange';

			//this.rootpath = this.
			//获取路径
			this.fragment = this.getFragment();
			//console.info(this.fragment)

			function checkUrl(){
				var pageHash = that.getFragment(), hash;

				//触发浏览器后退前进按钮
				if (pageHash !== that.fragment) {
					//console.info('触发后退按钮');
					//后退操作执行后
					hash = pageHash;
				}

				//被告知是后退按钮触发的时候执行
				if (hash != undefined) {
					//console.info('前进')
					//更新fragment
					that.fragment = hash;
					//不替换location, 执行回调
					that.guide(that.fragment, {fromHistory: true});
				}
			}

			//绑定事件
			if (this.monitorMode === 'popstate') {
				//window.addEventListener('popstate', checkUrl, false);
			} else if (this.monitorMode === 'hashchange') {
				window.addEventListener('hashchange', checkUrl, false);
			} else {
				window.addEventListener('hashchange', checkUrl, false);
			}

			//截获页面所有点击事件，如果事件源是链接则执行guide方法
			document.onclick = function pagecl(event){
				var target = event.target;

					
				//遍历点击元素，如果冒泡到body及以上则跳出函数
				while (target.nodeName != 'A') {
					target = target.parentNode;
					if (!target || target.tagName === 'BODY') {
						return;
					}
				}

				var href = target.getAttribute("href");
				//符合hash-bang
				console.info(href)
				if (href.substring(0, 2) == prefix) {
					event.preventDefault();
					//做location变化 和 回调执行
				console.info(href.replace(/#!/g, ''))
					that.guide(href.replace(/#!/g, ''), {replace: false, fromClick: true});
				}
				//console.info(that.routeState);

				//return false;
			};

			//页面初始化执行
			this.guide(this.fragment, {replace: true});
		},
        /*
         *  @interface guide  历史新添加或替换导向
         *  @param hash 访问的url的hash或点击链接中的href
        */
		guide: function(hash, options){
			//更新location
			this.updateLocation(hash, options);
			//执行路由回调
			this.route(hash, options);
		},
		/*
		 * 改变浏览器hash
		 */
		updateLocation: function(hash, options){
			var replace = options.replace;
			if (this.monitorMode === 'popstate') {
				//获取浏览器的URL
				var pathname = this.getFragment();
				var path = this.getFragment();
				var reg_link = this._pathToRegExp(hash);
				var isChange;
				/*
                 * 初始化时替换历史
                 * 点击时url 变化则浏览器url进行假跳转  未变化则浏览器url不做变化
                 * 前进后退时写入历史
                */
                
	            //来自初始化时
	            if (replace) {
	            	window.history.replaceState({path: pathname}, document.title, pathname);
	            }

                //来自点击事件
                if (options.fromClick) {
                	//
	                for (var i = 0; i < reg_link.length; i++) {

		                	console.info(path)
		                	console.info(reg_link[i])
	                	//浏览器url 不匹配 要添加的路由 -> pushState
	                	if (!path.match( new RegExp(reg_link[i], 'gi') )) {
		                	//url已变化
		                	console.info('已变化')
		                	isChange = true;
		                	break;
		                }
		                //否则 replaceState
		                else {
		                	//url未变化
		                	console.info('未变化')
		                	isChange = false;
		                	continue;
		                }

	                }

	                //是否跳转
	                if (isChange) {
	                	//浏览器url进行假跳转
            			window.history.pushState({path: path.replace(/#!.*$/, '') + '#!' + hash}, document.title, path.replace(/#!.*$/, '') + '#!' + hash);
	                } else {
		                window.history.replaceState({path: pathname}, document.title, pathname);
	                }
	                
                }
			} else {
				var newHash = prefix + hash;
				//当非初始化时 && hash发生变化时
				if (hash && newHash != this.getHash()) {
					//更新fragment中的url
					this.fragment = this._getHash(newHash);
				}
				//改变浏览器hash
				this._setHash(newHash, replace);
			}
		},
		//改变浏览器hash
		_setHash: function(hash, replace){
			//取出hash前的部分
			var href = decodeURIComponent(location.href).replace(/#!.*$/, '');
			//链接未发生变化时，替换浏览器的url
			//只有初始化时replace location
			//点击事件 和 前进后退事件都不replace, 只改变浏览器url的hash
			//window.location.replace不会写入历史(前进后退按钮失效)
				
			if (replace && href) {
				window.location.replace(href + hash);
			} else {
				location.hash = hash;
			}
			return false;
		},
		//执行路由回调
		route: function(path, options){
			//
			var routeState = this.routeState;
			var reg_path = (this.monitorMode == 'popstate' ? 'reg_history_path' : 'reg_path');
			//遍历路由数组对象 如果该路由中存在path，执行该路由回调函数
			for (var i = 0; i < routeState.length; i++) {
				//return states.callback();
				if (path && path.match(routeState[i][reg_path])) {
					if (this.monitorMode == 'popstate') {
						return routeState[i].callback();
					} else {
						return routeState[i].callback();
					}
				}
			}

		}
	};

	//exports.router = new Route;
	APP.router = new Route;
})();