import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const{
  set,
  RSVP: { hash }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {
  etapas: '',
  setupController(ctrlr, model) {
    set(ctrlr, 'etapas', model.etapas);
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
      saldoPagaresFormateado: '',
      catalogoNombres: null,
      documentosPagares: null,
      docsCliente: null,
      movimientosdocumento: null
    });
  },
  model() {
    let { store } = this;
    return hash({
      etapas: store.findAll('etapastramite', { reload: true })
    });
  }
});
