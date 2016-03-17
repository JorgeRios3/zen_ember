import DS from 'ember-data';

const {
	computed,
	get,
	set
} = Ember;

export default DS.Model.extend({
	rubroReducido: computed('rubro', 'valor', {
		get(){
			return `${get(this, 'rubro')} -->  (${get(this, 'valor')})`; 
		}
	}),
	rubro: DS.attr('string'),
	valor: DS.attr('number')
  
});
