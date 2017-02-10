import DS from 'ember-data';

export default DS.Model.extend({
  hipotecaria: DS.attr('number', {default: 0}),
  descripcion: DS.attr('string', {default: ''}),
  fecha: DS.attr('string', {default: ''}),
  cuenta: DS.attr('number', {default: 0})
});
