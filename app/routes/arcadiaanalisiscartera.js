import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  get,
  set,
  Logger: { info },
  RSVP: { hash }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  setupController(controller, model) {
    let listaEstimacion = Ember.A();
    let listaVencido = Ember.A();
    let contador = 1;
    model.forEach((item)=> {
      if (contador !== 1 && contador !== 7 && contador < 7) {
        // titulos de listaEstimacion
        let { etapa, terrenos, clientes, saldo } = item.getProperties('etapa terrenos clientes saldo'.w());
        listaEstimacion.pushObject({ etapa, terrenos, clientes, saldo });
      }
      if (contador > 7) {
        // titulos de listaVencido
        let { etapa, documentosnovencidos, vencidohasta30, vencido3190,
        vencidomas90, clientes, terrenos, vencido, porcentaje } =
        item.getProperties('etapa documentosnovencidos vencidohasta30 vencido3190 vencidomas90 clientes terrenos vencido porcentaje'.w());
        listaVencido.pushObject({ etapa, documentosnovencidos, vencidohasta30, vencido3190,
        vencidomas90, clientes, terrenos, vencido, porcentaje });
      }
      contador++;
    });
    set(controller, 'listaEstimacion', listaEstimacion);
    set(controller, 'listaVencido', listaVencido);
  },
  model() {
    let { store } = this;
    return store.findAll('analisiscarteraarcadia');
  }
});
