import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import FormatterMixin from '../mixins/formatter';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed,
	setProperties,
	inject: { service },
	isEmpty
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, FormatterMixin,  {
  comodin: service(),
  setupController(ctrlr, model) {
    let features = get(this, 'features');
    set(ctrlr, 'features', features);
    set(ctrlr, 'listaEtapas', model);
    let comodin = get(this, 'comodin');
    let vendedorEstadocuenta = get(comodin, 'vendedorEstadoCuentaAndPagos');
    if (vendedorEstadocuenta) {
      set(ctrlr, 'botonRegresaEstadoCuenta', true);
    } else {
      set(ctrlr, 'botonRegresaEstadoCuenta', false);
    }
    info('valor de vendedorEstadocuenta', vendedorEstadocuenta);
    if (!isEmpty(get(comodin, 'pago'))) {
      let pago = get(get(this, 'comodin'), 'pago');
      info('valor de comodin en before', pago);
      set(ctrlr, 'pagoComodin', pago);
      set(comodin, 'pago', '');
    }
  },
  beforeModel2() {
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      mostrarImprimirReporte: false,
      pago: '',
      levantaModal: false,
      pagoComision: null,
      comisionesLista: null,
      pagoImporte: null,
      pagoImpuesto: null,
      solicitudCheque: null,
      nuevaSolicitud: null,
      editable: false,
      nombreVendedor: '',
      esGerente: false,
      cantidadesIguales: true,
      mostrarImprimirReporte: false,
      numeroSolicitud: null,
      pagoComodin: null
    });
  },
  model() {
    return this.store.findAll('etapastramite');
  },
  willTransition(transition) {
    let comodin = get(this, 'comodin');
    let adonde = transition.targetName;
    if (!adonde.includes('comisionestadocuenta')) {
      set(comodin, 'vendedorEstadoCuentaAndPagos', '');
    }
  }
});
