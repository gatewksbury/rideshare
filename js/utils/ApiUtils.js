var ServerActions = require('../actions/ServerActions');
var Utils = require('../../functions');

var ApiUtils = {
  loadRides: function(){
    Utils.getRides(function(rides){
      ServerActions.loadedRides(rides);
    });
  },

  createRide: function(ride){
    Utils.createRide(ride, function(savedRide){
      debugger;
      ServerActions.createdRide(savedRide);
    });
  },

  deleteRide: function(id){
    Utils.deleteRide(id, function(id){
      ServerActions.deletedRide(id);
    });
  }
};

module.exports = ApiUtils;
