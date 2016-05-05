import DS from 'ember-data';

export default DS.Model.extend({
  manzana: DS.attr('string'),
  lote: DS.attr('string'),
  inmueble: DS.attr('string'),
  preciopormetro: DS.attr('money'),
  superficie: DS.attr('number')
});
