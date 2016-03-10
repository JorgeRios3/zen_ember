import DS from 'ember-data';

export default DS.Model.extend({
	hasTwoFactorAuthentication:DS.attr("boolean"),
	isTwoFactorAuthenticated:DS.attr("boolean")
  
});
