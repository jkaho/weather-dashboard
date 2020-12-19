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
            var weatherDiv = $("#weather-div");
            weatherDiv.empty();
            var cityName = response.name;
            var cityLi = $("<li>");
            var cityBtn = $("<button>" + cityName + "</button>");
            cityLi.append(cityBtn);
            $("ul").append(cityLi);

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
            
            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"
    
            $.ajax({
                url: forecastURL,
                method: "GET",
                error: function(request, error) {
                    return;
                }
            }).then(function(response) {
                console.log(response);    
                var forecastDiv = $("#forecast-div");
                forecastDiv.empty();

                var forecastTemps1 = [];
                var forecastTemps2 = [];
                var forecastTemps3 = [];
                var forecastTemps4 = [];
                var forecastTemps5 = [];
                var forecastArrItem = [];

                for (var i = 0; i < response.list.length; i++) {
                    if (response.list[i].dt_txt.includes(moment().add(1, "days").format("YYYY-M-DD"))) {
                        forecastTemps1.push(response.list[i].main.temp);
                    } else if (response.list[i].dt_txt.includes(moment().add(2, "days").format("YYYY-M-DD"))) {
                        forecastTemps2.push(response.list[i].main.temp);
                    } else if (response.list[i].dt_txt.includes(moment().add(3, "days").format("YYYY-M-DD"))) {
                        forecastTemps3.push(response.list[i].main.temp);
                    } else if (response.list[i].dt_txt.includes(moment().add(4, "days").format("YYYY-M-DD"))) {
                        forecastTemps4.push(response.list[i].main.temp);
                    } else if (response.list[i].dt_txt.includes(moment().add(5, "days").format("YYYY-M-DD"))) {
                        forecastTemps5.push(response.list[i].main.temp);
                    }
                }
                
                var forecastTemp1 = Math.max.apply(null, forecastTemps1);
                var forecastTemp2 = Math.max.apply(null, forecastTemps2);
                var forecastTemp3 = Math.max.apply(null, forecastTemps3);
                var forecastTemp4 = Math.max.apply(null, forecastTemps4);
                var forecastTemp5 = Math.max.apply(null, forecastTemps5);

                for (var i = 0; i < response.list.length; i++) {
                    if (response.list[i].main.temp === forecastTemp1 || response.list[i].main.temp === forecastTemp2 || response.list[i].main.temp === forecastTemp3 || response.list[i].main.temp === forecastTemp4 || response.list[i].main.temp === forecastTemp5) {
                        forecastArrItem.push(response.list[i]);
                    }
                }

                for (var i = 0; i < forecastArrItem.length; i++) {
                    var forecastSmallDiv = $("<div>");
                    forecastSmallDiv.attr("class", "forecast-each");
                    var forecastDate = moment().add(i + 1, "days").format("YYYY-M-DD");
                    var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                    var forecastTemp = forecastArrItem[i].main.temp;
                    var forecastHumidity = forecastArrItem[i].main.humidity;

                    var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                    var forecastIcon = $("<img>");
                    forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIconNumber + "@2x.png");
                    var forecastTempDiv = $("<div>" + "Temp: " + forecastTemp + "ºC" + "</div>");
                    var forecastHumidityDiv = $("<div>" + "Humidity: " + forecastHumidity + "%" + "</div>");

                    forecastSmallDiv.append(forecastDateDiv, forecastIcon, forecastTempDiv, forecastHumidityDiv);
                    forecastDiv.append(forecastSmallDiv);
                }
            })   
        }
    })
})
