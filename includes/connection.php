<?php require("constants.php") ?>
<?php
	$connection = mysql_connect(DB_SERVER,DB_USER,DB_PASS);
	if(!$connection) {
		die("Database connection failed");
	}
	$db_select = mysql_select_db(DB_NAME,$connection);
	if(!$db_select) {
		die("Database selection failed");
	}
?>
