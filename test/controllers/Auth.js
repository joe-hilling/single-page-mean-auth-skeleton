var app = require('../../app.js')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var supertest = require('supertest')
var should = require('should')

var usercreds = {
	username : 'authuser',
	password : 'password',
	role : 'user'
}


describe('Authentication', function(){


	// Setup user and remove afterwards	
	before(function(done){
		User.find({}).remove(function(){
			(new User(usercreds)).save(done)
		})
	})

	after(function(done){
		User.find(usercreds).remove(done)
	})

	// Build request objects
	var request = supertest(app)

	describe('Login', function(){

		var agent = supertest.agent(app);

		before(loginUser(agent));


		it('request should not be logged in', function(done){
			request.get('/loggedin').expect(200).end(function(err,res){
				if(err) throw err
				res.text.should.equal('0')
				done()
			})
		})

		it('agent should be logged in', function(done){
			agent.get('/loggedin').expect(200).end(function(err,res){
				if(err) throw err
				res.text.should.not.equal('0')
				done()
			})
		})

		it('should return 401 for invalid credentials', function(done){
			request.post('/login').send({}).expect(401).end(function(err,res){
				if(err) throw err
				done();
			})
		})

	})

	describe('Logout', function(){

		var agent = supertest.agent(app);

		before(loginUser(agent))

		it('should allow logout', function(done){
			agent.post('/logout').send().expect(200).end(function(err,res){
				if(err) throw err

				agent.get('/loggedin').expect(200).end(function(err,res){
					if(err) throw err
					res.text.should.equal('0')
					done()
				})
			})
		})

	})


	describe('Access', function(){

		it('should deny anon access to /users', function(done){
			request.get('/users').send().expect(401).end(function(err,res){
				if(err) throw err
				done();
			})
		})

	})

	describe('Persistent agent', function(){

		var agent = supertest.agent(app);
		
		before(loginUser(agent))

		it('should persist cookies across requests', function(done){
			agent.get('/users').expect(200).end(function(err,res){
				should.not.exist(err)
				done()
			})
		})

	})

	function loginUser(agent) {
  		return function(done) {
    		
    		agent
      			.post('/login')
      			.send(usercreds)
      			.expect(200).end(onResponse);

      	function onResponse(err, res){
      		return done();
      	}

  	};

}
})