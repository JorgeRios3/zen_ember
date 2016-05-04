import DS from 'ember-data';

const {
	computed,
	get
} = Ember;

export default DS.Model.extend({
  intervaloReducido: computed('intervalo', 'valor', {
    get() {
      return `${get(this, 'intervalo').substring(11)} -->  (${get(this, 'valor')})`;
    }
  }),
  semana: DS.attr('number'),
  valor: DS.attr('number'),
  intervalo: DS.attr('string')
});