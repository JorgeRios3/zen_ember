import DS from 'ember-data';
export default DS.Model.extend({
  contrato: DS.attr('number'),
  obra: DS.attr('string'),
  fecha: DS.attr('string'),
  valorcontrato: DS.attr('money'),
  facturado: DS.attr('money'),
  porfacturar: DS.attr('money'),
  pagado: DS.attr('money'),
  porpagar: DS.attr('money'),
  porcentajeavanceobra: DS.attr('number'),
  porcentajeavancepagado: DS.attr('number'),
  estimado:DS.attr('money'),
  estimadoporfacturar: DS.attr('money')
});
