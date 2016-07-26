import DS from 'ember-data';

export default DS.Model.extend({
  cargoabono: DS.attr('string'),
  importe: DS.attr('money'),
  tipo: DS.attr('number'),
  fechareconocimiento: DS.attr('string')
});
