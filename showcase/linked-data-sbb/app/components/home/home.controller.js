/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('home', ['ngResource', 'ngMap'])

    .controller('HomeController', function ($scope, NgMap) {

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });

        $scope.karte = {
            zoom: 8,
            lat: 46.76314860125452,
            lng: 8.3880615234375
        };

        $scope.onClick= function(event) {
            console.log('asdf', event.feature);
            $scope.name = event.feature.H.name;
            var clickedLat = event.latLng.lat();
            var clickedLng = event.latLng.lng();
            $scope.geoType = "[" + event.feature.H.latitude + ", " + event.feature.H.longitude + "]";
            //$scope.karte.lat = event.feature.H.latitude;
            //$scope.karte.lng = event.feature.H.longitude;
        };

        $scope.onMouseover = function(event) {
            $scope.map.data.revertStyle();
            $scope.map.data.overrideStyle(event.feature, {fillColor: 'red'});
        };

        $scope.onMouseout = function(event) {
            $scope.map.data.revertStyle();
        };

    })
;