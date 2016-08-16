import DS from 'ember-data';

export default DS.Model.extend({
  editable: DS.attr('boolean'),
  desarrollo: DS.attr('string'),
  domicilio: DS.attr('string'),
  etapa: DS.attr('string'),
  lote: DS.attr('string'),
  manzana: DS.attr('string'),

});
