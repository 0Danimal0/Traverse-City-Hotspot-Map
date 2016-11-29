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
            center: {lat: 44.773133, lng: -85.619024},
            zoom: 13,
            mapTypeId: 'hybrid',
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
            },
        });

      if (map == 0) {
        alert("The almighty Google didn't load!");
      }

      var bounds = new google.maps.LatLngBounds();
      ko.applyBindings(new ViewModel());

    }

var ViewModel = function() {
  var self = this;

  //Loop over all model data elements and give them a marker,
  places.forEach(function(place) {

    //create markers for each model item.
    place.marker = new google.maps.Marker({
      map: map,
      position: { lat: place.latitude, lng: place.longitude },
      title: place.placeName,
      animation: google.maps.Animation.DROP,
    });
    place.marker.addListener('click', toggleBounce);

    function toggleBounce() {
      if (place.marker.getAnimation() !== null) {
        place.marker.setAnimation(null);
      } else {
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          place.marker.setAnimation(null);
        }, 2090);
      }
    };

    //Store ability to make infoWindows on each marker.
    infoWindow = new google.maps.InfoWindow({
      maxWidth: 200,
    });

    // When map marker is clicked, create new infoWindow with Yelp content.
    google.maps.event.addListener(place.marker, 'click', function() {
        yelpAPI(place.marker);
        window.setTimeout(function() {
            map.panTo(place.marker.getPosition());
          }, 2090);
    });

  });

  self.placeLocation = ko.observableArray();

  // Push all places
  places.forEach(function(place) {
    self.placeLocation.push(place);
  });

  // This stores users keystrokes into input-box as an observable string for filtering.
  self.filter = ko.observable('');

  // This computed observable returns an array of list iteams that will display
  // on the mapFilter list.
  self.filterList = ko.computed(function() {
    return ko.utils.arrayFilter(self.placeLocation(), function(myPlace) {
      var matched = myPlace.placeName.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
      myPlace.marker.setVisible(matched);
      return matched;
    })
  })

  // Viewable function, triggered with a keystroke to the filter input box, 'triggers'
  // the selected marker's 'click' event, which makes all 'click' listeners perform.
  self.setMark = function(place, marker) {
        google.maps.event.trigger(place.marker, 'click');
  };

};

function yelpAPI(marker) {

    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelpUrl = 'https://api.yelp.com/v2/search?';
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
      location : '49686',
      term : marker.title,
    };

    var encodedSignature = oauthSignature.generate('GET', yelpUrl, parameters, yelpConsumer_Secret, yelpTokenSecret);
    parameters.oauth_signature = encodedSignature;


    var settings = {
      url : yelpUrl,
      data : parameters,
      cache : true,
      dataType : 'jsonp',
      jsonpCallback: 'cb',
      success : function(results) {
        console.log("Successful AJAX call to Yelp.");
      },
      fail : function(results) {
        console.log("Unsuccessful AJAX call to Yelp.");
      },
    };


    $.ajax(settings).done(function(data) {
      console.log(data);
      var content = '<div id="iwContainer">'
      var biz = data.businesses[0];

      if (data.businesses.length) {
        content += '<div class="iwTitle"> <p>' +biz.name+ '</p> </div>';
        // Contacts Class == OPEN
        content += '<div class="yelp-contacts">'
        content += '<p>' +biz.display_phone+ '</p>';
        content += '<p>' +biz.location.display_address+ '</p>';
        // Contacts Class == Close
        content += '</div>'
        content += '<span class="yelp-rating">Yelp Rating:</span> <img src="' +biz.rating_img_url+ '">';
        content += '<p class"yelp-snippet">' +biz.snippet_text+ '"</p>';

      } else {

        content += '<h2>' +places.placeName+ '</h2>';
        content += '<h2>' +places.description+ '</h2>';

      }
      // Close "iwContainer" div.
      content += '</div>';

      infoWindow.setContent(content);
      infoWindow.open(map, marker);

    }).fail(function() {
      alert("Sorry, but the map can't seem to connect to yelp.");
    });
};

function mapLoadError() {
  alert("The almighty Google has failed to load!");
  console.log("The almighty Google has failed to load!");
};
