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
  beforeModel() {
    let controller = this.controllerFor(this.routeName);
    controller.setProperties({
      esRutaComisionEstadoCuenta: false
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
    didTransition: function() {
      Ember.run.later('', ()=> {
        let c = this.controllerFor(this.routeName);
        info('valor de controller en didTransition', get(c, 'currentPath'));
        info('valor de controller en didTransition', get(c, 'currentRouteName'));
        if (get(c, 'currentRouteName') === 'comisionestadocuenta') {
          info('entro en el if del didTransition')
          set(c, 'esRutaComisionEstadoCuenta', true);
        } else {
          info('se fue por el else de didTransition')
          set(c, 'esRutaComisionEstadoCuenta', false);
        }
      }, 1000);
    },
    error(error) {
      info('error global', error);
      this.transitionTo('catchall', 'application-error');
    }
  }
});
