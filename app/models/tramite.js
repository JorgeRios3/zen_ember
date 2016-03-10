import DS from 'ember-data';

export default DS.Model.extend({
	inmueble: DS.attr("number"),
	tramite : DS.attr("number"),
	numeroCredito: DS.attr("number"),
	montoCredito: DS.attr("number"),
	montoSubsidio: DS.attr("number"),
	comentario: DS.attr("string"),
	fechaInicial: DS.attr("string", {default: "no hay fecha"}),
	fechaInicio: DS.attr("string", {default: "no hay fecha"}),
    fechaEstEntrega: DS.attr("string", {default: "no hay fecha"}),  
    fechaRealEntrega: DS.attr("string", {default: "no hay fecha"}),
    fechaVencimiento: DS.attr("string", {default: "no hay fecha"}),
    descripcion: DS.attr("string",  {default: "tramite"}),
    origen: DS.attr("string"),
    isGestion: Ember.computed.equal('origen', 'g')

});
