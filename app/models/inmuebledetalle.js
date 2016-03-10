import DS from 'ember-data';

export default DS.Model.extend({
	manzana:DS.attr("string"),
	lote:DS.attr("string"),
	habilitado:DS.attr("boolean"),
	candado:DS.attr("boolean"),
	precio:DS.attr("string"),
	vendido:DS.attr("boolean"),
  
});
