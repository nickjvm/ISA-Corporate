            <div id="content-top">
              <div class="container">
                <div class="row">
                  <div class="col-sm-12">
                    <?php print render($page['content_top']); ?>                    
                  </div>
                </div>
              </div>
            </div>
            <nav role="navigation">
              <div class="container">
                <div class="row">
                  <div class="col-md-3 logo">
                    <a href="/" id="logo">
                      <img src="<?php print $logo; ?>" alt="<?php print $site_name; ?>"/>
                    </a>
                  </div>
                  <div class="col-md-8">
                    <?php if (isset($main_menu)) : ?>
<?php print render($main_menu_expanded); ?>                    <?php endif; ?>
                    <?php //if (isset($secondary_menu)) : ?>
                      <?php //print theme('links', array('links' => $secondary_menu, 'attributes' => array('class' => 'links secondary-menu'))) ?>
                    <?php //endif; ?>
                  </div>
                  <div class="col-sm-1"></div>
                </div>
              </div>
            </nav>

            <div class="jumbotron">
                  <div id="slider">
                    <div class="jumbotron-nav jumbotron-prev"><span></span></div>
                    <?php print $jumbotron; ?>


                    <?php //print render($page['jumbotron']); ?>
                    <div class="jumbotron-nav jumbotron-next"><span></span></div>
                </div>
            </div>

            <div class="container" id="content-main">
              <?php if($page['content_main_top'] || $messages): ?>
                <div class="row sticky">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-10">
                    <?php print $messages; ?>
                    <?php print render($page['content_main_top']);?>
                  </div>
                  <div class="col-sm-1"></div>
                </div>
              <?php endif; # content_main_top || $messages ?>
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-7 content-left">
                    <?php print render($page['content']);?>
                  </div>
                  <div class="col-sm-3 sidebar">
                    <?php /*print $isa_now;*/ ?>
                    <?php print render($page['sidebar_first']);?>
                    <div class="col-sm-1"></div>
                  </div>
                </div>
              </div> <!-- /container --> 

                <div id="content-footer">
                  <div class="container">
                <div class="row">
                  <footer>
                    <div class="col-sm-1"></div>
                    <div class="col-sm-2">
                      <?php print render($page['footer_col_1']); ?>
                      
                      </div>
                      <div class="col-sm-3">
                        <?php print render($page['footer_col_2']); ?>
                        
                      </div>
                      <div class="col-sm-2">
                        <?php print render($page['footer_col_3']); ?>
                        
                      </div>
                      <div class="col-sm-3">
                        <?php print render($page['footer_col_4']);?>
                        
                      </div>
                      <div class="col-sm-1"></div>
                    </footer>
                  </div>
                </div>
              </div>

              <div id="content-footer-secondary">
                <div class="container">
                  <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">
                      &copy; <?php print date("Y");?> <?php print $site_name; ?>.
                      <a href="<?php print $base_path; ?>privacy">Privacy policy</a>.
                      <?php print render($page['secondary']); ?>
                      <?php if(!$logged_in): ?>
                        <a href="#user-login" class="login">Admin/board login</a>
                      <?php else: ?>
                        <a href="/user/logout?destination=<?php print current_path(); ?>" class="logout">Logout</a>
                      <?php endif;?>
                    </div>
                    <div class="col-sm-1"></div>
                  </div>
                </div>
              </div>

              <div id="user-login" class="white-popup-block small mfp-hide login-lightbox">
                <h2>Admin/Board Member Login</h2>
                <?php 
                  $form = drupal_get_form('user_login_block'); 
                  print render($form); 
                ?>
              </div>

