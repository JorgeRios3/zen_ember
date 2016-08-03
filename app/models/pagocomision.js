import Model from 'ember-data/model';

export default Model.extend({
  pagotipo: DS.attr('string'),
  pagoreferencia: DS.attr('string'),
  pagoimporte: DS.attr('string'),
  pagoimpuesto: DS.attr('string'),
  fechareconocimiento: DS.attr('string')

});
