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
    ctrlr.notifyPropertyChange('isArcadia');
  },
  beforeModel(transition) {
    this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      selectedEtapa: '',
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
      isArcadia: false
    });
  },
  actions: {
    error(error) {
      info(error);
    }
  }
});
