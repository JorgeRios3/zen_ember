import DS from 'ember-data';

export default DS.Model.extend({
	cuenta: DS.attr("string"),
	cliente: DS.attr("string"),
	nombre : DS.attr("string"),
	fechacierre : DS.attr("string")
  
});
