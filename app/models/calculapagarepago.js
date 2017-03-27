import DS from 'ember-data';

export default DS.Model.extend({
  apagar: DS.attr('number'),
  interes: DS.attr('number'),
  total: DS.attr('number'),
  fechavencimiento: DS.attr('string')
});
