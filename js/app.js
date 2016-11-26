var map;
var places = [{
      placeName : "Paesano's Pizza",
      latitude: 44.762806,
      longitude: -85.616607,
      description : "Best pizza in town!",
      hours : "11am to 11pm",
    },{
      placeName : "Chefs In",
      latitude: 44.7637009,
      longitude: -85.6315601,
      description : "Sandwiches that are grilled to perfection.",
      hours : "11am to 11pm",
    },{
      placeName : "Dino's Pizza",
      latitude: 44.7597975,
      longitude: -85.6133319,
      description : "Pizza open 24/7!.",
      hours : "24/7",
    },{
      placeName : "Poppycocks",
      latitude: 44.763916,
      longitude: -85.6224569,
      description : "Great for dates!",
      hours : "11am to 11pm",
    },{
      placeName : "7 Monks Taproom",
      latitude: 44.7631081,
      longitude: -85.6241574,
      description : "The place to grab a beer.",
      hours : "12 to 12pm",
    },{
      placeName : "Thats'sa Pizza",
      latitude: 44.763553,
      longitude: -85.5888974,
      description : "Best located pizza to the High School.",
      hours : "11am to 9pm",
    },{
      placeName : "Mancino's Pizza And Grinders",
      latitude: 44.7873822,
      longitude: -85.6382344,
      description : "Big fancy boats!",
      hours : "24/7",
    },{
      placeName : "Red Ginger",
      latitude: 44.7642706,
      longitude: -85.6192659,
      description : "Sushi spot!",
      hours : "10am to 10pm",
    }]



    function initMap() {
      //API map constructor that creates new map.
      map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 44.763916, lng: -85.6224569},
            zoom: 14,
            mapTypeId: 'hybrid',
        });

    //  this.positions = ko.observable(places)[0];
      var bounds = new google.maps.LatLngBounds();
      ko.applyBindings(new ViewModel());


    //    bounds.extend(ViewModel.placeLocation()[i].marker[i])
    //    map.fitBounds(bounds);
    //    ViewModel.placeLocation()[i].setMap(map);

    }


var yelpAPI = function(name, latitude, longitude, marker) {

    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelpUrl = 'https://api.yelp.com/v2/search/';
    var yelpConsumer_Secret = 'Jtd-Kf37xI4sR5HN_OMgyUBrEGw';
    var yelpTokenSecret	= 'JoW4x46vYdfslwAplRqyU78cK1Y';

    var parameters = {
      oauth_consumer_key : 'P5cIq5VC4PHcZAv7rQvXUg',
      oauth_token	: 'NGkT5L-Q6WwMX3H2KR9kdyksnOdJPRZ1',
      oauth_nonce	: nonce_generate(),
      oauth_timestamp	: Math.floor(Date.now() / 1000),
      oauth_signature_method	: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback : 'cb',
      term: name,
      location: '48236',
    };

    var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, yelpConsumer_Secret, yelpTokenSecret);
    parameters.oauth_signature = encodedSignature;
    console.log("obtaining encodedSignature:"+encodedSignature);
    console.log(yelpUrl);


    var settings = {
      url : yelpUrl,
      data : parameters,
      chache : true,
      dataType : 'jsonp',
      jsonpCallback: 'cb',
      success : function(results) {
        console.log("We're finally in business!");
      },
      fail : function(results) {
        console.log("Bueler...");
      },
    }
    $.ajax(settings)
};



var ViewModel = function() {
  var self = this;

  //Store a reference to the model in the ViewModel.
  self.allPlaces = [];

  //Push all model information to the reference array.
  places.forEach(function(place) {
    self.allPlaces.push(place);
  });


  //Loop over all model data elements and give them a marker,
  self.allPlaces.forEach(function(place) {

    //create markers for each model item.
    place.marker = new google.maps.Marker({
      map: map,
      position: { lat: place.latitude, lng: place.longitude },
      title: place.placeName,
      animation: google.maps.Animation.DROP,
    });

    //Store ability to make infoWindows on each marker.
    infoWindow = new google.maps.InfoWindow();

    //add click listener to open window for this marker
    place.marker.addListener('click', toggleMarker)

    // Toggle markers to make them bounce when selected.
    function toggleMarker() {
      if (place.marker.getAnimation() !== null) {
        place.marker.setAnimation(null);
      } else {
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
                    place.marker.setAnimation(null);
                }, 2000);
        }
      }

    // When map marker is clicked, create new infoWindow with Yelp content.
    google.maps.event.addListener(place.marker, 'click', function() {
        yelpAPI(place.name, place.latitude, place.longitude, place.marker);
        //yelpContentError(place);
    });

  });

  // Create a viewable array that we use in sidebar.
  self.placeLocation = ko.observableArray();

  // Push all places
  self.allPlaces.forEach(function(place) {
    self.placeLocation.push(place);
  });

  // Viewable function, triggered with a keystroke to the filter input box, 'triggers'
  // the selected marker's 'click' event, which makes all 'click' listeners perform.
  self.setMark = function(place, marker) {
        google.maps.event.trigger(place.marker, 'click');
  };

  // This stores users keystrokes into input-box as an observable string for filtering.
  self.filter = ko.observable('');

  // Make a function to filter the viewable array by the input-box!
  self.filterList = function() {
    // Clear the placeLocation array.
    self.placeLocation().removeAll();

    // Iterate over model to see what's matched to input-box, then push matches to viewable-array.
    self.allPlaces.forEach(function(myPlace) {

      // Make so none of the model values are on map.
      myplace.setVisible(false);

      // Test if an model values match filter input-box... if so...
      if (myPlace.placeName.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0) {

        // ...push to viewable-array.
        self.placeLocation().push(myPlace);
      };
    });
  };

}
