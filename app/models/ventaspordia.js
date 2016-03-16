import DS from 'ember-data';

export default DS.Model.extend({
  dia: DS.attr('string'),
  valor: DS.attr('number')
});
