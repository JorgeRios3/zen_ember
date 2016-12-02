import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  get,
  set,
  Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,
{
  beforeModel2() {
    // this._super(...arguments);
    info('paso por autorizaciondescuento before');
    let url = get(this, 'router.url');
    let origenCliente = url.indexOf('cliente?origenOferta') !== -1;
    if (origenCliente) {
      'selectedEtapa selectedManzana selectedInmueble'.w().forEach((key)=>  {
        info(key, controller.get(key));
      });
      info('before model agarraro parametros');
      return;
    }
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      selectedEtapa: '0',
      cuantosInmueblesDisponibles: 0,
      inmueble: '',
      inmuebleAsignado: '',
      carateristicasLista: Ember.A(),
      selectedManzana: null,
      candadoPrecio: ''
    });
    info('si entro en beforemodel de la ruta es el 2');
    
  },
  setupController(ctrlr, model) {
    // set(ctrlr,'model', model.gtevdor);
    set(ctrlr, 'etapasofertas', model.etapasoferta);
    set(ctrlr, 'preciosinmuebles', model.preciosinmueble);
    set(ctrlr, 'manzanasdisponibles', model.manzanasdisponible);
    let reservados = get(ctrlr, 'reservados');
    if (reservados > 0) {
      set(ctrlr, 'flagLista', true);
    }
  },

  model() {
    let store = this.store;
    store.unloadAll('etapasoferta');
    return Ember.RSVP.hash({
      gtevdor: store.find('zenversion', 1),
      etapasoferta: store.findAll('etapasoferta'),
      preciosinmueble: store.findAll('preciosinmueble'),
      manzanasdisponible: store.findAll('manzanasdisponible')
    });
  },
  actions: {
    error(error, transition) {
      info('se fue por aqui en ofertaasignacion');
      this.transitionTo('index');
    }
  }
});
