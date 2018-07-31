"use strict";
var resolveBingLocationDialog = require("./resolve-bing-location-dialog");
var resolveGoogleLocationDialog = require("./resolve-google-location-dialog");
var resolveMapboxLocationDialog = require("./resolve-mapbox-location-dialog");
var retrieveFacebookLocationDialog = require("./retrieve-facebook-location-dialog");

function register(library, connection, apiKey, country = null) {
  library.dialog('retrieve-location-dialog', createDialog(connection));
  if (connection == 'google') {
    resolveGoogleLocationDialog.register(library, apiKey);
  } else if (connection == 'mapbox') {
    resolveMapboxLocationDialog.register(library, apiKey, country);
  } else {
    resolveBingLocationDialog.register(library, apiKey);
  }
  retrieveFacebookLocationDialog.register(library, connection, apiKey);
}

exports.register = register;

function createDialog(connection) {
  return [
    function (session, args) {
      session.dialogData.args = args;
      if (args.useNativeControl && (session.message.address.channelId == 'facebook' || session.message.address.channelId == 'directline')) {
        session.beginDialog('retrieve-facebook-location-dialog', args);
      }
      else {
        if (connection == 'google') {
          session.beginDialog('resolve-google-location-dialog', args);
        } else if (connection == 'mapbox') {
          session.beginDialog('resolve-mapbox-location-dialog', args);
        } else {
          session.beginDialog('resolve-bing-location-dialog', args);
        }
      }
    },
    function (session, results, next) {
      if (results.response && results.response.place) {
        let place;
        if (typeof results.response.place.geometry == 'undefined') {
          place = results.response.place;
        } else if (connection == 'google') {
          place = {
            'entityType': 'Address',
            'name': results.response.place.formatted_address,
            'address': {
              formattedAddress: results.response.place.formatted_address,
              streetAddress: results.response.place.name,
            },
            'point': {
              coordinates: [results.response.place.geometry.location.lat, results.response.place.geometry.location.lng]
            }
          };
        } else if (connection == 'mapbox') {
          place = {
            'entityType': 'Address',
            'name': results.response.place.place_name,
            'address': {
              formattedAddress: results.response.place.place_name,
              streetAddress: results.response.place.text,
            },
            'point': {
              coordinates: [results.response.place.geometry.coordinates[1], results.response.place.geometry.coordinates[0]]
            }
          };
        } else {
          place = results.response.place; //default bing
        }

        session.beginDialog('require-fields-dialog', {
          place: place,
          requiredFields: session.dialogData.args.requiredFields
        });
        
      }
      else {
        next(results);
      }
    }
  ];
}
