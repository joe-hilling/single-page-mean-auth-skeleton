var passport = require('passport')
var accessLevels = require('./routingConfig.js').accessLevels
var Auth = require('./controllers/auth.js')
var User = require('./controllers/user.js')

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
    middleware: [function(req, res){ res.send([{name: "user1"}, {name: "user2"}])}],
    accessLevel: accessLevels.user
  },

  //==================================================================
  // User administration

  {
    path: '/users/index',
    method: 'get',
    middleware: [User.index],
    accessLevels: accessLevels.admin
  },

  {
    path: '/users/create',
    method: 'post',
    middleware: [User.create],
    accessLevels: accessLevels.admin
  },

  {
    path: '/users/delete',
    method: 'delete',
    middleware: [User.delete],
    accessLevels: accessLevels.admin
  },

  //==================================================================
  // Authentication

  {
    path: '/loggedin',
    method: 'get',
    middleware: [Auth.loggedin],
    accessLevel: accessLevels.public
  },

  {
    path: '/login',
    method : 'post',
    middleware: [passport.authenticate('local'),Auth.login],
    accessLevel: accessLevels.public
  },

  {
    path: '/logout',
    method : 'post',
    middleware: [Auth.logout],
    acceessLevel: accessLevels.public
  }

]

