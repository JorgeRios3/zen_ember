import DS from 'ember-data';

export default DS.Model.extend({
  cantidad:DS.attr("string"),
  fecha:DS.attr("string"),
  cargoabono:DS.attr("string"),
  recibo:DS.attr("number"),
  relaciondepago: DS.attr('string', {default: ""})
});
