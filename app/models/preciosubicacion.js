import DS from 'ember-data';

export default DS.Model.extend({
  desarrollo: DS.attr('string'),
  etapa: DS.attr('string'),
  tipoprecio: DS.attr('string'),
  precio: DS.attr('money'),
  total: DS.attr('formattedint')
});