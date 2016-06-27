import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  Route,
  Logger: { info }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{

  setupController(ctrl, model) {
    set(ctrl, 'etapas', model.etapas);
  },

  beforeModel2() {
    // this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      selectedEtapa: null,
      selectedDoc: null,
      catalogoNombres: '',
      docsCliente: '',
      nombre: '',
      idDocumento: '',
      conDevolucion: false,
      genSolicitudChq: false,
      reactivable: false,
      manzana: '',
      lote: '',
      cuenta: '',
      cliente: '',
      saldo: '',
      isCancelarOk: false,
      huboErrorAlImprimir: false,
      huboErrorAlImprimir1: false,
      muestraOpcionesImpresion: false,
      copiasDocsCliente: 1,
      copiasCancelacion: 1,
      enviarEmail: false,
      soloEmail: false,
      huboErrorAlGrabar: false,
      muestroErrores: false,
      cuantos: ''
    });
  },

  model() {
    return Ember.RSVP.hash({
      etapas: this.store.findAll('etapastramite', { reload: true })
    });
  },
  actions: {
    error(error) {
      info('entre en error con domingo', error);
    }
  }
});
