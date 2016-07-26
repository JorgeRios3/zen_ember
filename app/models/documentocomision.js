import DS from 'ember-data';

export default DS.Model.extend({
  inmueble: DS.attr('number'),
  cuenta: DS.attr('number'),
  etapa: DS.attr('number'),
  oferta: DS.attr('number'),
  saldo: DS.attr('money'),
  cargo: DS.attr('money'),
  abono: DS.attr('money'),
  precioneto: DS.attr('money'),
  nombrecliente: DS.attr('string'),
  cliente: DS.attr('number'),
  fechareconocimiento: DS.attr('string')

});
