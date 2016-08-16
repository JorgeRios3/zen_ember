import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  setupController(ctrlr, model) {
    
    let { gerentesventa: apGerentesventas, vendedor: apVendedors } = model;
    info('valor de esta mierda', apVendedors);
    ctrlr.setProperties({
      apGerentesventas,
      apVendedors
    });
  },
  beforeModel2() {
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      selectedGerente: null,
      selectedVendedor: null,
      listaComisionesInmueble: null,
      inmueble: ''
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      gerentesventa: store.findAll('gerentesventa', reload),
      vendedor: store.findAll('vendedor', reload)
    });
  },
});
