var map;
Location = function (data) {
    var that = this;

    this.name = ko.observable(data.name);
    this.position = data.location;
    this.info = ko.observable(data.info);
    this.id = ko.observable(data.id);
    this.category = ko.observable(data.category);
    this.Wikipedia = '';

    this.infoWindow = new google.maps.InfoWindow({
        maxWidth: 350,
        content: that.information
    });

    this.marker = new google.maps.Marker({
        map: that.map,
        position: that.position,
        title: that.name(),
        id: that.id(),
        animation: google.maps.Animation.DROP,
    });

    
    this.wikipedia = function(marker){
        var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+that.category() + '&format=json&callback=wikiCallback';
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'jsonp'
        })
        .done(function(reply) {
            var name = reply[0];
            that.Wikipedia = reply[2];
            var slice = that.Wikipedia.slice(0,2);
            slice.slice(0,2);
            console.log(that.Wikipedia);
            console.log(slice);
            var blog = 'http://en.wikipedia.org/wiki/' + that.category();
            that.information = '<div class="info-content"><h3>' + name + '</h3>' + '<p>' + slice +'</p><p><b>More Visit</b>: <a href="' + blog + '">' + name + '</a></p></div>';
            that.infoWindow.setContent(that.information);
            console.log('sec');
        })
        .fail(function(){
            that.information = 'sorry, the api dont work';
            that.infowindow.setContent(that.information);
            console.log('the api dont work');
            $('#map').html('There is an error with wikipedia API ');
        })
        .always(function(){
            console.log('that is better API');
        });
      };
    
    this.clicker = function(mark) {
        that.wikipedia(mark);
        that.infoWindow.open(map, this);
        console.log('Good');
        that.animationBounce();
    };
    this.marker.addListener('click', that.clicker);

    this.animationBounce = function() {
        that.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            that.marker.setAnimation(null);
        }, 2000);
    };

    this.clicked = function(marker) {
        google.maps.event.trigger(that.marker, 'click');
    };

    this.showMarks = ko.observable(true);        
    this.show = ko.computed(function(){
        if(this.showMarks() !== true)
            that.marker.setMap(null);
        else
            that.marker.setMap(map);
    }, this);

};

function ViewModel(){
    var that = this;
    this.LocationList = ko.observableArray([]);
    that.imgList = ko.observableArray([]);

    this.resetMap = function() {
            map.setCenter({lat: 24.746726, lng: 46.618246});
            map.setZoom(13);
            console.log('s');            
    };

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

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.746726, lng: 46.618246},
        zoom: 14,
        mapTypeControl: false,
        styles: styles
    });

    initalLocations.forEach(function(locationItem){
        that.LocationList.push( new Location(locationItem) );        
    });

    that.filterSearch = ko.observable('');
    this.search = ko.computed(function() {
        var searchs= that.filterSearch();
        if ( searchs !== false){
            return ko.utils.arrayFilter(that.LocationList(), function(place) {
                var outs = place.name().toLowerCase().indexOf(that.filterSearch().toLowerCase()) >= 0;
                place.showMarks(outs);
                return outs;
            });
        } else {
            that.LocationList().forEach(function(place){
                place.showMarks(true);
            });
        }
    });
}

function googleMapsError(){
    $('#map').html('sorry, dont work');
}

function init() {
    ko.applyBindings(new ViewModel());
}


