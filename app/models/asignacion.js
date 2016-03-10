import DS from 'ember-data';

export default DS.Model.extend({
  //afiliacion : DS.attr("string"),
  inmueble : DS.attr("number"),
  cliente : DS.attr("number"),
  //prospecto : DS.attr("number"),
  precio : DS.attr("number"),
  //montocredito : DS.attr("number"),
  //apartado : DS.attr("number"),
  //gastosadministrativos: DS.attr("number"),
  //precioseguro: DS.attr("number"),
  //anticipocomision: DS.attr("number"),
  precalificacion: DS.attr("number"),
  avaluo: DS.attr("number", {default: 0}),
  subsidio: DS.attr("number", {default: 0}),
  pagare: DS.attr("number", {default: 0}),
  //referencia: DS.attr("number"),
  //tipocuenta: DS.attr("string"),
  prerecibo: DS.attr("number", {default: 0}),
  prereciboadicional: DS.attr("number", {default: 0}),
  oferta:DS.attr("number")
});
