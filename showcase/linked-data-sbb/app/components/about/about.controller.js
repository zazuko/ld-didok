/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('about', ['ngResource'])

    .controller('AboutController', function ($scope, $resource, $routeParams) {

        $scope.world = "About";

        $scope.function = function (index) {
            //Do something
        };

    })
;