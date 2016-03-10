import Ember from 'ember';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  beforeModel(){
    this._super(...arguments);
    Ember.Logger.info("voy en beforemodel de showversion");
  },
  setupController(ctrlr, model) {
    Ember.Logger.info("voy en setupController de showversion");
    
    ctrlr.set("content", model.zenversion);
    
  },
  model() {
    Ember.Logger.info("voy en model de showversion");
  	var store = this.store;

    return new Ember.RSVP.hash({
      //usuarios: store.find('usuarios'),
      zenversion : store.find('zenversion',1)
    });
    
  },

  actions:{
    error(error, transition){
      Ember.Logger.info("vliendo madre");
      Ember.Logger.info("error de ruta", error);
    }
  }
});

