<?php 
			$query = "SELECT * FROM chinablog2010.wp_posts ";
			$query .= "WHERE (post_status = 'publish' AND post_type = 'post')";
			$query .= " ORDER BY ID DESC LIMIT 1";
            $latestpost = mysql_query($query, $connection);
			$post = mysql_fetch_array($latestpost);
			$htmlpost = htmlentities(nl2br($post['post_content']));
			$teaser_start_pos = (strpos($post['post_content'],'As') - 3);
			$oDate = strtotime($post['post_modified']);
			$sDate = date("F j, Y",$oDate);	
				echo "<span class=\"newstext\">";
				echo "<strong>UPDATE: <a href=\"" . $post['guid'] . "\">" . $post['post_title'] . "</a></strong>";
				echo "<br />";
				echo "<em>" . $sDate . "</em>";
				echo "<p>";
				if (strpos(nl2br($post['post_content']),'<br />') != "") {
					echo substr(convert_smart_quotes($post['post_content']),strpos(nl2br($post['post_content']),'<br />'),100);
					echo ".&nbsp;.&nbsp;.&nbsp;";
					echo "&gt;&gt;&nbsp;<strong><em><a href=\"" . $post['guid'] . "\">Continue&nbsp;Reading</a></em></strong>";
				} else {
					echo "&gt;&gt;&nbsp;<strong><em><a href=\"" . $post['guid'] . "\">Continue&nbsp;Reading</a></em></strong>";
				}
				echo "</p></span>";
				//echo $teaser_start_pos;
				if (logged_in()){
				
				//echo strpos(nl2br($post['post_content']),'<br />');
				//	echo $htmlpost;
				}
			
?>
