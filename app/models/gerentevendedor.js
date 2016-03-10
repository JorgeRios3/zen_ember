import DS from 'ember-data';

export default DS.Model.extend({
  gerente:DS.attr("number"),
  vendedor:DS.attr("number")
});
