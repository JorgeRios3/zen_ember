import DS from 'ember-data';

export default DS.Model.extend({
  cliente: DS.attr('number'),
  nombre: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  numerocredito: DS.attr('string'),
  montocredito: DS.attr('money'),
  montosubsidio: DS.attr('money'),
  codigohipotecaria: DS.attr('string'),
  domiciliohipotecaria: DS.attr('string'),
  oferta: DS.attr('number'),
  documentos: DS.attr('money'),
  imss: DS.attr('string')
});
