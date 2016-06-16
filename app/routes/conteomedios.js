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
  setupController(ctrl,model) {

    let lista = Ember.A(); 
    model.forEach((item)=> {
      info(typeof get(item, 'id'));
      lista.pushObject( item.getProperties('id descripcion conteo'.w()));
    });
    set(ctrl, 'tablaConteo', lista);
    let features = get(this, 'features');
    // features = { editable: false };
    set(ctrl, 'features', features );
  },
  model() {
    let { store } = this;
    return  store.findAll('conteomedio', { reload : true });
  }	
});