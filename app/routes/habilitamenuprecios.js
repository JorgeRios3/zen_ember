import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  set,
  get,
  Logger: { info }
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin,{
  model() {
  	let item = 'mantenimientoprecios';
    return this.store.find('zenmenuitemsuspendido', item);
  }
  
});
