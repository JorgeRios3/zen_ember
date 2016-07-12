import DS from 'ember-data';
const { attr } = DS;
export default DS.Model.extend({
  inmueble: attr('number'),
  descuento: attr('number'),
  autorizacion: attr('string'),
  comentario: attr('string')

});
