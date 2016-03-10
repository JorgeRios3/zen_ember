import DS from 'ember-data';

export default DS.Model.extend({

	cuenta: DS.attr("number"),
	nombre: DS.attr("string"),
	inmueble: DS.attr("string"),
	manzana: DS.attr("string"),
	lote: DS.attr("string"),
	saldo: DS.attr("number"),
	cliente: DS.attr("number")

});
