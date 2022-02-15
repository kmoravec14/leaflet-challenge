var max = 0
var min = 100000

// Code from https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

// Define a markerSize() function that will give each earthquake a different radius based on the energy released.
// Energy released from an earthquake is based on the Richter Scale and the energy released is:
// Log(Energy) = 11.8+1.5M.  Where M = Richter Magnitude and Log refers to the logarithm to the base 10
// Sqrt of the Energy was used so that the area of the circle would represent the Energy from the Earthquaie
function markerSize(magnitude) {
    
    Energy = (Math.pow(10,magnitude));
    Radius = Math.sqrt(Energy)
    // expected output: 343// return Math.sqrt(magnitude) * 50000;
    return Radius*750;
  }

  //  Code from Stack Overflow
  //  https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage/7128796

  //  I ended up not using this in final project - I used color spectrum from leaflet above

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
      zoom: 1.5,
    //   layers: [streetmap, earthQuakes]
      layers: [streetmap,earthQuakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);


    // Base Code from https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
    // Add Legend

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {

        var div = L.DomUtil.create('div', 'info legend');
        labels = [1000,500,200,100,50,20,10];

        colors = ['#800026','#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976']

        legend_title = "Depth: Meters"
        
        div.innerHTML += '<div align= "center"><strong> Depth In Meters </strong></div> <br>'

        for (var i = 0; i < labels.length; i++) {

            div.innerHTML += 
                '<i class="circle" style="background:' + (colors[i]) + '"></i> ' +
            labels[i] + (labels[i+1] ? '–' + labels[i+1] + '<br>' : '+');

    }
    return div;
    };
    legend.addTo(map);

  }
  
  function createMarkers(response) {
  
    // Pull the "features" property from response.data.
    var earthquakes = response.features
    console.log(earthquakes)
  
    // Initialize an array to hold locations.
    var locations = [];
  
    // Loop through the earthquake array to find the minimum and maximum depth for color scale.
    
    for (var index = 0; index < earthquakes.length; index++) {
      var location = earthquakes[index];

        if (max<location.geometry.coordinates[2]) {
            max = location.geometry.coordinates[2]
        }
    
        if (min>location.geometry.coordinates[2]) {
            min = location.geometry.coordinates[2]
        }
    }
  
    // Loop through the earthquake array to create markers for each earthquake

    for (var index = 0; index < earthquakes.length; index++) {
    var location = earthquakes[index];

    // For each location, create a marker, and bind a popup with the earthquate magnitude, depth, Index Number.
    
    var pct = 1-((location.geometry.coordinates[2]-min)/(max-min))

    // Latitude scale factor  (To compensate for the same size circle appearing larger at northern latitudes)
    sf = Math.abs(location.geometry.coordinates[1])/90
    sf = 1-sf
    sf = Math.sqrt(sf)
    var radius_scaled = markerSize(location.properties.mag)*sf

    var quakeMarker = L.circle([location.geometry.coordinates[1],location.geometry.coordinates[0]],{
        fillOpacity: 0.75,
        color: "black",
        weight: 1,
        // fillColor: getColorForPercentage(pct),
        fillColor: getColor(location.geometry.coordinates[2]),
        radius: radius_scaled
    }).bindPopup("<h3>Magnitude: " + location.properties.mag + "<h3><h3>Location: " + location.properties.place + "<h3><h3>Depth: " + location.geometry.coordinates[2] +" meters"+"</h3>");

    // Add the marker to the bikeMarkers array.
    locations.push(quakeMarker);
  }
    
    createMap(L.layerGroup(locations));
    
  }
  
  
  // Perform an API call to the US Geological Survey API to get the earthquake information. Call createMarkers when it completes.
  url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
  d3.json(url).then(createMarkers);
