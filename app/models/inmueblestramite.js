import DS from 'ember-data';

export default DS.Model.extend({
  manzana : DS.attr("string"),
  lote : DS.attr("string"),
  condominio: DS.attr("string", {default: ""}),
  domicilioOficial: DS.attr("string", {default: ""})
});
