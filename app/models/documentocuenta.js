import DS from 'ember-data';

export default DS.Model.extend({
  tipo: DS.attr('number'),
  cantidad: DS.attr('number'),
  cuenta: DS.attr('number')
});
