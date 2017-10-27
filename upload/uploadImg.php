<?php
	header('Content-Type:text/html;charset=utf-8');
	//引入配置文件
	require './resizeUploadImg.php';
	
	$uid = $_POST['uid'];
	$realx  = $_POST['ratiox'];
	$realy  = $_POST['ratioy'];
	$realw  = $_POST['ratiow'];
	$realh  = $_POST['ratioh'];
	$sourcew = $_POST['sourcew'];
	$sourceh = $_POST['sourceh'];
	$label  = $_POST['label'];
	$descri = $_POST['description'];
	$imgObj = $_FILES['imgObj'];
	$timestamp = time();
	$date = date('Ymd');
	$now = date('Y-m-d H:i:s');

	//设置路径
	$dir = ROOT_DIR.'images/photos/'.$date;
	if (!is_dir($dir)) {
		mkdir($dir);
	}
	$dst_file_1536 = $dir.'/'.$timestamp."_1536.jpg";
	$dst_file_960 = $dir.'/'.$timestamp."_960.jpg";
	$dst_file_720 = $dir.'/'.$timestamp."_720.jpg";
	$dst_file_444 = $dir.'/'.$timestamp."_444.jpg";
	$dst_file_252 = $dir.'/'.$timestamp."_252.jpg";

	$savePath_1536 = '/winds/images/photos/'.$date.'/'.$timestamp."_1536.jpg";
	$savePath_960 = '/winds/images/photos/'.$date.'/'.$timestamp."_960.jpg";
	$savePath_720 = '/winds/images/photos/'.$date.'/'.$timestamp."_720.jpg";
	$savePath_444 = '/winds/images/photos/'.$date.'/'.$timestamp."_444.jpg";
	$savePath_252 = '/winds/images/photos/'.$date.'/'.$timestamp."_252.jpg";

	//如果没有生成临时文件
	if(!file_exists($imgObj['tmp_name'])) {
		echo $imgObj['tmp_name'] . " is not exists !";
		exit();
	}
	//裁切图片
	resizeImg($imgObj['tmp_name'], $dst_file_1536, 1536, 1536, 1536*$realw, 1536*$realh, $realx*1536*$realw, $realy*1536*$realh);
	resizeImg($imgObj['tmp_name'], $dst_file_960, 960, 960, 960*$realw, 960*$realh, $realx*960*$realw, $realy*960*$realh);
	resizeImg($imgObj['tmp_name'], $dst_file_720, 720, 720, 720*$realw, 720*$realh, $realx*720*$realw, $realy*720*$realh);
	resizeImg($imgObj['tmp_name'], $dst_file_444, 444, 444, 444*$realw, 444*$realh, $realx*444*$realw, $realy*444*$realh);
	resizeImg($imgObj['tmp_name'], $dst_file_252, 252, 252, 252*$realw, 252*$realh, $realx*252*$realw, $realy*252*$realh);

	//存入库
	$saveImgSql = mysql_query('insert into images(uid, pic_desc, pic_label, pic_src, likeNum, cmtNum, uptime) values ("'.$uid.'","'.$descri.'","'.$label.'","['.$savePath_1536.','.$savePath_960.','.$savePath_720.','.$savePath_444.','.$savePath_252.']",0,0,"'.$now.'")');

	echo $imgObj['tmp_name'];
	echo $realw.'<br>';
	echo $realh.'<br>';
	echo $realx.'<br>';
	echo $realy.'<br>';
?>