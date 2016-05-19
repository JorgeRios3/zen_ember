import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  beforeModel() {
  	this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      referenciaRap: '',
      nombre: '',
      cuenta: '',
      referencia: '',
      cliente: '',
      etapa: '',
      manzana: '',
      lote: '',
      saldo: '',
      lista: Ember.A(),
      clientesLista: null
    });
  }
});
