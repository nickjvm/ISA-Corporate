<?php 
	session_start();
	function logged_in() {
			return isset($_SESSION['user_id']);
	}
	function confirm_logged_in() {
		if (!logged_in()) {
		redirect_to("http://www.iasoybeans.com/admin/login.php");
		}
		if ($_SESSION['privilege'] < 5) {
			redirect_to("http://www.iasoybeans.com/admin/calendar");
		}
	}
	
	function confirm_general_user() {
		if (!logged_in()) {
			redirect_to("http://www.iasoybeans.com/admin/login.php");
		}
	}
?>
