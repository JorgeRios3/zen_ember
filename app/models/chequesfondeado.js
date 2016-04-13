import DS from 'ember-data';

export default DS.Model.extend({
  empresa: DS.attr('string'),
  cuenta: DS.attr('string'),
  cheque: DS.attr('string'),
  beneficiario: DS.attr('string'),
  cantidad: DS.attr('money'),
  fecha: DS.attr('string')
  
});
