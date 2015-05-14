<?php	/* settings */
	$number_of_posts = 5; //5 posts will load at a time

	/* grab stuff */
	function get_posts($start = 0, $number_of_posts = 5) {
		/* connect to and select the db */
		$connection = mysql_connect('localhost','root','liv3_life'); //hostname, username, password
		mysql_select_db('isa_news',$connection);
		/* create the posts array */
		$posts = array();
		/* get the posts */
		$query = "SELECT title, id, date FROM press_releases ORDER BY id DESC LIMIT $start,$number_of_posts";
		$result = mysql_query($query);
		/* for every post... */
		while($row = mysql_fetch_assoc($result)) {
			/* set the post content equal to the first paragraph...a "preview" regular expression */
			preg_match("/<p>(.*)<\/p>/",$row['post_content'],$matches);
			$row['post_content'] = strip_tags($matches[1]);
			/* add this record to the posts array */
			$posts[] = $row;
		}
		/* return the posts in the JSON format */
		return json_encode($posts);
	}
/* loading of stuff */
if(isset($_GET['start'])) {
	/* spit out the posts within the desired range */
	echo get_posts($_GET['start'],$_GET['desiredPosts']);
	/* save the user's "spot", so to speak */
	$_SESSION['posts_start']+= $_GET['desiredPosts'];
	/* kill the page */
	die();
}
