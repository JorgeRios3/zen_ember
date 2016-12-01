import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const{
  set,
  get,
  setProperties,
  RSVP: { hash },
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  setupController(ctrlr, model) {
  	let { empresas } = model;
    set(ctrlr, 'empresasLista', empresas);
    // let a= this.controllerFor('index');
    // info('revisnado pèrfolñ', a.perfil);
    ctrlr.notifyPropertyChange('isArcadia');
  },
  beforeModel2() {
    info('valor de featues ',get(this, 'features'));
    // this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      features: get(this, 'features'),
      rapCliente: '',
      selectedEtapa: '',
      selectedNombre: '',
      telefonoCasa: '',
      telefonoTrabajo: '',
      selectedTipo: '',
      domicilioCliente: '',
      coloniaCliente: '',
      ciudadCliente: '',
      estadoCliente: '',
      cpCliente: '',
      rfcCliente: '',
      formaGeneraDocumento: false,
      CantidadDocumento: '',
      nombre: '',
      cuantos: '',
      maximo: Ember.computed.lt('cuantos', 101),
      manzana: '',
      lote: '',
      cuenta: '',
      saldo: '',
      company: '',
      saldoPagaresFormateado: '',
      catalogoNombres: null,
      documentosPagares: null,
      docsCliente: null,
      movimientosdocumento: null,
      showButton: false,
      showData: false,
      isArcadia: false,
      totalVencido: 0,
      documentosVencidos: 0,
      numeroDocumentos: 0,
      cargos: 0,
      abonos: 0,
      showName: '',
      showCuenta: '',
      cuentaBuscar: '',
      // aqui enpiezan variables de recibos
      listaPrerecibos: null,
      prereciboRecord: null,
      formaDepositos: false,
      nullFechaCapturaInicial: '',
      nullFechaCapturaFinal: '',
      fechaCapturaInicial: '',
      fechaCapturaFinal: '',
      prerecibosForma: false,
      selectedBancoOrigen: '',
      selectedEmpresa: '',
      depositosLista: Ember.A()
    });
  },

  willTransition() {
    let { store } = this;
    store.unloadAll('etapastramite');
    store.unloadAll('documentoscliente');
    store.unloadAll('movimientosdocumento');
    store.unloadAll('clientescuantosconcuentanosaldada');
    store.unloadAll('clientesconcuentanosaldada');
  },
  model() {
    return hash({
      empresas: this.store.findAll('empresasolicitud')
    });
  },
  actions: {
    error(error) {
      info(error);
    }
  }
});

