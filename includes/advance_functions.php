<?php
	function get_all_newsletters() {
		global $connection;
		$query = "SELECT * FROM advance_news.newsletter ORDER BY id DESC";
		$date_set = mysql_query($query, $connection);
		confirm_query($date_set);
		return $date_set;
	}
	function get_articles_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM advance_news.articles WHERE newsletter_id = {$news_id} ORDER BY sort_order ASC";
		$article_set = mysql_query($query, $connection);
		confirm_query($article_set);
		return $article_set;
	}
	function get_date_for_newsletter($news_id) {
		global $connection;
		$query = "SELECT date FROM advance_news.newsletter WHERE id = {$news_id}";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		return $newsletter_date;
	}
	
	function get_selected_newsletter($news_id) {
		global $connection;
		$query = "SELECT * FROM advance_news.newsletter WHERE id = {$news_id}";
		$newsletter = mysql_query($query, $connection);
		confirm_query($newsletter);
		return $newsletter;
	}

	function get_date($news_id) {
			global $connection;
			$query = "SELECT * FROM advance_news.newsletter ";
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
		$query = "SELECT date FROM advance_news.newsletter WHERE id= {$news_id} LIMIT 1";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		if ($date = mysql_fetch_array($newsletter_date)) {
			return $date;
		}
	}
	
	function get_id_by_date($news_date) {
		global $connection;
		$query = "SELECT * FROM advance_news.newsletter WHERE date= '{$news_date}'";
		$result = mysql_query($query, $connection);
		confirm_query($result);
		if ($date = mysql_fetch_array($result)) {
			return $date;
		}
	}
	
	function get_promar_title_by_id($article_id) {
			global $connection;
			$query = "SELECT * FROM advance_news.articles ";
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
			$query = "SELECT * FROM advance_news.articles ";
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
		$query .= " FROM advance_news.newsletter WHERE id= {$news_id} LIMIT 1";
		$newsletter_date = mysql_query($query, $connection);
		confirm_query($newsletter_date);
		if ($newsletter_id = mysql_fetch_array($newsletter_date)) {
			return $newsletter_id;
		}
	}
	
	function selected_promar_article($article_id) {
		global $connection;
		$query = "SELECT * FROM advance_news.articles WHERE id={$article_id} LIMIT 1";
		$article = mysql_query($query, $connection);
		confirm_query($article);
		return $article;
	}
	?>