import DS from 'ember-data';

export default DS.Model.extend({
  fecha: DS.attr('string'),
  usuario: DS.attr('string'),
  content: DS.attr('string'),
  estatus: DS.attr('string')
});
