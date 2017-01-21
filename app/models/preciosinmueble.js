import DS from 'ember-data';

export default DS.Model.extend({
  precio : DS.attr("string"),
  sustentable : DS.attr("boolean"),
  etapa : DS.attr("number"),
  precioraw : DS.attr('number'),
  descripcion: DS.attr("string"),
  descuentoraw: DS.attr('number'),
  descuento: DS.attr('string'),
  activo: DS.attr('boolean'),
  caracteristicas: DS.attr('string', {default: ''}),
  visible: DS.attr('boolean'),
  tipo: DS.attr('string')
});
