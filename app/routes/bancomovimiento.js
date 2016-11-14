import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
	get,
	set,
	getProperties,
	setProperties,
	RSVP: { hash },
	Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin , {
  beforeModel2() {
    let clasificar = get(this, 'features.clasificarycoinciliar');
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      clasificar,
      resultPage: '',
      resultPages: '',
      requestedPage: '',
      selectedBancoOrigen: '',
      selectedMovimiento: '',
      selectedClasificado: '',
      selectedEliminado: '',
      selectedEmpresa: '',
      nullFechaCapturaInicial: '',
      nullFechaCapturaFinal: '',
      listaRequests: Ember.A(),
      showNavigation: false,
      bancoOrigenLista: null,
      movimientosLista: null,
      formaMovimiento: false,
      //showBotonAgregar: false
      // forma
      selectedTipoForma: 'A',
      fechaForma: '',
      selectedEstatusForma: 'F',
      cantidadForma: '',
      referenciaForma: '',
      formaActionMovimiento: false,
      formaClasificar: false,
      movimientosForm: '',
      formaCoinciliar: false,
      selectedMovimientoForma: 'A',
      botonCoinciliarFlag: false
    });
  },
  setupController(ctrl, model) {
    let { empresas } = model;
    set(ctrl, 'empresasLista', empresas);
  },
  model() {
  	return hash({
  	  empresas: this.store.findAll('empresasolicitud')
  	});
  }

});
