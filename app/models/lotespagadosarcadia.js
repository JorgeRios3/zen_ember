import DS from 'ember-data';
export default DS.Model.extend({
  etapa: DS.attr('number'),
  pagados: DS.attr('number'),
  noescriturados: DS.attr('number'),
  escriturados: DS.attr('number')
  
});
