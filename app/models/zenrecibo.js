import DS from 'ember-data';

export default DS.Model.extend({
  documento: DS.attr('number'),
  cantidad: DS.attr('number'),
  autorizacion: DS.attr('string'),
  referencia: DS.attr('string'),
  fechaaplicacion: DS.attr('string', {default: ''}),
  espagare: DS.attr('boolean', {default: false}),
  pagares: DS.attr('string', {default: ''})
});
