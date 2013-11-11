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
                    <a href="#" id="logo">
                      <img src="<?php print $logo; ?>" alt="<?php print $site_name; ?>"/>
                    </a>
                  </div>
                  <div class="col-md-8">
                    <?php if (isset($main_menu)) : ?>
                      <?php print theme('links', array('links' => $main_menu, 'attributes' => array('class' => 'links main-menu'))) ?>
                    <?php endif; ?>
                    <?php if (isset($secondary_menu)) : ?>
                      <?php print theme('links', array('links' => $secondary_menu, 'attributes' => array('class' => 'links secondary-menu'))) ?>
                    <?php endif; ?>
                  </div>
                  <div class="col-sm-1"></div>
                </div>
              </div>
            </nav>

            <div class="jumbotron">
                  <div id="slider">
                    <div class="slide" style="background-image:url(<?php print drupal_get_path('theme','harvest'); ?>/img/dummy.jpg)">
                      <aside class="col-sm-4">
                        <h2>ISA Programs</h2>
                        <h3>help farmers provide food, feed, and fuel for the world while protecting and concerving natural resources</h3>
                        <ul class="buttons">
                          <li><a href="#" class="btn btn-primary">learn more <i class="fa fa-chevron-circle-right"></i></a>
                          </li>
                        </ul>
                      </aside>
                    </div>
                </div>
            </div>

            <div class="container" id="content-main">
              <!-- Example row of columns -->
              <div class="row sticky">
                <div class="col-sm-1"></div>
                <div class="col-sm-10">
                  <?php print render($page['content_main_top']);?>
                  <div class="sticky-img">
                    <img src="<?php print drupal_get_path('theme','harvest'); ?>/img/50-logo.png"/>
                  </div>
                  <div class="sticky-story">
                  <h1>Focused on the Future</h1>
                  <p>There’s a quiet revolution going on. It has been gaining momentum for 50 years, as Iowa’s soybean growers have planted the seeds of change to make Iowa a leader in agriculture innovation and sustainability worldwide.</p>
                  <p>
                    The farmer leaders who founded the Iowa Soybean Association (ISA) in 1964 knew that partnering to produce results was the key to stronger rural communities and a stronger Iowa. Opportunities continue to expand as today’s ISA members find new solutions to produce higher yields, ensure healthier food production, provide alternative energy options and create new commercial technologies for valuable soy byproducts. </p>

                    <p>They do all this by supporting the soybean checkoff, which enhances the value of their soybean...</p>
                    <ul class="buttons">
                      <li>
                        <a class="btn btn-secondary">watch the video<i class="fa fa-youtube-play"></i></a>
                      </li>
                      <li>
                        <a class="btn btn-primary">continue reading<i class="fa fa-chevron-circle-right"></i></a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-sm-1"></div>
              </div>

                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-7 content-left">
                    <?php print render($page['content']);?>
                  </div>
                  <div class="col-sm-3 sidebar">
                    <?php print render($page['sidebar_first']);?>
                    <div class="isa-now">
                      <img src="<?php print drupal_get_path('theme','harvest'); ?>/img/iowa-soybean-now.png"/>
                      <h3>October 31, 2013</h3>
                      <ul>
                        <li>
                          <a>Iowa Soybean association hires Carrie Kelly</a>
                          <p>Lorem ipsum dolar sit amet consec ta soy be im lecture...</p>
                        </li>
                        <li>
                          <a>Pron quis ticitudn lorem, alquam inducidunt odio nuc porta</a>
                          <p>Lorem ipsum dolar sit amet feugiat lacus. Fusce quconsec ta soy be im lecture...</p>
                        </li>
                      </ul>
                      <h3>October 19, 2013</h3>
                      <ul>
                        <li>
                          <a>Donar set let tomear dond</a>
                          <p>Pe habe styn io pynar me excelar</p>
                        </li>
                        <li><a>Vulputate faucibus tincidunt, nulla urna pellentesque</a>
                          <p>Lorem Ipsum dolar sit amet consec ta soy be im lecture...</p>
                        </li>
                      </ul>
                    </div>
                    <div class="twitter-feed">
                      <p>
                        <a>@laurablog</a>
                        I will be very soon. As a result of your prev recommendation on a bog post so it happens. Now just a few more letters here. <span class="time-ago">32 min ago</span>
                      </p>
                      <i class="fa fa-twitter"></i>
                      <span class="follow">follow <a>@iasoybeans</a> on Twitter</span>
                    </div>
                  </div>
                  <div class="col-sm-1"></div>

                </div>
                </div> <!-- /container --> 
                <div id="content-footer">
                  <div class="container">
                <div class="row">
                  <footer>
                    <div class="col-sm-1"></div>
                    <div class="col-sm-2">
                      <h4>Contact us</h4>
                      <ul>
                        <li>1255 SW Prairie Trail Pkwy<br/>
                          Ankeny, Iowa 50322
                        </li>
                        <li>
                          <li>
                            <label>Phone:</label>
                            <span>800.383.1423</span>
                          </li>
                          <li>
                            <label>Fax:</label>
                            <span>515.251.8657</span>
                          </li>
                          <li><a href="#">Get directions</a></li>
                        </ul>
                      </div>
                      <div class="col-sm-3">
                        <h4>Media Inquiries</h4>
                        <ul>
                          <li>Aaron Putze</li>
                          <li>
                            <label>Email:</label>
                            <span><a href="mailto:aputze@iasoybeans.com">aputze@iasoybeans.com</a></span>
                          </li>
                          <li>
                            <label>Office:</label>
                            <span>515.334.1099</span>
                          </li>
                          <li>
                            <label>Cell:</label>
                            <span>515.975.4168</span>
                          </li>
                          <li>
                            <label>Fax:</label>
                            <span>515.334.1126</span>
                          </li>
                        </ul>

                        <ul>
                          <li>Contact Secondary</li>
                          <li>
                            <label>Email:</label>
                            <span><a href="mailto:media@iasoybeans.com">media@iasoybeans.com</a></span>
                          </li>
                          <li>
                            <label>Office:</label>
                            <span>515.334.1099</span>
                          </li>
                          <li>
                            <label>Fax:</label>
                            <span>515.334.1126</span>
                          </li>
                        </ul>
                      </div>
                      <div class="col-sm-2">
                        <h4>Quick links</h4>
                        <ul>
                          <li>
                            <a href="#">About</a>
                          </li>
                          <li>
                            <a href="#">Blog</a>
                          </li>
                          <li>
                            <a href="#">Related Organizations</a>
                          </li>
                          <li>
                            <a href="#">Communications</a>
                          </li>
                          <li>
                            <a href="#">Programs</a>
                          </li>
                          <li>
                            <a href="#">Contact</a>
                          </li>
                          <li>
                            <a href="#">Become a member</a>
                          </li>
                        </ul>
                      </div>
                      <div class="col-sm-3">
                        <h4>Get connected</h4>
                        <ul>
                          <li>We're everywhere you are. Find us on your favorite social network!</li>
                          <li>
                            <ul class="social-media">
                              <li><a href="#"><i class="fa fa-twitter-square"></i></a></li>
                              <li><a href="#"><i class="fa fa-facebook-square"></i></a></li>
                              <li><a href="#"><i class="fa fa-youtube-square"></i></a></li>
                              <li><a href="#"><i class="fa fa-google-plus-square"></i></a></li>
                              <li><a href="#"><i class="fa fa-instagram"></i></a></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                      <div class="col-sm-1"></div>
                    </footer>
                  </div>
                </div>
              </div>
                <div  id="content-footer-secondary">
                  <div class="container">
                  <div class="row">
                    <div class="col-sm-1"></div>
                    <div class="col-sm-10">
                      &copy; 2013 Iowa Soybean Association. Partially funded by the Soybean Checkoff.  
                      <a href="#" class="login">Admin/board login</a>
                    </div>
                    <div class="col-sm-1"></div>
 
                  </div>
                  </div>
                </div>

