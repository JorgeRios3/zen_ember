import DS from 'ember-data';

export default DS.Model.extend({
  inmueble: DS.attr('number'),
  descuento: DS.attr('number'),
  autorizacion: DS.attr('string'),
  comentario: DS.attr('string'),
  cuenta: DS.attr('number', { default: 0 }),
  vigente: DS.attr('boolean', { default: true }),
  usuarionombre: DS.attr('string', {default: '' }),
  asignado: DS.attr('boolean', { default: false })
});
