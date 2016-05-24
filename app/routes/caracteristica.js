import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,
  RouteAuthMixin, {
  setupController(ctrl, model) {
    ctrl.setProperties({
      etapas: model,
      inmueble: '',
      carateristicasLista: '',
      currentNumeroInterior: '0',
      currentLoteElegido: 0,
      currentManzana: '0',
      cuantosInmueblesDisponibles: ''
    });
  },
  model() {
    return this.store.findAll('etapastramite', { reload: true });
  }
});
