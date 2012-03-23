CARD_COUNTER = 1000;
CURRENT_CARD = null;

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
	window.DataModel = ko.mapping.fromJS(dataModelAsJson);

	DataModel = $.extend({
		users: ko.observableArray(),
		lanes: ko.observableArray([ new Lane("Card Pile") ]),

		addLane: function() {
			var title = prompt("Enter title");
			window.DataModel.lanes.push(new Lane(title));
		},

		addCard: function() {
			var title = prompt("Title : ");
			DataModel.lanes()[0].cards.push(new Card(title));	
		},

		addUser: function() {
			var username = prompt("Enter Username: ");
			DataModel.users.push(username);
		}
	}, DataModel);

	ko.bindingHandlers.sortableList = {
		init: function(element, valueAccessor) {
			var lane = valueAccessor(), laneElement = element;
			$(element).data("lane", lane);

			$(element).sortable({
				connectWith: ".lane",
				start: function(event, ui) {
					CURRENT_CARD = $(ui.item).data("card");
				},

				update: function(event, ui) {
	            	var card = CURRENT_CARD;
	            	var position = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);

					if (!ui.sender) return;

	            	if (position >= 0) {
	            		lane.cards.remove(card);
	            		lane.cards.splice(position, 0, card);
		            	ui.item.remove();

	            	}
				},
	            receive: function(event, ui) {
	            	var oldLane = $(ui.sender).data("lane");
	            	var card = CURRENT_CARD;
	            	var position = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);

	            	if (position >= 0) {
	            		oldLane.cards.remove(card);
	            		lane.cards.splice(position, 0, card);
		            	ui.item.remove();
	            	}
	            }
 			});
		}
	}

	ko.bindingHandlers.sortableItem = {
		init: function(element, valueAccessor) {
			var card = valueAccessor();
			$(element).data("card", card);
		}
	}

	ko.applyBindings(DataModel);
});

$(window).bind("beforeunload", function() {
	var dataModelAsJson = ko.mapping.toJS(DataModel);
	$.storage.set("data", dataModelAsJson);
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