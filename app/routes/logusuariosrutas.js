import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
	get,
	set
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  beforeModel(transition) {
  	this._super(...arguments);
  },
  setupController(ctrl,model) {
  	let listaUsuarios = Ember.A();
    model.forEach((item)=> {
      let objeto = {};
      objeto = { usuario: get(item, 'usuario')} ;
      // objeto = { usuario: get(item, 'usuario'), ruta: get(item, 'ruta'), timestamp: get(item, 'timestamp'), intro: get(item, 'intro') };
      listaUsuarios.pushObject(objeto);
    });
    set(ctrl, 'listaUsuarios', listaUsuarios);
  },
  model() {
  	this.store.unloadAll('logusuarioruta');
  	return this.store.query('logusuarioruta', { solousuarios: '1' });
  }
});
