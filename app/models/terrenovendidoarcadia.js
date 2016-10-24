import DS from 'ember-data';

export default DS.Model.extend({
  fecha: DS.attr('string'),
  etapa: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string')
});
