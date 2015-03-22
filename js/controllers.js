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
        
        var scrollVal = 0;

        var layer0 = document.getElementById("layer-0");
        var layer1 = document.getElementById("layer-1");
        var layer2 = document.getElementById("layer-2");
        var layer3 = document.getElementById("layer-3");
        var layer4 = document.getElementById("layer-4");
        var layer5 = document.getElementById("layer-5");
        var layer6 = document.getElementById("layer-6");

        function parallaxy()
        {   
            offset6 = -(scrollVal * 1.0);
            offset5 = -(scrollVal * 0.7);
            offset4 = -(scrollVal * 0.5);
            offset3 = -(scrollVal * 0.3);
            offset2 = -(scrollVal * 0.2);
            offset1 = -(scrollVal * 0.1);
            offset0 = 0;

            layer0.style.webkitTransform = "translate3d(0, " + offset0 + "px, 0)";
            layer0.style.MozTransform = "translate3d(0, " + offset0 + "px, 0)";
            layer0.style.msTransform = "translateY(" + offset0 + "px)";
            layer0.style.OTransform = "translate3d(0, " + offset0 + "px, 0)";
            layer0.style.transform = "translate3d(0, " + offset0 + "px, 0)";

            layer1.style.webkitTransform = "translate3d(0, " + offset1 + "px, 0)";
            layer1.style.MozTransform = "translate3d(0, " + offset1 + "px, 0)";
            layer1.style.msTransform = "translateY(" + offset1 + "px)";
            layer1.style.OTransform = "translate3d(0, " + offset1 + "px, 0)";
            layer1.style.transform = "translate3d(0, " + offset1 + "px, 0)";

            layer2.style.webkitTransform = "translate3d(0, " + offset2 + "px, 0)";
            layer2.style.MozTransform = "translate3d(0, " + offset2 + "px, 0)";
            layer2.style.msTransform = "translateY(" + offset2 + "px)";
            layer2.style.OTransform = "translate3d(0, " + offset2 + "px, 0)";
            layer2.style.transform = "translate3d(0, " + offset2 + "px, 0)";

            layer3.style.webkitTransform = "translate3d(0, " + offset3 + "px, 0)";
            layer3.style.MozTransform = "translate3d(0, " + offset3 + "px, 0)";
            layer3.style.msTransform = "translateY(" + offset3 + "px)";
            layer3.style.OTransform = "translate3d(0, " + offset3 + "px, 0)";
            layer3.style.transform = "translate3d(0, " + offset3 + "px, 0)";

            layer4.style.webkitTransform = "translate3d(0, " + offset4 + "px, 0)";
            layer4.style.MozTransform = "translate3d(0, " + offset4 + "px, 0)";
            layer4.style.msTransform = "translateY(" + offset4 + "px)";
            layer4.style.OTransform = "translate3d(0, " + offset4 + "px, 0)";
            layer4.style.transform = "translate3d(0, " + offset4 + "px, 0)";

            layer5.style.webkitTransform = "translate3d(0, " + offset5 + "px, 0)";
            layer5.style.MozTransform = "translate3d(0, " + offset5 + "px, 0)";
            layer5.style.msTransform = "translateY(" + offset5 + "px)";
            layer5.style.OTransform = "translate3d(0, " + offset5 + "px, 0)";
            layer5.style.transform = "translate3d(0, " + offset5 + "px, 0)";

            layer6.style.webkitTransform = "translate3d(0, " + offset6 + "px, 0)";
            layer6.style.MozTransform = "translate3d(0, " + offset6 + "px, 0)";
            layer6.style.msTransform = "translateY(" + offset6 + "px)";
            layer6.style.OTransform = "translate3d(0, " + offset6 + "px, 0)";
            layer6.style.transform = "translate3d(0, " + offset6 + "px, 0)";
        }


        function scrollHandler(e)
        {
            console.log('scrolled');
            scrollVal = Math.max(window.pageYOffset,0);
            parallaxy();
        }

        document.addEventListener('scroll', scrollHandler, false);
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
                    name: "cafe-coco", lat: 36.151912, lon: -86.804893
                },
                {
                    name: "frist", lat: 36.157501, lon: -86.783707
                },
                {
                    name: "edleys", lat: 36.175921, lon: -86.756294
                },
                {
                    name: "parthenon", lat: 36.149608, lon: -86.81262
                }
            ],

            suggestions: [
                {
                    name: "filling-station", lat: 36.122781, lon: -86.789652
                },
                {
                    name: "climb-nashville", lat: 36.153031, lon: -86.828027
                },
                {
                    name: "contra", lat: 36.110897, lon: -86.801207
                },
                {
                    name: "ryman", lat: 36.161248, lon: -86.778471
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