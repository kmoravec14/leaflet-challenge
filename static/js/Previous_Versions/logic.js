
// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson");
//   console.log(response)

// Use this code to understand usgs json data  
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

d3.json(url).then((data) =>{
  // console.log(data)
  var earthquakes = data.features
  console.log(earthquakes)

  // Initialize an array to hold bike markers.
  var locations = [];

  // Loop through the stations array.
  for (var index = 0; index < earthquakes.length; index++) {
    var location = earthquakes[index];

    // var bikeMarker = L.marker([station.lat, station.lon])

    // For each station, create a marker, and bind a popup with the station's name.
    var quakeMarker = L.marker([location.geometry.coordinates[0],location.geometry.coordinates[1]])
      .bindPopup("<h3>" + location.properties.mag + "<h3><h3>Capacity: " + location.properties.place + "</h3>");

    // Add the marker to the bikeMarkers array.
    locations.push(quakeMarker);
  }

  console.log("Test")
  console.log(locations)

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  // createMap(L.layerGroup(locations));


})