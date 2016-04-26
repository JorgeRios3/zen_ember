import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  intro: DS.attr('string'),
  item: DS.attr('string'),
  fecha: DS.attr('string'),
  consulta: DS.attr('boolean')
});
