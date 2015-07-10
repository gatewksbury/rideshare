/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');

module.exports = RideDetailView = React.createClass({

  mixins: [Router.State, Router.Navigation],

  propTypes: {
    rides: React.PropTypes.array,
    requests: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    deleteRideHandler: React.PropTypes.func,
    createRequestHandler: React.PropTypes.func,
    deleteRequestHandler: React.PropTypes.func
  },

  shouldComponentUpdate: function(nextProps, nextState){
    var that = this;
    if(this.props.rides){
      var currentRide = _.find(this.props.rides, function(ride){
        return ride.id === that.state.rideId;
      });

      var nextRide = _.find(nextProps.rides, function(ride){
        return ride.id === that.state.rideId;
      });
      if(currentRide.spacesAvailable === nextRide.spacesAvailable){
        return false;
      }
    }
    return true;
  },

  getInitialState: function(){
    var rideId = parseInt(this.getParams().id);

    return {
      rideId: rideId
    };
  },

  _deleteRide: function(){
    this.props.deleteRideHandler(this.state.rideId);
    this.transitionTo('/');
  },

  _createRequest: function(){
    var request = {
      userId: this.props.currentUser.id,
      rideId: this.state.rideId
    };
    this.props.createRequestHandler(request);
  },

  _deleteRequest: function(){
    var that = this;
    var request = _.find(this.props.requests[this.state.rideId], function(request){
      return request.userId === that.props.currentUser.id;
    });
    this.props.deleteRequestHandler(request.id);
  },

  _formatTime: function(time){
    var formattedTime = new Date(time);
    formattedTime = formattedTime.toLocaleTimeString();
    return formattedTime.replace(':00', '');
  },

  _hasBeenRequestedByMe: function(rideReqs){
    var hasBeenRequested = false;
    var that = this;
    var request = _.find(rideReqs, function(request){
      return request.userId === that.props.currentUser.id;
    });

    request ? hasBeenRequested = true : null;
    return hasBeenRequested;
  },

  render: function(){
    var that = this;
    var users;
    var rideContent;
    var participants;
    var buttonNode;
    var ride = _.find(this.props.rides, function(ride){
      return ride.id === that.state.rideId;
    });

    if(ride){
      users = _.pluck(this.props.requests[ride.id], 'user');

      if(this.props.currentUser && ride.userId === this.props.currentUser.id) {
        buttonNode = (
          <span className="btn btn-danger" onClick={ this._deleteRide }>Delete</span>
        );
      } else if (this.props.currentUser && this._hasBeenRequestedByMe(this.props.requests[ride.id])){
        buttonNode = (
          <span className="btn btn-danger" onClick={ this._deleteRequest }>Unjoin</span>
        );
      } else if (this.props.currentUser && ride.spacesAvailable > 0){
        buttonNode = (
          <span className="btn btn-success" onClick={ this._createRequest }>Join</span>
        );
      } else if (this.props.currentUser && ride.spacesAvailable === 0){
        buttonNode = (
          <span className="btn btn-default">Ride Filled</span>
        );
      }

      rideContent = (
        <div>
          <h1>{ `${ride.destination} bound.` }</h1>
            <h3>{ ride.user.username } is leaving at { this._formatTime(ride.leavingAt) }.</h3>
            <h4>Spaces Available: { ride.spacesAvailable }</h4>
            { buttonNode }
        </div>
      );

      if(users){
        participants = users.map(function(user, index){
          return (
            <li>Username: { user.username }</li>
          );
        });
      }
    }

    return(
      <div className="container jumbotron">
        <div className="col-md-9">
          { rideContent }
        </div>
        <div className="col-md-3">
          <p>Riders</p>
          <ul>
            { participants }
          </ul>
        </div>
      </div>
    );
  }
});
