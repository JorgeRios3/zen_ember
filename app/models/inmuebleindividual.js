import DS from 'ember-data';

export default DS.Model.extend({

	domicilio : DS.attr("string", {default : ""}),
	cuv : DS.attr("string", {default : ""}),
	asignada: DS.attr('boolean', {default: false}),
	candadoPrecio: DS.attr("boolean"),
	precioCatalogo: DS.attr("number")
	 
  
});
