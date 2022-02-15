var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson  '

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


// A function to return circle radius by its magnitude
function circleRadius(feature) {
  // If magnitude is less than 0, return 0, otherwise return 3x values
  return feature.properties.mag <= 0 ? 0: feature.properties.mag * 3;
  
}

// Use conditional (Ternary) operators to replace boring IF conditions ;)
function circleColor(depth) {
  // Meaning if the depth condition is true, then return value after "?"
  // if false, then move to next line after ":"
  return depth <= 10 ? "#0000FF":
          depth <= 30 ? "#0033FF":
          depth <= 50 ? "#0066FF":
          depth <= 70 ? "#0099FF":
          depth <= 90 ? "#00CCFF":
                          "#00FFFF";
}

function createFeatures(earthquakeData) {

  function circles(feature, latlng) {
        
    var geojsonMarkerOptions = {
        radius: circleRadius(feature),
        fillColor: circleColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.8
    };

    // Return a group of circle layers
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    // Bind popups for all earthquakes
    layer.bindPopup(
        "<h3>Location: " + feature.properties.place + "<br> Magnitude: " + 
        feature.properties.mag +"<br>Depth: " + feature.geometry.coordinates[2] + 
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
}

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: circles,
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Create the base layers.
  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Topographic Map": topo
  };

   // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };
   
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map-id", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [topo, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'topright'});
  legend.onAdd = function() {
      // A list of all values for the legend
      var div = L.DomUtil.create("div", "info legend"),
          categories = [-10, 10, 30, 50, 70, 90];
      
      // Append each line HTML of color block and range to the div
      for (var i = 0; i < categories.length; i++) {
          if (i == 0) {
              div.innerHTML += '<p>Depth (m)</p><hr>';
          }
          div.innerHTML +=
              '<i style="background:' + circleColor(categories[i] + 1) + '"></i> ' + 
          + categories[i] + (categories[i + 1] ? ' - ' + categories[i + 1] + '<br>' : ' + ');
      }

      return div;
  }

  legend.addTo(myMap);
}

// // Em Hurst  7:11 PM
// // Read in Data
// url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// d3.json(url).then(function(data) {
//     createFeatures(data.features)
// });
// // A function to return circle radius by its magnitude
// function circleRadius(feature) {
//     // return mag 2x values
//     return feature.properties.mag * 2;
//   }
  
// function circleColor(depth) {
//     //color by depth
//     return depth <= 10 ? "#DAF7A6 ":
//             depth <= 30 ? "#FFC300":
//             depth <= 50 ? "#FF5733":
//             depth <= 70 ? "#C70039":
//             depth <= 90 ? "#900C3F":
//                             "#00FFFF";
//   }

// function createFeatures(earthquakes) {
//     //circle size by magnitude
//     function circle(feature, latlng){
//         var markers = {
//             radius: circleRadius(feature),
//             fillColor: circleColor(feature.geometry.coordinates[2]),
//             color: "#000",
//             weight: 1,
//             opacity: 0.5,
//             fillOpacity: 0.8
//     };
//     return L.circleMarker(latlng, markers);
// }

//   function onEachFeature(feature, layer) {
//     // Bind popups for all earthquakes
//     layer.bindPopup(
//         "<h3>Location: " + feature.properties.place + "<h3> Magnitude: " + 
//         feature.properties.mag +"<h3>Depth: " + feature.geometry.coordinates[2] + 
//         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
// }

//   var earthquakes = L.geoJSON(earthquakes, {
//     pointToLayer: circle,
//     onEachFeature: onEachFeature
//   });

//   // Send earthquakes layer to the createMap function
//   createMap(earthquakes);
  
// }

// function createMap(earthQuakes) {

//     console.log("createMap has been called!")

//     // Create the tile layer that will be the background of our map.
//     var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });
  
  
//     // Create a baseMaps object to hold the streetmap layer.
//     var baseMaps = {
//       "Street Map": streetmap
//     };
  
//     // Create an overlayMaps object to hold the earthquakes layer.
//     var overlayMaps = {
//       "Earthquakes": earthQuakes
//     };
  
//     // Create the map object with options.
//     var map = L.map("map", {
//         //LA lat.long
//       center: [40.052235, -110.243683],
//       zoom: 4.5,
//     //   layers: [streetmap, earthQuakes]
//       layers: [streetmap, earthQuakes]
//     });
  
//     // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(map);

//     var legend = L.control({
//         position: 'bottomright'
//       });
//       legend.onAdd = function() {
//         var div = L.DomUtil.create('div', 'info legend'),
//           categories = [-10, 10, 30, 50, 70, 90],
//           labels = [],
//           from, to;
//         for (var i = 0; i < categories.length; i++) {
//           from = categories[i];
//           to = categories[i + 1];
//           labels.push(
//             '<i style="background:' + circleColor(from + 1) + '">  .  .  </i> ' +
//             from + (to ? '&ndash;' + to : '+'));
//         }
//         div.innerHTML = labels.join('<br>');
//         return div;
//       };
//       legend.addTo(map);
    
//   }



// function createMap(earthQuakes) {

//     console.log("createMap has been called!")

//     // Create the tile layer that will be the background of our map.
//     var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });
  
  
//     // Create a baseMaps object to hold the streetmap layer.
//     var baseMaps = {
//       "Street Map": streetmap
//     };
  
//     // Create an overlayMaps object to hold the bikeStations layer.
//     var overlayMaps = {
//       "Earthquakes": earthQuakes
//     };
  
//     // Create the map object with options.
//     var map = L.map("map", {
//       center: [0, 0],
//       zoom: 1,
//     //   layers: [streetmap, earthQuakes]
//       layers: [streetmap,earthQuakes]
//     });
  
//     // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//       collapsed: false
//     }).addTo(map);
//   }
  
//   function createMarkers(response) {
  
//     // Pull the "stations" property from response.data.
//     // var stations = response.data.stations;
//     var earthquakes = response.features
//     // console.log(stations)
//     console.log(earthquakes)
  
//     // Initialize an array to hold bike markers.
//     // var bikeMarkers = [];
//     var locations = [];
  
//     // // Loop through the stations array.
//     // for (var index = 0; index < stations.length; index++) {
//     //   var station = stations[index];
  
//     //   // For each station, create a marker, and bind a popup with the station's name.
//     //   var bikeMarker = L.marker([station.lat, station.lon])
//     //     .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
  
//     //   // Add the marker to the bikeMarkers array.
//     //   bikeMarkers.push(bikeMarker);
      
//     // }

//     // Loop through the stations array.
//   for (var index = 0; index < earthquakes.length; index++) {
//     var location = earthquakes[index];

//     // var bikeMarker = L.marker([station.lat, station.lon])

//     // For each station, create a marker, and bind a popup with the station's name.
//     var quakeMarker = L.marker([location.geometry.coordinates[1],location.geometry.coordinates[0]])
//       .bindPopup("<h3>" + location.properties.mag + "<h3><h3>Capacity: " + location.properties.place + "</h3>");

//     // Add the marker to the bikeMarkers array.
//     locations.push(quakeMarker);
//   }
    
  
//     // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
//     // createMap(L.layerGroup(bikeMarkers));
//     createMap(L.layerGroup(locations));
    
//   }
  
  
//   // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
//   url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
//   d3.json(url).then(createMarkers);
