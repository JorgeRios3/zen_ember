import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  cliente: DS.attr('number'),
  nombre: DS.attr('string'),
  saldo: DS.attr('money'),
  cuenta: DS.attr('number'),
  congelada: DS.attr('boolean')
  
});
