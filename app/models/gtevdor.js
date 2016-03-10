import DS from 'ember-data';

export default DS.Model.extend({
  	idvendedor : DS.attr('number'),
	nombrevendedor : DS.attr('string'),
	idgerente : DS.attr('number'),
	nombregerente : DS.attr('string')
});
