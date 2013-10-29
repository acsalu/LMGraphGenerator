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

	$('#create-node').click(createNode);

	function createNode() {
		console.log("create-node");
		var TestObject = Parse.Object.extend("TestObject");
		var testObject = new TestObject();
		testObject.save({foo: "bar"}, {
		  success: function(object) {
		    alert("yay! it worked");
		  }
		});
	}

});