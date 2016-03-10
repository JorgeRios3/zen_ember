import DS from 'ember-data';

export default DS.Model.extend({
  etapa: DS.attr('number'),
  oferta: DS.attr('number'),
  cliente: DS.attr('number'),
  nombrecliente: DS.attr('string'),
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  cuenta: DS.attr('number'),
  saldo: DS.attr('number'),
  fecha: DS.attr('string'),
  saldoformateado : function numberWithCommas() {
    return this.get("saldo").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }.property("saldo")

});
