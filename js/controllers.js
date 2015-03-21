angular.module('hashControllers', [])

.factory('Info', function() {
    return { where: 'right here bb' };
})

.controller('LandingCtrl', ['$scope',
    function($scope, Info) {
        
    $scope.submit = function() {
//        Info.where = $scope.where;
        console.log(Info.where);
        $location.path('/plan');
    }
        
}])

.controller('ItineraryCtrl', ['$scope',
    function($scope, Info) {
        var lat = 36.158,
            long = -86.769;
        
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(lat, long),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true
        }
        
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
        
        plotRoute($scope.map, directionsDisplay, origin, destination, points.itinerary);
        
        $scope.switchSuggestion = function(i) {
            var dest = points.suggestions[i].location;
            plotRoute($scope.map, directionsDisplay, origin, dest, points.itinerary);
        }
    }
]);