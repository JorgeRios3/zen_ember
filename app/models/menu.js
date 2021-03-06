import DS from 'ember-data';
const { 
  attr
} = DS;

export default DS.Model.extend({
  item: attr('string'),
  title: attr('string'),
  intro: attr('string'),
  consulta: attr('boolean'),
  reciente: attr('boolean', {default: false})
});
