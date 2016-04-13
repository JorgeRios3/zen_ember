import DS from 'ember-data';

export default DS.Model.extend({
  empresa: DS.attr('string'),
  cuenta: DS.attr('string'),
  saldodisponible: DS.attr('number'),
  entransito: DS.attr('number'),
  saldobanco: DS.attr('number'),
  empresaid: DS.attr('string')
  
});
