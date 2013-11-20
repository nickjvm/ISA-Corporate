<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head profile="<?php print $grddl_profile; ?>">
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title><?php print $head_title; ?></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width">
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDeI2rgNEVh7Wl1VYqRNauDnz0aPmzhPZU&sensor=false"></script>
  <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.css" rel="stylesheet">
  <?php print $styles; ?>
  <?php print $scripts; ?>

</head>
<body class="<?php print $classes; ?>" <?php print $attributes;?>>
    <!--[if lt IE 7]>
        <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
    <![endif]-->

	<?php print $page_top; ?>

	<?php print $page; ?>

  

	<?php print $page_bottom; ?>
  
   <script>
   var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
   (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
     g.src='//www.google-analytics.com/ga.js';
     s.parentNode.insertBefore(g,s)}(document,'script'));
   </script>
 </body>
 </html>


