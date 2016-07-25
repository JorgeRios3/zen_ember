import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  inmueble: DS.attr('string'),
  etapa: DS.attr('string'),
  telefonocasa: DS.attr('string'),
  telefonotrabajo: DS.attr('string')
});
