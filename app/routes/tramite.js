import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  setupController(ctrl, model) {
    set(ctrl, 'etapas', model.etapas);
    set(ctrl, 'tramites', model.tramites);
    set(ctrl, 'catalogoTramites', model.catalogoTramites);
  },
  beforeModel(transition) {
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      descripcionTramite: '',
      tramitesLista: null,
      nullfechaInicial: '',
      nullfechaEstEntrega: '',
      nullfechaRealEntrega: '',
      nullfechaVencimiento: '',
      nullFechaInicio: '',
      selectedEtapa: '',
      muestraZonaCaptura: false,
      inmueble: '',
      mutInmueble: '',
      mutInterior: '',
      selectedManzanaFiltrado: '',
      loteElegido: '',
      selectedManzana: '',
      selectedNumeroExteriorElegido: '',
      selectedNumeroInteriorElegido: ''
    });
  },
  model() {
    let { store } = this;
    for (let modelo of 'etapastramite tramitesderecho catalogotramite'.w()) {
      store.unloadAll(modelo);
    }
    return hash({
      catalogoTramites: store.findAll('catalogotramite'),
      etapas: store.findAll('etapastramite'),
      tramites: store.findAll('tramitesderecho')
    });
  }
});
