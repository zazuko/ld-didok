/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource'])

    .controller('ShowcaseController', function ($scope, $http, queryService) {

        $scope.displayName = function(item) {
            return item.name.value;
        };

        $scope.afterSelect = function(item) {
            $scope.getDetail(item.id.value);
        };

        var url = queryService.getShowcaseData();

        $http({
            method: 'Get',
            url: url
        }).then(function successCallback(response) {
            var data = response.data.results.bindings;
            $scope.data = data;
        });

        $scope.getDetail = function(id) {
            var url = queryService.getDetailQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                var data = response.data.results.bindings[0];
                $scope.detail = data;
                var id = $scope.detail.municipality.value.split("/").pop();
                $scope.getAdminData(id);
                $scope.getDBpediaData(id);
            });
        };

        $scope.getAdminData = function(id) {
            var url = queryService.getAdminData(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("Admin data:", response.data.results.bindings);
                $scope.adminData = response.data.results.bindings[0];
                $scope.versionen = response.data.results.bindings;
            });
        };

        $scope.getDBpediaData = function(id) {
            if (id.length < 4) {
                var data = "";
                for (var i = id.length; i < 4; i++) {
                    data += "0"
                }
                id = data + id;
            }
            var url = queryService.getDBpediaData(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("DBpedia data:", response.data.results.bindings);
                $scope.dbpediaData = response.data.results.bindings[0];
                $scope.neighbors = response.data.results.bindings;
            });
        }

    })

    .factory('queryService', function() {

        var localUrl = "http://localhost:3030/showcase/query";
        var adminUrl = "http://data.admin.ch/query";
        var dbpediaUrl = "http://dbpedia.org/sparql";

        var prefix = "\
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
PREFIX owl: <http://www.w3.org/2002/07/owl#>\
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
prefix schema: <http://schema.org/>\
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
prefix gont: <https://gont.ch/>\
prefix transport: <http://schema.transport.swiss/>\
prefix dbo: <http://dbpedia.org/ontology/>\
prefix dbp: <http://dbpedia.org/property/>";

        var getEncodedQueryUrl = function(url, query) {
            return url + "?query=" + encodeURIComponent(query) + "&format=json";
        };

        return {

            getShowcaseData: function() {
                var query = prefix + "\
                    SELECT ?id ?name\
                    WHERE {\
                        ?subject a schema:CivicStructure;\
                        rdfs:label ?name;\
                        gont:id ?id;\
                    }";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            },

            getDetailQueryUrl: function(id) {
                var query = prefix + "\
                    SELECT *\
                    WHERE {\
                        ?subject a schema:CivicStructure;\
                        gont:id " + id + ";\
                        gont:id ?id;\
                        rdfs:label ?name;\
                        gont:municipality ?municipality;\
                        gont:lv03_x ?x;\
                        gont:lv03_y ?y;\
                        OPTIONAL {?subject schema:alternateName ?alternateName;}\
                    }";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            },

            getAdminData: function(id) {
                var query = prefix + "\
                SELECT DISTINCT *\
                WHERE {\
                    ?sub a gont:Municipality;\
                        gont:id " + id +", ?id;\
                        owl:sameAs ?sameAs;\
                        gont:municipalityVersion ?version\
                }";

                var queryUrl = getEncodedQueryUrl(adminUrl, query);
                return queryUrl;
            },

            getDBpediaData: function(id) {
                var query = prefix + "\
                SELECT *\
                WHERE {\
                    ?sub a dbo:Settlement ;\
                        dbo:municipalityCode '" + id + "' ;\
                        dbo:municipalityCode ?code ;\
                        dbo:abstract ?abstract ;\
                        dbo:country ?country ;\
                        dbo:neighboringMunicipality ?neighbor ;\
                        dbo:postalCode ?postalCode ;\
                        foaf:homepage ?website \
                        OPTIONAL { ?sub dbo:canton ?canton . }\
                        FILTER (langMatches(lang(?abstract),'de'))\
                }";

                var queryUrl = getEncodedQueryUrl(dbpediaUrl, query);
                return queryUrl;
            }

        };

    })
;