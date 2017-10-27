/*
 * common模块
 * - module模式
 */
(function(doc){
	var Even = function(selector){
		this.selector = selector;
		this[0] = selector;
	}

	Even.prototype = {
		hasClass: function(cls){
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			return this.selector.className.match(reg);
		},
		addClass: function(cls){
			if (!this.hasClass(cls)) {
				this.selector.className += (' ' + cls);
			}
				return this;
		},
		removeClass: function(cls){
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			if (this.selector instanceof Array) {
				for (var i = 0; i < this.selector.length; i++) {
					if (this.hasClass(cls)) {
						this.selector[i].className = this.selector[i].className.replace(reg, '');
					}
				}
				return this;
			}
			if (this.hasClass(cls)) {
				this.selector.className = this.selector.className.replace(reg, '');
			}
			return this;
		},
		show: function(){
			this.selector.style.display = 'block';
			return this;
		},
		//隐藏元素
		hide: function(){
			var len;
			if (this.selector.length) {
				for (var i = 0; i < len; i++) {
					this.selector[i].style.display = 'none';
				}
			} else {
				this.selector.style.display = 'none';
			}
			return this;
		},
		siblings: function(){
			var nodes = [], _elem = this.selector;

			var prev = this.selector.previousSibling;

			while (prev = prev.previousSibling)  {
				if (prev.nodeType == 1) {
					nodes.push(prev);
				}
			}
			nodes.reverse();  //按先后顺序

			var next = this.selector.nextSibling;

			while (next = next.nextSibling) {
				if (next.nodeType == 1) {
					nodes.push(next);
					console.info(3);
				}
			}
			return nodes;
		},
		parents: function(reg_parns){
			var prop;
			var patt_elem = reg_parns.charAt(0);
			var name;
			var elem = this.selector;

			if (patt_elem === '.') {
				prop = 'className';
				name = reg_parns.substring(1);
			}
			else if (patt_elem === '#') {
				prop = 'id';
				name = reg_parns.substring(1);
			}
			else if (patt_elem.match(/[a-zA-Z]/)) {
				prop = 'tagName';
				name = reg_parns;
			}
			while (elem = elem.parentNode) {
				
				if (elem[prop] === name) {
					return new Even(elem);
				}

			}
		},
		find: function(arg_map){
			//
			// var prop;
			// var patt_elem = arg_map.charAt(0);
			// var name;
			var elem = this.selector;

			return new Even( elem.querySelector(arg_map) );

		},
		html: function(str){
			if (str === undefined) {
				return this.selector.innerHTML;
			} else {
				this.selector.innerHTML = str;
				return this;
			}
		},
		attr: function (attribute, setValue){
			if (arguments.length > 1) {
				return this.selector.setAttribute(attribute, setValue);
			} else {
				return this.selector.getAttribute(attribute);
			}
		},
		eq: function(index){
			var _elem = this.selector[index]
			this.selector = _elem;
			this[0] = _elem;
			return this;
		},
		/*addHandler: function(node, eventType, callback){
			var len = node.length;
			//组元素
			if (node.length > 1) {
				//遍历DOM元素绑定回调函数
				for (var i = 0; i < len; i++) {
					(function(x){
						node[x].index = i;
						//console.info(node[x].index)
						node[x].addEventListener(eventType, callback, false);
					})(i);
				}
			}
			//单一元素
			else {
				node.addEventListener(eventType, callback, false);
			}
		},*/
		on: function (evt, callback){
			var self = this;
			var l = this.selector.length;

			if (typeof window.ontouchstart != 'undefined') {   //MOBILE
				TOUCHSTART = 'touchstart';
				TOUCHEND = 'touchend';
				TOUCHMOVE = 'touchmove';
			}else if (typeof window.onmspointerdown != 'undefined') {  //IE
				TOUCHSTART = 'mspointerdown';
				TOUCHEND = 'mspointerup';
				TOUCHMOVE = 'mspointermove';
			}else {                 //PC
				TOUCHSTART = 'mousedown';
				TOUCHEND = 'mouseup';
				TOUCHMOVE = 'mousemove';
			}

			if (evt == "tap") {  //按下开始
				evt = TOUCHSTART;
			} else if (evt == "tapend") {  //抬起状态
				evt = TOUCHEND;
			} else if (evt == "tapmove") {  //移动状态
				evt = TOUCHMOVE;
			}
			//console.info(callback.name)
			if (l > 1) {
				//遍历DOM元素绑定回调函数
				for (var i = 0; i < l; i++) {
					(function(x){
						self.selector[x].index = i;
						self.selector[x].addEventListener(evt, callback, false);
					})(i);
				}
			} else {
				this.selector.addEventListener(evt, callback, false);
			}

			return this;  //供链式调用
		},
		unbind: function(evt, callback){
			var self = this;
			var l = this.selector.length;

			if (typeof window.ontouchstart != 'undefined') {   //MOBILE
				TOUCHSTART = 'touchstart';
				TOUCHEND = 'touchend';
				TOUCHMOVE = 'touchmove';
			}else if (typeof window.onmspointerdown != 'undefined') {  //IE
				TOUCHSTART = 'mspointerdown';
				TOUCHEND = 'mspointerup';
				TOUCHMOVE = 'mspointermove';
			}else {                 //PC
				TOUCHSTART = 'mousedown';
				TOUCHEND = 'mouseup';
				TOUCHMOVE = 'mousemove';
			}

			if (evt == "tap") {  //按下开始
				evt = TOUCHSTART;
			} else if (evt == "tapend") {  //抬起状态
				evt = TOUCHEND;
			} else if (evt == "tapmove") {  //移动状态
				evt = TOUCHMOVE;
			}
			if (l > 1) {
				//遍历DOM元素绑定回调函数
				for (var i = 0; i < l; i++) {
					(function(x){
						self.selector[x].index = i;
						self.selector[x].removeEventListener(evt, callback, false);
					})(i);
				}
			} else {
				this.selector.removeEventListener(evt, callback, false);
			}

			return this;  //供链式调用
		}
	}

	window.winds = window.$ = function (selector){
		var node;

		if (typeof selector === 'object') {
			return new Even(selector);
		}

		if (doc.querySelectorAll(selector).length > 1) {
			node = doc.querySelectorAll(selector);
		} else {
			node = doc.querySelector(selector);
		}

		return node ? new Even(node) : null;
	}
})(document);