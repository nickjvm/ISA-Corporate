<?php
//Store all basic functions here
	function find_selected_broadcast() {
		global $sel_title;
		if (isset($_GET['id'])) {
		$sel_title = get_btitle_by_id($_GET['id']);
		} else {
			$sel_title = NULL;
			}
		}
	function get_btitle_by_id($broadcast_id) {
			global $connection;
			$query = "SELECT * FROM broadcast WHERE ";
			$query .= "(id= " . $broadcast_id . " AND interview_type=1) ";
			$query .= " LIMIT 1";
            $broadcast_set = mysql_query($query, $connection);
			confirm_query($broadcast_set);
			if ($title = mysql_fetch_array($broadcast_set)) {
			return $title;
			} else {
				return NULL;
			}
	}
	function get_audio_by_id($broadcast_id) {
			global $connection;
			$query = "SELECT * FROM press_releases ";
			$query .= "WHERE id= " . $broadcast_id;
			$query .= " LIMIT 1";
            $article_set = mysql_query($query, $connection);
			confirm_query($broadcast_set);
			if ($audio = mysql_fetch_array($broadcast_set)) {
			return $audio;
			} else {
				return NULL;
			}
	}
	function get_more_audio_left() {
			global $connection;
			$query = "SELECT * FROM broadcast WHERE interview_type=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC LIMIT 1,6";
            $broadcast = mysql_query($query, $connection);
			confirm_query($broadcast);
			return $broadcast;
	}
	function get_more_audio_right() {
			global $connection;
			$query = "SELECT * FROM broadcast WHERE interview_type=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC LIMIT 7,6";
            $broadcast = mysql_query($query, $connection);
			confirm_query($broadcast);
			return $broadcast;
	}
	function get_all_audio() {
			global $connection;
			$query = "SELECT * FROM broadcast WHERE interview_type=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC";
            $broadcast = mysql_query($query, $connection);
			confirm_query($broadcast);
			return $broadcast;
	}
	function get_new_broadcast() {
			global $connection;
			$query = "SELECT * FROM broadcast WHERE interview_type=1 ";
			$query .= "ORDER BY id ";
			$query .= "DESC LIMIT 1";
            $broadcast = mysql_query($query, $connection);
			confirm_query($broadcast);
			return $broadcast;
	}
	
	function newest_broadcast() {
		$broadcast = get_new_broadcast();			
			while ($article = mysql_fetch_array($broadcast)) {
				echo "<p style=\"margin:0;padding:10px 0;\"><strong>IOWA SOYBEAN REPORT</strong><br /><strong>Topic: </strong>" . $article['title'] . "<br />";
				if($article['date'] == "0000-00-00") {
					echo "<strong>Air Date:</strong> " . date("F j, Y",strtotime($article['timestamp']));
				} else {
					echo "<strong>Air Date:</strong> " . date("F j, Y",strtotime($article['date']));
				}
				if (!empty($article['documents'])) {
					echo " | <strong>Report: </strong><a href=\"checkoff/isnetwork/pdf/" . $article['documents'] . ".pdf\">PDF</a><br/ >";
				}
				echo "</p>";
				echo "<p id=\"audioplayer_1\" class=\"newstext\" style=\"background-color:#FFFFFF;padding:3px 10px;margin:0;\">Flash Player and Javascript are required to hear this broadcast. <a href=\"checkoff/isnetwork/isnetworkarchive.php\"><strong>Try the archives</strong></a></p>";
				echo "<script type=\"text/javascript\">"; 
				echo "AudioPlayer.embed(\"audioplayer_1\", {soundFile: \"";
                echo "http://www.iasoybeans.com/checkoff/isnetwork/isnetworkrm/{$article["audio"]}.mp3\"";
				echo ", titles: \"Kirk Leeds\", artists: \"Iowa Soybean Report\"});";
				echo "</script>";
            }
	}
	function more_audio_left() {
		$broadcast = get_more_audio_left();			
			while ($article = mysql_fetch_array($broadcast)) {
				echo "<p style=\"margin:0;\"><strong>Topic: </strong><span class=\"style11\">" . $article['title'] . "</span><br />";
				echo "<strong>Air Date:</strong> " . date("F j, Y",strtotime($article['date']));
				if (!empty($article['documents'])) {
					echo " | <strong>Report: </strong><a href=\"pdf/" . $article['documents'] . ".pdf\">PDF</a>";
				}
				echo "<br /><strong>Listen to the report:</strong></p>";
				echo "<p id=\"audioplayer_" . $article['id'] . "\" class=\"newstext\">Flash Player and Javascript are required to hear this broadcast.</p>";
				echo "<script type=\"text/javascript\">"; 
				echo "AudioPlayer.embed(\"audioplayer_" . $article['id'] . "\", {soundFile: \"";
                echo "http://www.iasoybeans.com/checkoff/isnetwork/isnetworkrm/{$article["audio"]}.mp3\"";
				echo ", titles: \"Kirk Leeds\", artists: \"Iowa Soybean Report\"});";
				echo "</script>";
				echo "<div style=\"border-bottom:1px solid #D3C57D;margin:12px 25px 12px 0;\"></div>";
            }
	}
	function more_audio_right() {
		$broadcast = get_more_audio_right();			
			while ($article = mysql_fetch_array($broadcast)) {
				echo "<p style=\"margin:0;\"><strong>Topic: </strong><span class=\"style11\">" . $article['title'] . "</span><br />";
				echo "<strong>Air Date:</strong> " . date("F j, Y",strtotime($article['date']));
				if (!empty($article['documents'])) {
					echo " | <strong>Report: </strong><a href=\"pdf/" . $article['documents'] . ".pdf\">PDF</a>";
				}
				echo "<br /><strong>Listen to the report:</strong></p>";
				echo "<p id=\"audioplayer_" . $article['id'] . "\" class=\"newstext\">Flash Player and Javascript are required to hear this broadcast.</p>";
				echo "<script type=\"text/javascript\">"; 
				echo "AudioPlayer.embed(\"audioplayer_" . $article['id'] . "\", {soundFile: \"";
                echo "http://www.iasoybeans.com/checkoff/isnetwork/isnetworkrm/{$article["audio"]}.mp3\"";
				echo ", titles: \"Kirk Leeds\", artists: \"Iowa Soybean Report\"});";
				echo "</script>";
				echo "<div style=\"border-bottom:1px solid #D3C57D;margin:12px 25px 12px 0;\"></div>";
            }
	}
	function all_audio() {
		$broadcast = get_all_audio();
			echo "<ul class=\"article_list\">";
			while ($article = mysql_fetch_array($broadcast)) {
				echo "<li><a href=\"isnetworkrm/{$article["audio"]}.mp3\">" . $article['title'] . "</a> <em>" . date("F j, Y",strtotime($article['date'])) . "</em> ";
				if (!empty($article['documents'])) {
					echo " | <strong>Report: </strong><a href=\"pdf/" . $article['documents'] . ".pdf\">PDF</a>";
				}
				echo "</li>";
            }
			echo "</ul>";
	}
	function all_audio_manage() {
		$broadcast = get_all_audio();
			echo "<ul class=\"article_list\">";
			while ($article = mysql_fetch_array($broadcast)) {
				echo "<li>[ <a href=\"/admin/audio/edit_broadcast.php?id=" . $article['id'] . "\"><img src=\"/images/edit.png\" style=\"border:0;vertical-align:middle;\"></a> ] [ <a href=\"/admin/audio/delete_broadcast.php?id=" . $article['id'] . "\" onClick=\"return confirm('Are you sure you want to delete this article?');\"><img src=\"/images/del.png\" style=\"border:0;vertical-align:middle;\"></a> ] <a href=\"../isnetwork/isnetworkrm/{$article["audio"]}.mp3\">" . $article['title'] . "</a> <em>" . date("F j, Y",strtotime($article['date'])) . "</em> ";
				if (!empty($article['documents'])) {
					echo " | <strong>Report: </strong><a href=\"pdf/" . $article['documents'] . ".pdf\">PDF</a>";
				}
				echo "</li>";
            }
			echo "</ul>";
	}
?>
