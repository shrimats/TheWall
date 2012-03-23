CARD_COUNTER = 1000;

function Lane(title) {
	this.title = title;
	this.cards = ko.observableArray();
}

function Card(title) {
	this.title = title;
	this.id = ++CARD_COUNTER;
}

$(function() {
	$.storage = new $.store();
	var dataModelAsJson = $.storage.get("data");

	if (dataModelAsJson == null || dataModelAsJson["lanes"] == null) {
		console.log("No data found!");
		dataModelAsJson = {
			lanes: [ new Lane("Card Pile") ]
		}
	}

	console.log(dataModelAsJson);

	window.DataModel = {
		lanes: ko.observableArray(dataModelAsJson.lanes),

		addLane: function() {
			var title = prompt("Enter title");
			window.DataModel.lanes.push(new Lane(title));
		},

		addCard: function() {
			var title = prompt("Title : ");
			DataModel.lanes()[0].cards.push(new Card(title));	
		}
	};

	ko.bindingHandlers.sortable = {
		init: function(element) {
			$(".lane").sortable({ connectWith: ".lane" });
		}
	}

	ko.applyBindings(DataModel);
});

$(window).bind("beforeunload", function() {
	var dataModelAsJson = ko.toJSON(DataModel);
	$.storage.set("data", dataModelAsJson);
	console.log("Saved Data: ", $.storage.get("data"));
});

/*
$(function() {

	var laneTemplate = Handlebars.compile($("#lane-template").text());
	var cardTemplate = Handlebars.compile($("#card-template").text());

	$(".lane").sortable({
		connectWith: ".lane"
	});

	$("#add-lane").click(function() {
		var title = prompt("Enter lane title");
		var laneElement = laneTemplate({ title: title });
		$(".wall").append(laneElement);
	});
	
});
*/