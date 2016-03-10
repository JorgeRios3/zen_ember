import DS from 'ember-data';

export default DS.Model.extend({
  nombre : DS.attr('string'),
  departamento : DS.attr('boolean', {default: false})
});
