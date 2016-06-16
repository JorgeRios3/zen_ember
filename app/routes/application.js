import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from '../config/environment';
import moment from 'moment';
const {
  Logger: { info },
  inject: { service },
  set,
  get,
  computed
} = Ember;
export default Ember.Route.extend(ApplicationRouteMixin,
{
  setupController(controller, model) {
    let features = get(this, 'features');
    this._super(...arguments);
    this.startWatchingTime(controller);
    // info(new Error().stack);
    controller.setProperties({
      invalidable: false,
      isDev: computed('', {
        get() {
          return config.AUTOMATIC_LOGIN;
        }
      })
    });
  },

  invalidateSession(controller) {
    set(controller, 'expirationFlag', false);
    controller.send('invalidateSession');
  },
  startWatchingTime(controller) {
    if (get(controller, 'isDev')) {
      return;
    }
    let that = this;
    set(controller, 'currentTime', moment());
    if (get(controller, 'restante') === 59 && get(controller, 'invalidable')) {
      if (get(controller, 'expirationFlag')) {
        info('pasando');
        that.invalidateSession(controller);
      }
    }
    if (get(controller, 'restante') === 5) {
      that.invalidateSession(controller);
    }
    Ember.run.later(()=> {
      that.startWatchingTime(controller);
    }, 20000);
  },
  actions: {
    error(error) {
      info('error global', error);
      this.transitionTo('catchall', 'application-error');
    }
  }
});
