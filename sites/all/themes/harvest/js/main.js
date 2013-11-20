var $ = jQuery;
$(document).ready(function() {

	DynamicLead.init();
	MenuDropdowns.init();
	StaffListing.init();

	$(".action-link").magnificPopup({
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
				console.log(this);
				if($(window).width() < 600) {
					this.st.focus = false;
				} else {
					this.st.focus = '#edit-name';
				}
			}
		}
	});

	window.player = new MediaElementPlayer("#radio-player");

	$(".view-id-radio").on("click",".radio-file",function(e) {
		if($(this).hasClass("on")) {
			$("#player-icon").hide();
			e.preventDefault();
			player.pause();
			$(this).removeClass("on");
		} else {
			var location = $(this).data("audio-src");
			if(location) {
				e.preventDefault();
				$(this).after($("#player-icon").show());
				$(".radio-file.on").removeClass("on");
				$(this).addClass("on");
				$(".view-header .title").text($(this).text());
				$("#radio-player").attr("src",location);
				player.play();
			}
		}
	})

	var data = {
		labels : ["Soybeans","Corn","Wheat","Other"],
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : [29,36,21,14]
			}
		]
	};

	var options = {
		scaleOverride:true,
		scaleSteps : 8,
		//Number - The value jump in the hard coded scale
		scaleStepWidth : 5,
		//Number - The scale starting value
		scaleStartValue : 0
	}

	//Get context with jQuery - using jQuery's .get() method.
	/*var ctx = $("#croparea").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx).Bar(data,options);

	var placeholder = $("#placeholder");
	var opts = {
		bars: {
			show:true
		},
		lines: { 
			show: false 
		},
		xaxis: {
			ticks: [
				[0,"a"], [ 1, "Soybeans" ], [ 2, "Corn" ],
				[ 3, "Wheat" ], [4, "Other" ]
			]
		}
	};*/
	//$.plot($("#placeholder"), [ [[0, 29], [2, 8], [3, 5], [4, 13]] ], opts);

	var line1 = [['Soybeans', 29],['Corn', 36],['Wheat', 21],['Other', 14]];
	 
    $('#chart1').jqplot([line1], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C","#cccccc","#cccccc","#cccccc"],
    	shadow:false,
        title:'Crop area planted 2012',
        axesDefaults: {
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        seriesDefaults:{
        	shadow:false,
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set the varyBarColor option to true to use different colors for each bar.
                // The default series colors are used.
                varyBarColor: true
            }
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
            	label:"Crop",
                renderer: $.jqplot.CategoryAxisRenderer
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
            	label:"Percent",
                pad: 1.05,
                tickOptions: {formatString: '%d\%'}
            }
        }
    });
    var line2 = [["1986",60.4],["1996",64.2],["2006",75.5],["2012",77.2]];
	 
    /*$('#chart2').jqplot([line2], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
    	shadow:false,
        title:'Soybean Acres - United States',
        seriesDefaults:{
        	shadow:false,
            renderer:$.jqplot.BarRenderer,
            rendererOptions: {
                // Set the varyBarColor option to true to use different colors for each bar.
                // The default series colors are used.
                varyBarColor: true
            }
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
            	label:"Year",
                renderer: $.jqplot.CategoryAxisRenderer
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
            	label:"Millions of acres",
                pad: 1.05
            }
        }
    });*/
   $('#chart2').jqplot([line2], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
         // Give the plot a title.
         title: 'Soybean Acres – United States',
         // You can specify options for all axes on the plot at once with
         // the axesDefaults object.  Here, we're using a canvas renderer
         // to draw the axis label which allows rotated text.
         axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         },
         // Likewise, seriesDefaults specifies default options for all
         // series in a plot.  Options specified in seriesDefaults or
         // axesDefaults can be overridden by individual series or
         // axes options.
         // Here we turn on smoothing for the line.
         seriesDefaults: {
         	shadow:false,

             rendererOptions: {
                 smooth: true
             }
         },
         // An axes object holds options for all axes.
         // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
         // Up to 9 y axes are supported.
         axes: {
           // options for each axis are specified in seperate option objects.
           xaxis: {
             label: "Year",

             renderer: $.jqplot.CategoryAxisRenderer,

             // Turn off "padding".  This will allow data point to lie on the
             // edges of the grid.  Default padding is 1.2 and will keep all
             // points inside the bounds of the grid.
             pad: 0
           },
           yaxis: {
             label: "Millions of acres"
           }
         }
       });
var line3 = [["1986",1.9],["1996",2.4],["2006",3.2],["2007",2.7],["2008",2.9],["2009",3.4],["2010",3.3],["2011",3.1],["2012",3]];

   $('#chart3').jqplot([line3], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
         // Give the plot a title.
         title: 'U.S. Soybean Production',
         // You can specify options for all axes on the plot at once with
         // the axesDefaults object.  Here, we're using a canvas renderer
         // to draw the axis label which allows rotated text.
         axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         },
         // Likewise, seriesDefaults specifies default options for all
         // series in a plot.  Options specified in seriesDefaults or
         // axesDefaults can be overridden by individual series or
         // axes options.
         // Here we turn on smoothing for the line.
         seriesDefaults: {
         	shadow:false,

             rendererOptions: {
                 smooth: true
             }
         },
         // An axes object holds options for all axes.
         // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
         // Up to 9 y axes are supported.
         axes: {
           // options for each axis are specified in seperate option objects.
           xaxis: {
             label: "Year",

             renderer: $.jqplot.CategoryAxisRenderer,

             // Turn off "padding".  This will allow data point to lie on the
             // edges of the grid.  Default padding is 1.2 and will keep all
             // points inside the bounds of the grid.
             pad: 0
           },
           yaxis: {
             label: "Billions of bushels"
           }
         }
       });

	var line4 = [["1986",4.70],["1996",7.30],["2006",6.40],["2007",10.10],["2008",9.9],["2009",9.5],["2010",11.3],["2011",12.5],["2012",14.3]];

   $('#chart4').jqplot([line4], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
         // Give the plot a title.
         title: 'U.S. Soybean Prices paid to farmers',
         // You can specify options for all axes on the plot at once with
         // the axesDefaults object.  Here, we're using a canvas renderer
         // to draw the axis label which allows rotated text.
         axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         },
         // Likewise, seriesDefaults specifies default options for all
         // series in a plot.  Options specified in seriesDefaults or
         // axesDefaults can be overridden by individual series or
         // axes options.
         // Here we turn on smoothing for the line.
         seriesDefaults: {
         	shadow:false,

             rendererOptions: {
                 smooth: true
             }
         },
         // An axes object holds options for all axes.
         // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
         // Up to 9 y axes are supported.
         axes: {
           // options for each axis are specified in seperate option objects.
           xaxis: {
             label: "Year",

             renderer: $.jqplot.CategoryAxisRenderer,

             // Turn off "padding".  This will allow data point to lie on the
             // edges of the grid.  Default padding is 1.2 and will keep all
             // points inside the bounds of the grid.
             pad: 0
           },
           yaxis: {
             label: "Price per bushel",
             tickOptions: {formatString: '$%d'}
           }
         }
       });

	var line5 = [["1986",1.2],["1996",1.4],["2006",1.8],["2012",1.6]];

   $('#chart5').jqplot([line5], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
         // Give the plot a title.
         title: 'U.S. Soybean Crush',
         // You can specify options for all axes on the plot at once with
         // the axesDefaults object.  Here, we're using a canvas renderer
         // to draw the axis label which allows rotated text.
         axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         },
         // Likewise, seriesDefaults specifies default options for all
         // series in a plot.  Options specified in seriesDefaults or
         // axesDefaults can be overridden by individual series or
         // axes options.
         // Here we turn on smoothing for the line.
         seriesDefaults: {
         	shadow:false,

             rendererOptions: {
                 smooth: true
             }
         },
         // An axes object holds options for all axes.
         // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
         // Up to 9 y axes are supported.
         axes: {
           // options for each axis are specified in seperate option objects.
           xaxis: {
             label: "Year",

             renderer: $.jqplot.CategoryAxisRenderer,

             // Turn off "padding".  This will allow data point to lie on the
             // edges of the grid.  Default padding is 1.2 and will keep all
             // points inside the bounds of the grid.
             pad: 0
           },
           yaxis: {
             label: "Billions of bushels"
           }
         }
       });

	var line6 = [["1986",.757],["1996",.882],["2006",1.1],["2012",1.35]];

   $('#chart6').jqplot([line6], {
    	grid: {
    		background:"#FFFFFF",
    		shadow:false
    	},
    	seriesColors:["#0D4D8C"],
         // Give the plot a title.
         title: 'U.S. Soybean Exports',
         // You can specify options for all axes on the plot at once with
         // the axesDefaults object.  Here, we're using a canvas renderer
         // to draw the axis label which allows rotated text.
         axesDefaults: {
           labelRenderer: $.jqplot.CanvasAxisLabelRenderer
         },
         // Likewise, seriesDefaults specifies default options for all
         // series in a plot.  Options specified in seriesDefaults or
         // axesDefaults can be overridden by individual series or
         // axes options.
         // Here we turn on smoothing for the line.
         seriesDefaults: {
         	shadow:false,

             rendererOptions: {
                 smooth: true
             }
         },
         // An axes object holds options for all axes.
         // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
         // Up to 9 y axes are supported.
         axes: {
           // options for each axis are specified in seperate option objects.
           xaxis: {
             label: "Year",

             renderer: $.jqplot.CategoryAxisRenderer,

             // Turn off "padding".  This will allow data point to lie on the
             // edges of the grid.  Default padding is 1.2 and will keep all
             // points inside the bounds of the grid.
             pad: 0
           },
           yaxis: {
             label: "Billions of bushels"
           }
         }
       });
	
		var line7 = [['Whole Soybeans', 84],['Sobean meal', 12],['Soybean oil', 4]];
		 
	    $('#chart7').jqplot([line7], {
	    	grid: {
	    		background:"#FFFFFF",
	    		shadow:false
	    	},
	    	seriesColors:["#0D4D8C"],
	    	shadow:false,
	        title:'U.S. Soybean and Soy Product Exports 2012',
	        axesDefaults: {
	          labelRenderer: $.jqplot.CanvasAxisLabelRenderer
	        },
	        seriesDefaults:{
	        	shadow:false,
	            renderer:$.jqplot.BarRenderer,
	            rendererOptions: {
	                // Set the varyBarColor option to true to use different colors for each bar.
	                // The default series colors are used.
	                varyBarColor: true
	            }
	        },
	        axes: {
	            // Use a category axis on the x axis and use our custom ticks.
	            xaxis: {
	            	label:"Product",
	                renderer: $.jqplot.CategoryAxisRenderer
	            },
	            // Pad the y axis just a little so bars can get close to, but
	            // not touch, the grid boundaries.  1.2 is the default padding.
	            yaxis: {
	            	label:"Percent",
	                pad: 1.05,
	                tickOptions: {formatString: '%d\%'}
	            }
	        }
	    });
		//create static image of chart so for responsive friendlyness
		$(".chart").each(function(i,e) {
			var imgData = $(e).jqplotToImageStr({}); // given the div id of your plot, get the img data
			var imgElem = $('<img/>').attr('src',imgData); // create an img and add the data to it
			$(e).after(imgElem);//
			$(e).hide();
		});
		

})

var MenuDropdowns = new function() {
	var self = this;

	self.init = function() {
		$("ul.menu li").hover(function(){
			console.log(this);
		    $(this).addClass("hover");
		    $('ul:first',this).css('visibility', 'visible');
		
		}, function(){
		
		    $(this).removeClass("hover");
		    $('ul:first',this).css('visibility', 'hidden');
		
		});
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
		console.log("here");
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