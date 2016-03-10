import DS from 'ember-data';

export default DS.Model.extend({
	password1:DS.attr("string"),
	password2:DS.attr("string")
  
});
