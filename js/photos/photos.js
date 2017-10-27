APP.photos = (function(){
	'use strict';

	//查询本地数据库全部图片列表
	function selectFullPhotos(type, succ_cb, fail_cb){
		var sql;
		if (type == 'hot') {
			sql = 'SELECT * FROM photos_hot';
		} else if (type == 'timeline') {
			sql = 'SELECT * FROM photos';
		} else if (type == 'atten') {
			sql = 'SELECT * FROM photos_atten';
		}
		APP.database.query(sql, [], succ_cb, fail_cb);
	}

	//插入本地数据库
	function insertPhotos(type, photos, succ_cb){
		var sql, data = [];

		if (type == 'hot') {
			sql = 'INSERT INTO photos_hot (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		} else if (type == 'timeline') {
			sql = 'INSERT INTO photos (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		} else if (type == 'atten') {
			sql = 'INSERT INTO photos_atten (pid, uid, pic_desc, pic_label, pic_src, uptime, cmtNum, likeNum, user_name, user_head) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		}

		//枚举表中字段
		for (var key in photos) {
			data.push(photos[key]);
		}
		
		//执行插入
		APP.database.query(sql, data, succ_cb);
	}

	//删除本地数据库
	// function deletePhotos(type, succ_cb){
	// 	APP.database.query(type, 'DELETE FROM photos', [], succ_cb);
	// }

	//删除本地数据库部分数据
	function deleteBasicPhotos(type, data, succ_cb){
		var sql;
		if (type == 'hot') {
			sql = 'DELETE FROM photos_hot WHERE pid=?';
		} else if (type == 'timeline') {
			sql = 'DELETE FROM photos WHERE pid=?';
		} else if (type == 'atten') {
			sql = 'DELETE FROM photos_atten WHERE pid=?';
		}
		APP.database.query(sql, [data], succ_cb);
	}

	return {
		selectFullPhotos: selectFullPhotos,
		insertPhotos: insertPhotos,
		//deletePhotos: deletePhotos,
		deleteBasicPhotos: deleteBasicPhotos
	}
}())