import DS from 'ember-data';

const {
  computed,
  get,
  set
} = Ember;

export default DS.Model.extend({
  inmueble: DS.attr('number'),
  cuenta: DS.attr('number'),
  etapa: DS.attr('number'),
  oferta: DS.attr('number'),
  saldo: DS.attr('number'),
  cargo: DS.attr('number'),
  abono: DS.attr('number'),
  precioneto: DS.attr('number'),
  nombrecliente: DS.attr('string'),
  cliente: DS.attr('number'),
  fechareconocimiento: DS.attr('string'),
  lote: DS.attr('string', { default: '' }),
  manzana: DS.attr('string', { default: '' }),
  tieneSaldo: computed.gt('saldo', 0),
  cuentavendedor: DS.attr('string', { default: 0 })

});
