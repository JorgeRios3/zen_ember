import DS from 'ember-data';
const {
  attr
} = DS;

export default DS.Model.extend({
	manzana: attr('string'),
	lote: attr('string'),
	fecha: attr('string'),
	fechaPreliberacion: attr('string'),	
	nota: attr('string'),
	oferta: attr('string'),	
	montoCredito: attr('string'),	
	montoSubsidio: attr('string'),	
	sumanDocumentos: attr('string'),	
	saldo: attr('string'),	
	imss: attr('string')

  
});
