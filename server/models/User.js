// User model

var mongoose  	= require('mongoose')
var _ = require('underscore')

var roles = ['user','public','admin']

var userSchema = new mongoose.Schema({

	username : {
		type: String,
		unique : true,
		trim : true,
		required: true,
		validate: function(x){
			// Length requirement
			return x.length > 3
		}
	},
	role :  {
		type : String,
		enum : roles,
		required : true
	},
	password : {
		type : String,
		required : true
	}

})

// Check if a password is valid
userSchema.methods.validPassword = function(password){
	return password == this.password;
}

module.exports = mongoose.model('User', userSchema);