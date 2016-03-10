import DS from 'ember-data';

export default DS.Model.extend({
	etapa: DS.attr("number"),
	oferta: DS.attr("number"),
	cuenta: DS.attr("number"),
	saldo: DS.attr("number"),
	clienteId: DS.attr("number"),
	nombreCliente: DS.attr("string", {default: ""}),
	fechaVenta: DS.attr("string", {default: "no hay fecha"}),
	inmueble: DS.attr("number")
  
});