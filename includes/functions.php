<?php
//Store all basic functions here
	function username() {
		$username = $_SESSION['username'];
		echo "$username";
	}
	function mysql_prep ($value) {
		$magic_quotes_active = get_magic_quotes_gpc();
		$new_enough_php = function_exists( "mysql_real_escape_string" );
		if( $new_enough_php ) {
			if ($magic_quotes_active ) { $value = stripslashes( $value ); }
			$value = mysql_real_escape_string( $value );
		} else { 
			if ( !$magic_quotes_active ) { $value = addslashes( $value ); }
		}
		return $value;
	}
	
	function redirect_to( $location = NULL ) {
		if($location != NULL) {
			header("Location: {$location}");
			exit;
		}
	}
	
	function confirm_query($result_set) {
            if(!$result_set) {
            //die("Database query failed: " . mysql_error());
            }
	}
	
	function get_last_ten_articles($amount) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE visible=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC LIMIT {$amount}";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			return $article_set;
	}
	function get_all_articles() {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE visible=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC ";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			return $article_set;
	}
	function get_all_articles_admin() {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "ORDER BY id ";
			$query .= "DESC ";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			return $article_set;
	}
	
	function get_title_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $article_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			if ($title = mysql_fetch_array($article_set)) {
			return $title;
			} else {
				return NULL;
			}
	}

	function get_article_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $article_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			if ($article = mysql_fetch_array($article_set)) {
			return $article;
			} else {
				return NULL;
			}
	}
	function get_date_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $article_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			if ($date = mysql_fetch_array($article_set)) {
			return $date;
			} else {
				return NULL;
			}
	}
	function get_id_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $article_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			if ($id = mysql_fetch_array($article_set)) {
			return $id;
			} else {
				return NULL;
			}
	}
	
	function get_keywords_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $article_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($article_set);
			if ($keywords = mysql_fetch_array($article_set)) {
			return $keywords;
			} else {
				return NULL;
			}
	}
	
	function find_selected_article() {
		global $sel_title;
		global $sel_article;
		global $sel_date;
		global $sel_keywords;
		if (isset($_GET['id'])) {
		$sel_title = get_title_by_id($_GET['id']);
		$sel_article = get_article_by_id($_GET['id']);
		$sel_date = get_date_by_id($_GET['id']);
		$sel_id = get_id_by_id($_GET['id']);
		$sel_keywords = get_keywords_by_id($_GET['id']);
		} else {
			$sel_title = NULL;
			$sel_article = NULL;
			$sel_date = NULL;
			$sel_id = NULL;
			$sel_keywords = NULL;
			}
		}
	function article_list($how_many) {
		echo "<ul class=\"article_list\">";
		$article_set = get_last_ten_articles($how_many);			
			while ($article = mysql_fetch_array($article_set)) {
                echo "<li><a href=\"whatnew/release/" . urlencode($article["id"]) ."\">{$article["title"]}</a> <em>".date("m/d/Y",strtotime($article['date']))."</em></li>";
            }
		echo "</ul>";
	}
	
	function article_archive() {
		echo "<ul class=\"article_list\">";
		$article_set = get_all_articles();			
			while ($article = mysql_fetch_array($article_set)) {
                echo "<li><a href=\"/whatnew/release/" . urlencode($article["id"]) ."\">{$article['title']}</a> <em>".date("m/d/Y",strtotime($article['date']))."</em></li>";
            }
		echo "</ul>";
	}
	function article_archive_manage($sel_article, $sel_title, $sel_date) {
		echo "<ul class=\"article_list\">";
		$article_set = get_all_articles_admin();			
			while ($article = mysql_fetch_array($article_set)) {
                echo "<li>[ <a href=\"/admin/news/edit_article.php?id=" . $article['id'] . "\"><img src=\"/images/edit.png\" style=\"border:0;vertical-align:middle;\"></a> ] [ <a href=\"/admin/news/delete_article.php?id=" . $article['id'] . "\" onClick=\"return confirm('Are you sure you want to delete this article?');\"><img src=\"/images/del.png\" style=\"border:0;vertical-align:middle;\"></a> ] <a href=\"/whatnew/release/" . urlencode($article["id"]) ."\">{$article["title"]}</a> <em>".date("m/d/Y",strtotime($article['date']))."</em></li>";
            }
		echo "</ul>";
	}
	
	function footer_login() {
		if(isset($_SESSION['username'])) {
			$username = $_SESSION['username'];
		} else {
			$username = NULL;
		}
		echo " &bull; ";
		if (!logged_in()) { 
        	echo "<a href=\"/login.php\" rel=\"nofollow\">Login</a>";
		} else { 
        	echo"You are logged in as {$username}. <a href=\"/admin/logout.php\" rel=\"nofollow\">Logout</a> | <a href=\"/admin/index.php\">Staff Area</a>";
		}
	}
	
	    function nl2p($string, $class='') { 
        $class_attr = ($class!='') ? ' class="'.$class.'"' : ''; 
        return 
            '<p'.$class_attr.'>' 
            .preg_replace('#(<br\s*?/?>\s*?){2,}#', '</p>'."\n".'<p'.$class_attr.'>', nl2br($string, true)) 
            .'</p>'; 
    }
	
function convert_smart_quotes($string) { 
		$search = array(chr(145), 
						chr(146), 
						chr(147), 
						chr(148), 
						chr(151),
						chr(150)); 
	 
		$replace = array("'", 
						 "'", 
						 '"', 
						 '"', 
						 '-',
						 '-'); 
	 
		return str_replace($search, $replace, $string); 
	} 

function find_default($value) {
	global $defaults;
	$search = in_array($value,$defaults);
	if($search) {
		return TRUE;
	} else {
		return FALSE;
	}
}

function checkDateFormat($date)
{
  //match the format of the date
  if (preg_match ("/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/", $date, $parts))
  {
    //check weather the date is valid of not
        if(checkdate($parts[2],$parts[3],$parts[1]))
          return true;
        else
         return false;
  }
  else
    return false;
}
	
function clean_specify($value) {
	$str = str_replace("please specify","other",$value);
	return $str;
}
?>
