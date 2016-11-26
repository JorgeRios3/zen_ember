import DS from 'ember-data';

export default DS.Model.extend({
 recibo: DS.attr('string'),
 movimientos: DS.attr('string')
  
});
