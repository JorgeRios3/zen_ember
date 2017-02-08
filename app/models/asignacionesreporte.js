import DS from 'ember-data';

export default DS.Model.extend({
  clientecodigo: DS.attr('number'),
  codigo: DS.attr('number'),
  fechaasignacion: DS.attr('string'),
  fechaoferta: DS.attr('string'),
  lote: DS.attr('string'),
  manzana: DS.attr('string'),
  nombrecliente: DS.attr('string'),
  nombrevendedor: DS.attr('string'),
  oferta: DS.attr('number'),
  referencia_rap: DS.attr('string'),
  subvendedor: DS.attr('number'),
  vendedor: DS.attr('number'),
  vendenom: DS.attr('string'),
  cuenta: DS.attr('number'),
  descripcion: DS.attr('string'),
  institucion: DS.attr('string')
});
