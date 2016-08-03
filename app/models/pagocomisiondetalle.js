import DS from 'ember-data';

const {
  computed,
  get,
  set
} = Ember;

export default DS.Model.extend({
  importe: DS.attr('number'),
  fechapago: DS.attr('string'),
  pago: DS.attr('string'),
  documento: DS.attr('string'),
  cuenta: DS.attr('string'),
  etapa: DS.attr('string'),
  oferta: DS.attr('string'),
  inmueble: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  cliente: DS.attr('string'),
  nombrecliente: DS.attr('string'),
  fechacomision: DS.attr('string'),
  esgerente: DS.attr('boolean'),
  nombrevendedor: DS.attr('string')
});
