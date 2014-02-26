var express = require('express');
var http = require('http');
var path = require('path');
var _ = require('underscore');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userRoles =  require('./server/routingConfig.js').userRoles;

//==================================================================
// Configure mongoose

// Bootstrap db connection
var db = mongoose.connect("mongodb://localhost/authexample");

// Init the model
var User = require('./server/models/User.js')
// Bootstrap the admin user if one does not exist
function bootstrapUser(userdata){
  User.findOne(userdata,function(err,user){
    if (!user){
      var user = new User(userdata)
      user.save(function(err, user){
        console.log('Bootstrapped user:',user.username)
      })
    } else {
      console.log('Existing user:',user.username)
    }
  })
}

User.find().remove() // Clear
bootstrapUser({username : 'joehilling', password: 'CVG5cvg5', role : 'admin'})
bootstrapUser({username : 'joehilling2', password: 'CVG5cvg5', role : 'admin'})


//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    
      User.findOne({ username : username }, function(err,user){
        if (err){ 
          return done(err); 
        }
        if (!user){ 
          return done(null, false, { message : 'Incorrect username'})
        }
        if (!user.validPassword(password)){
          return done(null, false, { message : 'Incorrect password'})
        }

        return done(null, user)
      })

  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


//==================================================================

// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
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