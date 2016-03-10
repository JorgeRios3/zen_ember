import DS from 'ember-data';

export default DS.Model.extend({
  	nombre : DS.attr('string'),
	activo : DS.attr('boolean'),
	prospectador: DS.attr('boolean')
});
