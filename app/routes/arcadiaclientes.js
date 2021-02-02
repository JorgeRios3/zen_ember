import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin,
{
  beforeModel2(transition) {
    // this._super(...arguments);
    let controller = this.controllerFor(this.routeName);
    let url = this.get('router.url');
    controller.setProperties({
      showForm: false,
      clienteGrabado: 0,
      clienteValorSelect: '',
      nullfechanacimiento: '',
      fechanacimiento: '',
      nullconyugefechanacimiento: '',
      conyugefechanacimiento: '',
      record:null,
      nullconyugefechanacimiento: '',
      conyugefechanacimiento:'',
    });
  },
  setupController(ctrlr, model) {
    try {
      let m = this.store.modelFor('cliente');
      let keys = Object.keys(m);

      m.eachAttribute(function(key, meta) {
      });
    } catch (error) {
      log('no jala', error.message);
    }
    // keys.forEach((v) => log(v));
    ctrlr.set('content', model);
  },
  model() {
    return this.store.find('gtevdor', 1);
  }

});
