var mongoose = require('mongoose')
var User = mongoose.model('User')


module.exports = {

	index : function(req,res){
		User.find(function(err, users){
			if (err) res.send(500,err)
			res.send(200, users)
		})
	},

	create : function(req,res){
		var user = new User(req.body);
		user.save(function(err, done){
			if (err) res.send(500,err)
			res.send(200, user)
		})
	},

	delete : function(req,res){
		User.findOne(req.body, function(err, user){
			if (err) res.send(500,err);
			user.remove(function(err,user){
				if (err) res.send(500,err);
				res.send(200, user)
		});	
		})
	},

	update : function(req,res){
		res.send(500,'Not implemented')		
	},

	get : function(req,res){
		res.send(500,'Not implemented')
	}
}