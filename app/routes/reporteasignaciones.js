import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  Logger: { info },
  RSVP: { hash },
  setProperties
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  beforeModel2() {
  	let controller = this.controllerFor(this.routeName);
  	controller.setProperties({
      selectedFiltro: ''
  	});
  },
  setupController(ctrl, model) {
    let {etapas, listaDescuentos} = model;
    set(ctrl, 'etapas', etapas);
  },
  
  model() {
    return hash({
      etapas: this.store.findAll('etapastramite', { reload: true }),
      // listaDescuentos: this.store.query('inmueblesvendidosdescuento', { fechainicial: c, fechafinal: c })
    });
  }
});