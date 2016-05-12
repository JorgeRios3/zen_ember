import DS from 'ember-data';
const { attr } = DS;
export default DS.Model.extend({
  etapa: attr('string'),
  documentosnovencidos: attr('string'),
  documentoshasta30: attr('string'),
  vencidohasta30: attr('string'),
  documentos3190: attr('string'),
  vencido3190: attr('string'),
  documentosmas90: attr('string'),
  vencidomas90: attr('string'),
  clientes: attr('string'),
  terrenos: attr('string'),
  vencido: attr('string'),
  porcentaje: attr('string'),
  saldo: attr('string'),
  reportevencido: attr('boolean')
  
 
  
});
