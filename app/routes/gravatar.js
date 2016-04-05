import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  setupController(ctrlr, model) {
    ctrlr.set('content', model);
    ctrlr.set('gravatarEmail', model.get('gravataremail'));
  },
  model() {
    let { store } = this;
    return store.findRecord('gravatar', 1);
  }
});

