angular.module('hashControllers', [])

.controller('LandingCtrl', ['$scope',
    function($scope, Info) {
        
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        var autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
        { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            console.log(autocomplete);
        });
        
        $scope.geolocate = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition( function(position) {
                    var geolocation = new google.maps.LatLng(
                        position.coords.latitude, 
                        position.coords.longitude);

                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });

                    autocomplete.setBounds(circle.getBounds());
                });
            }
        }
        
        $scope.submit = function() {
            $location.path('/plan');
        }
    }
])

.controller('ItineraryCtrl', ['$scope',
    function($scope, Info) {
        $scope.travel_mode = "walking";
        $scope.current_suggestion = 0;
        
        var lat = 36.158,
            long = -86.769;
        
        var mapStyle = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e3ebec"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"all","stylers":[{"saturation":"-31"},{"color":"#c64747"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#005573"},{"visibility":"on"}]}]
        
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true,
            styles: mapStyle
        }
        
        $scope.travel_time = "";
        
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        $scope.data = {
            itinerary: [
                {
                    name: "Cafe Coco", lat: 36.151912, lon: -86.804893
                },
                {
                    name: "Frist", lat: 36.157501, lon: -86.783707
                },
                {
                    name: "Edleys", lat: 36.175921, lon: -86.756294
                },
                {
                    name: "Parthenon", lat: 36.149608, lon: -86.81262
                }
            ],

            suggestions: [
                {
                    name: "The Filling Station", lat: 36.122781, lon: -86.789652
                },
                {
                    name: "Climb Nashville", lat: 36.153031, lon: -86.828027
                },
                {
                    name: "Contra", lat: 36.110897, lon: -86.801207
                },
                {
                    name: "Ryman", lat: 36.161248, lon: -86.778471
                }
            ]
        };
        
        var points = parseJSON($scope.data);

        var origin = new google.maps.LatLng(lat, long);
        var destination = points.suggestions[0].location;
        
        var rendererOptions = { 
            map: $scope.map,
    //        suppressMarkers: true
        };
        
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
        function updateTime(res) {
            $scope.time = "";
            var seconds = 0;
            $.each(res.routes[0].legs, function(index, elem) {
                seconds += elem.duration.value;
            });
            
            var days    = Math.floor(seconds/86400    ),
                hours   = Math.floor(seconds/3600 % 24),
                minutes = Math.floor(seconds/60   % 60);
            
            $scope.travel_time = (days    ? days    + " days "    : "")
                        + (hours   ? hours   + " hours "   : "")
                        + (minutes ? minutes + " minutes " : "");
        }
        
        $scope.switchSuggestion = function(i) {
            $scope.current_suggestion = i;
            var dest = points.suggestions[i].location;
            route = plotRoute($scope.map, directionsDisplay, origin, dest, points.itinerary, $scope.travel_mode, updateTime);
        }
        
    }
]);