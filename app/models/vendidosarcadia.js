import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  vendidos: DS.attr('number'),
  totales: DS.attr('number')
  
});
