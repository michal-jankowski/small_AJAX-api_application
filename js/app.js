$(function() {
	$("#loadData").click(function() {
		var url = "js/data.json";
		$.getJSON(url, function(response) {
			var statusHTML = '<table style="width:100%">';
			statusHTML += '<tr>';
			statusHTML += '<th>First Name</th>' + '<th>Last Name</th>' + '<th>Gender</th>' + '<th>Location</th>' + '<th>Weather</th>' + '<th>Map</th>' + '<th>Map preview</th>' + '</tr>';
			$.each(response, function(index, user) {
				statusHTML += '<tr>';
				statusHTML += '<td>' + user.firstName + '</td>';
				statusHTML += '<td>' + user.lastName + '</td>';
				statusHTML += '<td>' + user.gender + '</td>';

				if (user.type === "user") {
					statusHTML += '<td>' + 'no data' + '</td>';
					statusHTML += '<td>' + 'no access' + '</td>';
					statusHTML += '<td>' + 'no access' + '</td>';
					statusHTML += '<td>' + '-' + '</td>';

				} else if (user.type === "weatherUser") {
					statusHTML += '<td>' + user.city + ", " + user.country + '</td>';
					statusHTML += '<td id="weatherUser_'+ user.city +'">' + '<button class="weatherButton">' + user.city + '</button>' + '</td>';
					statusHTML += '<td>' + 'no access' + '</td>';
					statusHTML += '<td>' + '-' + '</td>';

				} else if (user.type === "mapUser") {
					statusHTML += '<td>' + user.city + ", " + user.country + '</td>';
					statusHTML += '<td>' + 'no access' + '</td>';
					statusHTML += '<td id="mapUser_'+ user.city +'">' + '<button class="mapButton">' + user.city + '</button>' + '</td>';
					statusHTML += '<td>' + '<div id="map_'+ user.city +'"></div>' + '</td>';
				statusHTML += '</tr>';

				} else {
					statusHTML += '<td>' + user.city + ", " + user.country + '</td>';
					statusHTML += '<td id="weatherUser_'+ user.city +'">' + '<button class="weatherButton">' + user.city + '</button>' + '</td>';
					statusHTML += '<td id="mapUser_'+ user.city +'">' + '<button class="mapButton">' + user.city + '</button>' + '</td>';
					statusHTML += '<td>' + '<div id="map_'+ user.city +'"></div>' + '</td>';
				statusHTML += '</tr>';
				}
			});
			statusHTML += '</table>';
			$("#usersList").html(statusHTML);

		}).fail(function(jqXHR) {
			$("#usersList").html("<b>Sorry! " + jqXHR.statusText + " error.</b>");
			}); // end getJSON
		$(this).detach();
	});

	// WEATHER
	/*************************************************
	**************************************************/
	$(document).on('click', '.weatherButton', function() {
		var yahooLocation = $(this).text();
		var yahooAPI = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + yahooLocation + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

		function displayWeather(data) {
			var weatherHTML = '<p>';
			$.each(data, function (i, item) {
				weatherHTML += "Temperatura: " + (((item.results.channel.item.condition.temp) - 32) * (5/9)).toFixed(0) + " &degC";
			});
			weatherHTML += '</p>';
			$("#weatherUser_"+yahooLocation).html(weatherHTML);
		}
		$.getJSON(yahooAPI, displayWeather);
	})

	// MAP
	/*************************************************
	**************************************************/
	$(document).on('click', '.mapButton', function() {
		var dir = $(this).text();
		var googleAPI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + dir + "$sensor=false";

		function displayMap(data) {
			var mapHTML = '<p>';
			$.each(data.results, function (i, item) {
				mapHTML += item.geometry.location.lat + ", " + item.geometry.location.lng;
			});
			mapHTML += '</p>';
			$("#mapUser_"+dir).html(mapHTML);
			$("#mapUser_"+dir+" p").hide();
			$("#map_"+dir).css({"width": "300px", "height": "200px"});

			function makeMap() {
				var lat_lng = $("#mapUser_"+dir).text();
				var loc = lat_lng.split(",");
				pos = new google.maps.LatLng(loc[0], loc[1]);
				var mapOptions = {
						zoom: 10,
						center: pos,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					}
				this.mapObj = new google.maps.Map(document.querySelector("#map_"+dir), mapOptions);
			}
			makeMap();
		}
		$.getJSON(googleAPI, displayMap);
	})

}); // end ready