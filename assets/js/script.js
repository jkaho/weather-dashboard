// Grab value of search bar input to use as query in API query URL 

// AJAX call using query URL for current weather
    // Current weather data: city name, date, temp, humidity, wind speed, UV index

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
        }
    }).then(function(response) {
            console.log(response);    
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

