import Ember from 'ember';
import RouteAuthMixin from "../mixins/routeauth";
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";
const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;


export default Ember.Route.extend(AuthenticatedRouteMixin,
                    RouteAuthMixin, {

    setupController(ctrl, model) {
        
        ctrl.setProperties({
            etapas: model,
            inmueble: ""
        });
        
    },

    model() {
       
            return this.store.findAll('etapastramite', {reload: true});

    }
	
	
});
