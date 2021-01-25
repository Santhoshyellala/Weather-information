$(document).ready(function(){
	$('#searchbutton').click(function(){
	
		var city = $("#city").val();
		
		if(city != '')
		{
			$.ajax({
				url:'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=metric" + "&APPID=85db71dc7bbf3fc30d0ec50945a297d3",
				//url:'https://api.sunrise-sunset.org/json?lat='+function show(data)+lati+'&lng='+function show(data)+longi+'&date=today',
				type:"GET",
				dataType:"jasonp",
				success:function(data){
					console.log(data);
					obj = JSON.parse(data);
					
					getAirData(obj);
					
				}
				
			});		
		}else
		{
			$("#error").html('Field cannot be empty');
		}
});
		
});

function getAirData(obj){
	$.ajax({
		url: "https://api.breezometer.com/baqi/?lat=" + obj.coord.lat +"&lon=" + obj.coord.lon +"&key=b3b37cb1572e4e468f6b23ea7df1267e",
		type:"GET",
		success:function(data){
			
			obj.dominentPollutant = data.dominant_pollutant_canonical_name;
			obj.airQuality = data.breezometer_description;
			obj.recomendations = [];
			if(data.random_recommendations){
				for(var prop in data.random_recommendations){
					obj.recomendations.push(data.random_recommendations[prop]);
				}
			}
			getDayData(obj);
		}
		
	});
}

function getDayData(obj){
	$.ajax({
		url: "https://api.weatherbit.io/v2.0/current?lat=" + obj.coord.lat  + "&lon="+ obj.coord.lon  +"&key=35f689bb24f9498f95d3b0f883403446",
		type:"GET",
		success:function(data){
			var result = data.data[0];
			
			obj.sunset = result.sunset;
			obj.sunrise = result.sunrise;
			obj.temp = result.temp;
			obj.uv = result.uv;
			obj.elevAngle = result.elev_angle;
			obj.hAngle = result.h_angle;
			
			
			console.log(obj);
			var widget = show(obj);
			$("#show").html(widget);
			$("#city").val('');
		}
	});
}

function show(obj){
	
	var result= 	"<h3 style='font-size=40px; font-weight=bold;' class='text-left'> Current Weather for "+obj.name+ "," + obj.sys.country + "</h3>"+
			"<p><strong>Weather </strong>:"+ obj.weather[0].main + "</p>"+
			"<p><strong>Description </strong>: <img src= 'http://openweathermap.org/img/w/"+obj.weather[0].icon+".png'> "+ obj.weather[0].description +"</p>"+
	   	    "<p><strong>Temprature </strong>:"+ obj.main.temp +"&deg;C</p>"+
			"<p><strong>Humidity </strong>:"+ obj.main.humidity + "%</p>"+
			"<p><strong>Minimum Temprature </strong>:"+ obj.main.temp_min + "&degC</p>"+
			"<p><strong>Maximum temprature </strong>:"+ obj.main.temp_max + "&degC</p>"+
			"<p><strong>Wind Speed </strong>:"+ obj.wind.speed + "m/s</p>"+
			"<p><strong>Wind Direction</strong>:"+ obj.wind.deg + "&deg</p>"+
			"<p><strong>Latitude</strong>:"+ obj.coord.lat + "</p>"+
			"<p><strong>Longitude</strong>:"+ obj.coord.lon + "</p>" + 
			"<p><strong>Dominant pollutant</strong>:"+ obj.dominentPollutant + "</p>"+
			"<p><strong>Sunrise</strong>:"+ obj.sunrise + "</p>"+
			"<p><strong>Sunset</strong>:"+ obj.sunset + "</p>"+
			"<p><strong>U V</strong>:"+ obj.uv + "</p>"+
			"<p><strong>Elev Angle</strong>:"+ obj.elevAngle + "</p>"+
			"<p><strong>H Angle</strong>:"+ obj.hAngle + "</p>"+
			"<p><strong>Air Quality</strong>:"+ obj.airQuality + "</p>";
	if(obj.recomendations && obj.recomendations.length >0){
		var recomendationsHTML = '';
		obj.recomendations.forEach(function(element){
			recomendationsHTML += element;
		});
		result += "<p><strong>Recommendations</strong>:"+ recomendationsHTML + "</p>";
	}
	return result;
}

