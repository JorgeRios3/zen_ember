import DS from 'ember-data';

export default DS.Model.extend({
  movimiento: DS.attr('string'),
  cantidad: DS.attr('number'),
  fecha: DS.attr('string'),
  relaciondepago: DS.attr('string'),
  fechavencimientodoc: DS.attr('string'),
  documento: DS.attr('number'),
  tipo: DS.attr('number')
  
});
