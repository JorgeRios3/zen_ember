import DS from 'ember-data';

export default DS.Model.extend({
  usuario: DS.attr('string'),
  vendedor: DS.attr('number')
  
});
