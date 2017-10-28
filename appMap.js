// Initialize Model
var Data = [
    {
        name: 'King Saud University',
        lat: 24.742205, 
        lng: 46.622934,
        info: 'King Saud University'
    },
    {
        name: 'Fitness Time',
        lat: 24.743382, 
        lng: 46.620692,
        info: 'Fitness Time'
    },
    {
        name: 'THE BOULEVARD - ALRYADH', 
        lat: 24.750641,
        lng: 46.613548,
        info: 'THE BOULEVARD - ALRYADH'
    },
    {
        name: 'Danub Market', 
        lat: 24.753019, 
        lng: 46.610083,
        info: 'Danub Market'
    },
    {
        name: 'Rubeen Plaza',
        lat: 24.752980, 
        lng: 46.624867,
        info: 'Rubeen Plaza'
    },
    {
        name: 'Badir Program', 
        lat: 24.747441, 
        lng: 46.618933,
        info: 'Badir Program'
    }
];


// Constructor
var Place = function(data) {
	this.name = data.name;
	this.lat = data.lat;
	this.lng = data.lng;
    this.info = data.info;
};

// Initialize ViewModel
var ViewModel = function() {
	var self = this;
	self.placeList = ko.observableArray([]);
	self.imgList = ko.observableArray([]);
	self.search = ko.observable('');
	Data.forEach(function(item){
		self.placeList.push(new Place(item));
	}, self);
	self.currentPlace = ko.observable(this.placeList()[0]);
	
	self.setPlace = function(clickedPlace) {
		self.currentPlace(clickedPlace);
		var index = self.filteredItems().indexOf(clickedPlace);
		self.updateContent(clickedPlace);
		self.activateMarker(self.markers[index], self, self.infowindow)();
        self.flickrImg(clickedPlace.lat, clickedPlace.lng, clickedPlace.name);
	};
    // Initialize Google Maps
    self.map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: 24.8238922, lng: 46.6552560},
        center: {lat: 24.746726, lng: 46.618246},
        zoom: 15,
        mapTypeControl: false,
        styles: styles,
        streetViewControl: false
    }); 

    // Initialize markers
    self.markers = [];
    self.infowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });
    var styles = [
        {
          featureType: 'water',
          stylers: [
            { color: '#19a0d8' }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.stroke',
          stylers: [
            { color: '#ffffff' },
            { weight: 6 }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            { color: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -40 }
          ]
        },{
          featureType: 'transit.station',
          stylers: [
            { weight: 9 },
            { hue: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'labels.icon',
          stylers: [
            { visibility: 'off' }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [
            { lightness: 100 }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            { lightness: -100 }
          ]
        },{
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
          ]
        }
      ];


    function toggleBounce() {
        if (places.marker.getAnimation()) {
          places.marker.setAnimation(null);
        } else {
          places.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        setTimeout(function() {
          places.marker.setAnimation(null);
        }, 2000);
    }

    // Filter for search
    this.filter = ko.observable();    
	self.filteredItems = ko.computed(function() {
	    var searchTerm = self.search();
	    if (!searchTerm) {
	        return self.placeList();
	    } else {
	        return ko.utils.arrayFilter(self.placeList(), function(item) {
            	return item.name.toLowerCase().indexOf(searchTerm) !== -1;
	        });
	    }
    });
    
	self.renderMarkers(self.placeList());
	self.filteredItems.subscribe(function(){
		self.renderMarkers(self.filteredItems());
      });
      
      // when click on map
	google.maps.event.addListener(self.map, 'click', function(event) {
        self.deactivateAllMarkers();
        self.infowindow.close();
    });

	//flickr API Call
	self.flickrImg = function(lat, lng, loc) {
		var Lat = lat,
			Lng = lng,
			locationURLList = [],
			imageObjList = [],
			imageList = [],
            flickrError = $('#ig'),
            apiKey = 'cdac25a3bb4ded59efab4e238447a867';
        self.imgList.removeAll();
        var flickrApiUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+apiKey+'&lat='+Lat+'&lon='+Lng+'&format=json&nojsoncallback=1';
        // var flickrApiUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+apiKey+'&lat=24.746726&lon=46.618246&format=json&nojsoncallback=1';
		$.getJSON(flickrApiUrl).done(function(data) {
			self.shuffle(data.photos.photo);
				for (var i = 0; i < 9; i++) {
			    	var targetURL = {url : 'https://farm' + data.photos.photo[i].farm + '.staticflickr.com/' + data.photos.photo[i].server + '/' + data.photos.photo[i].id + '_' + data.photos.photo[i].secret + '.jpg'};
			    	self.imgList.push(targetURL);
			}
		}).fail(function(e){
			//In error
			console.log("sorry failed to fetch data");
			flickrError.text("can't to get flickr resources");
	    });
    };
};

ViewModel.prototype.shuffle = function(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
};

// Render Markers
ViewModel.prototype.renderMarkers = function(arrayInput) {
    this.clearMarkers();
	var infowindow = this.infowindow;
	var context = this;
	var placeToShow = arrayInput;

  	for (var i = 0, len = placeToShow.length; i < len; i ++) {
		var location = {lat: placeToShow[i].lat, lng: placeToShow[i].lng};
		var marker = new google.maps.Marker({
				position: location,
				map: this.map,
				icon: 'img/mapDef.png'
			});
		this.markers.push(marker);
		this.markers[i].setMap(this.map);
		//listen to click
		marker.addListener('click', this.activateMarker(marker, context, infowindow, i));
  	}
};

//Update Info Window
ViewModel.prototype.activateMarker = function(marker, context, infowindow, index) {
	return function() {
		if (!isNaN(index)) {
			var place = context.filteredItems()[index];
			context.updateContent(place);
            context.flickrImg(place.lat, place.lng);
        }
		infowindow.close();
		context.deactivateAllMarkers();
        infowindow.open(context.map, marker);   
          
        marker.setIcon('img/mapAct.png');
        $('#ig').css('display','block');    
    };
};


// Info Window
ViewModel.prototype.updateContent = function(place){
	var html = '<div class="info-content">' +
		'<h3>' + place.name + '</h3>' +
        '<p>' + place.info + '</p>'+'</div>';
	    this.infowindow.setContent(html);
};

//Reset marker
ViewModel.prototype.deactivateAllMarkers = function() {
	var markers = this.markers;
	for (var i = 0; i < markers.length; i ++) {
        markers[i].setIcon('img/mapDef.png');
        $('#ig').css('display','none');
	}
};

//Clear Markers
ViewModel.prototype.clearMarkers = function() {
	for (var i = 0; i < this.markers.length; i++) {
		this.markers[i].setMap(null);
	}
		this.markers = [];
};


function init(){
	ko.applyBindings(new ViewModel());
}

function googleError() {
	mapError = $('#map');
	mapError.html("Fail to load map, please refresh the page");
}




