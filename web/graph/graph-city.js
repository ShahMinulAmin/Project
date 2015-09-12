/**
 * Created by SAJIB on 9/11/2015.
 */


// Graph class
function Graph() {
    this.nodes = [];
    this.start = {};
    this.end = {};
    this.dfsCounter = 0;
    this.allFullPaths = [];
    this.addNode = addNode;
    this.getAllFullPaths = getAllFullPaths;

    function addNode(Name, shortName, country, latitude, longitude) {
        var temp = new CityNode(Name, shortName, country, latitude, longitude);
        this.nodes.push(temp);
        return temp;
    }

    function getAllFullPaths() {
        return this.allFullPaths;
    }
}


// Node class represents a city
function CityNode(Name, shortName, country, latitude, longitude) {
    this.name = Name;
    this.shortName = shortName;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
    this.adjList = [];

    this.addEdge = addEdge;
    this.getAdjList = getAdjList;

    function addEdge(neighbour, cost, type, days, term, container, departureSchedule, environSafety) {
        var edge1 = new PathEdge(neighbour, cost, type, days, term, container, departureSchedule, environSafety);
        this.adjList.push(edge1);

        // TO make bi-directional
        var edge2 = new PathEdge(this, cost, type, days, term, container, departureSchedule, environSafety);
        neighbour.adjList.push(edge2);
    }

    function getAdjList() {
        return this.adjList;
    }

}

// Edge class represents a path between two cities
function PathEdge(destination, cost, type, days, term, container, departureSchedule, environSafety) {
    this.destination = destination;
    this.cost = cost;
    this.type = type;
    this.days = days;
    this.term = term;
    this.container = container;
    this.departureSchedule = departureSchedule;
    this.environSafety = environSafety;
}



function dfsRecursive(graph, routeVisited) {
    graph.dfsCounter++;
    //console.log("DFS: " + graph.dfsCounter);

    var length = routeVisited.length;
    if (length < 1) {
        return;
    }

    // get last edge from visited route
    var lastEdge = routeVisited[length - 1];

    // get adjacent nodes of last node
    var adjList = lastEdge.destination.getAdjList();

    // examine adjacent nodes.
    // if end node found, store it as a path
    for (var i = 0; i < adjList.length; i++) {
        var edge = adjList[i];
        if(edge.destination.name == graph.end.name) {
            routeVisited.push(edge);

            // store the full path
            var tempArray = routeVisited.slice();
            graph.allFullPaths.push(tempArray);

            routeVisited.pop();
            break;
        }
    }

    // the main DFS algorithm is here
    // in depth-first, recursion needs to come after visiting adjacent nodes
    for (var i = 0; i < adjList.length; i++) {
        var edge = adjList[i];
        if(containsNode(routeVisited, edge.destination) || (edge.destination.name == graph.end.name)) {
            continue;
        }
        routeVisited.push(edge);
        dfsRecursive(graph, routeVisited);
        routeVisited.pop();
    }

}


function containsNode(routeVisited, node) {
    var found = false;
    for (var i = 0; i < routeVisited.length; i++) {
        var u = routeVisited[i].destination;
        if (u.name == node.name) {
            found = true;
            break;
        }
    }
    return found;
}


function printAllPaths(graph) {
    var allFullPaths = graph.getAllFullPaths();
    for (var i = 0; i < allFullPaths.length; i++) {
        printPath(allFullPaths[i]);
    }
}


function printPath(routeVisited) {
    var totalCost = 0;
    var totalDays = 0;
    var resultStr = "Full Path: ";
    resultStr += routeVisited[0].destination.name;
    for (var i = 1; i < routeVisited.length; i++) {
        var node = routeVisited[i].destination;
        totalCost += routeVisited[i].cost;
        totalDays += routeVisited[i].days;

        resultStr += " (" + routeVisited[i].type + ")";
        resultStr += " (" + routeVisited[i].cost + " $)";
        resultStr += " (" + routeVisited[i].days + " days)";
        resultStr += " -> ";
        resultStr += node.name;
    }
    resultStr += " . [Total cost: " + totalCost + " $]";
    resultStr += ". [Total duration: " + totalDays + " days].";
    console.log(resultStr);
}


function test() {
    var graph = new Graph();

    var nodes = [];
    nodes[0] = graph.addNode("Stockholm", "STO", "SE", 59.337525, 18.066510);
    nodes[1] = graph.addNode("Orlando", "ORL", "USA", 28.537608, -81.382770);
    nodes[2] = graph.addNode("Gothenburg", "GOT", "SE", 57.708805, 11.977193);
    nodes[3] = graph.addNode("Ft. Lauderdale", "FLT", "USA", 26.120307, -80.137957);
    nodes[4] = graph.addNode("Savannah", "SVH", "USA", 32.082726, -81.098066);
    nodes[5] = graph.addNode("Rotterdam", "ROT", "NL", 51.924691, 4.480107);


    nodes[0].addEdge(nodes[2], 430, "Road", 1, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
    nodes[2].addEdge(nodes[3], 1623, "Ocean", 22, "CIF", 40, " Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
    nodes[3].addEdge(nodes[1], 600, "Road", 1, "CIF", 40, "Every day departure", " Neutralized CO2 emissions")

    //nodes[0].addEdge(nodes[2], 430, "Road", 1, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
    nodes[2].addEdge(nodes[4], 1765, "Ocean", 23, "CIF", 40, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
    nodes[4].addEdge(nodes[1], 600, "Road", 1, "CIF", 40, "Everyday departure", " Neutralized CO2 emissions");

    nodes[0].addEdge(nodes[5], 1430, "Road", 3, "CIF", 40, "Every weekday departure", " Neutralized CO2 emissions");
    nodes[5].addEdge(nodes[3], 1623, "Ocean", 18, "CIF", 40, "Departure Mondays, Wednesdays and Fridays", " Neutralized CO2 emissions");
    //nodes[3].addEdge(nodes[1], 600, "Road", 1, "CIF", 40, "Every day departure", " Neutralized CO2 emissions")

    graph.start = nodes[0];
    graph.end = nodes[1];
    var edge = new PathEdge(graph.start, 0);
    var routeVisited = [];
    routeVisited.push(edge);

    dfsRecursive(graph, routeVisited);

    printAllPaths(graph);

}