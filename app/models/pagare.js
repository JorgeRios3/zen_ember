import DS from 'ember-data';

export default DS.Model.extend({
	descripcion:DS.attr("string"),
	importe:DS.attr("number"),
	importeformateado:DS.attr("string"),
	importeletras:DS.attr("string")
  
});
