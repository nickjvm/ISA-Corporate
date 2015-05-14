<?php
	
	function newsletter_list() {
		global $connection;
		$query = "SELECT * FROM promar_month.newsletter ORDER BY date DESC";
		$result = mysql_query($query,$connection);
		confirm_query($result);
		echo "<ul>";
			while($newsletter = mysql_fetch_array($result)) {
				echo "<li><span style=\"color:#000000\">
						[ <a href=\"edit_newsletter.php?newsletter_id={$newsletter['id']}\"><img src=\"../../images/edit.png\" style=\"vertical-align:middle;border:0;\"></a> ] 
						[ <a href=\"/promar/promarMONTH/newsletter.php?newsletter_id={$newsletter['id']}\" target=\"_blank\"><img src=\"../../images/build.png\" style=\"vertical-align:middle;border:0;\"></a> ] 
					    [ <a href=\"delete_newsletter.php?newsletter_id={$newsletter['id']}\"
							onClick=\"return confirm('Are you sure you want to delete this Newsletter? \\n\\n{$newsletter['date']}')\"><img src=\"../../images/del.png\" style=\"vertical-align:middle;border:0;\"></a> ]
						 <a href=\"manage_articles.php?newsletter_id={$newsletter['id']}\">";
				echo $newsletter['date'];
				echo "</a></span></li>";
			}
		echo "</ul>";
	}
	
	function get_selected_newsletter($news_id){
		global $connection;
		$query = "SELECT * FROM promar_month.newsletter WHERE id={$news_id}";
		$result= mysql_query($query,$connection);
		$newsletter = mysql_fetch_array($result);
		confirm_query($newsletter);
		return $newsletter;
	}

	function article_by_category($category,$news_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.articles WHERE category='{$category}' AND news_id={$news_id}";
		$result = mysql_query($query,$connection);
		while ($article = mysql_fetch_array($result)) {
			echo "[ <a href=\"edit_article.php?article_id={$article['id']}&newsletter_id={$news_id}\"><img src=\"../../images/edit.png\" style=\"vertical-align:middle;border:0;\"></a> ] 
					  [ <a href=\"delete_article.php?article_id={$article['id']}&newsletter_id={$news_id}\"
							onClick=\"return confirm('Are you sure you want to delete this article? \\n\\n{$article['title']}')\"><img src=\"../../images/del.png\" style=\"vertical-align:middle;border:0;\"></a> ] {$article['title']}<br>";
		}
	}

	function article_by_category_for_build($category,$news_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.articles WHERE category='{$category}' AND news_id={$news_id}";
		$result = mysql_query($query,$connection);
		while ($article = mysql_fetch_array($result)) {
			if(!empty($article['title'])) {
			echo "&nbsp;&nbsp;&nbsp;&nbsp;".convert_smart_quotes($article['title']);
			echo "<br>";
			}
		}
	}

	function monthly_article_list($news_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.categories WHERE news_id={$news_id} ORDER BY position";
		$result = mysql_query($query,$connection);
		echo "<ul>";
		while( $category = mysql_fetch_array($result)) {
			echo "<li>";
			echo "<span style=\"color:#000000;\">";
			echo "";
			echo " <strong>{$category['category']}</strong> [ <a href=\"new_article.php?newsletter_id={$news_id}&category=". urlencode($category['category']) . "\"><img src=\"../../images/add.png\" style=\"vertical-align:middle;border:0;\"></a> ] [ <a href=\"edit_category.php?category_id={$category['id']}&newsletter_id={$news_id}\"><img src=\"../../images/edit.png\" style=\"vertical-align:middle;border:0;\"></a> ]
					[ <a href=\"delete_category.php?category_id={$category['id']}&newsletter_id={$news_id}\" onClick=\"return confirm('Are you sure you want to delete this category?\\n\\n{$category['category']}\\n\\nThis will delete the category and all associated articles!')\"><img src=\"../../images/del.png\" style=\"vertical-align:middle;border:0;\"></a> ]";
			echo "<br>";
			$article_set = article_by_category($category['category'],$news_id);
					while($article = mysql_fetch_array($article_set)) {
					echo "-".$article['title']."<br>";
					}
			echo "</span>";
			echo "</li>";
		}
		echo "</ul>";
	}
	
	function category_list($news_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.categories WHERE news_id={$news_id}";
        $category_set = mysql_query($query, $connection);
		confirm_query($category_set);
		return $category_set;
	}
	
	function get_selected_article($article_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.articles WHERE id={$article_id}";
		$result = mysql_query($query,$connection);
		$article = mysql_fetch_array($result);
		if ($article) {
			return $article;
		}
	}
	
	function get_selected_category($id) {
		global $connection;
		$query = "SELECT * FROM promar_month.categories WHERE id={$id}";
		$result = mysql_query($query,$connection);
		$category = mysql_fetch_array($result);
		if ($category) {
			return $category;
		}
	}
	
	function monthly_article_list_for_build($news_id) {
		global $connection;
		$query = "SELECT * FROM promar_month.categories WHERE news_id={$news_id} ORDER BY position";
		$result = mysql_query($query,$connection);
		echo "<p style=\"font-size:12px;margin:0;\">";
		while( $category = mysql_fetch_array($result)) {
			echo "<a href=\"#{$category['position']}\"><strong>{$category['category']}</strong></a><br>";
			article_by_category_for_build($category['category'],$news_id);
		echo "<div class=\"toc\"></div><br>";
		}
		echo "</p>";
	}
	
	/*function get_category_articles($news_id,$category) {
		global $connection;
		$query = "SELECT * FROM promar_month.articles WHERE news_id={$news_id} AND category={$category}";
		$result = mysql_query($query,$connection);
		$category = mysql_fetch_array($result);
		return $query;
	}
	*/
	
	function get_category_articles($news_id,$category) {
		global $connection;
		$query = "SELECT * FROM promar_month.articles WHERE news_id={$news_id} AND category='{$category}'";
		$result = mysql_query($query,$connection);
		return $result;
	}
?>