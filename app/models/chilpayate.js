import DS from 'ember-data';

export default DS.Model.extend({
  sexo: DS.attr("string"),
  anos: DS.attr("number"),
  meses: DS.attr("number"),
  cliente: DS.attr("number")
});
