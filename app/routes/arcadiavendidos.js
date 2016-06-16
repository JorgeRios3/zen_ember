import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
	get,
	set,
	getProperties,
	Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  setupController(ctrl, model) {
    let lista = Ember.A();
    let totalVendidos = 0;
    let totalEtapas = 0;
    model.forEach((item)=> {
      let { etapa, vendidos, totales } = item.getProperties(['etapa', 'vendidos', 'totales']);
      info(etapa, vendidos, totales);
      totalVendidos += vendidos;
      totalEtapas += totales;
      lista.pushObject({ etapa, vendidos, totales });
    });
    lista.pushObject({ etapa: 'Totales', vendidos: totalVendidos, totales: totalEtapas });
    set(ctrl, 'datos', lista);
  },
  model() {
    return this.store.findAll('vendidosarcadia');
  }
});
