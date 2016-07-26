import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin ,{
  setupController(ctrlr, model) {
    let { gtevdor, gerentesventa: apGerentesventas, vendedor: apVendedors, gerentecomision } = model;
    let gerente = get(gtevdor, 'idgerente');
    let vendedor = get(gtevdor, 'idvendedor');
    if (gerente !== 0 && vendedor !== 0) {
      set(ctrlr, 'selectedGerente', gerente);
      set(ctrlr, 'auxselectedVendedor', vendedor);
    }
    ctrlr.setProperties({
      gtevdor,
      apGerentesventas,
      apVendedors,
      gerentecomision
    });
  },
  beforeModel2() {
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      gerenteVendedor: '',
      nombre: '',
      cuantosvendedores: 0,
      selectedGerente: null,
      selectedVendedor: null,
      listaDocumentosComision: null,
      listaMovimientosComision: null,
      muestraDocumentos: true,
    });
  },
  model() {
    let { store } = this;
    let reload = { reload: true };
    return hash({
      gtevdor: store.findRecord('gtevdor', 1),
      gerentesventa: store.findAll('gerentesventa', reload),
      vendedor: store.findAll('vendedor', reload),
      gerentecomision: store.findAll('gerentecomision')
    });
  },
  actions: {
    error(error) {
      info('error en ruta prospecto', error);
    }
  }
});
