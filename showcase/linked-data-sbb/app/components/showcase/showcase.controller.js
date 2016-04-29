/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource'])

    .controller('ShowcaseController', function ($scope, $http) {

        $scope.world = "Showcase";

        var url = "http://localhost:3030/showcase/query";

        var query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
        PREFIX owl: <http://www.w3.org/2002/07/owl#>\
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
            prefix schema: <http://schema.org/>\
            prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
            prefix gont: <https://gont.ch/>\
            SELECT *\
            WHERE {\
            ?subject a schema:CivicStructure;\
            rdfs:label ?label;\
            gont:id ?id;\
            gont:lv03_y ?y;\
            gont:lv03_x ?x;\
            gont:municipality <http://classifications.data.admin.ch/municipality/371>\
        }\
        LIMIT 100";

        var queryUrl = url+"?query="+ encodeURIComponent(query) +"&format=json";

        $http({
            method: 'Get',
            url: queryUrl
        }).then(function successCallback(response) {
            console.log("successCallback:", response);
            $scope.data = response.data.results.bindings;
        }, function errorCallback(response) {
            console.log("errorCallback:", response);
        });

    })
;