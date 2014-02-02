
var RotatingTwitter = new function(){
    var self = this;

    self.currentItem = 0;
    self.oldItem = -1;
    self.itemsArray = "#twitter-feeds .twitter-feed";
    self.lookupArray = [];
    self.itemsArrayLen = null;
    self.currentItemArray = [];
    self.oldItemArray = [];
    self.timerLength = 15000; //milliseconds

    self.init = function() {
        var self = this;
        self.itemsArray = $(self.itemsArray);
        self.itemsArrayLen = self.itemsArray.length;

        self.itemsArray.each(function(i, e) {
            self.lookupArray.push({
                "leadItem":$(e),
                "index":i
            });

        self.itemsArray.eq(self.currentItem).addClass('active')

            //lookupArray[i].heading2.html(lookupArray[i].heading2a.text());

        });
        //clickItems( currentItem );
        if(self.itemsArrayLen > 1) {
            self.StartTimer();
        };
        
    };

    self.StartTimer = function() {
        $.doTimeout( 'twitterTimer', self.timerLength, function(){
            self.ChangeSlide( null );
            return true;
        } );
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
        self.lookupArray[oldItem].leadItem.removeClass("active");
        self.lookupArray[self.currentItem].leadItem.addClass("active");
    };

    self.ResetTimeout = function() {
        $.doTimeout( 'twitterTimer' );
        $.doTimeout( 'reTwitterTimer' );
        $.doTimeout( 'reTwitterTimer', self.timerLength, function(){
            $.doTimeout( 'twitterTimer', self.timerLength, function(){
                self.ChangeSlide( null );
                return true;
            } );
        } );
        
    }

}

jQuery(document).ready(function() {
    RotatingTwitter.init();
});