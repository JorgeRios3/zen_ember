import Model from 'ember-data/model';
const {
  get,
  set,
  computed,
  Logger: { info }
} = Ember;
export default Model.extend({
  banco: DS.attr('number'),
  empresa: DS.attr('number'),
  firmantes: DS.attr('string'),
  solicitudes: DS.attr('string'),
  estatus: DS.attr('string')
});
