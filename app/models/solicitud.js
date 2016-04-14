import DS from 'ember-data';

export default DS.Model.extend({
  usuario: DS.attr('string'),
  identificador: DS.attr('string'),
  empresa: DS.attr('string'),
  beneficiario: DS.attr('string'),
  concepto: DS.attr('string'),
  anexo: DS.attr('string'),
  detalleanexo: DS.attr('string'),
  observaciones: DS.attr('string'),
  cantidad: DS.attr('number')
  
});
