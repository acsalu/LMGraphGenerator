var map;
      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(23.597, 161.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

        google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng );
                createNode( event.latLng.lat(),event.latLng.lng() );
        });

      }


      function placeMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });

      }



$(document).ready(function() {
	Parse.initialize("9viWGl0x5YuJqhwg8dbYG16snlA2WG5X26JJrI7d", "u99KHyIjasLOmTlfePq01sk3k1ZqsRUyHlhmkaS3");
	
    
	$('#place-pin').click(function() {
		console.log("place-pin");
	});

	$('#select-pin').click(function() {
		console.log("select-pin");
	});

	$('#unselect-pin').click(function() {
		console.log("unselect-pin");
	});

	$('#create-node').click(function() {
		createNode(23, 120);
	});

	function createNode(lat, lng) {
		console.log("create-node");

		var Node = Parse.Object.extend("Node");
		var node = new Node();
		node.save({lat:lat, lng:lng}, {
			success: function(object) {
		    console.log("Node(" + lat + ", " + lng + ") saved!");
		  }
		});
	}

});
