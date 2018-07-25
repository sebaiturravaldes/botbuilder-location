"use strict";
var consts_1 = require("../consts");
var botbuilder_1 = require("botbuilder");

function register(library) {
    library.dialog('confirm-single-location-dialog', createDialog());
}
exports.register = register;
function createDialog() {
    return [
        function (session, args) {
            session.dialogData.locations = args.locations;
            session.send(botbuilder_1.Prompts.choice(session, session.gettext(consts_1.Strings.SingleResultFound), ["Si", "No"], {
              listStyle: botbuilder_1.ListStyle.button
            }));
        },
        function (session, results, next) {
          var message = parseBoolean(results.response.entity);
          if (results.response && typeof message == 'boolean' && message == true) {
            session.endDialogWithResult({response: {place: session.dialogData.locations[0]}});
          } else {
            session.endDialogWithResult({response: {reset: true}});
          }
        }
    ];
}

function parseBoolean(input) {
  input = input.trim();
  var yesExp = /^(y|yes|yep|sure|ok|true|s|si|sí)/i;
  var noExp = /^(n|no|nope|not|false)/i;
  if (yesExp.test(input)) {
    return true;
  }
  else if (noExp.test(input)) {
    return false;
  }
  return undefined;
}
