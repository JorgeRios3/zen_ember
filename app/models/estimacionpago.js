import DS from 'ember-data';

export default DS.Model.extend({
  nombreobra: DS.attr('string'),
  proveedor: DS.attr('number'), 
  estatus: DS.attr('number'), 
  contratoobra: DS.attr('number'), 
  idpagofacturaestimacion: DS.attr('number'),
  razonsocial: DS.attr('string'),
  cheque: DS.attr('number'),
  fechaprogramada: DS.attr('string'),
  importe: DS.attr('money')
});
