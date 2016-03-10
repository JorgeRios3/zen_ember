import DS from 'ember-data';

export default DS.Model.extend({
	inmueble:DS.attr("string"),
	manzana:DS.attr("string"),
	lote:DS.attr("string"),
	fecha:DS.attr("string"),
	tramite:DS.attr("string"),
	descripcion:DS.attr("string")
});
