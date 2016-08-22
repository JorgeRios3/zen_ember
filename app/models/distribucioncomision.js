import DS from 'ember-data';

export default DS.Model.extend({
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  inmueble: DS.attr('string'),
  vendedor: DS.attr('number'),
  nombrevendedor: DS.attr('string'),
  gerente: DS.attr('number'),
  nombregerente: DS.attr('string'),
  porcentaje: DS.attr('number')


});
