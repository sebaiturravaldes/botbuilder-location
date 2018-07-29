"use strict";
var rp = require("request-promise");
var common = require("../common");
var consts_1 = require("../consts");
var confirmSingleLocationDialog = require("./confirm-single-location-dialog");
var chooseLocationDialog = require("./choose-location-dialog");
var location_card_builder_1 = require("../services/location-card-builder");

function register(library, apiKey) {
    confirmSingleLocationDialog.register(library);
    chooseLocationDialog.register(library);
    library.dialog('resolve-google-location-dialog', createDialog());
    library.dialog('location-resolve-dialog', createLocationResolveDialog(apiKey));
}

exports.register = register;

function createDialog() {
    return [
        function (session, args) {
            session.beginDialog('location-resolve-dialog', args);
        },
        function (session, results, next) {
            session.dialogData.response = results.response;
            if (results.response && results.response.locations) {
                var locations = results.response.locations;
                if (locations.length == 1) {
                    session.beginDialog('confirm-single-location-dialog', {locations: locations});
                }
                else {
                    session.beginDialog('choose-location-dialog', {locations: locations});
                }
            }
            else {
                next(results);
            }
        }
    ];
}

var MAX_CARD_COUNT = 5;

function createLocationResolveDialog(apiKey) {
    return common.createBaseDialog()
        .onBegin(function (session, args) {
            if (!args.skipDialogPrompt) {
                var promptSuffix = session.gettext(consts_1.Strings.TitleSuffix);
                session.send(args.prompt + promptSuffix).sendBatch();
            }
        }).onDefault(function (session) {
            var options = {
                uri: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + encodeURIComponent(session.message.text) + '&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=' + apiKey,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options)
                .then(function (locations) {
                    if (locations.candidates.length == 0) {
                        session.send(consts_1.Strings.LocationNotFound).sendBatch();
                        return;
                    }
                    var locationCount = Math.min(MAX_CARD_COUNT, locations.candidates.length);
                    locations = locations.candidates.slice(0, locationCount);
                    var reply = new location_card_builder_1.LocationCardBuilder('google', apiKey).createHeroCards(session, locations);
                    session.send(reply);
                    session.endDialogWithResult({response: {locations: locations}});
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
}
