import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  descripcion: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('number'),
  preciobase: DS.attr('number'),
  descuento: DS.attr('number'),
  neto: DS.attr('number'),
  fecha: DS.attr('string'),
  subsidio: DS.attr('number')
});
