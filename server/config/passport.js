var mongoose = require('mongoose')
var LocalStrategy = require('passport-local').Strategy
var User = mongoose.model('User')


module.exports = function(passport) {

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
    }));

    // Serialized and deserialized methods when got from session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

};