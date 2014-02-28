var _ = require('underscore')
var routes = require('../routing/routes.js')
var accessLevels = require('../routing/accessConfig.js').accessLevels;
var userRoles = require('../routing/accessConfig.js').userRoles;

var ensureAuthorised = function(req,res,next){
  
  if(!req.user) role = userRoles.public;
  else          role = userRoles[req.user.role];

  var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;
  if(!(accessLevel.bitMask & role.bitMask)) return res.send(401)
  
  next();
}

module.exports = function(app){

  _.each(routes, function(route){
    
    // Access control policy
    route.middleware.unshift(ensureAuthorised)

    var args = _.flatten([route.path, route.middleware])
    switch(route.method.toUpperCase()){
      case 'GET' : 
        app.get.apply(app,args);
        break;
    
      case 'POST' :
        app.post.apply(app,args);
        break;

      case 'PUT' :
        app.put.apply(app,args);
        break;

      case 'DELETE' :
        app.delete.apply(app,args);
        break;
    
      default:
        throw new Error('Invalid HTTP method specified for route ' + route.path);
        break;
    }

  })

}