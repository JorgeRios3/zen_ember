import DS from 'ember-data';

export default DS.Model.extend({
	num : DS.attr("string"),
	numf : DS.attr("string"),
	apellidopaterno : DS.attr("string"),
	apellidomaterno : DS.attr("string"),
	nombre : DS.attr("string"),
	afiliacion : DS.attr("string"),
	fechaalta : DS.attr("string"),
	fechacierre : DS.attr("string"),
	rfc : DS.attr("string"),
	curp : DS.attr("string"),
	gerente : DS.attr("string"),
	vendedor : DS.attr("string")
});
