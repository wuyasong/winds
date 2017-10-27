APP.database = (function(){
	'use strict';

	var localDB;

	//打开本地数据库
	function open(successCallback){
		//打开database
		localDB = openDatabase('application', '1.0', 'photo list', 5 * 1024 * 1024);
		//如果photos表不存在则创建
		localDB.transaction(function (tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS photos (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head)', [], successCallback);
			tx.executeSql('CREATE TABLE IF NOT EXISTS photos_hot (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head)', [], successCallback);
			tx.executeSql('CREATE TABLE IF NOT EXISTS photos_atten (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head)', [], successCallback);
		});
	}

	//执行事务
	function sqlQuery(query, param, succHandler, errorHandler){
		var i = 0, len = param.length;
		//如果参数列表不是数组 将参数添加为数组
		if (!(param instanceof Array)) {
			param = [param];
		}

		function innerCallback(tx, rs){
			var l = rs.rows.length, output = [];
			
			//格式化WebSQL中数据格式
			for (var i = 0; i < l; i++) {
				output.push(rs.rows.item(i));
			}

			//有成功回调时执行
			if (succHandler) {
				succHandler(output);
			}
			return;
		}

		//执行事务处理
		localDB.transaction(function (tx){
			//console.info(query + param);
			tx.executeSql(query, param, innerCallback, errorHandler);
		});
	}

	return {
		open: open,
		query: sqlQuery
	};
}());