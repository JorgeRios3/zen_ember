import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  Logger: { info },
  setProperties
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  beforeModel2() {
  	let c = this.controllerFor(this.routeName);
  	c.setProperties({
  		selectedEtapa: '0',
  		listaComisiones: null
  	});
  },
  model() {
  	return this.store.findAll('etapacomisioncompartida')
  }
});
