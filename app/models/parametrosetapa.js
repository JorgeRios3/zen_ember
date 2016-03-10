import DS from 'ember-data';

export default DS.Model.extend({
  gastosadministrativos: DS.attr("number"),
  precioseguro: DS.attr("number"),
  apartado: DS.attr("number"),
  anticipocomision: DS.attr("number")
});
