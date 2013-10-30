var map;

//index is the title of the marker, the content is the id to query parse.
var nodeArray;
// in order to get the marker and get lat and lng
var markers;

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
    	    placeMarkerWithTitleIndexString( event.latLng, nodeArray.length.toString() );
    	    createNode( event.latLng.lat(),event.latLng.lng() );
	    if( currentSelectedPin != -1){
		drawEdgeWithCurrentSelectedPinAndJustPlacedMarkerLatAndLng(event.latLng.lat(),event.latLng.lng() );
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
    node.save({lat:lat, lng:lng}, {
        success: function(object) {
            console.log("Node " + node.id +  " (" + lat + ", " + lng + ") saved!");
	    //the index of the array is the marker's title 
	    nodeArray.push(node.id);
	    console.log(nodeArray);

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

    console.log("in draw function");
    var Node = Parse.Object.extend("Node");
    var query = new Parse.Query(Node);
    query.get(nodeArray[currentSelectedPin], {
      success: function(node) {
        // The object was retrieved successfully.
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
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
	console.log("retreival failed QQ, can't draw");
      }
    });


}


function updateNode(node, parms) {

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
