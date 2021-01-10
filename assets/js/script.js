var storedSearches = []; // local storage array

initialise();

// get and render last searched or default (Sydney) weather data 
function renderLastSearch() {
    var lastSearch = storedSearches[storedSearches.length - 1];
    
    if (storedSearches.length === 0) {
        var initialURL = "https://api.openweathermap.org/data/2.5/weather?q=sydney&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    } else {
        var initialURL = "https://api.openweathermap.org/data/2.5/weather?q=" + lastSearch + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    }

    $.ajax({
        url: initialURL,
        method: "GET",
        error: function() {
            alert("Sorry, there was an error loading the weather data.")
        },
        success: function(response) {
            var weatherDiv = $("#weather-div");
            weatherDiv.empty();

            var cityName = response.name;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" + latitude + "&lon=" + longitude + "&appid=21cf2c282545a0fc1251a4061d71efec",
                method: "GET",
                error: function() {
                    return;
                },
                success: function(response) {
                    // current weather data (upon opening web page)
                    var date = moment.unix(response.current.dt).format("dddd, Do MMMM, YYYY");
                    var iconNumber = response.current.weather[0].icon;
                    var temp = response.current.temp;
                    var humidity = response.current.humidity;
                    var windSpeed = (response.current.wind_speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour
                    var uvIndex = response.current.uvi; 

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

                    // UV index data (upon opening web page)
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 3) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 3 && uvIndex <= 6) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);

                    // forecast weather data (upon opening web page)
                    var forecastDiv = $("#forecast-div");
                    forecastDiv.empty();

                    var forecastArrItem = []; // find forecast data for next 5 days
                    for (var i = 0; i < response.daily.length; i++) {
                        var date = moment.unix(response.daily[i].dt).format("DD-MM-YYYY");
                        if (date === moment().add(1, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(2, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(3, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(4, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(5, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        }
                    }

                    for (var i = 0; i < forecastArrItem.length; i++) {
                        var forecastSmallDiv = $("<div>");
                        forecastSmallDiv.attr("class", "forecast-each");
                        forecastSmallDiv.attr("id", "forecast" + (i + 1));

                        var forecastDay = moment().add(i + 1, "days").format("dddd");
                        var forecastDate = moment().add(i + 1, "days").format("DD-MM-YYYY");
                        var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                        var forecastTemp = forecastArrItem[i].temp.day;
                        var forecastHumidity = forecastArrItem[i].humidity;
                        
                        var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                        forecastDayDiv.attr("class", "forecast-day");
                        var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                        forecastDateDiv.attr("class", "forecast-date");
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

// get and render weather data for searched city on button click 
function getData() {
    var searchWord = $("#search-word").val();
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";

    $.ajax({
        url: weatherURL,
        method: "GET",
        error: function() {
            alert("Sorry, the city you're looking for doesn't exist in our database.");
        },
        success: function(response) {
            var lowerSearches = []; 
            for (var i = 0; i < storedSearches.length; i++) {
                var storedLower = storedSearches[i].toLowerCase();
                lowerSearches.push(storedLower);
            }

            // push search values to local storage array 
            if (lowerSearches.includes(searchWord.toLowerCase()) === false) {
                storedSearches.push(response.name);
            } else { // if city has been searched previously, add new item to end of array and delete old array item
                storedSearches.push(response.name);
                var searchIndex = lowerSearches.indexOf(searchWord.toLowerCase());
                storedSearches.splice(searchIndex, 1);
            }

            var weatherDiv = $("#weather-div");
            weatherDiv.empty();

            var cityName = response.name;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" + latitude + "&lon=" + longitude + "&appid=21cf2c282545a0fc1251a4061d71efec",
                method: "GET",
                error: function() {
                    return;
                },
                success: function(response) {
                    // current weather data (for searched city)
                    var date = moment.unix(response.current.dt).format("dddd, Do MMMM, YYYY");
                    var iconNumber = response.current.weather[0].icon;
                    var temp = response.current.temp;
                    var humidity = response.current.humidity;
                    var windSpeed = (response.current.wind_speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour
                    var uvIndex = response.current.uvi; 

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

                    // UV index data (for searched city)
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 3) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 3 && uvIndex <= 6) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);

                    // forecast weather data (for searched city)
                    var forecastDiv = $("#forecast-div");
                    forecastDiv.empty();

                    var forecastArrItem = []; // find forecast data for next 5 days
                    for (var i = 0; i < response.daily.length; i++) {
                        var date = moment.unix(response.daily[i].dt).format("DD-MM-YYYY");
                        if (date === moment().add(1, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(2, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(3, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(4, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(5, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        }
                    }

                    for (var i = 0; i < forecastArrItem.length; i++) {
                        var forecastSmallDiv = $("<div>");
                        forecastSmallDiv.attr("class", "forecast-each");
                        forecastSmallDiv.attr("id", "forecast" + (i + 1));

                        var forecastDay = moment().add(i + 1, "days").format("dddd");
                        var forecastDate = moment().add(i + 1, "days").format("DD-MM-YYYY");
                        var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                        var forecastTemp = forecastArrItem[i].temp.day;
                        var forecastHumidity = forecastArrItem[i].humidity;
                        
                        var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                        forecastDayDiv.attr("class", "forecast-day");
                        var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                        forecastDateDiv.attr("class", "forecast-date");
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

$(".search-btn").on("click", function(event) {
    event.preventDefault();

    if ($(this).parent().attr("id") === "hidden-form") {
        $("#hidden-form input").attr("id", "search-word");
        $("#sidebar-form input").attr("id", "");
    } else {
        $("#sidebar-form input").attr("id", "search-word");
        $("#hidden-form input").attr("id", "");
    } 

    getData();
    $("#search-word").val("");
})

// get and render previous searched weather data on button click  
$("ul").on("click", ".city-btn", function(event) {
    event.preventDefault();

    var searchWord = $(this).text();
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchWord + "&units=metric&appid=21cf2c282545a0fc1251a4061d71efec";
    
    $.ajax({
        url: weatherURL,
        method: "GET",
        error: function() {
            alert("Sorry, the city you're looking for doesn't exist in our database.")
        },
        success: function(response) {
            var weatherDiv = $("#weather-div");
            weatherDiv.empty();

            var cityName = response.name;
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" + latitude + "&lon=" + longitude + "&appid=21cf2c282545a0fc1251a4061d71efec",
                method: "GET",
                error: function() {
                    return;
                },
                success: function(response) {
                    // current weather data (for previously searched city)
                    var date = moment.unix(response.current.dt).format("dddd, Do MMMM, YYYY");
                    var iconNumber = response.current.weather[0].icon;
                    var temp = response.current.temp;
                    var humidity = response.current.humidity;
                    var windSpeed = (response.current.wind_speed * 3.6).toFixed(2); // convert metres per second to kilometres per hour
                    var uvIndex = response.current.uvi; 

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

                    // UV index data (for previously searched city)
                    var uvIndexDiv = $("<div>" + "UV Index: " + "</div>");
                    uvIndexDiv.addClass("inline-block");
                    var uvValue = $("<p>" + uvIndex + "</p>");
                    if (uvIndex <= 3) {
                        uvValue.addClass("favorable");
                    } else if (uvIndex > 3 && uvIndex <= 6) {
                        uvValue.addClass("moderate");
                    } else {
                        uvValue.addClass("severe");
                    }

                    weatherDiv.append(uvIndexDiv, uvValue);

                    // forecast weather data (for previously searched city)
                    var forecastDiv = $("#forecast-div");
                    forecastDiv.empty();

                    var forecastArrItem = []; // find forecast data for next 5 days
                    for (var i = 0; i < response.daily.length; i++) {
                        var date = moment.unix(response.daily[i].dt).format("DD-MM-YYYY");
                        if (date === moment().add(1, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(2, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(3, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(4, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        } else if (date === moment().add(5, "days").format("DD-MM-YYYY")) {
                            forecastArrItem.push(response.daily[i]);
                        }
                    }

                    for (var i = 0; i < forecastArrItem.length; i++) {
                        var forecastSmallDiv = $("<div>");
                        forecastSmallDiv.attr("class", "forecast-each");
                        forecastSmallDiv.attr("id", "forecast" + (i + 1));

                        var forecastDay = moment().add(i + 1, "days").format("dddd");
                        var forecastDate = moment().add(i + 1, "days").format("DD-MM-YYYY");
                        var forecastIconNumber = forecastArrItem[i].weather[0].icon;
                        var forecastTemp = forecastArrItem[i].temp.day;
                        var forecastHumidity = forecastArrItem[i].humidity;
                        
                        var forecastDayDiv = $("<div>" + forecastDay + "</div>");
                        forecastDayDiv.attr("class", "forecast-day");
                        var forecastDateDiv = $("<div>" + forecastDate + "</div>");
                        forecastDateDiv.attr("class", "forecast-date");
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

// clear search history
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
