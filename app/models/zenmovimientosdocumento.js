import DS from 'ember-data';
const {
computed,
get,
set, 
Logger: {info},
observer
} = Ember;

export default DS.Model.extend({
  cantidad:DS.attr("string"),
  fecha:DS.attr("string"),
  cargoabono:DS.attr("string"),
  recibo:DS.attr("number"),
  relaciondepago: DS.attr('string', {default: ""}),
  esdescuento: computed('relaciondepago', {
  	get() {
  	  return get(this, 'relaciondepago') === 'DESCUENTO PRECIO';
  	}
  })
});
