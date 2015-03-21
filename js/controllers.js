angular.module('hashControllers', ['uiGmapgoogle-maps'])


.controller('LandingCtrl', ['$scope',
    function($scope) {
        $scope.where = "Where will you be staying?";
        $scope.when = "How long will you be in Nashville?";
}])

.controller('IteneraryCtrl', ['$scope', 'uiGmapGoogleMapApi',
    function($scope, uiGmapGoogleMapApi) {
        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        });
}]);