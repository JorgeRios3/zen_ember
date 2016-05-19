import DS from 'ember-data';

export default DS.Model.extend({
  nombre: DS.attr('string'),
  cuenta: DS.attr('number'),
  referencia: DS.attr('string'),
  cliente: DS.attr('number'),
  etapa: DS.attr('string', { default: '' }),
  manzana: DS.attr('string', { default: '' }),
  lote: DS.attr('string', { default: '' }),
  saldo: DS.attr('money', { default: '' })
});
