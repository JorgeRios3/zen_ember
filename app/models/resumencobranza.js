import DS from 'ember-data';

export default DS.Model.extend({
  rubronombre: DS.attr('string'),
  rubro: DS.attr('number'),
  etapa: DS.attr('number'),
  etapanombre: DS.attr('string'),
  cantidad: DS.attr('number'),
  cantidadformateada: DS.attr('string')
});
