angular.module('hashControllers', ['uiGmapgoogle-maps'])


.controller('LandingCtrl', ['$scope',
    function($scope) {
        $scope.where = "Where will you be staying?";
        $scope.when = "How long will you be in Nashville?";
}])

.controller('ItineraryCtrl', ['$scope',
    function($scope) {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(37.0000, -80.0000),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            draggable: false,
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true
        }
        
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
]);