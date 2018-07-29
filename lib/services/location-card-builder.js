"use strict";
var botbuilder_1 = require("botbuilder");
var map_card_1;
var map_card_bing = require("../map-card-bing");
var map_card_google = require("../map-card-google");
var map_card_mapbox = require("../map-card-mapbox");
var LocationCardBuilder = (function () {
    function LocationCardBuilder(connection = 'bing', apiKey) {
        if (connection == 'google') {
            map_card_1 = map_card_google;
        } else if (connection == 'mapbox') {
            map_card_1 = map_card_mapbox;
        } else {
            map_card_1 = map_card_bing;
        }

        this.apiKey = apiKey;
    }

    LocationCardBuilder.prototype.createHeroCards = function (session, locations, alwaysShowNumericPrefix, locationNames) {
        var cards = new Array();
        for (var i = 0; i < locations.length; i++) {
            cards.push(this.constructCard(session, locations, i, alwaysShowNumericPrefix, locationNames));
        }
        return new botbuilder_1.Message(session)
            .attachmentLayout(botbuilder_1.AttachmentLayout.carousel)
            .attachments(cards);
    };
    LocationCardBuilder.prototype.constructCard = function (session, locations, index, alwaysShowNumericPrefix, locationNames) {
        var location = locations[index];
        var card = new map_card_1.MapCard(this.apiKey, session);
        if (alwaysShowNumericPrefix || locations.length > 1) {
            if (locationNames) {
                card.location(location, index + 1, locationNames[index]);
            }
            else {
                card.location(location, index + 1);
            }
        }
        else {
            card.location(location);
        }
        return card;
    };
    return LocationCardBuilder;
}());
exports.LocationCardBuilder = LocationCardBuilder;
