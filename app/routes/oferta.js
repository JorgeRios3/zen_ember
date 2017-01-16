import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  set,
  isEmpty,
  Logger: { info },
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  cliente: '',
  noModel: false,
  beforeModel2(transition) {
    //this._super(...arguments);
    set(this, 'cliente', '');
    set(this, 'noModel', false);
    let controller = this.controllerFor(this.routeName);
    let url = get(this, 'router.url');
    let origenCliente = false;
    try {
      origenCliente = !isEmpty(transition.queryParams.origenCliente);
      if (!isEmpty(transition.queryParams.cliente)) {
        set(this, 'cliente', transition.queryParams.cliente);
      }
    } catch(err) {
      info('error message en oferta probando', err.message);
    }
    info('enbefore model de oferta2');
    if (origenCliente) {
      'selectedEtapa selectedManzana selectedInmueble'.w().forEach((key)=> {
        info(key, get(controller, key));
      });
      set(this, 'noModel', true);
      return;
    }
    controller.setProperties({
      observaCodigoDescuento: false,
      processingGrabar: false,
      selectedEtapa: null,
      selectedPrecio: null,
      selectedManzana: null,
      selectedLote: null,
      selectedInmueble: null,
      hayClientesSinOfertas: false,
      afiliacion: '',
      comision: false,
      errorMessageComision: 'El asesor no tiene comision',
      cliente: '',
      numerointerior: '',
      numeroexterior: '',
      errorMessage: '',
      departamento: false,
      montocredito: '',
      precio: '',
      inmueble: '',
      afiliacionOk: false,
      afiliacionNoChecar: false,
      prospectoNoChecar: false,
      manzana: '',
      lote: '',
      apartado: '',
      prospecto: '',
      cuantosprecios: 0,
      gastosadministrativos: '',
      precioseguro: '',
      prerecibo: '',
      prereciboadicional: '',
      anticipocomision: '',
      precalificacion: '',
      avaluo: '',
      subsidio: '',
      pagare: '',
      cuantosInmueblesDisponibles: 0,
      sumaCheca: false,
      precioRaw: null,
      candadoPrecio: false,
      precioCatalogo: 0,
      DescuentoCatalogo: 0,
      totalDescuentoCatalogo: 0,
      muestraCamposCapturaAdicionales: false,
      messageTotaldescuento: '',
      showSubsidio: true
    }); // conforme se definen properties en el controller modificar este hash agregando las properties con el mismo valor asociado
  },
  setupController(ctrlr, model) {
    info('printicipio de setupController');
    if (get(this, 'cliente')) {
      set(ctrlr, 'cliente', get(this, 'cliente'));
    }
    if (get(this, 'noModel')) {
      return;
    }
    set(ctrlr, 'etapasofertas', model.etapasoferta);
    let reservados = get(ctrlr, 'reservados');
    info('reservados', reservados);
    if (reservados > 0) {
      set(ctrlr, 'flagLista', true);
      info('flagLista');
    }
  },
  model() {
    info('en model');
    if (this.get('noModel')) {
      return [];
    }
    info('en model2');
    let { store } = this;
    return hash({
      etapasoferta: store.findAll('etapasoferta', { reload: true })
    });
  },
  actions: {
    error(error, transition) {
      info('error en ruta oferta', error);
    },
    willTransition(transition) {
      info('en willTransition');
      let controller = this.controllerFor(this.routeName);
      let adonde = transition.targetName;
      if (adonde.indexOf('cliente') === -1) {
        try {
          controller.send('descartaInmueble');
          controller.send('descartaProspecto');
        } catch (errorson) {
          info(errorson.message);
        }
      }
      get(controller, 'inmueblesReservados.content').clear();
      get(controller, 'prospectosReservados.content').clear();
      return true;
    }
  }
});
