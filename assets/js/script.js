// Grab value of search bar input to use as query in API query URL 

// AJAX call using query URL for current weather
    // Current weather data: city name, date, temp, humidity, wind speed, UV index

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=sydney&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
})

// AJAX call using query URL for forecast weather
    // Forecast data: date, icon, min & max temp, humidity 

var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=sydney&units=metric&appid=21cf2c282545a0fc1251a4061d71efec"

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
})

// Add city to ul (event listener on each li to display weather data)

// Local storage to save ul cities

// Save last searched city into variable, display info upon opening page
