import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  get,
  set,
  Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  /*let lista = Ember.A();
  setupController(controller, model) {
    model.forEach((item)=> {
      let { etapa, manzana, lote, cliente, nombre, saldo, cuenta, congelada } = item.getProperties( 'etapa manzana lote cliente nombre saldo cuenta congelada'.w());
    });

  },*/
  model(){
  	return this.store.findAll('carteravencidaarcadia');
  }
});
