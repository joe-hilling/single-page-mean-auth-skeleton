var mongoose = require('mongoose')
var should = require('should')
var app = require('../../app.js')

var User = mongoose.model('User')

var usercreds = {
	username : 'user',
	password : 'password',
	role : 'user'
}


describe('Mongoose User Model', function(){

	before(function(done){
		// Drop all users
		User.find({}).remove(done)
	})


	beforeEach(function(done){
		var user = new User(usercreds);
		user.save(function(err,user){
			if (err) throw err
			should.exist(user)
			done()
		})
	})

	afterEach(function(done){
		User.find({}).remove(done);
	})


	describe('Accessing the user', function(done){
		it('should allow access', function(done){
			User.findOne({ username : 'user' }, function(err, user){
				should.not.exist(err);
				should.exist(user);
				should.exist(user.role)
				user.role.should.equal('user')
				done();
			})
		})
	})


	describe('Omitting the password', function(done){
		it('should not allow it', function(done){
			var user = new User({username : 'abcd'})
			user.save(function(err,user){
				should.exist(err)
				done()
			})
		})
	})


	describe('Creating user with same username', function(done){
		it('should forbid it', function(done){
			var dupUser = new User(usercreds);
			dupUser.save(function(err, user){
				should.exist(err);
				should.not.exist(user)
				done();
			})
		})
	})


	describe('Valid password method', function(done){
		it('should match only the password', function(done){
			User.findOne({ username: usercreds.username}, function(err, user){
				if(err) throw err
				should.exist(user)
				user.validPassword('password').should.be.true
				user.validPassword('xxxx').should.be.false
				done();
			})
		})
	})
})