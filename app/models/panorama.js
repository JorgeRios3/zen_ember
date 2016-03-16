import DS from 'ember-data';

export default DS.Model.extend({
	rubro: DS.attr('string'),
	valor: DS.attr('number')
  
});
