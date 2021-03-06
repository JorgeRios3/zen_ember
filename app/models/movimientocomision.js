import DS from 'ember-data';

export default DS.Model.extend({
  cargoabono: DS.attr('string'),
  importe: DS.attr('money'),
  tipo: DS.attr('number'),
  fechareconocimiento: DS.attr('string'),
  pagotipo: DS.attr('string'),
  pagoreferencia: DS.attr('string'),
  pagoimporte: DS.attr('string'),
  pago: DS.attr('string'),
  documento: DS.attr('string', { default: ''})
});
