import Ember from 'ember';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
export default Ember.Route.extend(AuthenticatedRouteMixin, {
 
 setupController(ctrlr, model) {
    
    ctrlr.set("content",model);
    ctrlr.set("gravatar_email", model.get("gravataremail"));
    
  },
  model() {
  	
    return this.store.find('gravatar',1);
  }
});

