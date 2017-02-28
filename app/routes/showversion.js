import Ember from 'ember';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  setupController(ctrlr, model) {
    Ember.Logger.info("voy en setupController de showversion");
    Ember.Logger.info(model.timestamp);
    
    ctrlr.set("content", model.zenversion);
    
  },
  model() {
    let ajax = this.get('ajax');
    Ember.Logger.info("voy en model de showversion");
  	let store = this.store;

    return new Ember.RSVP.hash({
      //usuarios: store.find('usuarios'),
      zenversion : store.find('zenversion',1),
      timestamp: ajax.post('/api/gql', {data: JSON.stringify({query: "query {zenusers {timestamp}}"})})
    });
    
  },

  actions:{
    error(error, transition){
      Ember.Logger.info("vliendo madre");
      Ember.Logger.info("error de ruta", error);
    }
  }
});

