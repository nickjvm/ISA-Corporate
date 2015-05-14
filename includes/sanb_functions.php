<?php 
function document_exist($id) {
	global $connection;
	$query = "SELECT * FROM sanb_docs WHERE news_id = $id";
	$result_set = mysql_query($query);
	$num_rows = mysql_num_rows($result_set);
	if($num_rows > 0) {	
		return $num_rows; 
	} else {
		return FALSE;
	}
}

	function get_newsletter_list() {
		global $connection;
		$query = "SELECT * FROM sanb_news ORDER BY id DESC LIMIT 1";
		$result = mysql_query($query);
		$id = mysql_fetch_array($result);
		$date = date("m-d-Y",strtotime($id['date']));
		$id = $id[0];
		$query = 'SELECT * FROM sanb_articles WHERE news_id = '.$id;
 		$result = mysql_query($query,$connection);
 		$count = mysql_num_rows($result);
		echo "<h2>Current Issue &raquo; ".$date."</h2>";
		echo "<strong>Functions: </strong>";
			echo "<a href=\"create_article.php?newsletter_id=" . $id . "\">Add Article</a> | ";
			
		echo "<a href=\"upload.php?newsletter_id=" . $id . "\">";
		if(!$num_rows = document_exist($id)) {
			echo "Attach File"; 
		} else {
			echo "View File Attachments <strong>(".$num_rows.")</strong>";
		} 
		echo "</a> | ";
		echo "<a href=\"/sanb/newsletter.php?newsletter_id=" . $id . "\">Preview</a> | ";
		echo "<a href=\"delete_newsletter.php?newsletter_id=" . $id . "\" onclick=\"return confirm('Are you sure you want to delete this newsletter?')\">
				Delete</a>";
		echo "<hr>";
		if($count > 0) {
		echo "<table id=\"manage\" class=\"sanb\" cellpadding=\"5\" cellspacing=\"0\">";
 		while ($newsletter = mysql_fetch_array($result)) {
			echo "<tr><td class='actions'>";
			echo " <a href=\"/admin/sanb/edit.php?article_id=" . $newsletter['id'] . "&viewas=admin\">Edit</a>";
			echo "<br/>";
			echo " <a href=\"/admin/sanb/delete_article.php?newsletter_id=".$id."&article_id=" . $newsletter['id'] . "\" onclick=\"return confirm('Are you sure you want to delete this article?')\">
					Delete</a>";
			echo "</td><td class='preview'>";
			if($newsletter['title']) { echo "<p><strong>".$newsletter['title']."</strong></p>"; }
			echo  $newsletter['article'];
			echo "<hr>";	
			echo "</td></tr>";
		}
		echo "</table>";
		} else {
		echo "<p>No articles exist yet for this issue. <a href=\"create_article.php?newsletter_id=".$id."\">Create an article</a> or <a href=\"upload.php?newsletter_id=" . $id . "\">Upload a document</a></p>";
		}
	}
	
	function get_newsletter_list_bak() {
		global $connection;
		$query = 'SELECT * FROM sanb_news ORDER BY date DESC LIMIT 10';
 		$result = mysql_query($query,$connection);
		echo "<ul>";
 		while ($newsletter = mysql_fetch_array($result)) {
			echo "<li><span style=\"color:#000000;\">";
			echo "[ <a href=\"upload.php?newsletter_id=" . $newsletter['id'] . "\"><img src=\"../../images/upload.png\" style=\"vertical-align:middle;border:0;\"></a> ] ";
			echo "[ <a href=\"/sanb/newsletter.php?newsletter_id=" . $newsletter['id'] . "&viewas=admin\"><img src=\"/images/edit.png\" style=\"vertical-align:middle;\"></a> ] ";
			echo "[ <a href=\"/sanb/newsletter.php?newsletter_id=" . $newsletter['id'] . "\" target=\"_blank\" \"><img src=\"/images/build.png\" style=\"vertical-align:middle;\"></a> ] ";
			echo  "<strong>{$newsletter['date']}</strong>";
			echo " [ <a href=\"delete_newsletter.php?newsletter_id=" . $newsletter['id'] . "\" onclick=\"return confirm('Are you sure you want to delete this newsletter?')\">
					<img src=\"/images/del.png\" style=\"vertical-align:middle;\"></a> ]";
			echo "</span></li>";
		}
		echo "</ul>";
	}
	
	function get_newsletter_id() {
		if (isset($_GET['newsletter_id'])) {
			$news_id = $_GET['newsletter_id'];
		} else {
			$news_id = NULL;
		}
		return $news_id;
	}
	
	function get_article_id() {
		if (isset($_GET['article_id'])) {
			$article_id = $_GET['article_id'];
		} else {
			$article_id = NULL;
		}
		return $article_id;
	}
	
	function get_newsletter_date($news_id) {
		global $connection;
		$query = "SELECT date FROM sanb_news WHERE id = {$news_id}";
		$result = mysql_query($query,$connection);
		$date = mysql_fetch_array($result);
		if ($date) {
			return $date['date'];
		}
	}
	
	function get_articles($article_id) {
		global $connection;
		$query = "SELECT * FROM sanb_articles WHERE id = {$article_id}";
		$result = mysql_query($query,$connection);
		$articles = mysql_fetch_array($result);
		if ($articles) {
			return $articles;
		} else {
			echo mysql_error();
		}
	}
	
	function get_document_info($news_id) {
		global $connection;
		$query = "SELECT * FROM sanb_docs WHERE news_id = {$news_id}";
		$result = mysql_query($query,$connection);
		$info = mysql_fetch_array($result);
		if ($info) {
			return $info;
		} else {
			echo mysql_error();
		}
	}
	function find_articles($news_id) {
		global $connection;
		$query = "SELECT * FROM sanb_articles WHERE (news_id = {$news_id} AND category=1)";
		$result = mysql_query($query,$connection);
		return $result;
	}
	
	function get_articles_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM sanb_articles WHERE (news_id = {$news_id} AND category=1)";
		$result = mysql_query($query,$connection);
		$viewas = $_GET['viewas'];
		while ($article = mysql_fetch_array($result)) {
			if(logged_in() && $viewas == "admin") {
				echo "[ <a href=\"/admin/sanb/edit.php?article_id=" . $article['id'] . "\">";
				echo "<img src=\"http://www.iasoybeans.com/images/edit.png\" style=\"vertical-align:middle;border:0;\"></a> ]";
				echo " [ <a href=\"/admin/sanb/delete_article.php?newsletter_id={$news_id}&article_id=" . $article['id'] . "\" onclick=\"return confirm('Are you sure you want to delete this newsletter?')\">";
				echo "<img src=\"http://www.iasoybeans.com/images/del.png\" style=\"vertical-align:middle;border:0;\"></a> ] ";
			}
			
			if($article['category'] == 1) {
				if(!empty($article['title'])) {
					echo "<strong>" . $article['title'] . "</strong><br>";
				}			
					echo $article['article'];
					echo "<p class=\"dtn\" style=\"border-bottom-width:2px;border-bottom-color:#FC5B01;border-bottom-style:solid;margin-top:0;text-align:left;\">&nbsp;</p>";
			} else {
				if(!empty($article['title'])) {
					echo "<strong>" . $article['title'] . "</strong><br><br>";
				}
				echo $article['article'];
			}  
		}
	}
	
	function get_crop_articles_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM sanb_articles WHERE (news_id = {$news_id} AND category=2)";
		$result = mysql_query($query,$connection);
		while ($article = mysql_fetch_array($result)) {
			if(logged_in()) {
				echo "[ <a href=\"/admin/sanb/edit.php?article_id=" . $article['id'] . "\">";
				echo "<img src=\"http://www.iasoybeans.com/images/edit.png\" style=\"vertical-align:middle;border:0;\"></a> ]";
				echo " [ <a href=\"/admin/sanb/delete_article.php?newsletter_id={$news_id}&article_id=" . $article['id'] . "\" onclick=\"return confirm('Are you sure you want to delete this newsletter?')\">";
				echo "<img src=\"http://www.iasoybeans.com/images/del.png\" style=\"vertical-align:middle;border:0;\"></a> ] ";
			}
			
			if($article['category'] == 2) {
				if(!empty($article['title'])) {
					echo "<strong>" . $article['title'] . "</strong><br>";
				}			
					echo "<p>";
					echo $article['article'];
					echo "</p><div  class=\"cropspot\" style=\"border-bottom-width:2px;border-bottom-color:#019330;border-bottom-style:solid;margin-top:0;text-align:left;\" ></div>";
			} else {
				if(!empty($article['title'])) {
					echo "<strong>" . $article['title'] . "</strong><br><br>";
				}
				echo $article['article'];
			} 
		}
	}
		
	function get_documents_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM sanb_docs WHERE news_id = {$news_id}";
		$result = mysql_query($query,$connection);
		
		$document = mysql_fetch_array($result);
		
		
		$date = get_newsletter_date($news_id);
			if(!empty($document['dasbridge'])) {
				echo "<p class=\"cropspot\" style=\"border-bottom-width:2px;border-bottom-color:#019330;border-bottom-style:solid;margin-top:0;padding-bottom:10px;text-align:left;\"><a href=\"http://www.iasoybeans.com/sanb/docs/{$date}/" . urlencode($document['dasbridge']) . "\" style=\"color:#000000;\" target=\"_blank\"><strong>CLICK HERE</strong></a> for David Asbridge commentary - " . date("F j, Y",(strtotime($document['dasbridge_date']))) . "</p>";
			}
			if(!empty($document['roundup'])) {
				echo "<p class=\"cropspot\" style=\"border-bottom-width:2px;border-bottom-color:#019330;border-bottom-style:solid;margin-top:0;padding-bottom:10px;text-align:left;\"><a href=\"http://www.iasoybeans.com/sanb/docs/{$date}/" . urlencode($document['roundup']) . "\" style=\"color:#000000;\" target=\"_blank\"><strong>CLICK HERE</strong></a> to view the " . date("F j, Y",(strtotime($document['roundup_date']))) . " issue of \"Brazil Ag News Roundup\"</p>";
			}
	}
	
	function static_info() {
		global $connection;
		$query = "SELECT * FROM sanb_static";
		$result = mysql_query($query,$connection);
		if($result) { 
			$static_info = mysql_fetch_array($result);
			return $static_info;
		}
	}
	
function sanb_archive() {
		global $connection;
		$query = "SELECT * FROM sanb_news ORDER BY id DESC";
		$result_set = mysql_query($query,$connection);
		echo "<ul>";
		while($newsletter = mysql_fetch_array($result_set)) {
			echo "<li><a href=\"/sanb/newsletter.php?newsletter_id=".$newsletter['id']."\">";
			echo date('F j, Y',strtotime($newsletter['date']));
			echo "</a></li>";
		}
		echo "</ul>";
	}

	
?>