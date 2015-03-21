angular.module('hash', [
    'ngRoute',
    'hashControllers'
])

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

.config(['$routeProvider', '$locationProvider',
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
    }
]);
