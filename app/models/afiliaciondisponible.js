import DS from 'ember-data';

export default DS.Model.extend({
  siguiente: DS.attr('string'),
  disponibles: DS.attr('number')
});
