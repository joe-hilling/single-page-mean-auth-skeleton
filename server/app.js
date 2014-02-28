var http = require('http');
var passport = require('passport');
var express = require('express')
var path = require('path')
var app = express();


var configPath = path.join(__dirname,'./config');

//==================================================================
// Set enviroment default to dev
var env 	= process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//==================================================================
// Set configuration
var config 	= require(path.join(configPath,'config.js'))

//==================================================================
// Configure mongoose
var db 		= require(path.join(configPath,'mongoose.js'))(config)

//==================================================================
// Configure authentication
require(path.join(configPath,'passport.js'))(passport)

//==================================================================
// Configure express application
require(path.join(configPath,'express.js'))(app,db,passport)

//==================================================================
// Apply routing
require(path.join(configPath,'routing.js'))(app)

//==================================================================
// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//==================================================================
// Make available for testing
module.exports = app