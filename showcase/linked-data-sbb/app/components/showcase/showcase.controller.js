/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource', 'ngMap'])

    .controller('ShowcaseController', function ($scope, $http, queryService, geoService, NgMap) {

        $("#showcaseNav a").click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        $scope.allLoaded = false;

        NgMap.getMap('karte').then(function(map) {
            var center = {lat: 46.76314860125452, lng: 8.3880615234375};
            map.setCenter(center);
            $scope.karte = map;
        });

        $scope.displayName = function(item) {
            return item.name.value;
        };
        $scope.afterSelect = function(item) {
            console.log("afterSelect", item);
            $scope.getDetail(item.id.value);
        };

        $scope.limit = 100;
        $scope.begin = 0;

        $scope.increaseLimit = function() {
          $scope.limit += 50;
        };

        var url = queryService.getShowcaseData();

        $scope.dynMarkers = [];

        $http({
            method: 'Get',
            url: url
        }).then(function successCallback(response) {
            var data = response.data.results.bindings;
            data.forEach(function(element, index, array) {
                var y = element.y.value.replace('.','');
                var x = element.x.value.replace('.','');
                element.lat = geoService.CHtoWGSlat(y, x);
                element.lng = geoService.CHtoWGSlng(y, x);
                var latLng = new google.maps.LatLng(element.lat, element.lng);
                var marker = new google.maps.Marker({position:latLng, title: element.name.value, data: element.id.value});
                marker.addListener('click', onMarkerClick);
                $scope.dynMarkers.push(marker);
            });
            $scope.markerClusterer = new MarkerClusterer($scope.karte, $scope.dynMarkers, {});
            $scope.data = data;
            google.maps.event.trigger($scope.karte,'resize');
        });

        var onMarkerClick = function() {
            console.log("onMarkerClick", this);
            $scope.getDetail(this.data);
        };


        $scope.getDetail = function(id) {

            showDetail(id);
            showServices(id);
            showNebenbetriebe(id);

            $('#nav-detail').click();
            $('#nav-detail').parent().removeClass("hidden");
        };

        var showDetail = function(id) {

            var url = queryService.getDetailQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                var data = response.data.results.bindings[0];
                var y = data.y.value.replace('.','');
                var x = data.x.value.replace('.','');
                data.lat = geoService.CHtoWGSlat(y, x);
                data.lng = geoService.CHtoWGSlng(y, x);

                NgMap.getMap('map').then(function(map) {
                    var center = {lat: data.lat, lng: data.lng};
                    map.setCenter(center);
                    $scope.map = map;

                    new google.maps.Marker({
                        map: $scope.map,
                        position: {lat: data.lat, lng: data.lng},
                        title: data.name.value
                    });
                });

                $scope.detail = data;
            });

        };

        var showServices = function(id) {

            var url = queryService.getServiceQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                $scope.services = response.data.results.bindings;
            });

        };

        var showNebenbetriebe = function(id) {

            var url = queryService.getNebenbetriebeQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                $scope.nebenbetriebe = response.data.results.bindings;
            });

        };

        $scope.getServiceDetail = function(id) {

            showServiceDetail(id);

            $('#nav-service').click();
            $('#nav-service').parent().removeClass("hidden");
        };

        var showServiceDetail = function(id) {
            var url = queryService.getServiceDetailQueryUrl(id);
            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                $scope.service = response.data.results.bindings[0];
            });
        };

        $scope.getNebenbetriebDetail = function(id) {

            showNebenbetriebDetail(id);

            $('#nav-nebenbetrieb').click();
            $('#nav-nebenbetrieb').parent().removeClass("hidden");
        };

        var showNebenbetriebDetail = function(id) {
            var url = queryService.getNebenbetriebDetailQueryUrl(id);

            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                $scope.nebenbetrieb = response.data.results.bindings[0];
            });
        };

        $scope.loadAll = function(){
            console.log("Started loading All");
            $scope.loadAllLoading = true;

            var url = queryService.getLoadAllData();

            $http({
                method: 'Get',
                url: url
            }).then(function successCallback(response) {
                var data = response.data.results.bindings;
                data.forEach(function(element, index, array) {
                    var y = element.y.value.replace('.','');
                    var x = element.x.value.replace('.','');
                    element.lat = geoService.CHtoWGSlat(y, x);
                    element.lng = geoService.CHtoWGSlng(y, x);
                    var latLng = new google.maps.LatLng(element.lat, element.lng);
                    var marker = new google.maps.Marker({position:latLng, title: element.name.value, data: element.id.value});
                    marker.addListener('click', onMarkerClick);
                    $scope.dynMarkers.push(marker);
                    $scope.data.push(element);
                });
                $scope.markerClusterer = new MarkerClusterer($scope.karte, $scope.dynMarkers, {});

                $scope.allLoaded = true;
                console.log("Finished loading All");
            });
        };

        $scope.setKarte = function() {
            google.maps.event.trigger($scope.karte, 'resize');
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
                    prefix gont: <https://gont.ch/>\
                    prefix transport: <http://schema.transport.swiss/>";

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
                        gont:lv03_x ?x;\
                        gont:lv03_y ?y;\
                        OPTIONAL {?subject schema:alternateName ?alternateName;}\
                    }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getShowcaseData: function() {
                var query = prefix + "\
                    SELECT ?id ?name ?x ?y\
                    WHERE {\
                        ?subject a schema:CivicStructure;\
                        rdfs:label ?name;\
                        gont:id ?id;\
                        gont:lv03_y ?y;\
                        gont:lv03_x ?x;\
                    }\
                    LIMIT 10000";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getServiceQueryUrl: function(id) {
                var query = prefix + "\
                    SELECT ?id ?station ?service ?provider\
                    WHERE {\
                        ?s a schema:Service;\
                        gont:didok <http://linked.transport.swiss/didok/"+ id +">;\
                        gont:id ?id;\
                        transport:stationName ?station;\
                        schema:serviceType ?service;\
                        schema:provider ?provider;\
                    }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getNebenbetriebeQueryUrl: function(id) {
                var query = prefix + "\
                    SELECT ?id ?station ?name\
                    WHERE {\
                        ?s a schema:LocalBusiness;\
                        gont:didok <http://linked.transport.swiss/didok/"+ id +">;\
                        gont:id ?id;\
                        transport:stationName ?station;\
                        schema:name ?name;\
                    }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getServiceDetailQueryUrl: function(id) {
                var query = prefix + "\
                SELECT *\
                WHERE {\
                    ?subject a schema:Service;\
                    gont:id " + id + ";\
                    gont:id ?id;\
                    transport:stationName ?stationName;\
                    schema:serviceType ?service;\
                    schema:provider ?provider;\
                    OPTIONAL { ?subject transport:periodFrom ?periodFrom; }\
                    OPTIONAL { ?subject transport:periodTo ?periodTo; }\
                    OPTIONAL { ?subject transport:openingPeriod ?openingPeriod; }\
                    OPTIONAL { ?subject transport:Mo ?mo; }\
                    OPTIONAL { ?subject transport:Tu ?di; }\
                    OPTIONAL { ?subject transport:We ?mi; }\
                    OPTIONAL { ?subject transport:Th ?do; }\
                    OPTIONAL { ?subject transport:Fr ?fr; }\
                    OPTIONAL { ?subject transport:Sa ?sa; }\
                    OPTIONAL { ?subject transport:Su ?so; }\
                }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getNebenbetriebDetailQueryUrl: function(id) {
                var query = prefix + "\
                    SELECT *\
                    WHERE {\
                        ?subject a schema:LocalBusiness;\
                        gont:id " + id + ";\
                        gont:id ?id;\
                        transport:stationName ?stationName;\
                        schema:name ?name;\
                        OPTIONAL { ?subject schema:openingHours ?openingHours; }\
                        OPTIONAL { ?subject rdfs:comment ?comment; }\
                    }";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            },

            getLoadAllData: function() {
                var query = prefix + "\
                    SELECT ?id ?name ?x ?y\
                    WHERE {\
                        ?subject a schema:CivicStructure;\
                        rdfs:label ?name;\
                        gont:id ?id;\
                        gont:lv03_y ?y;\
                        gont:lv03_x ?x;\
                    }\
                    OFFSET 10000";

                var queryUrl = getEncodedQueryUrl(query);
                return queryUrl;
            }

        };

    })

    .factory('geoService', function($http) {

        // The MIT License (MIT)
        //
        // Copyright (c) 2014 Federal Office of Topography swisstopo, Wabern, CH
        //
        // Permission is hereby granted, free of charge, to any person obtaining a copy
        //  of this software and associated documentation files (the "Software"), to deal
        //  in the Software without restriction, including without limitation the rights
        //  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        //  copies of the Software, and to permit persons to whom the Software is
        //  furnished to do so, subject to the following conditions:
        //
        // The above copyright notice and this permission notice shall be included in
        //  all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        //  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        //  THE SOFTWARE.
        //

        // Source: http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/projections.html (see PDFs under "Documentation")
        // Updated 9 dec 2014
        // Please validate your results with NAVREF on-line service: http://www.swisstopo.admin.ch/internet/swisstopo/en/home/apps/calc/navref.html (difference ~ 1-2m)

        return {

            // Convert WGS lat/long (° dec) to CH y
            WGStoCHy: function(lat, lng) {

                // Convert decimal degrees to sexagesimal seconds
                lat = DECtoSEX(lat);
                lng = DECtoSEX(lng);

                // Auxiliary values (% Bern)
                var lat_aux = (lat - 169028.66)/10000;
                var lng_aux = (lng - 26782.5)/10000;

                // Process Y
                y = 600072.37
                    + 211455.93 * lng_aux
                    -  10938.51 * lng_aux * lat_aux
                    -      0.36 * lng_aux * Math.pow(lat_aux,2)
                    -     44.54 * Math.pow(lng_aux,3);

                return y;
            },

            // Convert WGS lat/long (° dec) to CH x
            WGStoCHx: function(lat, lng) {

                // Convert decimal degrees to sexagesimal seconds
                lat = DECtoSEX(lat);
                lng = DECtoSEX(lng);

                // Auxiliary values (% Bern)
                var lat_aux = (lat - 169028.66)/10000;
                var lng_aux = (lng - 26782.5)/10000;

                // Process X
                x = 200147.07
                    + 308807.95 * lat_aux
                    +   3745.25 * Math.pow(lng_aux,2)
                    +     76.63 * Math.pow(lat_aux,2)
                    -    194.56 * Math.pow(lng_aux,2) * lat_aux
                    +    119.79 * Math.pow(lat_aux,3);

                return x;

            },

            // Convert CH y/x to WGS lat
            CHtoWGSlat: function(y, x) {

                // Converts military to civil and  to unit = 1000km
                // Auxiliary values (% Bern)
                var y_aux = (y - 600000)/1000000;
                var x_aux = (x - 200000)/1000000;

                // Process lat
                lat = 16.9023892
                    +  3.238272 * x_aux
                    -  0.270978 * Math.pow(y_aux,2)
                    -  0.002528 * Math.pow(x_aux,2)
                    -  0.0447   * Math.pow(y_aux,2) * x_aux
                    -  0.0140   * Math.pow(x_aux,3);

                // Unit 10000" to 1 " and converts seconds to degrees (dec)
                lat = lat * 100/36;

                return lat;

            },

            // Convert CH y/x to WGS long
            CHtoWGSlng: function(y, x) {

                // Converts military to civil and  to unit = 1000km
                // Auxiliary values (% Bern)
                var y_aux = (y - 600000)/1000000;
                var x_aux = (x - 200000)/1000000;

                // Process long
                lng = 2.6779094
                    + 4.728982 * y_aux
                    + 0.791484 * y_aux * x_aux
                    + 0.1306   * y_aux * Math.pow(x_aux,2)
                    - 0.0436   * Math.pow(y_aux,3);

                // Unit 10000" to 1 " and converts seconds to degrees (dec)
                lng = lng * 100/36;

                return lng;

            },

            // Convert angle in decimal degrees to sexagesimal seconds
            DECtoSEX: function(angle) {

                // Extract DMS
                var deg = parseInt(angle);
                var min = parseInt((angle-deg)*60);
                var sec = (((angle-deg)*60)-min)*60;

                // Result sexagesimal seconds
                return sec + min*60.0 + deg*3600.0;

            }

        }
    })
;