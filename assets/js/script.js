// Grab value of search bar input to use as query in API query URL 

// AJAX call using query URL for current weather
    // Current weather data: city name, date, icon, temp, humidity, wind speed, UV index

// AJAX call using query URL for forecast weather
    // Forecast data: date, icon, min & max temp, humidity 

// Add city to ul (event listener on each li to display weather data)

// Local storage to save ul cities

// Save last searched city into variable, display info upon opening page

$("#search-btn").on("click", function(event) {
    event.preventDefault();

    var searchWord = $("#search-word").val();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"

    $.ajax({
        url: weatherURL,
        method: "GET",
        error: function(request, error) {
            alert("Sorry, the city you're looking for doesn't exist in our database.")
        },
        success: function(response) {
            console.log(response)
            var weatherDiv = $("#weather-div");
            weatherDiv.empty();
            var cityName = response.name;
            var date = moment.unix(response.dt).format("DD/MM/YYYY");
            var iconNumber = response.weather[0].icon;
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = (response.wind.speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour

            var cityDateDiv = $("<div>" + cityName + " " + date + "</div>")
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + iconNumber + "@2x.png");
            cityDateDiv.append(icon);
            var tempDiv = $("<div>" + "Temp: " + temp + "ºC" + "</div>");
            var humidityDiv = $("<div>" + "Humidity: " + humidity + "%" + "</div>")
            var windSpeedDiv = $("<div>" + "Wind Speed: " + windSpeed + "km/h" + "</div>");
            weatherDiv.append(cityDateDiv, tempDiv, humidityDiv, windSpeedDiv);

            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=21cf2c282545a0fc1251a4061d71efec"
    
            $.ajax({
                url: uvURL,
                method: "GET",
                error: function(request, error) {
                    return;
                },
                success: function(response) {
                    var uvIndex = response.value; 

                    var uvIndexDiv = $("<div>" + "UV Index: " + uvIndex + "</div>");
                    weatherDiv.append(uvIndexDiv);
                }
            })      
        }
    })

    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"
    
    $.ajax({
        url: forecastURL,
        method: "GET",
        error: function(request, error) {
            return;
        }
    }).then(function(response) {
        console.log(response);    
    })   
})

