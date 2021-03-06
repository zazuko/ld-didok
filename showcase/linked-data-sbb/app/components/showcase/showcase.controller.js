/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource'])

    .controller('ShowcaseController', function ($scope, $http, queryService) {

        $scope.displayName = function(item) {
            return item.name.value;
        };

        $scope.afterSelect = function(item) {
            $scope.detail = null;
            $scope.adminData = null;
            $scope.dbpediaData = null;
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
            var url = queryService.getDetailQueryUrl(id, $scope);
            //$scope.didokUrl = url.replace("showcase/query", "dataset.html");          // for localhost
            $scope.didokUrl = url.replace("query", "dataset.html");
            $scope.didokID = id;
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                var data = response.data.results.bindings[0];
                $scope.detail = data;
                var id = $scope.detail.municipality.value.split("/").pop();
                $scope.adminAndDBpediaID = id;
                $scope.getService(data.subject.value);
                $scope.getNebenbetriebe(data.subject.value);
                $scope.getGepaecke(data.subject.value);
                $scope.getAdminData(id);
                $scope.getDBpediaData(id);
            });
        };

        $scope.getAdminData = function(id) {
            var url = queryService.getAdminData(id);
            $scope.adminUrl = url.replace("query?", "sparql/?");
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
            $scope.dbpediaUrl = url.replace("sparql", "snorql/");
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("DBpedia data:", response.data.results.bindings);
                $scope.dbpediaData = response.data.results.bindings[0];
                $scope.neighbors = response.data.results.bindings;
            });
        };

        $scope.getService = function(id) {

            var url = queryService.getService(id);
            //$scope.serviceUrl = url.replace("showcase/query", "dataset.html");        // for localhost
            $scope.serviceUrl = url.replace("query", "dataset.html");
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("Service: ", response);
                $scope.service = response.data.results.bindings[0];
            });
        };

        $scope.getNebenbetriebe = function(id) {
            var url = queryService.getNebenbetriebe(id);
            //$scope.nebenbetriebeUrl = url.replace("showcase/query", "dataset.html");  // for localhost
            $scope.nebenbetriebeUrl = url.replace("query", "dataset.html");
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("Nebenbetriebe: ", response);
                $scope.nebenbetriebe = response.data.results.bindings[0];
            });
        };

        $scope.getGepaecke = function(id) {
            var url = queryService.getGepaecke(id);
            //$scope.gepaeckeUrl = url.replace("showcase/query", "dataset.html");       // for localhost
            $scope.gepaeckeUrl = url.replace("query", "dataset.html");
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                console.log("Gepaecke: ", response);
                $scope.gepaecke = response.data.results.bindings[0];
            });
        };

    })

    .factory('queryService', function() {

        //var localUrl = "http://localhost:3030/showcase/query";                        // for localhost
        var localUrl = "http://lod.transportopendata.swiss/query";
        var adminUrl = "http://data.admin.ch/query";
        var dbpediaUrl = "http://dbpedia.org/sparql";

        var prefix = "\
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
prefix owl: <http://www.w3.org/2002/07/owl#>\n\
prefix xsd: <http://www.w3.org/2001/XMLSchema#>\n\
prefix foaf: <http://xmlns.com/foaf/0.1/>\n\
prefix schema: <http://schema.org/>\n\
prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
prefix gont: <https://gont.ch/>\n\
prefix transport: <http://schema.transport.swiss/>\n\
prefix dbo: <http://dbpedia.org/ontology/>\n\
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

            getDetailQueryUrl: function(id, $scope) {
                var query = prefix + "\n\n\
SELECT *\n\
WHERE {\n\
    ?subject a schema:CivicStructure;\n\
        gont:id " + id + ";\n\
        gont:id ?id;\n\
        rdfs:label ?name;\n\
        gont:municipality ?municipality;\n\
        gont:lv03_x ?x;\n\
        gont:lv03_y ?y;\n\
    OPTIONAL {?subject schema:alternateName ?alternateName;}\n\
}";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            },

            getAdminData: function(id) {
                var query = prefix + "\n\n\
SELECT DISTINCT *\n\
WHERE {\n\
    ?sub a gont:Municipality;\n\
        gont:id " + id +", ?id;\n\
        owl:sameAs ?sameAs;\n\
        gont:municipalityVersion ?version\n\
}";

                var queryUrl = getEncodedQueryUrl(adminUrl, query);
                return queryUrl;
            },

            getDBpediaData: function(id) {
                var query = prefix + "\n\n\
SELECT *\n\
WHERE {\n\
    ?sub a dbo:Settlement ;\n\
        dbo:municipalityCode '" + id + "' ;\n\
        dbo:municipalityCode ?code ;\n\
        dbo:abstract ?abstract ;\n\
        dbo:country ?country ;\n\
        dbo:neighboringMunicipality ?neighbor ;\n\
        dbo:postalCode ?postalCode ;\n\
        foaf:homepage ?website \n\
    OPTIONAL { ?sub dbo:canton ?canton . }\n\
    FILTER (langMatches(lang(?abstract),'de'))\n\
}";

                var queryUrl = getEncodedQueryUrl(dbpediaUrl, query);
                return queryUrl;
            },

            getService: function(id) {
                var query = prefix + "\n\n\
SELECT *\n\
WHERE {\n\
   ?subject a schema:Service ;\n\
        gont:didok <" + id +">, ?didok ;\n\
        gont:id ?id ;\n\
        transport:stationName ?stationName ;\n\
        schema:serviceType ?serviceType ;\n\
        schema:provider ?provider ;\n\
        transport:location ?geo\n\
}";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            },

            getNebenbetriebe: function(id) {
                var query = prefix + "\n\n\
SELECT *\n\
WHERE {\n\
    ?subject a schema:LocalBusiness;\n\
        gont:didok <" + id + ">, ?didok ;\n\
        gont:id ?id ;\n\
        transport:stationName ?stationName ;\n\
        schema:name ?name ;\n\
        schema:geo ?geo\n\
}";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            },

            getGepaecke: function(id) {
                var query = prefix + "\n\n\
SELECT *\n\
WHERE {\n\
    ?subject a schema:CivicStructure ;\n\
        gont:didok <" + id + ">, ?didok ;\n\
        gont:id ?id ;\n\
        transport:stationName ?stationName ;\n\
        transport:info ?info ;\n\
        transport:knot ?knot ;\n\
        transport:location ?geo\n\
}";

                var queryUrl = getEncodedQueryUrl(localUrl, query);
                return queryUrl;
            }

        };

    })
;