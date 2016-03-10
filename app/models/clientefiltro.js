import DS from 'ember-data';

export default DS.Model.extend({
	cuenta:DS.attr("number"),
	saldo:DS.attr("number"),
	nombre:DS.attr("string")
  
});
