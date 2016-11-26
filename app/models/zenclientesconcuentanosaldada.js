import DS from 'ember-data';

export default DS.Model.extend({

	cuenta: DS.attr("number"),
	nombre: DS.attr("string"),
	inmueble: DS.attr("string"),
	manzana: DS.attr("string"),
	lote: DS.attr("string"),
	saldo: DS.attr("number"),
	cliente: DS.attr("number"),
	oferta: DS.attr("number",{default: 0}),
	conpagares:DS.attr("boolean"),
	saldopagares:DS.attr("number"),
	saldoformateado:DS.attr("string"),
	saldopagaresformateado:DS.attr("string")

});
