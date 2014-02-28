var mongoose = require('mongoose');

// Init the models
var User = require('./../models/User.js')

module.exports = function(config){

	// Bootstrap db connection
	var db = mongoose.connect(config.db);

	// If there is no admin user then bootstrap this
	User.findOne({ username : 'admin'},function(err, user){
  		if (!user){
    		(new User({ username : 'admin', password: 'admin', role: 'admin'})).save()
  		}
	})

	return db;

}

