/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('home', ['ngResource'])

    .controller('HomeController', function ($scope) {

        $scope.world = "Home";

        $scope.function = function (index) {
            //Do something
        };

    })
;