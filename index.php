<?php

	//开启session
	session_start();

	$smarty->assign('uid', @$_SESSION['uid']);
	$smarty->assign('username', @$_SESSION['username']);
	$smarty->assign('userhead', @$_SESSION['userhead']);
	$smarty->assign('userdesc', @$_SESSION['userdesc']);
	$smarty->assign('time', date('Y-m-d H:i:s'));
	$smarty->display('index-test.htm');  //配置首页
?>