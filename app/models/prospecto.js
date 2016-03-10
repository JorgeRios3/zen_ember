import DS from 'ember-data';

export default DS.Model.extend({
  apellidopaterno : DS.attr("string"),
  apellidomaterno : DS.attr("string"),
  nombre : DS.attr("string"),
  afiliacion : DS.attr("string"),
  fechaalta : DS.attr("string"),
  fechacierre : DS.attr("string"),
  fechadenacimiento : DS.attr("string"),
  rfc : DS.attr("string"),
  curp : DS.attr("string"),
  telefonocasa : DS.attr("string"),
  telefonooficina : DS.attr("string"),
  extensionoficina : DS.attr("string"),
  telefonocelular : DS.attr("string"),
  lugardetrabajo : DS.attr("string", { defaultValue: '' }),
  idmediopublicitario : DS.attr("number"),
  mediopublicitariosugerido : DS.attr("string"),
  contado : DS.attr("boolean"),
  hipotecaria : DS.attr("boolean"),
  pensiones: DS.attr("boolean"),
  fovisste: DS.attr("boolean"),
  congelado : DS.attr("boolean"),
  gerente : DS.attr("number"),
  vendedor : DS.attr("number")

});
