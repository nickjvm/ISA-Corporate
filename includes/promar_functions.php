<?php
function get_current_newsletter() {
		global $connection;
		$query = "SELECT * FROM promar_news ORDER BY id DESC LIMIT 1";
		$result = mysql_query($query);
		$id = mysql_fetch_array($result);
		if($id['approved']) {
			$approved = TRUE; 
		} else {
			$approved = FALSE;
		}
		$date = date("m-d-Y",strtotime($id['date']));
		$id = $id[0];
		$query = 'SELECT * FROM promar_articles WHERE news_id = '.$id;
 		$result = mysql_query($query,$connection);
		echo "<h2>Current Issue &raquo; ".$date."</h2>";
		echo "<strong>Functions: </strong>";
		echo "<a href=\"new_article.php?id=" . $id . "\">Add Article</a> | ";
		echo "<a href=\"/promar/newsletter.php?id=" . $id . "\">Preview</a> | ";
		if(!$approved) {
			echo "<a href=\"/admin/promar/index.php?id=" . $id . "&approved=1\">Email KY</a> | ";
		}
		echo "<a href=\"delete_newsletter.php?id=" . $id . "\" onclick=\"return confirm('Are you sure you want to delete this newsletter?')\">
				Delete</a>";
		echo "<hr>";
		echo "<table id=\"manage\" class=\"sanb\" cellpadding=\"5\" cellspacing=\"0\">";
 		while ($newsletter = mysql_fetch_array($result)) {
			echo "<tr><td class='actions'>";
			echo "<a href=\"/admin/promar/edit_article.php?newsletter=".$id."&id=" . $newsletter['id']."\">Edit</a>";
			echo "<br/>";
			echo " <a href=\"/admin/promar/delete_article.php?newsletter=".$id."&id=" . $newsletter['id'] . "\" onclick=\"return confirm('Are you sure you want to delete this article?')\">
					Delete</a>";
			echo "</td><td class='preview'>";
			if($newsletter['title']) { echo "<strong>".$newsletter['title']."</strong>"; }
			echo  $newsletter['content'];
			echo "<hr>";	
			echo "</td></tr>";
		}
		echo "</table>";
	}
	
	function get_all_newsletters_bak() {
		global $connection;
		$query = "SELECT * FROM promar_news ORDER BY id DESC LIMIT 10";
		$date_set = mysql_query($query, $connection);
		confirm_query($date_set);
		return $date_set;
	}
	
	
	function get_articles_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM promar_articles WHERE news_id = {$news_id} ORDER BY id ASC";
		$article_set = mysql_query($query, $connection);
		confirm_query($article_set);
		return $article_set;
	}
	function get_date_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT date FROM promar_news WHERE id = {$news_id}";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		return $newsletter_date;
	}
	
	function get_selected_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM promar_news WHERE id = {$news_id}";
		$newsletter = mysql_query($query, $connection);
		confirm_query($newsletter);
		return $newsletter;
	}

	function get_date($news_id) {
			global $connection;
			$query = "SELECT * FROM promar_news ";
			$query .= "WHERE id= " . $news_id;
			$query .= " LIMIT 1";
            $date_set = mysql_query($query, $connection);
			confirm_query($date_set);
			if ($date = mysql_fetch_array($date_set)) {
			return $date;
			} else {
				return NULL;
			}
	}
	
	function newsletter_date($news_id) {
		global $connection;
		$query = "SELECT date FROM promar_news WHERE id= {$news_id} LIMIT 1";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		if ($date = mysql_fetch_array($newsletter_date)) {
			return $date;
		}
	}
	
	function get_id_by_date($news_date) {
		global $connection;
		$query = "SELECT * FROM promar_news WHERE date= '{$news_date}'";
		$result = mysql_query($query, $connection);
		confirm_query($result);
		if ($date = mysql_fetch_array($result)) {
			return $date;
		}
	}
	
	function get_promar_title_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM promar_articles ";
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
	function get_promar_article_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM promar_articles ";
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
	
	function get_newsletter_id($news_id) {
		global $connection;
		$query = "SELECT id";
		$query .= " FROM promar_news WHERE id= {$news_id} LIMIT 1";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		if ($newsletter_id = mysql_fetch_array($newsletter_date)) {
			return $newsletter_id;
		}
	}
	
	function selected_promar_article($article_id) {
		global $connection;
		$query = "SELECT * FROM promar_articles WHERE id={$article_id} LIMIT 1";
		$article = mysql_query($query, $connection);
		confirm_query($article);
		return $article;
	}
	
	function promar_archive() {
		global $connection;
		$query = "SELECT * FROM promar_news ORDER BY id DESC";
		$result_set = mysql_query($query,$connection);
		echo "<ul>";
		while($newsletter = mysql_fetch_array($result_set)) {
			echo "<li><a href=\"/promar/newsletter.php?id=".$newsletter['id']."\">";
			echo $newsletter['date'];
			echo "</a></li>";
		}
		echo "</ul>";
	}

?>