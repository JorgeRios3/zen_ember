import Model from 'ember-data/model';

export default Model.extend({
  pagotipo: DS.attr('string'),
  pagoreferencia: DS.attr('string'),
  pagoimporte: DS.attr('number'),
  pagoimpuesto: DS.attr('number'),
  fechareconocimiento: DS.attr('string'),
  solicitudcheque: DS.attr('number'),
  estatussolicitud: DS.attr('string')
});
