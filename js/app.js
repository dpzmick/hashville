angular.module('hash', [
    'ngRoute',
    'hashControllers'
])

.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
//        $locationProvider.html5Mode(true);
        $routeProvider
        .when('/', {
            templateUrl: '/templates/landing.html',
            controller: 'LandingCtrl'
        })
        
        .when('/plan', {
            templateUrl: '/templates/itinerary.html',
            controller: 'ItineraryCtrl'
        })
        
        .otherwise({ 
            templateUrl: '/templates/404.html' 
        });
    }
]);
