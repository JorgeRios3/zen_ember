import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	Logger: { info },
	RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,{
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
