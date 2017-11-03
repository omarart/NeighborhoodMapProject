var map;

// locations array
var initalLocations = [
    {
        name: 'King Saud University',
        location: {lat: 24.742205,lng: 46.622934},
        info: 'King Saud University',
        id: 1
    },
    {
        name: 'Fitness Time',
        location: {lat: 24.743382, lng: 46.620692},
        info: 'Fitness Time',
        id: 2
    },
    {
        name: 'THE BOULEVARD - ALRYADH', 
        location: {lat: 24.750641, lng: 46.613548},
        info: 'THE BOULEVARD - ALRYADH',
        id: 3
    },
    {
        name: 'Danub Market', 
        location: {lat: 24.753019, lng: 46.610083},
        info: 'Danub Market',
        id: 4
    },
    {
        name: 'Rubeen Plaza',
        location: {lat: 24.752980, lng: 46.624867},
        info: 'Rubeen Plaza',
        id: 5
    },
    {
        name: 'Badir Program', 
        location: {lat: 24.747441, lng: 46.618933},
        info: 'Badir Program',
        id: 6
    }
];

Location = function (data) {
    var that = this;

    this.name = ko.observable(data.name);
    this.position = data.location;
    this.info = ko.observable(data.info);
    this.id = ko.observable(data.id);
    this.imgList = ko.observableArray([]);

    this.infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
        content: that.infoWin
    });

    // for(var i =0 ; i < initalLocations.length ; i++ ) {
    //     var name = initalLocations[i].name;
    //     var position = initalLocations[i].location;
    //     var info = initalLocations[i].info;

    //     this.marker = new google.maps.Marker({
    //         map: map,
    //         position: position,
    //         title: name,
    //         animation: google.maps.Animation.DROP,
    //     });
    //     this.marker.addListener('click', that.clicker);
        
    // }

    this.marker = new google.maps.Marker({
        map: that.map,
        position: that.position,
        title: that.name(),
        id: that.id(),
        animation: google.maps.Animation.DROP,
    });
    
    this.show = ko.observable(true);
    if (this.show() === true )
        that.marker.setMap(map);
    else
        that.marker.setMap(null);

    map.addListener('zoom_changed', function() {
    infowindow.setContent('Zoom: ' + map.getZoom());
    });

    this.clicker = function() {
        that.infoWin = 
        '<div class="info-content">' +'<h3>' + that.name() + '</h3>' +'<p>' + that.info() + '</p>'+'</div>';
        that.infoWindow.setContent(that.infoWin);
        that.infoWindow.open(map, this);
        that.animationBounce();
        // that.closeWin(that.marker.id);
    };
    this.marker.addListener('click', that.clicker);

    // this.closeWin = function(id) {
    //     if (that.id !== id){
    //         that.infoWindow.closeclick();
    //     }
    // };

    this.animationBounce = function() {
        that.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            that.marker.setAnimation(null);
        }, 2000);
    };    

    this.clicked = function(marker) {
        google.maps.event.trigger(that.marker, 'click');
    };

};

function ViewModel(){
    var that = this;

    this.LocationList = ko.observableArray([]);
    that.imgList = ko.observableArray([]);
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.746726, lng: 46.618246},
        zoom: 15,
        mapTypeControl: false,
        styles: styles
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

    initalLocations.forEach(function(locationItem){
        that.LocationList.push( new Location(locationItem) );        
    });    

    that.filterSearch = ko.observable();     
    this.search = ko.computed(function() {
        var newFilter = that.filterSearch();
        if ( newFilter !== false){
            newFilter = that.filterSearch();
            return ko.utils.arrayFilter(that.LocationList(), function(place) {
                var title = place.name();
                var outs = title.search(newFilter) >= 0;
                return outs;
            });
        } else {
            that.LocationList().forEach(function(place){
            });
            return that.LocationList();
        }
    });

}

function googleMapsError(){
    $('#map').html('sorry, dont work');
}

function init() {
    ko.applyBindings(new ViewModel());
}


