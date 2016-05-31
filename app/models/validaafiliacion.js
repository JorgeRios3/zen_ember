import DS from 'ember-data';

export default DS.Model.extend({
  validacion: DS.attr('string'),
  disponible: DS.attr('boolean')
  
});
