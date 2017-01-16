import DS from 'ember-data';

export default DS.Model.extend({
  precio: DS.attr('number'),
  fecha: DS.attr('strign'),
  usuario: DS.attr('string'),
  comentario: DS.attr('string'),
  descuento: DS.attr('number')
});
