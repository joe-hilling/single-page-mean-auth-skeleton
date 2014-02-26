var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');


//==================================================================
// Set enviroment defaults to dev
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';


//==================================================================
// Load and print the configuration
var config = require('./config/config.js')
console.log('Starting application with config:')
console.log(config)

//==================================================================
// Configure mongoose

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the model
var User = require('./server/models/User.js')

//==================================================================
// Define the strategy to be used by PassportJS
require('./config/passport.js')(passport)


//==================================================================
// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());

// development only
if ('development' == app.get('env')){
  app.use(express.logger('dev'));
}

app.use(express.cookieParser()); 
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'securedsession' }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//==================================================================
// Apply routing
require('./server/routing.js')(app)


//==================================================================
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app