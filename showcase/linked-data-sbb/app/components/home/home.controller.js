/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('home', ['ngResource', 'ngMap'])

    .controller('HomeController', function ($scope, NgMap, $http) {

        var prefix = "prefix gont: <https://gont.ch/>\
                          prefix schema: <http://schema.org/>";

        var query = prefix + "\
                SELECT ?mun\
                WHERE {\
                    ?subject a schema:CivicStructure;\
                        gont:municipality ?mun\
                }";

        var url = "http://localhost:3030/showcase/query?query=" + encodeURIComponent(query) + "&format=json";

        $http({
            method: 'Get',
            url: url
        }).then(function successCallback(response) {
            $scope.data = response.data.results.bindings;
        });

        $scope.wikiLinkRdf = "https://en.wikipedia.org/wiki/Resource_Description_Framework";
        $scope.wikiTextRdf = "Resource Description Framework (RDF)";

        $scope.wikiLinkLD = "https://en.wikipedia.org/wiki/Linked_Data";
        $scope.wikiTextLD = "Linked Data";

        $scope.dataSbbLink = "https://data.sbb.ch";
        $scope.dataSbbText = "data.sbb.ch";

        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });

        $scope.karte = {
            zoom: 8,
            lat: 46.76314860125452,
            lng: 8.3880615234375
        };

        $scope.onMouseover = function(event) {
            $scope.map.data.revertStyle();
            $scope.map.data.overrideStyle(event.feature, {fillColor: 'red'});
        };

        $scope.onMouseout = function(event) {
            $scope.map.data.revertStyle();
        };

        $scope.getCantonStation = function(canton) {

            var prefix = "prefix gont: <https://gont.ch/>\
                          prefix schema: <http://schema.org/>";

            var query = prefix + "\
                SELECT DISTINCT ?mun\
                WHERE {\
                    ?subject a gont:MunicipalityVersion;\
                        gont:canton <" + canton + ">;\
                        gont:municipality ?mun\
                }";

            var url = "http://data.admin.ch/query?query=" + encodeURIComponent(query) + "&format=json";

            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                $scope.municipalities = "";
                var i = 1;
                $scope.countStation = 0;
                response.data.results.bindings.forEach( function(element) {
                    /*if (i === 1) {
                        $scope.firstMunicipality = element.mun.value;
                        i++;
                    }
                    $scope.municipalities += " UNION { ?subject gont:municipality <" + element.mun.value + "> } ";*/
                    $scope.countStation += $scope.data.reduce(function(total,x){return x.mun.value === element.mun.value ? total+1 : total}, 0)
                });

                return false;

                /*var query2 = prefix + "\
                SELECT ?subject \
                WHERE {\
                    ?subject a schema:CivicStructure;\
                    { ?subject gont:municipality <" + $scope.firstMunicipality + "> }\
                    " + $scope.municipalities + "\
                }";

                var url2 = "http://localhost:3030/showcase/query?query=" + encodeURIComponent(query2) + "&format=json";

                $http({
                    method: 'Get',
                    url: url2
                }).then(function successCallback(response) {
                    console.log("stationInCanton: ", response.data.results.bindings);
                    $scope.countStation = response.data.results.bindings.length;
                });*/
            });

        };

        $scope.onClick= function(event) {
            $scope.countStation = undefined;
            $scope.laden = "Zählt...";
            console.log('clicked Canton: ', event.feature);
            $scope.name = event.feature.H.name;
            var clickedLat = event.latLng.lat();
            var clickedLng = event.latLng.lng();

            var canton = "http://classifications.data.admin.ch/canton/" + event.feature.R;

            $scope.getCantonStation(canton);
        };

    })
;