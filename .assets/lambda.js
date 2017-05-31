/*
 * MyIoTDevice Rule Action Lambda Node.js 6.10
 */

var endpoint = {
    "endpointAddress": "a2fctl118kkq9k.iot.us-east-1.amazonaws.com"
}

var thing = {
    "thingName": 'MyIoTDevice'
}

var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({endpoint: endpoint.endpointAddress});

exports.handler = function(event, context) {

   iotdata.getThingShadow(thing, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
          console.log(data);
          var jsonPayload = JSON.parse(data.payload);
          var windowOpen = jsonPayload.state.desired.windowOpen;

          if (windowOpen) {
                console.log('windowOpen was open');

                var update = {
                   "state": {
                      "desired" : {
                        "windowOpen" : false
                      }
                   }
                };

                iotdata.updateThingShadow({
                payload: JSON.stringify(update),
                thingName: thing.thingName
                }, function(err, data) {
                   if (err) {
                       context.fail(err);
                   } else {
                       console.log(data);
                   }
                });



          } else {
                console.log('windowOpen was not open');
          }

      }

   });

};
