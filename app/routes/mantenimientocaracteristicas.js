import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const {
  set,
  RSVP: { hash },
  setProperties,
  get
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, {

  beforeModel2() {
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      showForma: false,
    })
  },
  model() {
    this.store.unloadAll('caracteristica');
    return this.store.findAll('caracteristica');
  }
});