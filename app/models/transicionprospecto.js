import DS from 'ember-data';

export default DS.Model.extend({
  fecha: DS.attr('string'),
  transicion: DS.attr('string'),
  gerente: DS.attr('string'),
  vendedor: DS.attr('string'),
  notas: DS.attr('string')
  
});
