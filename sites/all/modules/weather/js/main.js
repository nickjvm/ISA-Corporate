$(document).ready(function() {
	yepnope({
		test:navigator.geolocation,
		yep:function() { console.log("geo!")},
		nope:function() { console.log("NOO")}
	})
	
	Weather.init();
	
});

var Weather = {

	init:function() {
		var self = this;

		$.cookie.json = true;
		self.SetPosition();

		
	},
	options:{
		numDays:3
	},
	SetPosition:function(position){
		var self = this;
		geolocator.locateByIP(function(data) { 
			self.Latlng = data.coords.latitude+ "," +data.coords.longitude;
			self.GetZip(); 
		});
	},
	GeoLocate:function(position) {
		var self = Weather;
		self.SetPosition(position);

		//getZip(position);
		//getWeather(position);
	},
	GetZip:function() {
		var self = this;
		//console.log("http://maps.googleapis.com/maps/api/geocode/json?latlng="+self.Latlng+"&sensor=false");
		if(!$.cookie("location")) {
			$.ajax({
				url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+self.Latlng+"&sensor=false",
				dataType:"json"
			}).done(function(data) {
				address = data.results[0].address_components;
				self.SetLocationCookie(address[2])
				//console.log(data.results[0].address_components[6].long_name);
			})
		} else {
			self.InjectLocationData($.cookie("location"));
		}
	},
	ExpirationDate:function() {
		var currentDate = new Date();
		var expirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1, 0, 0, 0);
		return expirationDate;
	},
	SetLocationCookie:function(data) {
		var self = this;
		$.cookie("location",data,{expires:self.ExpirationDate()})
		self.InjectLocationData(data)
	},
	InjectLocationData:function(data) {
		var self = this;
		$(".postal-code").text("Weather for "+data.long_name);
		self.GetWeather();
	},
	SetWeatherCookie:function(data) {
		var self = this;
		console.log("in SetCookie");
		var savedData = [];
		for(var i=0;i<self.options.numDays;i++) {
			savedData[i] = JSON.stringify(data[i]);
		}
		$.cookie("weather", savedData, { expires:self.ExpirationDate() });
		self.InjectWeatherData(savedData);
	},
	GetWeather:function() {	
	var self = this;	

		if(!$.cookie("weather")) {
			$.ajax({ 
				url:"https://api.forecast.io/forecast/7bf62ebad1d38f2266b97dc96f75a8aa/"+self.Latlng,
				dataType:"jsonp"
			}).done(function( data ) {
				self.SetWeatherCookie(data.daily.data);
	 		});
		} else {
			self.InjectWeatherData($.cookie("weather"));
		}
  	},
  	InjectWeatherData:function(data) {
  		var self = this;
  		for(var i=0;i<self.options.numDays;i++) {
			var daily = JSON.parse(data[i]);
			var summary = self.GetSummary(daily);
			html = "<div class='col-sm-2'>";
			html += "<div class='card'><h2>"+Math.round(daily.apparentTemperatureMax)+"</h2>";
			html += "<div class='summary'>"+summary+"</div>";
			html += "<i class='wi-"+daily.icon+"'></i></div></div>";
			html += "</div>";
			$(".weather").append(html);
			
		}
		$(".loading").removeClass("loading");
  	},
  	GetSummary:function(daily) {
  		var summary = daily.icon.split("-");
		if(summary.length > 1) {
			summary.pop(-1);
		}
		summary = summary.join(" ");
		return summary;
  	}
}
