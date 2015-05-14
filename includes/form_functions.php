<?php
	function timezone() {
		date_default_timezone_set('America/Chicago');
	}

	function check_required_fields() {
		$errors = array();
	
		//Form Validation
		$required_fields = array('title', 'date', 'article', 'visible', 'keywords');
		foreach($required_fields as $fieldname) {
			if(!isset($_POST[$fieldname]) || (empty($_POST[$fieldname]) && !is_numeric($_POST[$fieldname]))) {
				$errors[] = $fieldname;
			}
		}
		
//		if(!empty($errors)) {
//			redirect_to("new_article.php");
//		}
	}
	
	function display_errors() {
        if (!empty($errors)) {
			echo "<div id=\"errors\">";
			echo "Please review the following fields:";
			echo "<ul>";
			foreach($errors as $error) {
				echo "<li>" . $error . "</li>";
			}
			echo "</ul></div>";
		}
	}

?>