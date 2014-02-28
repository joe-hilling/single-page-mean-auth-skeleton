var express = require('express')
var mongoStore = require('connect-mongo')(express);
var path = require('path');


module.exports = function(app,db,passport){

	app.set('showStackError', true);    

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname,'../../client/'));
	//app.set('view engine', 'jade');
	app.engine('html', require('ejs').renderFile);
	app.use(express.favicon());

	// development only
	if ('development' == app.get('env')){
  		app.use(express.logger('dev'));
	}

	app.use(express.cookieParser()); 
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// Use mongo to store sessions rather than keep in memory
	app.use(express.session({
  		secret: 'MEAN',
  		store: new mongoStore({
    		db: db.connection.db,
    		collection: 'sessions'
  		})
	}));

	app.use(passport.initialize()); // Add passport initialization
	app.use(passport.session());    // Add passport initialization
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '../../client')));

	// development only
	if ('development' == app.get('env')) {
  		app.use(express.errorHandler());
	}

}