var app = require('../../app.js')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var supertest = require('supertest')
var should = require('should')

var adminCreds = {
	username : 'adminuser',
	password : 'password',
	role : 'admin'
}

var userCreds = {
	username : 'reguser',
	password : 'password',
	role : 'user'	
};


describe('User operations', function(){

	var agent = supertest.agent(app);

	// Create the admin user
	before(function(done){
		User.find({}).remove(function(){
			(new User(adminCreds)).save(done)
		})
	})

	// Clear all
	after(function(done){
		User.find({}).remove(done)
	})


	describe('index', function(){

		before(loginUser(agent));

		it('should create a new user', function(done){
			 agent.post('/users/create').send(userCreds).expect(200).end(function(err,res){
			 	if (err) throw err;
			 	done();
			 })
		})

		it('should list all users', function(done){
			agent.get('/users/index').expect(200).end(function(err,res){
				if(err) throw err
				res.body.should.have.lengthOf(2)
				done()
			})
		})

		it('should delete the user', function(done){
			agent.del('/users/delete').send({username : userCreds.username }).expect(200).end(function(err,res){
				if(err) throw err
				done()
			})	
		})

		it('should have one less user', function(done){
			agent.get('/users/index').expect(200).end(function(err,res){
				if(err) throw err
				res.body.should.have.lengthOf(1)
				done()
			})
		})
	})

	function loginUser(agent,credentials) {
  		return function(done) {
    		
    		agent
      			.post('/login')
      			.send(credentials)
      			.expect(200).end(onResponse);

      	function onResponse(err, res){
      		return done();
      	}

  	};

}
})