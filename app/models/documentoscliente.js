import DS from 'ember-data';

export default DS.Model.extend({
    
	descripcion: DS.attr("string"),
	cargo: DS.attr("string"),
	abono: DS.attr("string"),
	fecha: DS.attr("string"),
	saldo: DS.attr("string"),
	elegido: DS.attr("boolean", {default : false})
  
});
