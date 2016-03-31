import DS from 'ember-data';
const {
  attr
} = DS;

const {
	computed,
	get,
	set
} = Ember;
export default DS.Model.extend({
  tramite: attr('number'),
  total: attr('formattedint')
  /*totalFormateado: computed('total', {
    get: function() {
      let valor = new Intl.NumberFormat('en-US');
      return valor.format(get(this, 'total'));
    }
  })*/

});
