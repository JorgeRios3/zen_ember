import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel2() {
    // this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      disponible: false,
	    selectedEtapa: '',
	    listaInmuebles: '',
	    desplegarResultado: false,
    });
  },
  model() {  
    this.store.unloadAll('inmuebledetalle');
    return  this.store.findAll('etapastramite', { reload: true });
  }	
});
