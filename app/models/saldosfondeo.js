import Model from 'ember-data/model';
const {
  get,
  set,
  computed,
  Logger: { info }
} = Ember;
export default Model.extend({
  cantidadfondear: DS.attr('number'),
  saldoinicialtransito: DS.attr('number'),
  saldofinaltransito: DS.attr('number'),
  saldobanco: DS.attr('number'),
  saldoinicialdisponible: DS.attr('number'),
  saldofinaldisponible: DS.attr('number')
});
