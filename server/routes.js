var _ = require('underscore')
var passport = require('passport')
var accessLevels = require('./routingConfig.js').accessLevels

var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
    res.send(401);
  else
    next();
};


module.exports = [
  
  {
    path: '/',
    method: 'get',
    middleware: [function(req,res){ res.render('index', {title: 'Express'})}],
    accessLevel: accessLevels.public
  },

  {
    path: '/users',
    method: 'get',
    middleware: [auth, function(req, res){ res.send([{name: "user1"}, {name: "user2"}])}],
    accessLevel: accessLevels.user
  },

  {
    path: '/loggedin',
    method: 'get',
    middleware: [function(req,res){ res.send(req.isAuthenticated() ? req.user : '0')}],
    accessLevel: accessLevels.public
  },

  {
    path: '/login',
    method : 'post',
    middleware: [passport.authenticate('local'),function(req,res){ res.send(req.user)}],
    accessLevel: accessLevels.public
  },

  {
    path: '/logout',
    method : 'post',
    middleware: [function(req, res){ req.logOut(); res.send(200);}],
    acceessLevel: accessLevels.public
  }

]

