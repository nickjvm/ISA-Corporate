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
              <div id="slider" style="background-image: url(/img/dummy-header.jpg)">
                <aside class="col-sm-4">
                  <h2>Iowa Food and Family Project</h2>
                  <h3>The more we know, the more we grow</h3>
                </aside>
              </div>
            </div>

            <div class="container" id="content-main">
                <div class="row">
                  <div class="col-sm-1"></div>
                  <div class="col-sm-7 content-left">
                    <div class="story">
                      <div class="body-img">
                        <img src="/img/placeholder-4.jpg"/>
                      </div>
                      <div class="body">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pulvinar cursus rutrum. Aenean placerat enim sit amet libero auctor ornare. Mauris id nibh et eros facilisis interdum vel ac magna. Vivamus porta arcu justo, eu egestas lacus volutpat ut. Pellentesque consectetur sed ipsum at ultrices. Maecenas a tincidunt nisi, molestie fermentum nulla. Etiam...</p>
                        <p>Proin quis tincidunt lorem, aliquam tincidunt odio. Nunc porta a enim eu consequat. Proin sed lacinia justo. Suspendisse in suscipit lorem. Aliquam egestas blandit sodales. Aenean at lectus sed nisl lobortis faucibus et ac felis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas</p>
                        <p>They do all this by supporting the soybean checkoff, which enhances the value of their soybean...</p>
                        <ul class="buttons">
                          <li>
                        <a class="btn btn-primary">Visit iowafoodandfamily.com <i class="fa fa-chevron-circle-right"></i></a>
                      </li>
                    </ul>
                      </div>
                    </div>
                    <div class="gallery">
                      <img src="/img/iffp-4.jpg"/>
                    </div>
                  </div>
                  <div class="col-sm-3 sidebar">
                    <div class="block">
                      <h2>Visit the Iowa Food & Family website for</h2>
                      <ul>
                        <li>Farm facts</li>
                        <li>Partners of IFFP</li>
                        <li>Programs</li>
                        <li>Events</li>
                        <li>Volunteer opportunities</li>
                        <li>Newsletters</li>
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

