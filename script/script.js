var map;
canSelectPin = false;
isFirstTime = true;

infowindow = null;

defaultPinColor = "FE7569";
highlightPinColor = "FFFF46";

function initialize() {
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
      map: map,
      draggable: true,
      icon: getPinIcon(defaultPinColor)
    });
    //put the marker and also add onclick listener for it
    /*******************Acsa put the pressed marker function here ******/
    google.maps.event.addListener(marker, "click", function(event) {
        console.log("marker pressed");
        var pinColor = "AAAAAA";
        marker.setIcon(getPinIcon(highlightPinColor));
    });

    google.maps.event.addListener(marker, "dragend", function(event) {
        console.log("marker update");
    });
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
            console.log("Node " + node.getId() +  " (" + lat + ", " + lng + ") saved!");
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
