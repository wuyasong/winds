<?php
	//定义常量
	define('ROOT_DIR', '/');

	require '/home/web_php/winds/libs/Smarty.class.php';
	
	$smarty = new Smarty();

	//配置指向路径
	$smarty->template_dir = SMARTY_DIR.'../template/templates/';
	$smarty->compile_dir = SMARTY_DIR.'../template/templates_c/';
	$smarty->config_dir = SMARTY_DIR.'../template/config/';
	$smarty->cache_dir = SMARTY_DIR.'../template/cache/';
	$smarty->caching = false;
	$smarty->left_delimiter = "{";    //定义标签
	$smarty->right_delimiter = "}";
?>