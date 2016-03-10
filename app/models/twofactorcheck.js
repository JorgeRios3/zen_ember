import DS from 'ember-data';

export default DS.Model.extend({
	isTwoFactorAuthenticated:DS.attr("boolean")
  
});
