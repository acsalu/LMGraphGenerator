var map;

//index is the title of the marker, the content is the id to query parse.
var nodeArray;
// in order to get the marker and get lat and lng
var markers;
//save id, node1id, node2id, length
var edgeTable;


canSelectPin = false;
isFirstTime = true;
//the id(title) of the current selected Marker, equals -1 when no one is selected.
currentSelectedPin = -1;

infowindow = null;

defaultPinColor = "FE7569";
highlightPinColor = "FFFF46";

function initialize() {


    nodeArray = new Array();
    markers = new Array();
    edgeTable = new Array();

    var mapOptions = {
      center: new google.maps.LatLng(23.597, 121.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {

        if (infowindow) {
            infowindow.close();
        }
        infowindow = new google.maps.InfoWindow();

    	if(isFirstTime == true){
            placeMarkerWithTitleIndexString( event.latLng, nodeArray.length.toString() );
            createNode( event.latLng.lat(),event.latLng.lng() );
    	    isFirstTime = false;
    	}
    	else if (canSelectPin == true){
    	  
   	    if( currentSelectedPin != -1){
		//place marker
		createNode( event.latLng.lat(), event.latLng.lng() );
		//setTimeout(function(){
		placeMarkerWithTitleIndexString( event.latLng, nodeArray.length.toString() );
		//},1000);
    	    	
		//build edge
		var newEdge = {edgeId:edgeTable.length,  node1Id:currentSelectedPin, node2Id: nodeArray.length};
		console.log("newEdge = ");
		console.log(newEdge);
		edgeTable.push(newEdge);
		//draw the edge
		//save the length after the call back of parse.
		var dist = drawEdgeWithCurrentSelectedPinAndJustPlacedMarkerLatAndLng(event.latLng.lat(),event.latLng.lng() );
		//save the bearings after the call back of Parse.
		var bearings = calculateBearingWithCurrentMarkerAndPressedMarkerLatLng(event.latLng.lat(), event.latLng.lng() );
		//updateNodeWithEdgeId( edgeTable.length-1 );
	    }

    	}
    });
}


function placeMarkerWithTitleIndexString(location, markerId) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      icon: getPinIcon(defaultPinColor),
      title: markerId
    });

    console.log("marker with title :" + markerId + "placed ");
    //put the marker and also add onclick listener for it
    google.maps.event.addListener(marker, "click", function(event) {
	//if there's no one selected, it'll change color,
	//if there's some marker selcted and the pressed is the same one, change color.
	//if there's some marker selected, the pressed one is not the same one,  they'll generate a line between them.
	if(currentSelectedPin == -1){

		//assume that user won't try to make to pin highlighted at once.
		if( currentSelectedPin == parseInt(marker.title) ){
            	  console.log("marker pressed");
            	  var pinColor = "AAAAAA";
            	  marker.setIcon(getPinIcon(defaultPinColor));
	    	  currentSelectedPin = -1;
	    	  console.log( "there's no current seleceted pin now, so it's -1");
		}
		// current selected pin is not the clicked one (assume that it's -1 right now)
		else{
	    	  console.log("no marker was selected, but now yes XDD");
	    	  var pinColor = "AAAAAA";
	    	  marker.setIcon(getPinIcon(highlightPinColor));
	    	  currentSelectedPin = parseInt(marker.title);
		}

	}
	//some one is selected
	else{
		//if it's not the same one
		//draw line here.
		if( currentSelectedPin != parseInt( marker.title )){
			//build edge
                  	var newEdge = {edgeId:edgeTable.length,  node1Id:currentSelectedPin, node2Id: parseInt( marker.title )};
                  	console.log("newEdge = ");
                  	console.log(newEdge);
                  	edgeTable.push(newEdge);

			drawEdgeWithCurrentSelectedPinAndJustPlacedMarkerLatAndLng( event.latLng.lat(),event.latLng.lng() );
			//have to do some saving stuff here.
			calculateBearingWithCurrentMarkerAndPressedMarkerLatLng(event.latLng.lat(), event.latLng.lng() );
		}
		else{
		  //if it's the same one, change the color	
		  	marker.setIcon(getPinIcon(defaultPinColor ));
			currentSelectedPin = -1;

		}


	}

	
    });

    google.maps.event.addListener(marker, "dragend", function(event) {
        console.log("marker updated");
    });

    markers.push(marker);
    console.log("marker pushed into markers");
    console.log(markers);

}

function getPinIcon(pinColor) {
    return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
}

function createNode(lat, lng) {
    console.log("create-node");

    var Node = Parse.Object.extend("Node", {
        getId: function() {
            return this.get("objectId");
        }
    });
    var node = new Node();
    var edgeArrayInNode = new Array();
    node.save({lat:lat, lng:lng, edges: edgeArrayInNode}, {
        success: function(object) {
            console.log("Node " + node.id +  " (" + lat + ", " + lng + ") saved!");
	    //the index of the array is the marker's title 
	    nodeArray.push(node.id);
	    console.log(nodeArray);

	    //test place
	    //placeMarkerWithTitleIndexString(new google.maps.LatLng(lat, lng), nodeArray.length.toString() );

          }
    });
  
  
    return node;
}

function createEdge(node1, node2) {
    console.log("create-edge");

    var Edge = Parse.Object.extend("Edge");
    var edge = new Edge();
    edge.save({node1:node1, node2:node2}), {
           success: function(object) {
            
        }
    }


}

//get the lat and lng of current selected by querying Parse.
function drawEdgeWithCurrentSelectedPinAndJustPlacedMarkerLatAndLng(lat,lng){

    var currentLat; 
    var currentLng;

    var Node = Parse.Object.extend("Node");
    var query = new Parse.Query(Node);
    query.get(nodeArray[currentSelectedPin], {
      success: function(node) {
        // The object was retrieved successfully.

	//test getting edges from node
	console.log("edges = ");
	console.log(node.get("edges") );
	console.log("lat = " + node.get("lat")+ ",lng = "+ node.get("lng") );
	currentLat = node.get("lat");
	currentLng = node.get("lng");

	var line = new google.maps.Polyline({
          path: [new google.maps.LatLng(lat, lng), new google.maps.LatLng(currentLat, currentLng)],
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 10,
          map: map
        });

        var node1 = new google.maps.LatLng(lat, lng);
        var node2 = new google.maps.LatLng(currentLat, currentLng );
        console.log(node1);
        console.log(node2);


    	//var distance = distHaversine(new google.maps.LatLng(lat, lng), new google.maps.LatLng(currentLat, currentLng) );
    	var pointDist = google.maps.geometry.spherical.computeDistanceBetween (node1, node2 ).toFixed(2);
    	//console.log(pointDist);
	edgeTable[edgeTable.length-1].length = pointDist;
	console.log(edgeTable);
	//return pointDist;

      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
	console.log("retreival failed QQ, can't draw");
      }
    });
    

}


Number.prototype.toDeg = function() {
	return this * 180 / Math.PI;
}

Number.prototype.toRad = function() {
  	 return this * Math.PI / 180;
}


//updateNodeWithEdgeId after calculating bearing.
function calculateBearingWithCurrentMarkerAndPressedMarkerLatLng(lat, lng){
    
    var Node = Parse.Object.extend("Node");
    var query = new Parse.Query(Node);
    query.get(nodeArray[currentSelectedPin], {
       success: function(node) {
         // The object was retrieved successfully.
        var currentLat = node.get("lat");
        var currentLng = node.get("lng");
	currentLat = currentLat.toRad();
	currentLng = currentLng.toRad();
	var inLat = lat; inLat = inLat.toRad();
	var inLng = lng; inLng = inLng.toRad();
	var dLon = (inLng - currentLng).toRad();
	var y = Math.sin(dLon) * Math.cos(inLat);
	var x = Math.cos(currentLat)*Math.sin(inLat) - 
		Math.sin(currentLat)*Math.cos(inLat)*Math.cos(dLon);
	//brng is from the view of starting point
	var brng = Math.atan2(y,x).toDeg();
	console.log("generated bearing = " + brng);
	//from the view of end point.
	var brng2 = getBearing(lat, lng, node.get("lat"), node.get("lng"));
	console.log("generated bearing 2 = " + brng2);

	//save bearings in the edgeTable.
	edgeTable[edgeTable.length-1].bearing1 = brng;
	edgeTable[edgeTable.length-1].bearing2 = brng2;
	//console.log( edgeTable[edgeTable.length-1] );
	updateNodeWithEdgeId(edgeTable.length-1);
	setTimeout(function(){
	updateNode2WithEdgeId(edgeTable.length-1);
	},1000);
	//save the new edge to parse.


       }
    
    });

  

}

function getBearing(lat1, lng1, lat2, lng2){

    console.log(lat1);
    lat1 = lat1.toRad();
    console.log(lat1);
    lng1 = lng1.toRad();
    lat2 = lat2.toRad();
    lng2 = lng2.toRad();    
    dLon = (lng2 - lng1).toRad();
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = Math.atan2(y, x).toDeg(); 
    return brng;

}



function updateNode(node, parms) {

}


function updateNodeWithEdgeId( edgeId ) {

    var node1ToUpdateId = edgeTable[edgeId].node1Id;
    //var node2ToUpdateId = edgeTable[edgeId].node2Id;
    var node1ParseId = nodeArray[node1ToUpdateId];
    //var node2ParseId = nodeArray[node2ToUpdateId];

    var Node = Parse.Object.extend("Node");
    var query = new Parse.Query(Node);
    query.get(node1ParseId, {
       success: function(node) {
         // The object was retrieved successfully.
         var originalEdgeArray = node.get("edges");
	 console.log("originalEdgeArray1 of node " +node1ToUpdateId + "= ");
	 console.log(originalEdgeArray);
	 originalEdgeArray.push(edgeId);
	 node.set("edges", originalEdgeArray);
	 node.save();
       },
	error: function (object, error){
	  console.log("update first node failed");
	}
    });
  

}

function updateNode2WithEdgeId( edgeId ){
    //var node1ToUpdateId = edgeTable[edgeId].node1Id;
    var node2ToUpdateId = edgeTable[edgeId].node2Id;
    //var node1ParseId = nodeArray[node1ToUpdateId];
    var node2ParseId = nodeArray[node2ToUpdateId];
    console.log("node2ToUpdateId = " + node2ToUpdateId);
    console.log("node2ParseId = " + node2ParseId);


    var Node = Parse.Object.extend("Node");
    var query2 = new Parse.Query(Node);
    query2.get(node2ParseId,{
	success: function(node2){
	  var originalEdgeArray2 = node2.get("edges");
	  console.log("originalEdgeArray2 of node " + node2ToUpdateId + "= ");
	  console.log(originalEdgeArray2);
	  originalEdgeArray2.push(edgeId);
	  node2.set("edges", originalEdgeArray2);
	  node2.save();	  
	},
	error: function (object, error){
	  console.log("update second node failed");
	  console.log(error);
	}
    });

}


function toggleSelectPinBtn() {
   $('#select-pin').toggleClass("btn-on", canSelectPin);
}

$(document).ready(function() {
    Parse.initialize("9viWGl0x5YuJqhwg8dbYG16snlA2WG5X26JJrI7d", "u99KHyIjasLOmTlfePq01sk3k1ZqsRUyHlhmkaS3");
    
    $('#place-pin').click(function() {
        console.log("place-pin");
    });

    $('#select-pin').click(function() {
        console.log("select-pin");
        canSelectPin = !canSelectPin;
        toggleSelectPinBtn();
    });

    $('#unselect-pin').click(function() {
        console.log("unselect-pin");
    });

    $('#create-node').click(function() {
        createNode(23, 120);
    });


});

function distHaversine(p1, p2) {
  var R = 6371; // earth's mean radius in km
  var dLat  = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);
}



