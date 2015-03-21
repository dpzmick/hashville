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
            center: new google.maps.LatLng(lat, long),
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
                $scope.map.setCenter(actualLocation);
            });
        }
    }
]);