import DS from 'ember-data';

export default DS.Model.extend({
	etapa: DS.attr("string", {default: ""}),
	manzana: DS.attr("string", {default: ""}),
	lote: DS.attr("string", {default: ""}),
	tramite: DS.attr("number")
  
});
