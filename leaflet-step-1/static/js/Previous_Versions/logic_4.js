var max = 0
var min = 100000

// Define a markerSize() function that will give each earthquake a different radius based on the energy released.
// Energy released from an earthquake is based on the Richter Scale and the energy released is:
// Log(Energy) = 11.8+1.5M.  Where M = Richter Magnitude and Log refers to the logarithm to the base 10
// Sqrt of the Energy was used so that the area of the circle would represent the Energy from the Earthquaie
function markerSize(magnitude) {
    
    Energy = (Math.pow(10,magnitude));
    Radius = Math.sqrt(Energy)
    // expected output: 343// return Math.sqrt(magnitude) * 50000;
    return Radius*500;
  }

  var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

    var getColorForPercentage = function(pct) {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
};


function createMap(earthQuakes) {

    console.log("createMap has been called!")
    

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
      "Earthquakes": earthQuakes
    };
  
    // Create the map object with options.
    var map = L.map("map", {
      center: [0, 0],
      zoom: 1,
    //   layers: [streetmap, earthQuakes]
      layers: [streetmap,earthQuakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the "stations" property from response.data.
    // var stations = response.data.stations;
    var earthquakes = response.features
    // console.log(stations)
    console.log(earthquakes)
  
    // Initialize an array to hold bike markers.
    // var bikeMarkers = [];
    var locations = [];
  
    // // Loop through the stations array.
    // for (var index = 0; index < stations.length; index++) {
    //   var station = stations[index];
  
    //   // For each station, create a marker, and bind a popup with the station's name.
    //   var bikeMarker = L.marker([station.lat, station.lon])
    //     .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
  
    //   // Add the marker to the bikeMarkers array.
    //   bikeMarkers.push(bikeMarker);
      
    // }

    // Loop through the stations array.
  for (var index = 0; index < earthquakes.length; index++) {
    var location = earthquakes[index];
    
    // var bikeMarker = L.marker([station.lat, station.lon])

    // For each station, create a marker, and bind a popup with the station's name.
    
    if (max<location.geometry.coordinates[2]) {
        max = location.geometry.coordinates[2]
    }

    if (min>location.geometry.coordinates[2]) {
        min = location.geometry.coordinates[2]
    }
    
    var pct = (location.geometry.coordinates[2]+3.13)/(644+3.13)

    console.log(location.geometry.coordinates[2])
    console.log(max)
    console.log(min)
    console.log(pct)

    var quakeMarker = L.circle([location.geometry.coordinates[1],location.geometry.coordinates[0]],{
        fillOpacity: 0.75,
        color: "black",
        weight: 1,
        fillColor: getColorForPercentage(pct),
        radius: markerSize(location.properties.mag)
    }).bindPopup("<h3>Magnitude: " + location.properties.mag + "<h3><h3>Depth: " + location.geometry.coordinates[2] + "<h3><h3>Index: " + index +"</h3>");

    // Add the marker to the bikeMarkers array.
    locations.push(quakeMarker);
  }
    
//   // for (var i = 0; i < cities.length; i++) {
//   for (var index = 0; index < earthquakes.length; index++) {
//     L.circle(cities[i].location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "purple",
//       // Setting our circle's radius to equal the output of our markerSize() function:
//       // This will make our marker's size proportionate to its population.
//       radius: markerSize(cities[i].population)
//     }).bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Population: ${cities[i].population.toLocaleString()}</h3>`).addTo(myMap);
//   }
  
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    // createMap(L.layerGroup(bikeMarkers));
    createMap(L.layerGroup(locations));
    
  }
  
  
  // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
  url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
  d3.json(url).then(createMarkers);
