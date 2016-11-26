import DS from 'ember-data';
export default DS.Model.extend({
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  inmueble: DS.attr('number'),
  cuenta: DS.attr('number'),
  etapa: DS.attr('string')
});
