angular.module('hashControllers', [])

.factory('Info', function() {
    return { where: 'right here bb' };
})

.controller('LandingCtrl', ['$scope',
    function($scope, Info) {
        
    $scope.submit = function() {
//        Info.where = $scope.where;
        console.log(Info.where);
//        $rootScope.date = $scope.when;
        $location.path('/plan');
    }
        
}])

.controller('ItineraryCtrl', ['$scope',
    function($scope, Info) {
        var lat = 36.158,
            long = -86.769;
        
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(-33.897, 150.099),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true
        }
        
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                actualLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                $scope.map.setCenter(actualLocation);
            });
        }
        
        var rendererOptions = { map: $scope.map };
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
        /*
        var point1 = new google.maps.LatLng(-33.8975098545041,151.09962701797485);
        var point2 = new google.maps.LatLng(-33.8584421519279,151.0693073272705);
        var point3 = new google.maps.LatLng(-33.87312358690301,151.99952697753906);
        var point4 = new google.maps.LatLng(-33.84525521656404,151.0421848297119);
        */
        
        //var point1 = new google.maps.LatLng();
        //var point2 = new google.maps.LatLng();
        //var point3 = new google.maps.LatLng();
        //var point4 = new google.maps.LatLng();
        
        console.log(angular.fromJson(data.json));
        
        var wps = [{ location: point1 }, { location: point2 }, {location: point4}];

        var org = new google.maps.LatLng ( -33.89192157947345,151.13604068756104);
        var dest = new google.maps.LatLng ( -33.69727974097957,150.29047966003418);

        var request = {
            origin: org,
            destination: dest,
            waypoints: wps,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };


        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
            else
                alert ('failed to get directions');
        });
    }
]);