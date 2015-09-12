
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

        // graph and nodes
        var graph = {};
        var nodes = [];


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
                $scope.errorMsg = "Information Required";
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
                $scope.errorMsg = "Invalid Information";
            }

            return found;
        }


        function validateUnit(unit) {
            var found = false;
            if (unit == 0) {
                $scope.errorMsg = "Information Required";
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
                $scope.errorMsg = "Invalid Information";
            }

            return found;
        }

        function validateTerm(term) {
            var found = false;
            if (term == null || term == "") {
                $scope.errorMsg = "Information Required";
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
                $scope.errorMsg = "Invalid Information";
            }

            return found;
        }

        function validateAllFields(fromCity, toCity, unitMenuId, termMenuId) {
            $scope.validationPassed = true;
            $scope.errorMsg = "";

            if (!validateCity(fromCity)) {
                console.log("fromCity validation fails");
                $scope.validationPassed = false;

            } else if(!validateCity(toCity)) {
                console.log("toCity validation fails");
                $scope.validationPassed = false;

            } else if (fromCity == toCity) {
                console.log("toCity and fromCiy same. validation fails");
                $scope.validationPassed = false;
                $scope.errorMsg = "Invalid Information. Source and destination same.";

            } else if (!validateUnit(unitMenuId)) {
                console.log("unitMenuId validation fails");
                $scope.validationPassed = false;

            } else if (!validateTerm(termMenuId)) {
                console.log("termMenuId validation fails");
                $scope.validationPassed = false;

            }
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
            graph = generateGraph($scope.fromCity, $scope.toCity);
            var allFullPaths = graph.getAllFullPaths();
            var allRoutePathJson = [];

            if (allFullPaths.length > 0) {
                $scope.hasSearchResults = true;
            } else {
                return;
            }

            for (var j = 0; j < allFullPaths.length; j++) {
                var fullPath = allFullPaths[j];
                var routeSummary = $scope.fromCity;
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

        }



        function generateGraph(fromCity, toCity) {

            graph = new Graph();
            nodes = [];
            nodes[0] = graph.addNode("Stockholm", "STO", "SE", 59.337525, 18.066510);
            nodes[1] = graph.addNode("Orlando", "ORL", "USA", 28.537608, -81.382770);
            nodes[2] = graph.addNode("Gothenburg", "GOT", "SE", 57.708805, 11.977193);
            nodes[3] = graph.addNode("Ft. Lauderdale", "FLT", "USA", 26.120307, -80.137957);
            nodes[4] = graph.addNode("Savannah", "SVH", "USA", 32.082726, -81.098066);
            nodes[5] = graph.addNode("Rotterdam", "ROT", "NL", 51.924691, 4.480107);


            nodes[0].addEdge(nodes[2], 430, "Road transport", 1, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
            nodes[2].addEdge(nodes[3], 1623, "Ocean freight low steaming", 22, "CIF", 40, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
            nodes[3].addEdge(nodes[1], 600, "Road transport", 1, "CIF", 40, "Every day departure", " Neutralized CO2 emissions")

            //nodes[0].addEdge(nodes[2], 430, "Road", 1, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
            nodes[2].addEdge(nodes[4], 1765, "Ocean freight low steaming", 23, "CIF", 40, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
            nodes[4].addEdge(nodes[1], 600, "Road transport", 1, "CIF", 40, "Everyday departure", " Neutralized CO2 emissions");

            nodes[0].addEdge(nodes[5], 1430, "Road transport ", 3, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
            nodes[5].addEdge(nodes[3], 1623, "Ocean freight low steaming", 18, "CIF", 40, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
            //nodes[3].addEdge(nodes[1], 600, "Road", 1, "CIF", 40, "Every day departure", " Neutralized CO2 emissions")

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

            var edge = new PathEdge(graph.start, 0);
            var routeVisited = [];
            routeVisited.push(edge);

            // call graph search algorithm and populate results
            dfsRecursive(graph, routeVisited);

            return graph;
        }


    }

);