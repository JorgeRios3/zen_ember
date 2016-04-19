import DS from 'ember-data';

export default DS.Model.extend({
  usuario: DS.attr('string'),
  ruta: DS.attr('string'),
  timestamp: DS.attr('string'),
  intro: DS.attr('string')
  
});
