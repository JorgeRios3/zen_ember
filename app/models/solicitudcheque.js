import DS from 'ember-data';

export default DS.Model.extend({
  fechacaptura: DS.attr('string'),
  fechaprogramada: DS.attr('string'),
  bancodestino: DS.attr('string'),
  clavebancariadestino: DS.attr('string'),
  tipoprogramacion: DS.attr('string'),
  beneficiario: DS.attr('string'),
  concepto: DS.attr('string'),
  observaciones: DS.attr('string'),
  cantidad: DS.attr('money')
  
});