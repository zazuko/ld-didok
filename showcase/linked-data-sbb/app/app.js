/**
 * Created by UE61582 on 22.04.2016.
 */

angular.module('linked-data', ['ngRoute', 'home', 'showcase', 'about', 'infinite-scroll'])

    .config(
        function($routeProvider, uiGmapGoogleMapApiProvider) {
            $routeProvider.
                when('/home', {
                    templateUrl: 'components/home/home.html',
                    controller: 'HomeController'
                })
                .when('/showcase', {
                    templateUrl: 'components/showcase/showcase.html',
                    controller: 'ShowcaseController'
                })
                .when('/about', {
                    templateUrl: 'components/about/about.html',
                    controller: 'AboutController'
                })
                .otherwise({
                    redirectTo: '/home'
                })
            ;

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCmNEfudw_rMuqLY67W65m0-XsnprwFU_U',
                v: '3.21',
                libraries: 'weather,geometry,visualization'
            });
        }
    )

    .controller('NavController', function ($scope, $location) {

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

    })
;