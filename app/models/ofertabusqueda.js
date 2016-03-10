import DS from 'ember-data';

export default DS.Model.extend({
	oferta:DS.attr("string"),
	fecha_oferta : DS.attr("string"),
	etapa:DS.attr("string"),
	fecha_cancelacion:DS.attr("string"),
	nombre_cliente:DS.attr("string"),
	telefono:DS.attr("string"),
	nombre_gerente:DS.attr("string"),
	nombre_subvendedor:DS.attr("string"),
  
});
