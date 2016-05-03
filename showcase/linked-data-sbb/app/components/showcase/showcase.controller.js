/**
 * Created by UE61582 on 25.04.2016.
 */

angular.module('showcase', ['ngResource', 'uiGmapgoogle-maps'])

    .controller('ShowcaseController', function ($scope, $http, queryService, geoService) {

        $('#showcaseNav a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        $scope.limit = 100;
        $scope.begin = 0;

        $scope.increaseLimit = function() {
          $scope.limit += 50;
        };

        var url = queryService.getShowcaseData();

        $http({
            method: 'Get',
            url: url
        }).then(function successCallback(response) {
            var data = response.data.results.bindings;
            data.forEach(function logArrayElements(element, index, array) {
                var y = element.y.value.replace('.','');
                var x = element.x.value.replace('.','');
                element.lat = geoService.CHtoWGSlat(y, x);
                element.lng = geoService.CHtoWGSlng(y, x);
            });
            $scope.data = data;
        });

        $scope.setKarte = function() {
            $scope.karte = { center: { latitude: 46.875213396722685, longitude: 8.29742431640625}, zoom: 8 };
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

                $scope.marker = {
                    id: data.id.value,
                    coords: {
                        latitude: data.lat,
                        longitude: data.lng
                    }
                };

                $scope.detail = data;

                $scope.map = { center: { latitude: data.lat, longitude: data.lng}, zoom: 13 };
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
        };

        $scope.getNebenbetriebDetail = function(id) {

            showNebenbetriebDetail(id);

            $('#nav-nebenbetrieb').click();
            $('#nav-nebenbetrieb').parent().removeClass("hidden");
        };

        var showNebenbetriebDetail = function(id) {
            var url = queryService.getNebenbetriebDetailQueryUrl(id);
        };

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

            getNebenbetriebDetailQueryUrl: function(id) {
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