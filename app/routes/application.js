import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
const { Logger: { info }
      } = Ember;
export default Ember.Route.extend(ApplicationRouteMixin,
{
  actions: {
    error(error) {
      info('error global', error);
      this.transitionTo('catchall', 'application-error');
    }
  }
});
