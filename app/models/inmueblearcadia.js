import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  codigo: DS.attr('number'),
  inmueble: DS.attr('number'),
  manzana: DS.attr('string'),
  lote: DS.attr('number'),
  cuenta: DS.attr('number'),
  cliente: DS.attr('number'),
  nombre: DS.attr('string')
  
});
