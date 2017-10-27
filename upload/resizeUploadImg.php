<?php  
    /*
		* 参数说明
		* $src_file : 需要处理图片的文件名
		* $dst_file : 生成新图片的保存文件名
		* $new_width : 生成新图片的宽
		* $new_height : 生成新图片的高
		* $pre_width : 前台要生成的缩略图的宽
		* $pre_height : 前台要生成的缩略图的高
		* $pre_x : 前台要生成缩略图的起点x坐标
		* $pre_y : 前台要生成缩略图的起点y坐标
	*/
	
	function resizeImg($src_file, $dst_file, $new_width, $new_height, $pre_width, $pre_height, $pre_x, $pre_y){
		if($new_width <1 || $new_height <1) {
			echo "params width or height error !";
			exit();
		}
		if(!file_exists($src_file)) {
			echo $src_file . " is not exists !";
			exit();
		}
		//定义图片类型数组
		$support_type = array(IMAGETYPE_JPEG , IMAGETYPE_PNG , IMAGETYPE_GIF);
		
		//图片类型
		$type = exif_imagetype($src_file);   //返回图片类型
		
		//加载图片
		switch($type){
			case IMAGETYPE_JPEG :
				$src_img = imagecreatefromjpeg($src_file);
				break;
			case IMAGETYPE_PNG :
				$src_img = imagecreatefrompng($src_file);
				break;
			case IMAGETYPE_GIF :
				$src_img = imagecreatefromgif($src_file);
				break;
			default:
				$src_img = imagecreatefromjpeg($src_file);
				break;
		}
		//$src_img = imagerotate($src_img, 90, 0);
		
		//取得图像宽度和高度  原图宽高
		$w = imagesx($src_img);
		$h = imagesy($src_img);
		
		//要截取的图占的比例
		$ratio_w = $new_width  / $pre_width;  //宽
		$ratio_h = $new_height / $pre_height;  //高
		$ratio_x = $pre_x / $pre_width;  //left
		$ratio_y = $pre_y / $pre_height;  //top
				
		/* 裁切操作 */
		
		//原图要裁切的长度（原图要裁的宽/原图的宽 = 100px/100px对应图的宽）
		$inter_w = (int)($w * $ratio_w);
		$inter_h = (int)($h * $ratio_h);
		//原图中要裁切的起点坐标
		$src_x = (int)($w * $ratio_x);
		$src_y = (int)($h * $ratio_y);

		
		//定义画布 为要裁切的长度
		$inter_img = imagecreatetruecolor($inter_w, $inter_h);
		//拷贝图像的一部分
		/*
			* imagecopy ( $dst_im , $src_im , $dst_x , $dst_y , $src_x , $src_y , $src_w , $src_h )
			* 将 src_im 图像中坐标从 src_x，src_y 开始，宽度为 src_w，高度为 src_h 的一部分拷贝到 dst_im 图像中坐标为 dst_x 和 dst_y 的位置上。
			* $inter_img: 画布
			* $src_img:   创建的图片
			* $dst_x:     画布中的起点x坐标
			* $dst_y:     画布中的起点y坐标
			* $src_x:     图像中的起点x坐标
			* $src_y:     图像中的起点y坐标
			* $src_w:     图像中要拷贝的宽度
			* $src_h:     图像中要拷贝的高度
		*/
		imagecopy($inter_img, $src_img, 0, 0, $src_x, $src_y, $inter_w, $inter_h);
		
		/* 缩放操作 */
		
		//定义一个新图像
		$new_img = imagecreatetruecolor($new_width, $new_height);
		//进行缩放
		imagecopyresampled($new_img, $inter_img, 0, 0, 0, 0, $new_width, $new_height, $inter_w, $inter_h);
		//判断图片类型最终创建存储图片
		switch($type) {
			case IMAGETYPE_JPEG :
				imagejpeg($new_img, $dst_file, 76); // 存储图像
				break;
			case IMAGETYPE_PNG :
				imagepng($new_img, $dst_file, 9);
				break;
			case IMAGETYPE_GIF :
				imagegif($new_img, $dst_file);
				break;
			default:
				imagejpeg($new_img, $dst_file, 100);
				break;
		}
	}
?>
