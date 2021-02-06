import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	getProperties,
	Logger: { info },
	RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,{
  setupController(ctrl, model) {
  	let listaGerentes = Ember.A();
    let vendedores = get(model, 'vendedores');
    set(ctrl, 'vendedores', vendedores);
  },
  model() {
  	let { store } = this;
  	return hash({
  	   vendedores: store.findAll('vendedoresarcadia', { reload: true }),
  	});
  }

})