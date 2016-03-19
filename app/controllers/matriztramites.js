import Ember from 'ember';

const {
	get,
	set,
	observer,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  selectedEtapa: '',
  etapaSeleccionada: observer('selectedEtapa', function() {
    info('paso por aqui', get(this, 'selectedEtapa'));
  })
});
