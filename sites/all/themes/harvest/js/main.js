var $ = jQuery;

$(document).ready(function() {

    DynamicLead.init();
    ProgramSlideshow.init();
    MenuDropdowns.init();
    StaffListing.init();
    Videos.init();
    Radios.init();

    //Mobile Navigation
    $("#mobile-nav").on("click",function() {
        $(this).toggleClass("visible");
    })
    $("#mobile-nav li").on("click",function(e) {
        e.stopPropagation();
        $(this).children("ul").slideToggle();
        $(this).toggleClass("open");
    });
    $("#mobile-nav li a").on("click",function(e){
        e.stopPropagation();
    });
    $(".shadow").on("click",function() {
        $("#mobile-nav").toggleClass("visible");
    });

    //End Mobile Navigation


    $(".action-link").magnificPopup({
        type:'iframe',
        removalDelay:160,
        preloader:false
    });

    $("a[rel=Youtube]").magnificPopup({
        type:'iframe',
        removalDelay:160,
        preloader:false
    });

    $('.login').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#edit-name',

        callbacks: {
            beforeOpen: function() {
                if($(window).width() < 600) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#edit-name';
                }
            }
        }
    });


    //External URL notification
    $("a").on("click",function(e) {
        //proceed to check url if it's not already attached to an internal lightbox
        if(!$(this).data("magnificPopup") && 
            !$(this).closest("#toolbar").length && 
            !$(this).closest(".contextual-links-wrapper").length && 
            !$(this).closest(".tabs").length && 
            !$(this).data("audioSrc")) {
            
            var url = $(this).attr("href");

            if(isExternal(url)) {
                e.preventDefault();
                //get the domain of the url
                var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
                $.magnificPopup.open({
                  items: {
                      src: '<div class="white-popup-block">\
                            <h2>You are now leaving The Iowa Soybean Association</h2>\
                            <p>If you are not redirected in <span class="countdown">5</span> seconds, click continue below.</p>\
                            <ul class="buttons"><li>\
                            <a href="'+url+'" class="btn btn-primary">Continue to '+match[2]+'<i class="fa fa-chevron-circle-right"></i></a>\
                            </li></ul></div>',
                      type: 'inline'
                  },
                  callbacks: {
                      beforeOpen:function() {
                        //Set the timer for 5 seconds
                        $.doTimeout( 'redirecter', 5000, function(){
                            document.location = url;
                        });
                        var i = 4;
                        $.doTimeout('countdown',1000,function() {
                            $(".countdown").text(i--);
                            return true;
                            if(i==0) {
                                return false;
                            }
                        })
                      },
                      close:function() {
                        $.doTimeout('redirecter');
                        $.doTimeout('countdown');
                      }
                  }
                });
            } 
        }
    });
})

var safeList = [
    "iasoybeans",
    "iowafoodandfamily",
    "iowabiodiesel",
    "thesoyfoodscouncil",
    "planthealth",
    "ag-urbanleadership",
    "soybeanreview"
]
function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[2] === "string" && match[2].length > 0 && $.inArray(match[2].replace("www.","").split(".")[0],safeList) != -1) return false;
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol && match[1].toLowerCase()!= 'mailto:') return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
    return false;
}

var MenuDropdowns = new function() {
    var self = this;

    self.init = function() {
        $("#full-nav ul.menu li").hover(function(){
            $(this).addClass("hover");
            $('ul:first',this).css('visibility', 'visible');
        
        }, function(){
        
            $(this).removeClass("hover");
            $('ul:first',this).css('visibility', 'hidden');
        
        });
    }
}
var Radios = new function() {
    var self= this;

    self.init = function() {

        //self.attachHandlers();
        if($("#radio-player").length) {
            self.player = new MediaElementPlayer("#radio-player", {
                pluginPath:'/sites/all/themes/harvest/js/'
            });
            self.attachHandlers();
        }
    };


    self.attachHandlers = function() {

        $(".view-id-radio").on("click",".radio-file",function(e) {
            e.preventDefault()
            self.player.pause();
            if($(this).hasClass("on")) {
                $("#player-icon").hide();
                $(this).removeClass("on");
            } else {
                var location = $(this).data("audioSrc");
                if(location) {
                    var currentsrc = self.player.src;
                    $(this).after($("#player-icon").show());

                    $(".radio-file.on").removeClass("on");
                    $(this).addClass("on");
                    if(currentsrc == location) {
                        self.player.play();
                    } else {
                        
                        $(".view-header .title").text($(this).text());
                        self.player.setSrc(location);
                        //$("#radio-player").attr("src",location);
                        self.player.play();
                    }
                }
            }
            return false;
        })
    };
}
var Videos = new function() {
    var self = this;
    self.init = function() {
        if($(".page-programs-production-research-videos").length) {
            self.attachHandlers();
        }
        return false;
    }
    self.attachHandlers = function() {
        $('a[rel=Other]').on("click",function(e) {
            e.preventDefault();

            if(!$(this).data("url")) {
                $(this).data("url",$(this).attr("href"));
            }
            self.URL = $(this).attr("href");
            self.Title = $(this).text();
            self.Magnific();
        });
    };
    self.Open = function() {
        videojs("video-player").ready(function(){
            self.player = this;
            var url = $(self).data("url");
            self.player.src({
                type:"video/mp4",
                src:self.URL
            });
        });
    },
    self.Magnific = function() {
        $.magnificPopup.open({
            items:{
                src:self.videoSrc(),
                type:"inline"
            },
            closeBtnInside:true,
            callbacks: {
                open:Videos.Open,
                close: function() {
                    self.player.dispose();
                }
            }
        });
    }
    self.videoSrc = function() {
        var markup = "<div class='video white-popup'>\
            <h2>"+self.Title+"</h2>\
            <video id='video-player' class='video-js vjs-default-skin'\
            src='"+self.URL + "'\
            controls preload='none' width='640' height='536'\
            poster='/sites/all/themes/harvest/img/player-splash.jpg'></video>";

        return markup;
    }
}
var DynamicLead = new function(){
    var self = this;

    self.currentItem = 0;
    self.oldItem = -1;
    self.itemsArray = "#slider .slide";
    self.lookupArray = [];
    self.itemsArrayLen = null;
    self.currentItemArray = [];
    self.oldItemArray = [];

    self.init = function() {
        var self = this;
        self.itemsArray = $(self.itemsArray);
        self.itemsArrayLen = self.itemsArray.length;

        if(self.itemsArray.length == 1) {
            $(".jumbotron-nav").hide();
        }
        self.itemsArray.each(function(i, e) {
            self.lookupArray.push({
                "leadItem":$(e),
                "aside":$(e).children(".aside"),
                "heading2":$(e).find("h2"),
                "heading3":$(e).find(".heading3"),
                "heading3a":$(e).find(".primary-btn"),
                "gotoDestination":$(e).find(".primary-btn").attr("href"),
                "img":$(e).find(".slide-img").data("slide-image"),
                "index":i
            });

        self.itemsArray.eq(self.currentItem).addClass('on').css({
            backgroundImage:"url("+self.lookupArray[self.currentItem].img+")"
        });

            //lookupArray[i].heading2.html(lookupArray[i].heading2a.text());

        });
        //clickItems( currentItem );
        if(self.itemsArrayLen > 1) {
            self.StartTimer();
            self.AttachHandlers();
        };
        
    };

    self.StartTimer = function() {
        $.doTimeout( 'autoStart', 10000, function(){
            self.ChangeSlide( null );
            return true;
        } );
    };

    self.AttachHandlers = function() {
        $(".jumbotron-prev").on("click",function() {

            self.ChangeSlide(self.currentItem-1);
            self.ResetTimeout();
        });
        $(".jumbotron-next").on("click",function() {
            self.ChangeSlide(self.currentItem+1);
            self.ResetTimeout();
        });
    };

    self.ChangeSlide = function( slideNumber ){

        var oldItem = self.currentItem;

        if (slideNumber==null) {
            self.currentItem++;
        } else {
            self.currentItem = slideNumber;
        }

        if ( self.currentItem >= self.itemsArrayLen ) self.currentItem = 0;
        if ( self.currentItem < 0 ) self.currentItem = self.itemsArrayLen-1;

        self.currentItemArray = self.lookupArray[ self.currentItem ];
        self.oldItemArray = self.lookupArray[ oldItem ];
        self.lookupArray[oldItem].leadItem.removeClass("on");
        self.lookupArray[self.currentItem].leadItem.addClass("on").css({
            backgroundImage:"url("+self.lookupArray[self.currentItem].img+")"
        });
    };

    self.ResetTimeout = function() {
        $.doTimeout( 'autoStart' );
        $.doTimeout( 'reAutoStart' );
        $.doTimeout( 'reAutoStart', 10000, function(){
            $.doTimeout( 'autoStart', 10000, function(){
                self.ChangeSlide( null );
                return true;
            } );
        } );
        
    }

}

var StaffListing = new function() {
    var self = this;
    self.init = function() {
        if($(".staff").length) {
            self.AttachHandlers();
            self.ApplyTipsy();
        }
        return;
    };

    self.AttachHandlers = function() {
        $(".staff-member,.district-member").on("click",function(e) {
            e.stopPropagation();
            var $staffMember = $(e.target).closest(".staff-member")
            //self.Details = self.StaffDetail($staffMember);
            $staffMember.addClass("on").find(".staff-overlay").slideDown();
            $staffMember.attr("original-title","");
            $staffMember.tipsy("hide");
            self.ShowCurtain();

            //self.PlaceOverlay($staffMember);

        })
    };

    self.ApplyTipsy = function() {
        $(".staff-member,.district-member").each(function() {
            $(this).attr("title",self.ViewMoreInfoText);
            $(this).tipsy({
                gravity:"s"
            });
        })
    }
    self.ShowCurtain = function() {
        $curtain = $("#staff-curtain").fadeIn("fast");
        $(".close-overlay").on("click",function(e) {
            e.stopPropagation();
            self.HideCurtain();
            $(".close-overlay").off("click");

        })
    };
    self.PlaceOverlay = function(target) {
        if($("#overlay").length == 0) {
            var test = $("<div id='overlay'/>").appendTo("body");
        } else {
            test = $("#overlay");
        }
        test.css({
            left:target.offset().left,
            top:target.offset().top,
            width:target.outerWidth(),
            display:"none",
            minHeight:180
        });
        test.slideDown();
        var html = "<div class='mask'></div>"+self.Details.name;
        test.html(html);
    };
    self.StaffDetail = function(element) {
        var $element = $(element);
        var data = $element.data();
        var staffDetails = {
            name:data.Name,
            title:data.Title,
            phone:data.phone,
            fax:data.fax,
            email:data.email,
            bio:data.bio
        }
        return data;
    };

    self.ViewMoreInfoText = "view more info"

    self.HideCurtain = function() {
        var $activeStaff = $(".staff-member.on,district-member.on");
        $curtain = $("#staff-curtain").fadeOut("fast");
        $activeStaff.removeClass("on").find(".staff-overlay").hide();
        $activeStaff.attr("original-title",self.ViewMoreInfoText);

    };


}

var ProgramSlideshow = new function(){
    var self = this;

    self.currentItem = 0;
    self.oldItem = -1;
    self.itemsArray = ".program-slideshow .slide";
    self.lookupArray = [];
    self.itemsArrayLen = null;
    self.currentItemArray = [];
    self.oldItemArray = [];

    self.init = function() {
        var self = this;
        self.itemsArray = $(self.itemsArray);
        self.itemsArrayLen = self.itemsArray.length;

        if(self.itemsArray.length == 1) {
            $(".program-slideshow .view-header").hide();
        }
        self.itemsArray.each(function(i, e) {
            self.lookupArray.push({
                "leadItem":$(e),
                "img":$(e).find("img").attr("src"),
                "index":i
            });

        self.itemsArray.eq(self.currentItem).addClass('on').css({
            backgroundImage:"url("+self.lookupArray[self.currentItem].img+")"
        });

            //lookupArray[i].heading2.html(lookupArray[i].heading2a.text());

        });
        //clickItems( currentItem );
        if(self.itemsArrayLen > 1) {
            self.StartTimer();
            self.AttachHandlers();
        };
        
    };

    self.StartTimer = function() {
        $.doTimeout( 'autoStart', 10000, function(){
            self.ChangeSlide( null );
            return true;
        } );
    };

    self.AttachHandlers = function() {
        $(".program-slideshow .program-prev").on("click",function() {

            self.ChangeSlide(self.currentItem-1);
            self.ResetTimeout();
        });
        $(".program-slideshow .program-next").on("click",function() {
            self.ChangeSlide(self.currentItem+1);
            self.ResetTimeout();
        });
    };

    self.ChangeSlide = function( slideNumber ){

        var oldItem = self.currentItem;

        if (slideNumber==null) {
            self.currentItem++;
        } else {
            self.currentItem = slideNumber;
        }

        if ( self.currentItem >= self.itemsArrayLen ) self.currentItem = 0;
        if ( self.currentItem < 0 ) self.currentItem = self.itemsArrayLen-1;

        self.currentItemArray = self.lookupArray[ self.currentItem ];
        self.oldItemArray = self.lookupArray[ oldItem ];
        self.lookupArray[oldItem].leadItem.removeClass("on");
        self.lookupArray[self.currentItem].leadItem.addClass("on").css({
            backgroundImage:"url("+self.lookupArray[self.currentItem].img+")"
        });
    };

    self.ResetTimeout = function() {
        $.doTimeout( 'autoStart' );
        $.doTimeout( 'reAutoStart' );
        $.doTimeout( 'reAutoStart', 10000, function(){
            $.doTimeout( 'autoStart', 10000, function(){
                self.ChangeSlide( null );
                return true;
            } );
        } );
        
    }

}