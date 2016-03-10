import DS from 'ember-data';

export default DS.Model.extend({
	cuenta: DS.attr("number"),
	total: DS.attr("number"),
	conDevolucion: DS.attr("boolean"),
	generarSolicitudCheque: DS.attr("boolean"),
    reactivable: DS.attr("boolean"),
    documentosConRecibosADevolver: DS.attr("string")
});
