import DS from 'ember-data';

export default DS.Model.extend({
  inmueble: DS.attr('number'),
  vendedor: DS.attr('number'),
  porcentaje: DS.attr('string'),
  fecha: DS.attr('string')
});