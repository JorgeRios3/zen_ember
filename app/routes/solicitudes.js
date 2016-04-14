import Ember from 'ember';

const {
	get,
	set,
	Logger: { info },
	RSVP: { hash }
} = Ember;

export default Ember.Route.extend({
  setupController(controller, model) {
    set(controller, 'empresas', model.empresas);
    set(controller, 'solicitudes', model.solicitudes);
    controller.send('pedir');
  },

  model() {
  	let { store } = this;
    return hash({
      empresas: store.findAll('empresascontable'),
      solicitudes: store.query('solicitud', { empresa: '', fecha: '' })
    });
  },
  actions: {
  	error(error) {
  	  info(error);
  	}
  }
});
