import DS from 'ember-data';

export default DS.Model.extend({
  centrodecosto: DS.attr('string'),
  partida: DS.attr('string'),
  subpartida1: DS.attr('string'),
  subpartida2: DS.attr('string'),
  subpartida3: DS.attr('string'),
  subpartida4: DS.attr('string'),
  subpartida5: DS.attr('string'),
  cantidad: DS.attr('number')
  
});
