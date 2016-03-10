import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

const {
  get,
  computed
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin,
RouteAuthMixin, {
  beforeModel() {
    this._super(...arguments);
    let c = this.controllerFor('twofactorlogin');
    c.setProperties({
      twoFactorToken: '',
      errorMessage: '',
      buttonReady: computed('twoFactorToken', {
        get() {
          return get(this, 'twoFactorToken.length') === 6;
        }
      })
    });
  }
});
