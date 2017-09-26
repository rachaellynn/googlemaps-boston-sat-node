var map;
function initMap() {
  var uluru = {lat: 42.4015, lng: -71.3110307}; //centered map on Waltham because it's in the center of top-scoring cities
  map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 42.4275083, lng: -71.1372474},
    center: uluru,
    zoom: 11
  });

  //add in geojson data
  var script = document.createElement('script');
  script.src = '/js/sat_top10_byscore.js';
  document.getElementsByTagName('head')[0].appendChild(script);

}

// Loop through the results array and place a marker for each set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: 'images/bookmark.png',
      optimized: false,
      community: results.features[i].properties.Community,
      label: {
        text: results.features[i].properties.Rank,
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
        community: results.features[i].properties.Community,
        district: results.features[i].properties.District
        }
    });

    //pull data for the sidebar
    var city = results.features[i].properties.Community;
    var district = results.features[i].properties.District;
    var rank = results.features[i].properties.Rank;
    var score = results.features[i].properties.SAT;
    var price = results.features[i].properties.Price;
    var percentage_public = results.features[i].properties.Public;
    var pic = "images/" + results.features[i].properties.Pic;

    //add some data to the sidebar
    var div = document.createElement("div"); //create div
    div.className = "card" //with class = "card"
    var h3 = document.createElement("h3"); //create h2
    var title_city = document.createTextNode(rank + " " + city + " " + district); //add in the city name
    h3.appendChild(title_city); //attach cityname to the h2
    var para = document.createElement("p"); //add a paragraph for narrative text
    var narrative = document.createTextNode(city + " has an average combined SAT score of " + score + " and a median single-family home price of " + price + ". " + percentage_public + " of students attend public school."); //create that text
    para.appendChild(narrative); //add text to the paragraph tag
    var image = document.createElement("img");
    image.src = pic;
    var element = document.getElementById("sidebar"); //find the sidebar
    element.appendChild(div).appendChild(h3); //add the card and title to sidebar
    var element = document.getElementsByClassName("card"); //find the card div and add something to it
    element[i].appendChild(image);
    element[i].appendChild(para); 

    //addlistener to marker
    marker.addListener("click",function() {
       town = this.getLabel().community;
       rating = this.getLabel().text;
       district = this.getLabel().district;
       name = rating + " " + town + " " + district;
       h3 = $("h3");
        for (var i = 0; i < h3.length; i++) { //find the right h3 and go there
          sidebar_name = h3[i].innerHTML;
          if(sidebar_name == name) {
            element = document.getElementsByTagName("h3")[i];
            element.scrollIntoView();
           }
         }  
        });
    
  } 
}


