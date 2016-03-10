import DS from 'ember-data';

const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;

export default DS.Model.extend({
  manzana : DS.attr("string"),
  lote : DS.attr("string"),
  condominio: DS.attr("string", {default: ""}),
  domicilioOficial: DS.attr("string", {default: ""}),
  entero: computed("lote",{
  	get: function(){
  		return parseInt(get(this,"lote"));
  	}
  })
});
