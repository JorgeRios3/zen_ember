import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  Logger: { info },
  RSVP: { hash },
  setProperties,
  get,
  set
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel(transition) {
    this._super(...arguments);
    info('en beforeModel de buscarprospecto');
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      resultPage: '',
      resultPages: '',
      resultRowCountFormatted: '',
      requestedPage: 0,
      criterioindividual: false,
      tipoFecha: null,
      tipoCuenta: null,
      fechaInicial: '',
      fechaFinal: '',
      sincierre: false,
      selectedGerente: null,
      deboFiltrar: false,
      afiliacionOk: false,
      numeroprospecto: '',
      nombreprospecto: '',
      afiliacion: '',
      cuantosBusqueda: 0,
      fini: '',
      ffin: '',
      criterioFiltro: 'numero',
      tipoResultado: null,
      selectedVendedor: null,
      selectedMedio: null,
      apGerentesventas: null,
      apVendedors: null,
      apMediospublicitarios: null,
      apProspectosrecientes: null
    });
  },

  setupController(ctrlr, model) {
    let features = get(this, 'features');
    info("features vale",features.generarafiliacion);
    set(ctrlr, 'features', features);
    info('setupController buscarprospecto');
    ctrlr.setProperties({
      model: model.model,
      apGerentesventas: model.gerentesventa,
      apVendedors: model.vendedor,
      apMediospublicitarios: model.mediospublicitario,
      apProspectosrecientes: model.prospectosreciente
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      model: store.find('gtevdor', 1),
      gerentesventa: store.findAll('gerentesventa', reload),
      vendedor: store.findAll('vendedor', reload),
      mediospublicitario: store.findAll('mediospublicitario', reload),
      prospectosreciente: store.findAll('prospectosreciente', reload)
    });
  },
  actions: {
    error(error) {
      info('error en ruta buscarprospecto', error);
    }
  }
});

