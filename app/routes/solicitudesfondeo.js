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
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      selectedEmpresa: '',
      selectedBancoOrigen: '',
      cantidadfondear: '',
      saldobanco: '',
      saldofinaldisponible: '',
      saldofinaltransito: '',
      saldoinicialdisponible: '',
      saldoinicialtransito: '',
      selectedEstatus: 5,
      resultPage: '',
      requestedPage: '',
      resultRowCountFormatted: '',
      tablaFirmantesFlag: false,
      bancoOrigenLista: '',
      listaSolicitudFirmarFondear: '',
      listaFirmantes: '',
      solicitudesSeleccionadas: '',
      solicitudesLista: ''
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
