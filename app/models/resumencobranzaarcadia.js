import DS from 'ember-data';

export default DS.Model.extend({
  rubro: DS.attr('string'),
  enganche: DS.attr('string'), 
  ocurrenciasenganche: DS.attr('string'),
  porcentajeenganche: DS.attr('string'),
  pagos: DS.attr('string'),
  ocurrenciaspagos: DS.attr('string'),
  porcentajepagos: DS.attr('string'),
  total: DS.attr('string')
});
