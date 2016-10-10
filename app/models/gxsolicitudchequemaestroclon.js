import DS from 'ember-data';

export default DS.Model.extend({
  solicitudbase: DS.attr('number'),
  numeroclonaciones: DS.attr('number'),
  motivo: DS.attr('string')
});
