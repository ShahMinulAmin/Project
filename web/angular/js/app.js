
var TEModule = angular.module('TEModule', ['te.directives', 'te.filters', 'ngCookies']);

TEModule.controller('FreightController',

    function FreightController($scope, $cookieStore) {

        /** User and sign-in related properties */
        $scope.loggedIn = false;
        $scope.userId = "";
        $scope.userPass = "";
        $scope.signinErrorMsg = "";

        /** button menu related properties */
        $scope.seachOptions = false;

        /** search fields related properties */
        $scope.fromCity = "";
        $scope.toCity = "";
        $scope.selectedUnitMenuId = 0;
        $scope.selectedTermMenuId = "";
        $scope.hasSearchResults = false;
        $scope.allRoutePaths = [];
        $scope.validationPassed = true;
        $scope.errorMsg = "";
        $scope.validationErrorFields = [];

        // graph and nodes
        var graph = {};
        var nodes = [];

        $scope.map = {};
        //$scope.markers = [];


        /** version related function */

        $scope.getVersion = function() {
            var version = new Version(1, 0, 1);
            var versionStr = version.major + "." + version.minor + "." + version.buiild;
            return versionStr;
        }

        /** User and sign-in related functions */

        $scope.isSignedIn = function() {
            var usrId = $cookieStore.get('userId');
            var userPass = $cookieStore.get('userPass');
            if(usrId=='sajib' || usrId=='test') {
                $scope.loggedIn = true;
                $scope.userId = usrId;
                $scope.userPass = userPass;
            } else {
                $scope.loggedIn = false;
            }

            return $scope.loggedIn;
        }

        $scope.signInDialog = function() {
            if(!$scope.loggedIn) {
                $("#dialog").dialog({
                    close: function(event, ui) {
                        // do whatever you need on close
                    }
                });
            }
        }

        function isAuthorizedUser() {
            if(($scope.userId == 'test' && $scope.userPass == 'test')
                ||($scope.userId == 'sajib' && $scope.userPass == 'sajib')) {
                return true;
            } else {
                $scope.signinErrorMsg = "You entered wrong user id or password."
                return false;
            }
        }

        $scope.checkUserCredential = function() {
            console.log($scope.userId);
            if(isAuthorizedUser()) {
                $("#dialog").dialog( "close" );
                $scope.loggedIn = true;
                $cookieStore.put('userId', $scope.userId);
                $cookieStore.put('userPass', $scope.userPass);
            } else {
                $scope.loggedIn = false;
            }
        }



        /** button menu related functions */

        $scope.showSearchOptions = function() {
            return  $scope.seachOptions;
        }

        $scope.selectDashboard = function() {
            $scope.seachOptions = false;
            $scope.hasSearchResults = false;
            $("#dashboard").removeClass('btn btn-primary');
            $("#dashboard").addClass('btn btn-default active');

            $("#frieghtSearch").removeClass('btn btn-default active');
            $("#frieghtSearch").addClass('btn btn-primary');

            $("#spotRequest").removeClass('btn btn-default active');
            $("#spotRequest").addClass('btn btn-primary');

            $("#bookings").removeClass('btn btn-default active');
            $("#bookings").addClass('btn btn-primary');
        }

        $scope.selectFreightSeach = function() {
            $scope.seachOptions = true;
            $scope.hasSearchResults = false;

            // initialize all fields
            $scope.fromCity = $scope.toCity = "";
            $scope.selectedUnitMenuId = $scope.selectedTermMenuId = 0;
            //$("#unitId").val("");
            //$("#termId").val("");


            $("#dashboard").removeClass('btn btn-default active');
            $("#dashboard").addClass('btn btn-primary');

            $("#frieghtSearch").removeClass('btn btn-primary');
            $("#frieghtSearch").addClass('btn btn-default active');

            $("#spotRequest").removeClass('btn btn-default active');
            $("#spotRequest").addClass('btn btn-primary');

            $("#bookings").removeClass('btn btn-default active');
            $("#bookings").addClass('btn btn-primary');
        }

        $scope.selectSpotRequest = function() {
            $scope.seachOptions = false;
            $scope.hasSearchResults = false;
            $("#dashboard").removeClass('btn btn-default active');
            $("#dashboard").addClass('btn btn-primary');

            $("#frieghtSearch").removeClass('btn btn-default active');
            $("#frieghtSearch").addClass('btn btn-primary');

            $("#spotRequest").removeClass('btn btn-primary');
            $("#spotRequest").addClass('btn btn-default active');

            $("#bookings").removeClass('btn btn-default active');
            $("#bookings").addClass('btn btn-primary');
        }

        $scope.selectBookings = function() {
            $scope.seachOptions = false;
            $scope.hasSearchResults = false;
            $("#dashboard").removeClass('btn btn-default active');
            $("#dashboard").addClass('btn btn-primary');

            $("#frieghtSearch").removeClass('btn btn-default active');
            $("#frieghtSearch").addClass('btn btn-primary');

            $("#spotRequest").removeClass('btn btn-default active');
            $("#spotRequest").addClass('btn btn-primary');

            $("#bookings").removeClass('btn btn-primary');
            $("#bookings").addClass('btn btn-default active');
        }




        /** validation related functions */

        function validateCity(city) {
            var found = false;
            if (city == null || city == "") {
                $scope.errorMsg = "Information Required. Please enter value in following fields: ";
                return found;
            }
            var availableCities = [
                "Stockholm",
                "Orlando",
                "Gothenburg",
                "Ft. Lauderdale",
                "Savannah",
                "Rotterdam"
            ];
            for (var i = 0; i < availableCities.length; i++) {
                if (availableCities[i] == city) {
                    found = true;
                }
            }

            if (!found) {
                $scope.errorMsg = "Invalid Information. Please enter value in following fields: ";
            }

            return found;
        }


        function validateUnit(unit) {
            var found = false;
            if (unit == 0) {
                $scope.errorMsg = "Information Required. Please enter value in following fields: ";
                return found;
            }
            var availableUnits = [
                40, 50, 60, 70
            ];
            var found = false;

            for (var i = 0; i < availableUnits.length; i++) {
                if (availableUnits[i] == unit) {
                    found = true;
                }
            }

            if (!found) {
                $scope.errorMsg = "Invalid Information. Please enter value in following fields: ";
            }

            return found;
        }

        function validateTerm(term) {
            var found = false;
            if (term == null || term == "") {
                $scope.errorMsg = "Information Required. Please enter value in following fields: ";
                return found;
            }
            var availableTerms = [
                "CIF",
                "CIP",
                "CFR",
                "DES"
            ];
            for (var i = 0; i < availableTerms.length; i++) {
                if (availableTerms[i] == term) {
                    found = true;
                }
            }

            if (!found) {
                $scope.errorMsg = "Invalid Information. Please enter value in following fields: ";
            }

            return found;
        }

        function validateAllFields(fromCity, toCity, unitMenuId, termMenuId) {
            $scope.validationPassed = true;
            $scope.errorMsg = "";
            var invalidFields = [];

            if (!validateCity(fromCity)) {
                console.log("fromCity validation fails");
                $scope.validationPassed = false;
                invalidFields.push(
                    {fieldName: "From"}
                );
            }
            if(!validateCity(toCity)) {
                console.log("toCity validation fails");
                $scope.validationPassed = false;
                invalidFields.push(
                    {fieldName: "To"}
                );

            }
            if (!validateUnit(unitMenuId)) {
                console.log("unitMenuId validation fails");
                $scope.validationPassed = false;
                invalidFields.push(
                    {fieldName: "Unit"}
                );

            }
            if (!validateTerm(termMenuId)) {
                console.log("termMenuId validation fails");
                $scope.validationPassed = false;
                invalidFields.push(
                    {fieldName: "Term"}
                );
            }

            if (validateCity(fromCity) && validateCity(toCity) && fromCity == toCity) {
                console.log("toCity and fromCiy same. validation fails");
                $scope.validationPassed = false;
                $scope.errorMsg = "Invalid Information. Source and destination same.";

            }

            $scope.validationErrorFields = invalidFields;
        }

        $scope.isValidationPassed = function() {
            return $scope.validationPassed;
        }


        /** search related functions */

        $scope.isShowSearchResults = function() {
            return $scope.hasSearchResults;
        }

        $scope.getSearchResults = function() {

            console.log("Seacrh button clicked");

            // initialize data before search
            $scope.allRoutePaths = [];
            $scope.validationErrorFields = [];
            graph = {};
            nodes = [];

            $scope.fromCity = $("#tempFromCity").val();
            $scope.toCity = $("#tempToCity").val();

            console.log('$scope.fromCity: ' + $scope.fromCity);
            console.log(' $scope.toCity: ' +  $scope.toCity);
            console.log('$scope.selectedUnitMenuId: ' + $scope.selectedUnitMenuId);
            console.log('$scope.selectedTermMenuId: ' + $scope.selectedTermMenuId);

            // validate all input fields
            validateAllFields($scope.fromCity, $scope.toCity, $scope.selectedUnitMenuId, $scope.selectedTermMenuId);
            if(!$scope.validationPassed) {
                return;
            }

            // generate the graph of cities and populate results
            graph = generateGraph($scope.fromCity, $scope.toCity, $scope.selectedTermMenuId, $scope.selectedUnitMenuId);
            var allFullPaths = graph.getAllFullPaths();
            var filteredAllFullPaths = [];

            // Filter all full routes. Exclude routes which have more than one ocean paths
            for (var j = 0; j < allFullPaths.length; j++) {
                var fullPath = allFullPaths[j];
                var oceanCount = 0;
                // find ocean path count
                for (var i = 1; i < fullPath.length; i++) {
                    if (fullPath[i].type == "Ocean freight low steaming") {
                        oceanCount++;
                    }
                }
                if (oceanCount > 1) {
                    continue;
                }
                filteredAllFullPaths.push(fullPath);
            }


            if (filteredAllFullPaths.length > 0) {
                $scope.hasSearchResults = true;
            } else {
                return;
            }

            var allRoutePathJson = [];
            for (var j = 0; j < filteredAllFullPaths.length; j++) {
                var fullPath = filteredAllFullPaths[j];
                // handle first node of source city separately
                var routeSummary = fullPath[0].destination.name;
                var totalCost = 0;
                var totalDays = 0;
                var fullPathJson = [];
                for (var i = 1; i < fullPath.length; i++) {
                    var pathShortName = "";
                    pathShortName += fullPath[i-1].destination.shortName;
                    pathShortName += "-";
                    pathShortName += fullPath[i].destination.shortName;
                    routeSummary  += "-" + fullPath[i].destination.name;
                    totalCost += fullPath[i].cost;
                    totalDays += fullPath[i].days;

                    if(i > 1) {
                        fullPathJson.push({
                            destination: fullPath[i].destination.name,  cost: fullPath[i].cost, transportType: fullPath[i].type,
                            pathShortName: pathShortName,
                            numDays: fullPath[i].days, term:fullPath[i].term, container:fullPath[i].container,
                            departureSchedule: fullPath[i].departureSchedule, environSafety: fullPath[i].environSafety,
                            showDash: true
                        });
                    } else {
                        fullPathJson.push({
                            destination: fullPath[i].destination.name,  cost: fullPath[i].cost, transportType: fullPath[i].type,
                            pathShortName: pathShortName,
                            numDays: fullPath[i].days, term:fullPath[i].term, container:fullPath[i].container,
                            departureSchedule: fullPath[i].departureSchedule, environSafety: fullPath[i].environSafety,
                            showDash: false
                        });
                    }
                }

                allRoutePathJson.push({
                    optionNo: (j+1), term: fullPath[1].term, routeSummary: routeSummary, fullPathList: fullPathJson,
                    totalCost: totalCost, totalDays: totalDays
                });
            }
            console.log(allRoutePathJson);
            $scope.allRoutePaths = allRoutePathJson;


            /*** show search result in google map */
            showGoogleMap(filteredAllFullPaths);

        }



        function showGoogleMap(filteredAllFullPaths) {

            var x = new google.maps.LatLng(52.395715, 4.888916);
            var mapProp = {
                center: x,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

            // outer loop
            for (var j = 0; j < filteredAllFullPaths.length; j++) {
                var fullPath = filteredAllFullPaths[j];

                // polyline nodes of a route path
                var routePolylineNodes = [];

                // handle first node of source city separately
                var location = new google.maps.LatLng(fullPath[0].destination.latitude, fullPath[0].destination.longitude);
                console.log('location latitude: ' + location.lat());
                console.log('location longitude: ' + location.lng());

                routePolylineNodes.push(location);
                var marker = {};
                var infowindow = {};


                // add as source marker
                marker = new google.maps.Marker({
                    map: $scope.map,
                    position: location,
                    animation: google.maps.Animation.DROP,
                    title: fullPath[0].destination.name,
                    icon: '../images/mapMarkIcon.png'
                });
                infowindow = new google.maps.InfoWindow({
                    content: fullPath[0].destination.name + ', ' + fullPath[0].destination.country
                });
                google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open($scope.map, marker);
                    };
                })(marker, content, infowindow));


                // add transport type to source node
                if (fullPath[1].type == "Road transport") {
                    marker = new google.maps.Marker({
                        map: $scope.map,
                        position: location,
                        animation: google.maps.Animation.DROP,
                        title: fullPath[0].destination.name,
                        icon: '../images/truckIcon.png'
                    });
                } else if(fullPath[1].type == "Ocean freight low steaming")   {
                    marker = new google.maps.Marker({
                        map: $scope.map,
                        position: location,
                        animation: google.maps.Animation.DROP,
                        title: fullPath[0].destination.name,
                        icon: '../images/cargoShip.png'
                    });
                }
                infowindow = new google.maps.InfoWindow({
                    content: fullPath[0].destination.name + ', ' + fullPath[0].destination.country
                });
                google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                    return function () {
                        infowindow.setContent(content);
                        infowindow.open($scope.map, marker);
                    };
                })(marker, content, infowindow));

                var routeSummary = "OPTION " + (j+1) + " ";
                routeSummary += fullPath[0].destination.shortName;
                var totalCost = 0;
                var totalDays = 0;

                // inner loop
                for (var i = 1; i < fullPath.length; i++) {
                    location = new google.maps.LatLng(fullPath[i].destination.latitude, fullPath[i].destination.longitude);
                    console.log('location latitude: ' + location.lat());
                    console.log('location longitude: ' + location.lng());
                    routePolylineNodes.push(location);

                    routeSummary  += "-" + fullPath[i].destination.shortName;
                    totalCost += fullPath[i].cost;
                    totalDays += fullPath[i].days;

                    marker = {};
                    if (i == (fullPath.length-1)) {
                        // last node, add as destination marker
                        marker = new google.maps.Marker({
                            map: $scope.map,
                            position: location,
                            animation: google.maps.Animation.DROP,
                            title: fullPath[i].destination.name,
                            icon: '../images/mapMarkIcon.png'
                        });

                    } else if (fullPath[i+1].type == "Road transport") {
                        marker = new google.maps.Marker({
                            map: $scope.map,
                            position: location,
                            animation: google.maps.Animation.DROP,
                            title: fullPath[i].destination.name,
                            icon: '../images/truckIcon.png'
                        });
                    } else if (fullPath[i+1].type == "Ocean freight low steaming") {
                        marker = new google.maps.Marker({
                            map: $scope.map,
                            position: location,
                            animation: google.maps.Animation.DROP,
                            title: fullPath[i].destination.name,
                            icon: '../images/cargoShip.png'
                        });
                    }

                    infowindow = new google.maps.InfoWindow({
                        content: fullPath[i].destination.name + ', ' + fullPath[i].destination.country
                    });
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                        return function () {
                            infowindow.setContent(content);
                            infowindow.open($scope.map, marker);
                        };
                    })(marker, content, infowindow));

                } // end inner for loop

                // show poly line of a full route
                var routePolyline = new google.maps.Polyline({
                    path: routePolylineNodes,
                    strokeColor: "#70EF66",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    geodesic: true
                });
                routePolyline.setMap($scope.map);

                var midLocation = lineMidpoint(routePolylineNodes);
                console.log('midLocation: ' + midLocation);
                console.log(midLocation.lat);
                console.log(midLocation.lng);
                var midLocationLatLng = new google.maps.LatLng(midLocation.lat, midLocation.lng);
                var midLocMarker =  new google.maps.Marker({
                    map: $scope.map,
                    position: midLocationLatLng,
                    title: ""
                });

                var boxText = document.createElement("div");
                boxText.style.cssText = "border: 2px solid #2A89B2; background: #4E9BC6; padding: 5px;";
                boxText.innerHTML = routeSummary + " FROM " + totalCost + " EUR AND " + totalDays + " DAYS";
                var ibOptions = {
                    content: boxText
                    , boxStyle: {
                        border: "2px solid #2A89B2"
                        , background: "#4E9BC6"
                        , textAlign: "center"
                        , fontSize: "10pt"
                        , width: "400px"  // has to be set manually
                        , opacity: 1.0
                        , zIndex: -100
                    }
                    , disableAutoPan: true
                    , pixelOffset: new google.maps.Size(-200,0) // set manually
                    , position: midLocMarker.getPosition()
                    , closeBoxURL: ""
                    , pane: "floatPane"
                    , enableEventPropagation: true
                    , zIndex: -1
                };
                var ibLabel = new InfoBox(ibOptions);
                ibLabel.open($scope.map, midLocMarker);

                midLocMarker.setVisible(false);


            } // end outer for loop

        }


        //
        // Calculate the distance between two points
        //
        function distance(a, b) {
            var dx = a.lat() - b.lat();
            var dy = a.lng() - b.lng();
            return Math.sqrt(dx * dx + dy * dy);
        }

        //
        // Given a line between point1 and point2 return a point that
        // is distance away from point1
        //
        function lineInterpolate(point1, point2, distance) {
            var xabs = Math.abs(point1.lat() - point2.lat());
            var yabs = Math.abs(point1.lng() - point2.lng());
            var xdiff = point2.lat() - point1.lat();
            var ydiff = point2.lng() - point1.lng();

            var length = Math.sqrt((Math.pow(xabs, 2) + Math.pow(yabs, 2)));
            var steps = length / distance;
            var xstep = xdiff / steps;
            var ystep = ydiff / steps;

            return { lat: point1.lat() + xstep, lng: point1.lng() + ystep };
        }


        //
        // Return the point that is the midpoint for the line
        //
        function lineMidpoint(lineSegments) {
            //
            // Sum up the total distance of the line
            //
            var TotalDistance = 0;
            for (var i = 0; i < lineSegments.length - 1; i += 1) {
                TotalDistance += distance(lineSegments[i], lineSegments[i + 1]);
            }

            //
            // Find the middle segemnt of the line
            //
            var DistanceSoFar = 0;
            for (var i = 0; i < lineSegments.length - 1; i += 1) {
                //
                // If this linesegment puts us past the middle then this
                // is the segment in which the midpoint appears
                //
                if (DistanceSoFar + distance(lineSegments[i], lineSegments[i + 1]) > TotalDistance / 2) {
                    //
                    // Figure out how far to the midpoint
                    //
                    var DistanceToMidpoint = TotalDistance / 2 - DistanceSoFar;

                    //
                    // Given the start/end of a line and a distance return the point
                    // on the line the specified distance away
                    //
                    return lineInterpolate(lineSegments[i], lineSegments[i + 1], DistanceToMidpoint);
                }

                DistanceSoFar += distance(lineSegments[i], lineSegments[i + 1]);
            }

            //
            // Can happen when the line is of zero length... so just return the first segment
            //
            return lineSegments[0];
        }




        function generateGraph(fromCity, toCity, term, containerSize) {

            graph = new Graph();
            nodes = [];
            nodes[0] = graph.addNode("Stockholm", "STO", "SE", 59.337525, 18.066510);
            nodes[1] = graph.addNode("Orlando", "ORL", "USA", 28.537608, -81.382770);
            nodes[2] = graph.addNode("Gothenburg", "GOT", "SE", 57.708805, 11.977193);
            nodes[3] = graph.addNode("Ft. Lauderdale", "FLT", "USA", 26.120307, -80.137957);
            nodes[4] = graph.addNode("Savannah", "SVH", "USA", 32.082726, -81.098066);
            nodes[5] = graph.addNode("Rotterdam", "ROT", "NL", 51.924691, 4.480107);

            if (containerSize == 40) {
                nodes[0].addEdge(nodes[2], 430, "Road transport", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[3], 1623, "Ocean freight low steaming", 22, term, containerSize, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[3].addEdge(nodes[1], 600, "Road transport", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions")

                //nodes[0].addEdge(nodes[2], 430, "Road", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[4], 1765, "Ocean freight low steaming", 23, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[4].addEdge(nodes[1], 600, "Road transport", 1, term, containerSize, "Everyday departure", " Neutralized CO2 emissions");

                nodes[0].addEdge(nodes[5], 1430, "Road transport", 3, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[5].addEdge(nodes[3], 1623, "Ocean freight low steaming", 18, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                //nodes[3].addEdge(nodes[1], 600, "Road", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions");

            } else if (containerSize == 50) {
                nodes[0].addEdge(nodes[2], 430+10, "Road transport", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[3], 1623+10, "Ocean freight low steaming", 22, term, containerSize, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[3].addEdge(nodes[1], 600+10, "Road transport", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions")

                //nodes[0].addEdge(nodes[2], 430+10, "Road", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[4], 1765+10, "Ocean freight low steaming", 23, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[4].addEdge(nodes[1], 600+10, "Road transport", 1, term, containerSize, "Everyday departure", " Neutralized CO2 emissions");

                nodes[0].addEdge(nodes[5], 1430+10, "Road transport", 3, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[5].addEdge(nodes[3], 1623+10, "Ocean freight low steaming", 18, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                //nodes[3].addEdge(nodes[1], 600+10, "Road", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions");

            } else if (containerSize == 60) {
                nodes[0].addEdge(nodes[2], 430+20, "Road transport", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[3], 1623+20, "Ocean freight low steaming", 22, term, containerSize, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[3].addEdge(nodes[1], 600+20, "Road transport", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions")

                //nodes[0].addEdge(nodes[2], 430+20, "Road", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[4], 1765+20, "Ocean freight low steaming", 23, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[4].addEdge(nodes[1], 600+20, "Road transport", 1, term, containerSize, "Everyday departure", " Neutralized CO2 emissions");

                nodes[0].addEdge(nodes[5], 1430+20, "Road transport", 3, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[5].addEdge(nodes[3], 1623+20, "Ocean freight low steaming", 18, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                //nodes[3].addEdge(nodes[1], 600+20, "Road", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions");

            } else if (containerSize == 70) {
                nodes[0].addEdge(nodes[2], 430+30, "Road transport", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[3], 1623+30, "Ocean freight low steaming", 22, term, containerSize, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[3].addEdge(nodes[1], 600+30, "Road transport", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions")

                //nodes[0].addEdge(nodes[2], 430+30, "Road", 1, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[2].addEdge(nodes[4], 1765+30, "Ocean freight low steaming", 23, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                nodes[4].addEdge(nodes[1], 600+30, "Road transport", 1, term, containerSize, "Everyday departure", " Neutralized CO2 emissions");

                nodes[0].addEdge(nodes[5], 1430+30, "Road transport", 3, term, containerSize, "Every weekday departure", " Neutralized CO2 emissions");
                nodes[5].addEdge(nodes[3], 1623+30, "Ocean freight low steaming", 18, term, containerSize, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
                //nodes[3].addEdge(nodes[1], 600+30, "Road", 1, term, containerSize, "Every day departure", " Neutralized CO2 emissions");
            }


            // find start node
            var startNode = {};
            for (var i = 0; i < nodes.length; i++) {
                if(nodes[i].name == fromCity) {
                    startNode = nodes[i];
                    break;
                }
            }
            //console.log('startNode: ' + startNode.name);
            graph.start = startNode;

            var endNode = {};
            for (var i = 0; i < nodes.length; i++) {
                if(nodes[i].name == toCity) {
                    endNode = nodes[i];
                    break;
                }
            }
            //console.log('endNode: ' + endNode.name);
            graph.end = endNode;

            var edge = new PathEdge(graph.start, 0, "", 0, "", 0, "", "");
            var routeVisited = [];
            routeVisited.push(edge);

            // call graph search algorithm and populate results
            dfsRecursive(graph, routeVisited);

            return graph;
        }


    }

);