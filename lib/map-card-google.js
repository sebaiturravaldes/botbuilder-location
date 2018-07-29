"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];

    function __() {
        this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var botbuilder_1 = require("botbuilder");
var MapCard = (function (_super) {
    __extends(MapCard, _super);

    function MapCard(apiKey, session) {
        var _this = _super.call(this, session) || this;
        _this.apiKey = apiKey;
        return _this;
    }

    MapCard.prototype.location = function (location, index, locationName) {
        var prefixText = "";
        if (index !== undefined) {
            prefixText = index + ". ";
        }
        if (locationName !== undefined) {
            prefixText += locationName + ": ";
        }
        if (location.formatted_address) {
            this.subtitle(prefixText + location.formatted_address);
        }
        else {
            this.subtitle(prefixText);
        }
        if (location.geometry.location) {
            var locationUrl;
            try {
                locationUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=600x400&zoom=18&markers=color:red%7Clabel:%7C' + location.geometry.location.lat + ' ' + location.geometry.location.lng + '&visible=' + location.geometry.location.lat + ' ' + location.geometry.location.lng + '&key=' + this.apiKey;
                this.images([botbuilder_1.CardImage.create(this.session, locationUrl)]);
            }
            catch (e) {
                this.session.error(e);
            }
        }
        return this;
    };
    return MapCard;
}(botbuilder_1.HeroCard));
exports.MapCard = MapCard;
