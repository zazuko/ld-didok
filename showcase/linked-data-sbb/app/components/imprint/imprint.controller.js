/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('imprint', ['ngResource'])

    .controller('ImprintController', function ($scope, $resource, $routeParams) {

        $scope.world = "Imprint";

        $scope.function = function (index) {
            //Do something
        };

    })
;