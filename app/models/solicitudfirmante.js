import Model from 'ember-data/model';
const {
  get,
  set,
  computed,
  Logger: { info }
} = Ember;
export default Model.extend({
  nombre: DS.attr('string')
});
