
import DS from 'ember-data';

const {
  Model,
  attr
} = DS;

export default Model.extend({
  etapa: attr('string'),
  cuantos: attr('formattedint'),
  valuacion: attr('money')
});
