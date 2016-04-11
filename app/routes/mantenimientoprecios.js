import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const {
  get,
  set,
  computed,
  observer,
  isEmpty
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  setupController(ctrl, model) {
    set(ctrl, 'etapas', model.etapas);
    set(ctrl, "tramites", model.tramites);
    set(ctrl, "catalogoTramites", model.catalogoTramites);
    ctrl.setProperties({
      loteOficial: '',
      inmueble: '',
      seGrabo: false,
      hayCaracteristicas: false,
      caracteristicasLista: null,
      mostrarForma: '',
      cuantosInmueblesDisponibles: '',
        });
    },
  model() {
    let store = this.store;
    return Ember.RSVP.hash({
      catalogoTramites: store.findAll('catalogotramite', { reload: true }),
      etapas: store.findAll('etapastramite', { reload: true }),
      tramites: store.findAll('tramitesderecho', { reload: true })
    });
  }
	
});
