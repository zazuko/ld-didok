/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('home', ['ngResource'])

    .controller('HomeController', function ($scope) {

        $scope.world = "Home";
        $scope.wikiLinkRdf = "https://en.wikipedia.org/wiki/Resource_Description_Framework";
        $scope.wikiTextRdf = "Resource Description Framework (RDF)";

        $scope.wikiLinkLD = "https://en.wikipedia.org/wiki/Linked_Data";
        $scope.wikiTextLD = "Linked Data";

        $scope.dataSbbLink = "https://data.sbb.ch";
        $scope.dataSbbText = "data.sbb.ch"

        $scope.function = function (index) {
            //Do something
        };

    })
;