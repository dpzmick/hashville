var hashControllers = angular.module('hashControllers', []);

hashControllers.controller('LandingCtrl', ['$scope',
    function($scope) {
        $scope.where = "Where will you be staying?";
        $scope.when = "How long will you be in Nashville?";
}]);