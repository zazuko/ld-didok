/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource'])

    .controller('ShowcaseController', function ($scope, $http) {

        $scope.world = "Showcase";

        var url = "http://dbpedia.org/sparql";

        var query = "select distinct ?Concept where {[] a ?Concept} LIMIT 100";

        var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";

        $http({
            method: 'Get',
            url: queryUrl
        }).then(function successCallback(response) {

            console.log("successCallback:", response);

        }, function errorCallback(response) {

            console.log("errorCallback:", response);

        });

        $scope.function = function (index) {
            //Do something
        };

    })
;