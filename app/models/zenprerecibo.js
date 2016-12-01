import DS from 'ember-data';

export default DS.Model.extend({
  cantidad: DS.attr('number'),
  fecha: DS.attr('string'),
  cuenta: DS.attr('number')
});
