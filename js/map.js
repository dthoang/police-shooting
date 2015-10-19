var drawMap = function() {
 	var map = L.map('container').setView([38, -98], 4);
 	var layer = L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHRob2FuZyIsImEiOiJjaWZ0M253dmUwaXk2dXVtMHVqbWQ4YXV1In0.jcE_vuyKtt4NHu-J0fsW1Q').addTo(map);
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

  //Adds points and layers to the map
  for(var i = 0; i < data.length; i++) {
    var race = data[i].Race;
    var isArmed = data[i]["Armed or Unarmed?"];
    var lat = data[i].lat;
    var lng = data[i].lng;
    var summary = data[i].Summary;

    if(isArmed == "Armed") {
        if(race == "White") {
          circleDetail(lat, lng, 'red', whiteArmed, summary);
          armedWhite++;
        } else if(race == "Black or African American") {
          circleDetail(lat, lng, 'deepskyblue', blackArmed, summary);
          armedBlack++;
        } else if(race == "Asian") { 
          circleDetail(lat, lng, 'gold', asianArmed, summary);
        } else if(race == "Unknown") {
          circleDetail(lat, lng, 'violet', unknownArmed, summary);
        } else if(race == "American Indian or Alaska Native") {
          circleDetail(lat, lng, 'lightgreen', nativeArmed, summary);
        } else { //"Native Hawaiian or Other Pacific Islander"
          circleDetail(lat, lng, 'orange', pacificArmed, summary);
        }
    } else { //unarmed
        if(race == "White") {
          circleDetail(lat, lng, 'darkred', whiteUnarmed, summary);
          unarmedWhite++;
        } else if(race == "Black or African American") {
          circleDetail(lat, lng, 'darkblue', blackUnarmed, summary);
          unarmedBlack++;
        } else if(race == "Asian") { 
          circleDetail(lat, lng, 'saddlebrown', asianUnarmed, summary);
        } else if(race == "Unknown") {
          circleDetail(lat, lng, 'darkviolet', unknownUnarmed, summary);
        } else if(race == "American Indian or Alaska Native") {
          circleDetail(lat, lng, 'darkgreen', nativeUnarmed, summary);
        } else { //"Native Hawaiian or Other Pacific Islander"
          circleDetail(lat, lng, 'sienna', pacificUnarmed, summary);
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

  $('#unarmedWhite').text(unarmedWhite);
  $('#armedWhite').text(armedWhite);
  $('#unarmedBlack').text(unarmedBlack);
  $('#armedBlack').text(armedBlack);
}

//This function makes the appropriate circle markers for the map
function circleDetail(lat, lng, fColor, grouping, summary) {
  var circle = L.circle([lat, lng], 500, {
    color: fColor,
  }).bindPopup(summary);
  grouping.addLayer(circle);
}

