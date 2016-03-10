import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const { Logger: { info } } = Ember;
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
    return Ember.RSVP.hash({
      model: store.find('gtevdor', 1),
      gerentesventa: store.findAll('gerentesventa'),
      vendedor: store.findAll('vendedor'),
      mediospublicitario: store.findAll('mediospublicitario'),
      prospectosreciente: store.findAll('prospectosreciente')
    });
  }
});

