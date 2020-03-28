// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(cases) {
  return cases * 20;
}

d3.json("static/data/covid_usa.json", function(data){

  var cities = data.filter(object => object.county!=null);
  var states = data.filter(object => object.county==null);  

  console.log(cities);

// Loop through the cities array and create one marker for each city object
cities.forEach(city =>
  L.circle([city.lat,city.long] , {
    fillOpacity: 0.50,
    color: "red",
    fillColor: "red",
    // Setting our circle's radius equal to the output of our markerSize function
    // This will make our marker's size proportionate to its population
    radius: markerSize(city.cases)
  }).bindPopup("<h2>" + city.county + "</h2> <hr> <h2>State:"+ city.state + "</h2> <hr> <h3>Cases: " + city.cases + "</h3> <h3>Deaths:" + city.deaths + "</h3>" ).addTo(myMap));
states.forEach(state =>
  L.circle([state.lat,state.long] , {
    fillOpacity: 0.25,
    color: "blue",
    fillColor: "blue",
    radius: markerSize(state.cases)
 }).bindPopup("<h2>State:"+ state.state + "</h2> <hr> <h3>Cases: " + state.cases + "</h3> <h3>Deaths:" + state.deaths + "</h3>" ).addTo(myMap));
});

//Patricia Wong 2020