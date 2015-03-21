var myApp = angular.module('hash', [
    'ngRoute',
    'hashControllers',
]);

myApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
        .when('/', {
            templateUrl: '/templates/landing.html',
            controller: 'LandingCtrl'
        })
        
        .when('/plan', {
            templateUrl: '/templates/plan.html',
            controller: 'IteneraryCtrl'
        })
        
        .otherwise({ 
            templateUrl: '/templates/404.html' 
        });
    }]);