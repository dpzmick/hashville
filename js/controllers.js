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

.controller('ItineraryCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.travel_mode = "walking";
        $scope.current_suggestion = 0;
        
        var lat = 36.158,
            lon = -86.769,
            nextLat = 36.158,
            nextLon = -86.769,
            rad = 1000,
            mapStyle = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#e3ebec"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"all","stylers":[{"saturation":"-31"},{"color":"#c64747"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#005573"},{"visibility":"on"}]}]
        
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(lat, lon),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true,
            styles: mapStyle
        }
        
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        $scope.itinerary = [];
        $scope.suggestions = [];
        
        var origin = new google.maps.LatLng(lat, lon);
        
        var rendererOptions = { 
            map: $scope.map,
    //        suppressMarkers: true
        };
        
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
        function iterateIten() {
            $http.get('http://localhost:3000/all?latitude=' + nextLat + '&longitude=' + nextLon + '&radius=' + rad)
            .then(function(response) {
                $scope.suggestions = response.data;
                setTimeout(function() {
                    $scope.$apply();
                }, 300);
            });
        }
        
        $scope.updateIten = function(i) {
            var selected = $scope.suggestions[i];
            $scope.itinerary.push(selected);
            nextLat = selected.lat;
            nextLon = selected.lon;
            
            iterateIten();
        }
        
        function updateTime(res) {
            $scope.time = "";
            var seconds = 0;
            $.each(res.routes[0].legs, function(index, elem) {
                seconds += elem.duration.value;
            });
            
            var days    = Math.floor(seconds/86400    ),
                hours   = Math.floor(seconds/3600 % 24),
                minutes = Math.floor(seconds/60   % 60);
            
            var time = (days    ? days    + " days "    : "")
                     + (hours   ? hours   + " hours "   : "")
                     + (minutes ? minutes + " minutes " : "");
            
            $('.travel_time').text(time);
        }
        
        $scope.switchSuggestion = function(i) {
            $scope.current_suggestion = i;
            var points = JSONtoMaps($scope.itinerary, $scope.suggestions);
            var dest = points.suggestions[i].location;
            route = plotRoute($scope.map, directionsDisplay, origin, dest, points.itinerary, $scope.travel_mode, updateTime);
        }
        
        iterateIten();
    }
]);