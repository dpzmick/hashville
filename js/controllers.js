angular.module('hashControllers', ['uiGmapgoogle-maps'])


.controller('LandingCtrl', ['$scope',
    function($scope) {
        $scope.where = "Where will you be staying?";
        $scope.when = "How long will you be in Nashville?";
}])

.controller('ItineraryCtrl', ['$scope', 'uiGmapGoogleMapApi',
    function($scope, uiGmapGoogleMapApi) {
        $scope.lat = 36.17;
        $scope.long = -86.78;
        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = { 
                center: { latitude: $scope.lat, longitude: $scope.long }, 
                zoom: 8,
                options: {
                    scrollwheel: false,
//                    draggable: false,
                    keyboardShortcuts: false,
                    disableDoubleClickZoom: true,
                    disableDefaultUI: true
                }
            };
    });
}]);