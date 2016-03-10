import DS from 'ember-data';

export default DS.Model.extend({
	nombre : DS.attr("string"),
	afiliacion : DS.attr("string"),
	vendedor : DS.attr("number"),
	nombrevendedor : DS.attr("string"),
	gerente : DS.attr("number"),
	nombregerente : DS.attr("string"),
	tieneComision:DS.attr("boolean")
  				
});
