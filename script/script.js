var map;
canSelectPin = false;
isFirstTime = true;

function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(23.597, 161.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {
	if(isFirstTime == true){
            placeMarker(event.latLng );
            createNode( event.latLng.lat(),event.latLng.lng() );
	    isFirstTime = false;
	}
	else if (canSelectPin == true){
	    placeMarker( event.latLng );
	    createNode( event.latLng.lat(),event.latLng.lng() );
	}

    });
}


function placeMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    //put the marker and also add onclick listener for it
    /*******************Acsa put the pressed marker function here ******/
    google.maps.event.addListener(marker, "click", function() {
        console.log("marker pressed");
	
    });
}


function createNode(lat, lng) {
    console.log("create-node");

    var Node = Parse.Object.extend("Node");
    var node = new Node();
    node.save({lat:lat, lng:lng}, {
        success: function(object) {
            console.log("Node(" + lat + ", " + lng + ") saved!");
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
