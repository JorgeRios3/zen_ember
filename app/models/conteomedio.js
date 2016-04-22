import DS from 'ember-data';

export default DS.Model.extend({
  descripcion: DS.attr('string'),
  conteo: DS.attr('number')
});
