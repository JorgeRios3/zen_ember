import DS from 'ember-data';

export default DS.Model.extend({
	cuenta: DS.attr("number"),
	oferta: DS.attr("number")
  
});
