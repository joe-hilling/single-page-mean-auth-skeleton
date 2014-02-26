
module.exports = {
	
	loggedin: function(req,res){ 
		res.send(req.isAuthenticated() ? req.user : '0');
	},

	login: function(req,res){ 
		res.send(req.user);
	},

	logout: function(req, res){ 
		req.logOut(); res.send(200);
	}
}