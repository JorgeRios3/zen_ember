import DS from 'ember-data';

export default DS.Model.extend({
	idPrecioCatalogo: DS.attr("number"),
	precioCatalogo: DS.attr("number"),
	candadoPrecio: DS.attr("boolean", {default : true}),
	vendido: DS.attr("boolean"),
	habilitarInmueble: DS.attr("boolean", {"default": false})
  
});
