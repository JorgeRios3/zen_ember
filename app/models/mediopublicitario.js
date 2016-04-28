import DS from 'ember-data';

export default DS.Model.extend({
  descripcion: DS.attr('string'),
  previa: DS.attr('number'),
  actual: DS.attr('number')
  
});
