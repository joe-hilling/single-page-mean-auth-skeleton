var should = require('should')
var accessLevels = require('../../routing/accessConfig.js').accessLevels
var userRoles = require('../../routing/accessConfig.js').userRoles
var _ = require('underscore')

describe('Routing Config', function(){

	it('- everyone should access public', function(){
		(accessLevels.public.bitMask & userRoles.admin.bitMask).should.be.truthy;
		(accessLevels.public.bitMask & userRoles.user.bitMask).should.be.truthy;
		(accessLevels.public.bitMask & userRoles.public.bitMask).should.be.truthy;
	})

	it('- only unlogged users (public) should access anon', function(){
		(accessLevels.anon.bitMask & userRoles.admin.bitMask).should.be.falsy;
		(accessLevels.anon.bitMask & userRoles.user.bitMask).should.be.falsy;
		(accessLevels.anon.bitMask & userRoles.public.bitMask).should.be.truthy;
	})

	it('- users and admin should be able to access user data', function(){
		(accessLevels.user.bitMask & userRoles.admin.bitMask).should.be.truthy;
		(accessLevels.user.bitMask & userRoles.user.bitMask).should.be.truthy;
		(accessLevels.user.bitMask & userRoles.public.bitMask).should.be.falsy;
	})

	it('- only admin users should be allowed access to admin materials', function(){
		(accessLevels.admin.bitMask & userRoles.admin.bitMask).should.be.truthy;
		(accessLevels.admin.bitMask & userRoles.user.bitMask).should.be.falsy;
		(accessLevels.admin.bitMask & userRoles.public.bitMask).should.be.falsy;	
	})

})