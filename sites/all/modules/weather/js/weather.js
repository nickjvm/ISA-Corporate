$ = jQuery;
$(document).ready(function() {

	Weather.init();
});

var Weather = {

	init:function() {
		var self = this;

		$.cookie.json = true;
		
		self.SetPosition();

		$.doTimeout("locationRequest",10000,Weather.Error);

		
	},
	options:{
		numDays:4
	},
	Error:function() {
		if(!Weather.Latlng || !Weather.ZipSet ) {
			$("#weather-widget").removeClass("weather-loading").addClass("weather-error");
		}
	},
	OnGeoSuccess:function(data) {

		var self = this;

		if(!self.LocationSet) {
			self.Latlng = data.coords.latitude+ "," +data.coords.longitude;
			self.GetZip(); 
		}
		return
	},
	SetPosition:function(position){
		var self = this;
		if(!$.cookie("latlng")) {
			//console.log("Getting lat lang from geolocator");
		    geolocator.locateByIP(self.OnIPSuccess, self.OnGeoError, 2);
		} else {
			self.Latlng = $.cookie("latlng");
			self.GetZip();
		}
	},
	OnGeoError:function(error) {
		var self = this;
		self.Latlng = '41.731788,-93.600128';
		self.GetZip();
	},
	OnIPSuccess:function(data) {
		var self = Weather;

		$.cookie("latlng",data.coords.latitude+ "," +data.coords.longitude,{expires:self.ExpirationDate()});
		self.Latlng = data.coords.latitude+ "," +data.coords.longitude;

		self.GetZip();
	},
	LocationSet:false,
	GeoLocate:function(position) {
		var self = Weather;
		self.SetPosition(position);

		//getZip(position);
		//getWeather(position);
	},
	GetZip:function() {
		var self = this;

		if(!$.cookie("location")) {
			//console.log("getting zip from google");
			$.ajax({
				url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+self.Latlng+"&sensor=false",
				dataType:"json"
			}).done(function(data) {
				address = data.results[0].address_components;
				self.SetLocationCookie(address[2].long_name)

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
		$(".city").text(data);
		self.ZipSet = true;
		self.GetWeather();
	},
	SetWeatherCookie:function(data) {
		var self = this;
		var savedData = [];
		for(var i=0;i<=self.options.numDays;i++) {
			savedData[i] = JSON.stringify({
				apparentTemperatureMax:data[i].apparentTemperatureMax,
				apparentTemperatureMin:data[i].apparentTemperatureMin,
				icon:data[i].icon
				});
		}
		console.log(savedData);
		$.cookie("weather",savedData,{ expires:self.ExpirationDate() });
		//$.cookie("weather-today", JSON.stringify(data[0]), { expires:self.ExpirationDate() });
		//$.cookie("weather-future", savedData, { expires:self.ExpirationDate() });

		self.InjectWeatherData(savedData);
	},
	GetWeather:function() {	
	var self = this;	

		if(!$.cookie("weather")) {
			//console.log("getting weather info from forecast.io");
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
  		self.LocationSet = true;
  		var today = JSON.parse(data[0]);

  		$("#weather-widget .icon").addClass("wi-"+today.icon);
  		$("#weather-widget .summary").text(self.GetSummary(today));
  		$("#weather-widget .hi").html(Math.round(today.apparentTemperatureMax)+"&deg;");
  		$("#weather-widget .lo").html("/"+Math.round(today.apparentTemperatureMin));
  		$("#forecast li").remove();

  		for(var i=1;i<=self.options.numDays-1;i++) {
			var daily = JSON.parse(data[i]);

			html = "<li><i class='three-day wi-"+daily.icon+"'></i>"+Math.round(daily.apparentTemperatureMax)+
					"/"+Math.round(daily.apparentTemperatureMin)+"</li>"
			$("#forecast").append(html);
			
		}
		$(".weather-loading").removeClass("weather-loading");
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
