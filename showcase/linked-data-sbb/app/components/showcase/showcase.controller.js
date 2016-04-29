/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource'])

    .controller('ShowcaseController', function ($scope, $http, queryService) {

        $scope.world = "Showcase";

        var url = queryService.getShowcaseData();

        $http({
            method: 'Get',
            url: url
        }).then(function successCallback(response) {
            $scope.data = response.data.results.bindings;
        });


        $scope.getDetail = function (id) {
            var url = queryService.getDetailQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                var data = response.data.results.bindings[0];
                showDetail(data);
            });
        };

        var showDetail = function(data) {
            $("#showcase").html("<ul><li>Id: "+ data.id.value +"</li><li>Subject: "+ data.subject.value +"</li><li>Name: "+ data.name.value +"</li><li>alternateName: "+ data.alternateName.value +"</li><li>municipality: "+ data.municipality.value +"</li><li>x: "+ data.x.value +"</li><li>y: "+ data.y.value +"</li></ul>")
        }

    })

    .factory('queryService', function() {

        var url = "http://localhost:3030/showcase/query";

        var prefix = "\
                    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
                    PREFIX owl: <http://www.w3.org/2002/07/owl#>\
                    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                    prefix schema: <http://schema.org/>\
                    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                    prefix gont: <https://gont.ch/>";

        var getEncodedQueryUrl = function(query) {
            return url+"?query="+ encodeURIComponent(query) +"&format=json";
        };

        return {

            getDetailQueryUrl: function(id) {
                var query = prefix + "\
                    SELECT *\
                    WHERE {\
                        ?subject a schema:CivicStructure;\
                        gont:id " + id + ";\
                        gont:id ?id;\
                        rdfs:label ?name;\
                        gont:municipality ?municipality;\
                        schema:alternateName ?alternateName;\
                        gont:lv03_x ?x;\
                        gont:lv03_y ?y;\
                    }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getShowcaseData: function() {
                var query = prefix + "\
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

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            }

        };

    })
;