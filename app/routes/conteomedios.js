import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  set,
  get,
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,
{
  beforeModel(transition) {
    this._super(...arguments);
   
  },
  setupController(ctrl,model) {
    let lista = Ember.A(); 
    model.forEach((item)=> {
      info(typeof get(item, 'id'));
      lista.pushObject( item.getProperties('id descripcion conteo'.w()));
    });
    set(ctrl, 'tablaConteo', lista);
  },
  model() {
    let { store } = this;
    return  store.findAll('conteomedio', { reload : true });
  }	
});