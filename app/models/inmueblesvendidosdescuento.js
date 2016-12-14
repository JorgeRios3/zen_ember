import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  descripcion: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('number'),
  preciobase: DS.attr('money'),
  descuento: DS.attr('money'),
  neto: DS.attr('money'),
  fecha: DS.attr('string')
});
