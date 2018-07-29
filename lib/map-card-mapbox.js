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
        if (location.place_name) {
            this.subtitle(prefixText + location.place_name);
        }
        else {
            this.subtitle(prefixText);
        }
        if (location.geometry.coordinates) {
            var locationUrl;
            try {
                //Documentation: https://www.mapbox.com/api-documentation/pages/static_classic.html
                locationUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-s+F44336(' + location.geometry.coordinates[0] + ',' + location.geometry.coordinates[1] + ')/' + location.geometry.coordinates[0] + ',' + location.geometry.coordinates[1] + ',17/500x280@2x?access_token=' + this.apiKey;
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
