import DS from 'ember-data';
export default DS.Model.extend({
  etapa: DS.attr('string'),
  nombreetapa: DS.attr('string'),
  oferta: DS.attr('number'),
  cuenta: DS.attr('number'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  nombrevendedor: DS.attr('string'),
  vendedor: DS.attr('number'),
  vendido: DS.attr('boolean'),
  cliente: DS.attr('number', { default: 0 }),
  nombrecliente: DS.attr('string', { default: '' })
});
