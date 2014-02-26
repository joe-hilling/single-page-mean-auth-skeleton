// User model

var mongoose  	= require('mongoose')
var _ = require('underscore')
var crypto = require('crypto')

var roles = ['user','public','admin']

var UserSchema = new mongoose.Schema({

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
	hashed_password : String,
	salt : String

})

/*
	Virtuals
*/
UserSchema.virtual('password').set(function(password){
	this._password = password
	this.salt = this.makeSalt()
	this.hashed_password = this.encryptPassword(password)
}).get(function(){
	return this._password
})

/*
	Validations
*/
UserSchema.path('username').validate(function(username){
	return username.length;
}, 'Username cannot be blank')

UserSchema.path('hashed_password').validate(function(hashed_password){
	return hashed_password.length
}, 'Password cannot be blank')


/*
	Pre save hook
*/
UserSchema.pre('save', function(next){
	if(!this.isNew) return next()

	if(!this.password || !this.password.length)
		next(new Error('Invalid password'))
	else if(!this.role)
        next(new Error('Invalid user role'))
    else
		next()
})

/*
	Methods
*/
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    validPassword: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

// Check if a password is valid
// userSchema.methods.validPassword = function(password){
// 	return password == this.password;
// }

module.exports = mongoose.model('User', UserSchema);