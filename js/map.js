var drawMap = function() {
 	var map = L.map('container').setView([38, -98], 4);
 	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
 	getData(map);
}


var getData = function(map) {
  $.ajax({
  	url: 'data/response.json',
  	type: 'get',
  	success: function(data) {
  		customBuild(map, data);
  	},
  	dataType: 'json'
  });
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(map, data) {
  //Layers by race whether they were armed or unarmed
  var whiteArmed = new L.layerGroup([]);
  var whiteUnarmed = new L.layerGroup([]);

  var blackArmed = new L.layerGroup([]);
  var blackUnarmed = new L.layerGroup([]);

  var asianArmed = new L.layerGroup([]);
  var asianUnarmed = new L.layerGroup([]);

  var unknownArmed = new L.layerGroup([]);
  var unknownUnarmed = new L.layerGroup([]); 

  var nativeArmed = new L.layerGroup([]);
  var nativeUnarmed = new L.layerGroup([]);

  var pacificArmed = new L.layerGroup([]);
  var pacificUnarmed = new L.layerGroup([]); 

  //Counters for cross tabulation of race and whether they were armed or unarmed
  var armedBlack = 0;
  var unarmedBlack = 0;
  var armedWhite = 0;
  var unarmedWhite = 0;
  var armedOther = 0;
  var unarmedOther = 0;

  for(var i = 0; i < data.length; i++) {
    var race = data[i].Race;
    var isArmed = data[i]["Armed or Unarmed?"];
    var lat = data[i].lat;
    var lng = data[i].lng;
    var summary = data[i].Summary;

    if(isArmed == "Armed") {
        if(race == "White") {
          circleDetail(lat, lng, 'red', 0.4, whiteArmed, summary);
          armedWhite++;
        } else if(race == "Black or African American") {
          circleDetail(lat, lng, 'deepskyblue', 0.7, blackArmed, summary);
          armedBlack++;
        } else if(race == "Asian") { 
          circleDetail(lat, lng, 'gold', 0.4, asianArmed, summary);
          armedOther++;
        } else if(race == "Unknown") {
          circleDetail(lat, lng, 'violet', 0.4, unknownArmed, summary);
          armedOther++;
        } else if(race == "American Indian or Alaska Native") {
          circleDetail(lat, lng, 'lightgreen', 0.4, nativeArmed, summary);
          armedOther++;
        } else { //"Native Hawaiian or Other Pacific Islander"
          circleDetail(lat, lng, 'orange', 0.4, pacificArmed, summary);
          armedOther++;
        }
    } else { //unarmed
        if(race == "White") {
          circleDetail(lat, lng, 'darkred', 1, whiteUnarmed, summary);
          unarmedWhite++;
        } else if(race == "Black or African American") {
          circleDetail(lat, lng, 'darkblue', 1, blackUnarmed, summary);
          unarmedBlack++;
        } else if(race == "Asian") { 
          circleDetail(lat, lng, 'goldenrod', 1, asianUnarmed, summary);
          unarmedOther++;
        } else if(race == "Unknown") {
          circleDetail(lat, lng, 'darkviolet', 1, unknownUnarmed, summary);
          unarmedOther++;
        } else if(race == "American Indian or Alaska Native") {
          circleDetail(lat, lng, 'darkgreen', 1, nativeUnarmed, summary);
          unarmedOther++;
        } else { //"Native Hawaiian or Other Pacific Islander"
          circleDetail(lat, lng, 'sienna', 1, pacificUnarmed, summary);
          unarmedOther++;
        }
    }
  }

  // Creates the adjustable layers for the map
  var overlay = {
                 "Armed white victims" : whiteArmed,
                 "Unarmed white victims" : whiteUnarmed, 

                 "Armed black victims" : blackArmed, 
                 "Unarmed black victims" : blackUnarmed,

                 "Armed Asian victims" : asianArmed,
                 "Unarmed Asian victims" : asianUnarmed,

                 "Armed American Indian or Alaskan Native victims" : nativeArmed, 
                 "Unarmed American Indian or Alaskan Native victims" : nativeUnarmed,

                 "Armed Pacific Islander victims" : pacificArmed, 
                 "Urmed Pacific Islander victims" : pacificUnarmed,

                 "Armed Unknown race victims" : unknownArmed, 
                 "Unarmed Unknown race victims" : unknownUnarmed
               }
  L.control.layers(null, overlay).addTo(map);  
}

//This function makes the appropriate circle markers for the map
function circleDetail(lat, lng, fColor, fOpacity, grouping, summary) {
  var circle = L.circle([lat, lng], 500, {
    color: fColor,
    fillOpacity: fOpacity,
  }).bindPopup(summary);
  grouping.addLayer(circle);

}

