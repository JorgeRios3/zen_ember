import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const{
  set,
  get,
  setProperties,
  getProperties,
  RSVP: { hash },
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  setupController(ctrlr, model) {
    ctrlr.notifyPropertyChange('isArcadia');
    info('valor de hipotecarias', model);
    let {hipotecarias} = model;
    let lista=[]
    hipotecarias.forEach((item)=>{
      let{id, descripcion}  = getProperties(item, 'id descripcion'.w());
      lista.pushObject({id, descripcion});
    });
    set(ctrlr, 'catalogoHipotecaria', lista);
    //set(ctrlr, 'catalogoHipotecaria', hipotecarias);
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
      vendedor: '',
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
      arcadiaBorrar: null
    });
  },
  model() {
    return Ember.RSVP.hash({
      hipotecarias: this.store.findAll('zenhipotecaria')
    })
  },

  willTransition() {
    let { store } = this;
    store.unloadAll('etapastramite');
    store.unloadAll('documentoscliente');
    store.unloadAll('movimientosdocumento');
    store.unloadAll('clientescuantosconcuentanosaldada');
    store.unloadAll('clientesconcuentanosaldada');
    store.unloadAll('zenhipotecaria');
  },
  actions: {
    error(error) {
      info(error);
    }
  }
});
