import DS from 'ember-data';

export default DS.Model.extend({
  idcheque: DS.attr('number'),
  centrocostoid: DS.attr('number'),
  partida: DS.attr('number'),
  subpartida1: DS.attr('number'),
  subpartida2: DS.attr('number'),
  subpartida3: DS.attr('number'),
  subpartida4: DS.attr('number'),
  subpartida5: DS.attr('number'),
  cantidad: DS.attr('number'),

});
