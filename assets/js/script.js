// ------- client-side storage ------- 
var storedSearches = [];

initialise();

function renderLastSearch() {
    var lastSearch = storedSearches[storedSearches.length - 1];
    
    if (storedSearches.length === 0) {
        var initialURL = "http://api.openweathermap.org/data/2.5/weather?q=sydney&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    } else {
        var initialURL = "http://api.openweathermap.org/data/2.5/weather?q=" + lastSearch + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    }
    
    $.ajax({
        url: initialURL,
        method: "GET",
        error: function(request, error) {
            alert("Sorry, there was an error loading the weather data.")
        },
        success: function(response) {
            var weatherDiv = $("#weather-div");
            weatherDiv.empty();
            var cityName = response.name;
            var date = moment.unix(response.dt).format("dddd, Do MMMM, YYYY");
            var iconNumber = response.weather[0].icon;
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = (response.wind.speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour

            var cityDiv = $("<div>" + cityName + "</div>")
            cityDiv.attr("id", "city-name");
            var dateDiv = $("<div>" + date + "</div>");
            dateDiv.attr("id", "date-div");
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + iconNumber + "@2x.png");
            cityDiv.append(icon);
            var tempDiv = $("<div>" + "Temp: " + temp + "ºC" + "</div>");
            var humidityDiv = $("<div>" + "Humidity: " + humidity + "%" + "</div>")
            var windSpeedDiv = $("<div>" + "Wind Speed: " + windSpeed + "km/h" + "</div>");
            weatherDiv.append(cityDiv, dateDiv, tempDiv, humidityDiv, windSpeedDiv);

            // API call for UV index data 
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
 
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 2.5) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 2.5 && uvIndex <= 5.5) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);
                }
            })  
             
            // API call for forecast data 
            
            if (storedSearches.length === 0) {
                var initialForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=sydney&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
            } else {
                var initialForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + lastSearch + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
            }

            $.ajax({
                url: initialForecastURL,
                method: "GET",
                error: function(request, error) {
                    return;
                }, 
                success: function(response) {
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
                        var forecastDay = moment().add(i + 1, "days").format("dddd");
                        var forecastDate = moment().add(i + 1, "days").format("DD-M-YYYY");
                        var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                        var forecastTemp = forecastArrItem[i].main.temp;
                        var forecastHumidity = forecastArrItem[i].main.humidity;
                        
                        var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                        forecastDayDiv.attr("id", "forecast-day");
                        var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                        forecastDateDiv.attr("id", "forecast-date");
                        var forecastIcon = $("<img>");
                        forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIconNumber + "@2x.png");
                        var forecastTempDiv = $("<div>" + "Temp: " + forecastTemp + "ºC" + "</div>");
                        var forecastHumidityDiv = $("<div>" + "Humidity: " + forecastHumidity + "%" + "</div>");
     
                        forecastSmallDiv.append(forecastDayDiv, forecastDateDiv, forecastIcon, forecastTempDiv, forecastHumidityDiv);
                        forecastDiv.append(forecastSmallDiv);
                    }
                }
            })
        }
    })
}

function renderCityBtns() {
    $("ul").empty();

    $.each(storedSearches, function() {
        var cityName = this;
        var cityLi = $("<li>");
        var cityBtn = $("<button>" + cityName + "</button>");
        cityBtn.attr("class", "city-btn");
        cityLi.append(cityBtn);
        $("ul").append(cityLi);
    })
}

function initialise() {
    var userSearch = JSON.parse(localStorage.getItem("storedSearches"));
    if (userSearch !== null) {
        storedSearches = userSearch;
    }

    renderLastSearch();
    renderCityBtns();
}

function storeSearches() {
    localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
}

// ------- getting data on search btn click ------- 
function getData() {
    // API call for weather data 
    var searchWord = $("#search-word").val();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    
    $.ajax({
        url: weatherURL,
        method: "GET",
        error: function(request, error) {
            alert("Sorry, the city you're looking for doesn't exist in our database.")
        },
        success: function(response) {
            var lowerSearches = [];
            for (var i = 0; i < storedSearches.length; i++) {
                var storedLower = storedSearches[i].toLowerCase();
                lowerSearches.push(storedLower);
            }

            if (lowerSearches.includes(searchWord.toLowerCase()) === false) {
                storedSearches.push(response.name);
            }

            var weatherDiv = $("#weather-div");
            weatherDiv.empty();

            var cityName = response.name;
            var date = moment.unix(response.dt).format("dddd, Do MMMM, YYYY");
            var iconNumber = response.weather[0].icon;
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = (response.wind.speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour

            var cityDiv = $("<div>" + cityName + "</div>");
            cityDiv.attr("id", "city-name");
            var dateDiv = $("<div>" + date + "</div>");
            dateDiv.attr("id", "date-div");
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + iconNumber + "@2x.png");
            cityDiv.append(icon);
            var tempDiv = $("<div>" + "Temp: " + temp + "ºC" + "</div>");
            var humidityDiv = $("<div>" + "Humidity: " + humidity + "%" + "</div>")
            var windSpeedDiv = $("<div>" + "Wind Speed: " + windSpeed + "km/h" + "</div>");
            weatherDiv.append(cityDiv, dateDiv, tempDiv, humidityDiv, windSpeedDiv);

            // API call for UV index data 
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
 
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 2.5) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 2.5 && uvIndex <= 5.5) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);
                }
            })  
            
            // API call for forecast data 
            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"
    
            $.ajax({
                url: forecastURL,
                method: "GET",
                error: function(request, error) {
                    return;
                }, 
                success: function(response) {
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
                        var forecastDay = moment().add(i + 1, "days").format("dddd");
                        var forecastDate = moment().add(i + 1, "days").format("DD-M-YYYY");
                        var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                        var forecastTemp = forecastArrItem[i].main.temp;
                        var forecastHumidity = forecastArrItem[i].main.humidity;
                        
                        var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                        forecastDayDiv.attr("id", "forecast-day");
                        var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                        forecastDateDiv.attr("id", "forecast-date");
                        var forecastIcon = $("<img>");
                        forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIconNumber + "@2x.png");
                        var forecastTempDiv = $("<div>" + "Temp: " + forecastTemp + "ºC" + "</div>");
                        var forecastHumidityDiv = $("<div>" + "Humidity: " + forecastHumidity + "%" + "</div>");
    
                        forecastSmallDiv.append(forecastDayDiv, forecastDateDiv, forecastIcon, forecastTempDiv, forecastHumidityDiv);
                        forecastDiv.append(forecastSmallDiv);
                    }
                }
            })
            storeSearches();
            renderCityBtns();
        }
    })
}

$("#search-btn").on("click", function(event) {
    event.preventDefault();
    getData();
})

// ------- getting data on city name btn click ------- 
$("ul").on("click", ".city-btn", function(event) {
    event.preventDefault();

    var searchWord = $(this).text();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    
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
            var date = moment.unix(response.dt).format("dddd, Do MMMM, YYYY");
            var iconNumber = response.weather[0].icon;
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = (response.wind.speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour

            var cityDiv = $("<div>" + cityName + "</div>");
            cityDiv.attr("id", "city-name");
            var dateDiv = $("<div>" + date + "</div>");
            dateDiv.attr("id", "date-div");
            var icon = $("<img>");
            icon.attr("src", "http://openweathermap.org/img/wn/" + iconNumber + "@2x.png");
            cityDiv.append(icon);
            var tempDiv = $("<div>" + "Temp: " + temp + "ºC" + "</div>");
            var humidityDiv = $("<div>" + "Humidity: " + humidity + "%" + "</div>")
            var windSpeedDiv = $("<div>" + "Wind Speed: " + windSpeed + "km/h" + "</div>");
            weatherDiv.append(cityDiv, dateDiv, tempDiv, humidityDiv, windSpeedDiv);

            // API call for UV index data 
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
 
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 2.5) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 2.5 && uvIndex <= 5.5) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);
                }
            })  
            
            // API call for forecast data 
            var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"
    
            $.ajax({
                url: forecastURL,
                method: "GET",
                error: function(request, error) {
                    return;
                },
                success: function(response) {
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
                    var forecastDay = moment().add(i + 1, "days").format("dddd");
                    var forecastDate = moment().add(i + 1, "days").format("DD-M-YYYY");
                    var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                    var forecastTemp = forecastArrItem[i].main.temp;
                    var forecastHumidity = forecastArrItem[i].main.humidity;

                    var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                    forecastDayDiv.attr("id", "forecast-day");
                    var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                    forecastDateDiv.attr("id", "forecast-date");
                    var forecastIcon = $("<img>");
                    forecastIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIconNumber + "@2x.png");
                    var forecastTempDiv = $("<div>" + "Temp: " + forecastTemp + "ºC" + "</div>");
                    var forecastHumidityDiv = $("<div>" + "Humidity: " + forecastHumidity + "%" + "</div>");

                    forecastSmallDiv.append(forecastDayDiv, forecastDateDiv, forecastIcon, forecastTempDiv, forecastHumidityDiv);
                    forecastDiv.append(forecastSmallDiv);
                }
                }
            })
        }
    })
})

$(".clear-btn").on("click", function() {
    var clearHistory = confirm("Are you sure you want to clear your search history?");
    if (clearHistory) {
        localStorage.clear();
        $("ul").empty();
        storedSearches = [];
    } else {
        return;
    }
})

// Try making entire ajax call a function 
